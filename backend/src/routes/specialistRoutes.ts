import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { requireRole } from '../middleware/auth.js';
import { Specialist } from '../types/index.js';
import { socketManager } from '../sockets/socketManager.js';

export const specialistRouter = Router();

specialistRouter.get('/', (req: Request, res: Response) => {
  let specialists = db.getSpecialists();
  if (typeof req.query.status === 'string' && req.query.status) specialists = specialists.filter(s => s.status === req.query.status);
  res.json({ success: true, count: specialists.length, data: specialists });
});

specialistRouter.get('/:id', (req: Request, res: Response) => {
  const specialist = db.getSpecialistById(req.params.id);
  if (!specialist) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Specialist ${req.params.id} not found.` } }); return; }
  res.json({ success: true, data: specialist });
});

specialistRouter.patch('/:id/status', requireRole(['super_admin', 'ops_manager']), (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status) { res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'status is required.' } }); return; }
  const updated = db.updateSpecialistStatus(req.params.id, status as Specialist['status']);
  if (!updated) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Specialist ${req.params.id} not found.` } }); return; }
  socketManager.broadcastSpecialistUpdate(updated);
  res.json({ success: true, data: updated });
});
