import { Request, Response, NextFunction } from 'express';

// ─── 1. Secure HTTP Response Headers ─────────────────────────────────────────
export function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'", "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://images.unsplash.com https://lh3.googleusercontent.com",
    "connect-src 'self' https://generativelanguage.googleapis.com",
    "frame-ancestors 'none'"
  ].join('; '));
  res.removeHeader('X-Powered-By');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  next();
}

// ─── 2. Rate Limiter ──────────────────────────────────────────────────────────
interface RateLimitEntry { count: number; windowStart: number; }
const rateLimitStore = new Map<string, RateLimitEntry>();
setInterval(() => {
  const now = Date.now();
  rateLimitStore.forEach((e, k) => { if (now - e.windowStart > 60_000) rateLimitStore.delete(k); });
}, 5 * 60 * 1000);

export interface RateLimitOptions { windowMs?: number; maxRequests?: number; message?: string; }

export function createRateLimiter(options: RateLimitOptions = {}) {
  const windowMs = options.windowMs ?? 60_000;
  const maxRequests = options.maxRequests ?? 100;
  const message = options.message ?? 'Too many requests. Please slow down and try again later.';

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${ip}::${req.path.split('/')[1] || 'root'}`;
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (!entry || now - entry.windowStart >= windowMs) {
      rateLimitStore.set(key, { count: 1, windowStart: now });
      next(); return;
    }
    entry.count += 1;
    res.setHeader('X-RateLimit-Limit', String(maxRequests));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, maxRequests - entry.count)));
    res.setHeader('X-RateLimit-Reset', String(Math.ceil((entry.windowStart + windowMs) / 1000)));

    if (entry.count > maxRequests) {
      res.setHeader('Retry-After', String(Math.ceil(windowMs / 1000)));
      res.status(429).json({ success: false, error: { code: 'RATE_LIMITED', message } });
      return;
    }
    next();
  };
}

export const apiRateLimiter     = createRateLimiter({ maxRequests: 200, windowMs: 60_000 });
export const authRateLimiter    = createRateLimiter({ maxRequests: 10,  windowMs: 60_000, message: 'Too many login attempts. Try again in 1 minute.' });
export const webhookRateLimiter = createRateLimiter({ maxRequests: 50,  windowMs: 60_000 });

// ─── 3. Request Size Guard ────────────────────────────────────────────────────
export function requestSizeGuard(maxBytes = 1 * 1024 * 1024) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const cl = parseInt(req.headers['content-length'] || '0', 10);
    if (cl > maxBytes) {
      res.status(413).json({ success: false, error: { code: 'PAYLOAD_TOO_LARGE', message: `Request body exceeds ${Math.round(maxBytes / 1024)} KB limit.` } });
      return;
    }
    next();
  };
}

// ─── 4. CSRF Protection ───────────────────────────────────────────────────────
const CSRF_HEADER = 'x-csrf-token';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  if (req.path.startsWith('/webhooks') || req.path.startsWith('/events') || SAFE_METHODS.has(req.method)) {
    next(); return;
  }
  const token = req.headers[CSRF_HEADER] as string | undefined;
  if (process.env.NODE_ENV !== 'production') {
    if (!token) console.warn(`[CSRF] Missing X-CSRF-Token on ${req.method} ${req.path} — allowed in dev mode.`);
    next(); return;
  }
  const secret = process.env.CSRF_SECRET || 'omniflow-csrf-dev-secret';
  if (!token || token !== secret) {
    res.status(403).json({ success: false, error: { code: 'CSRF_VIOLATION', message: 'CSRF token is missing or invalid.' } });
    return;
  }
  next();
}

// ─── 5. Input Sanitiser ───────────────────────────────────────────────────────
const DANGEROUS = [/\$where/i, /\$expr/i, /\$gt|\$lt|\$ne|\$in/i, /<script[\s>]/i, /javascript:/i, /on\w+\s*=/i];

function sanitiseValue(v: unknown): unknown {
  if (typeof v === 'string') {
    for (const p of DANGEROUS) if (p.test(v)) return '';
    return v.replace(/\0/g, '');
  }
  if (Array.isArray(v)) return v.map(sanitiseValue);
  if (v !== null && typeof v === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (!k.startsWith('$')) out[k] = sanitiseValue(val);
    }
    return out;
  }
  return v;
}

export function inputSanitiser(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') req.body = sanitiseValue(req.body);
  next();
}

// ─── 6. Strict CORS ───────────────────────────────────────────────────────────
const ALLOWED_ORIGINS_DEV = ['http://localhost:3000', 'http://localhost:5000', 'http://127.0.0.1:3000'];

export function strictCors(req: Request, res: Response, next: NextFunction): void {
  const origin = req.headers.origin as string | undefined;
  const allowed = process.env.NODE_ENV === 'production'
    ? (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean)
    : ALLOWED_ORIGINS_DEV;

  if (origin && allowed.includes(origin)) { res.setHeader('Access-Control-Allow-Origin', origin); res.setHeader('Vary', 'Origin'); }
  else if (!origin) res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-authoritative-role, x-csrf-token');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') { res.sendStatus(204); return; }
  next();
}
