import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { AuthoritativeRole } from '../types/index.js';

export const authRouter = Router();

authRouter.post('/login', (req: Request, res: Response) => {
  const { email, role } = req.body;
  if (role && ['super_admin', 'ops_manager', 'support_lead'].includes(role)) {
    const authRole = role as AuthoritativeRole;
    res.json({ success: true, data: { token: `token-${authRole.replace('_', '-')}`, user: { id: `staff-${authRole}`, name: authRole === 'super_admin' ? 'Super Admin' : authRole === 'ops_manager' ? 'Ops Manager' : 'Support Lead', email: `${authRole}@omniflow.internal`, role: authRole } } });
    return;
  }
  const users = db.getUsers();
  const customer = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || users[0];
  res.json({ success: true, data: { token: 'token-customer-session', user: { id: customer.id, name: customer.name, email: customer.email, role: 'customer', loyaltyTier: customer.loyaltyTier } } });
});

authRouter.get('/me', (req: Request, res: Response) => {
  if (!req.user) { res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }); return; }
  res.json({ success: true, data: req.user });
});
