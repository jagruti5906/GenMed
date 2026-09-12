import express from 'express';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import {
  securityHeaders, strictCors, inputSanitiser,
  requestSizeGuard, csrfProtection,
  apiRateLimiter, authRateLimiter, webhookRateLimiter
} from './middleware/security.js';
import { authRouter }       from './routes/authRoutes.js';
import { serviceRouter }    from './routes/serviceRoutes.js';
import { orderRouter }      from './routes/orderRoutes.js';
import { specialistRouter } from './routes/specialistRoutes.js';
import { auditRouter }      from './routes/auditRoutes.js';
import { userRouter }       from './routes/userRoutes.js';
import { webhookRouter }    from './routes/webhookRoutes.js';
import { socketManager }    from './sockets/socketManager.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security ──────────────────────────────────────────────────────────────────
app.use(securityHeaders);
app.use(strictCors);
app.use(requestSizeGuard(1 * 1024 * 1024));
app.use(express.json());
app.use(inputSanitiser);
app.use('/api',              apiRateLimiter);
app.use('/api/v1/auth',      authRateLimiter);
app.use('/api/v1/webhooks',  webhookRateLimiter);
app.use(csrfProtection);

// ── Logging ───────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const level = res.statusCode >= 500 ? 'ERROR' : res.statusCode >= 400 ? 'WARN' : 'INFO';
    console.log(`[${level}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${Date.now() - start}ms) [${req.ip}]`);
  });
  next();
});

// ── Auth context ──────────────────────────────────────────────────────────────
app.use(authMiddleware);

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    platform: 'OmniFlow Dual-Surface Dispatch Engine',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    security: { rateLimiting: 'active', csrfProtection: process.env.NODE_ENV === 'production' ? 'enforced' : 'dev-mode', secureHeaders: 'active', inputSanitisation: 'active' }
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/api/v1/events', (req, res) => socketManager.handleConnection(req, res));
app.use('/api/v1/auth',        authRouter);
app.use('/api/v1/services',    serviceRouter);
app.use('/api/v1/orders',      orderRouter);
app.use('/api/v1/specialists', specialistRouter);
app.use('/api/v1/audit-logs',  auditRouter);
app.use('/api/v1/users',       userRouter);
app.use('/api/v1/webhooks',    webhookRouter);

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 [OmniFlow Backend] http://localhost:${PORT}`);
        console.log(`📡 [OmniFlow Backend] Health: http://localhost:${PORT}/api/health`);
        console.log(`📦 [OmniFlow Backend] API: http://localhost:${PORT}/api/v1`);
    });
}

export default app;
