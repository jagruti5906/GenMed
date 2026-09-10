import { Request, Response, NextFunction } from 'express';
import { AuthoritativeRole, UserRole } from '../types/index.js';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const roleHeader = req.headers['x-authoritative-role'] as AuthoritativeRole | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token === 'token-super-admin' || roleHeader === 'super_admin') {
      req.user = { id: 'admin-1', name: 'Super Admin Commander', email: 'admin@omniflow.internal', role: 'super_admin' };
    } else if (token === 'token-ops-manager' || roleHeader === 'ops_manager') {
      req.user = { id: 'ops-1', name: 'Sarah Connor (Dispatcher)', email: 'ops@omniflow.internal', role: 'ops_manager' };
    } else if (token === 'token-support-lead' || roleHeader === 'support_lead') {
      req.user = { id: 'sup-1', name: 'David Mills (Support)', email: 'support@omniflow.internal', role: 'support_lead' };
    } else {
      req.user = { id: 'cust-101', name: 'Alex Morgan', email: 'alex.morgan@example.com', role: 'customer' };
    }
  } else if (roleHeader) {
    req.user = {
      id: `staff-${roleHeader}`,
      name: roleHeader === 'super_admin' ? 'Super Admin' : roleHeader === 'ops_manager' ? 'Ops Manager' : 'Support Lead',
      email: `${roleHeader}@omniflow.internal`,
      role: roleHeader
    };
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication token is required.' } });
    return;
  }
  next();
}

export function requireRole(allowedRoles: AuthoritativeRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } });
      return;
    }
    if (!allowedRoles.includes(req.user.role as AuthoritativeRole)) {
      res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}.` } });
      return;
    }
    next();
  };
}
