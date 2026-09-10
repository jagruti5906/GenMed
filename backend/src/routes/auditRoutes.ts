import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { requireRole } from '../middleware/auth.js';

export const auditRouter = Router();

auditRouter.get('/', requireRole(['super_admin', 'support_lead', 'ops_manager']), (req: Request, res: Response) => {
  const logs = db.getAuditLogs();
  const max = req.query.limit ? Math.min(100, parseInt(req.query.limit as string, 10)) : 50;
  res.json({ success: true, count: logs.length, data: logs.slice(0, max) });
});
