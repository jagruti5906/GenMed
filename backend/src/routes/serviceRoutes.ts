import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { requireRole } from '../middleware/auth.js';

export const serviceRouter = Router();

serviceRouter.get('/', (req: Request, res: Response) => {
  let services = db.getServices();
  if (req.query.available === 'true') services = services.filter(s => s.available);
  if (typeof req.query.category === 'string' && req.query.category) services = services.filter(s => s.category.toLowerCase() === (req.query.category as string).toLowerCase());
  res.json({ success: true, count: services.length, data: services });
});

serviceRouter.get('/:id', (req: Request, res: Response) => {
  const service = db.getServiceById(req.params.id);
  if (!service) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Service ${req.params.id} not found.` } }); return; }
  res.json({ success: true, data: service });
});

serviceRouter.post('/', requireRole(['super_admin']), (req: Request, res: Response) => {
  const { name, category, description, price, durationMinutes, features, iconName } = req.body;
  if (!name || !category || !price || !durationMinutes) { res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing required fields.' } }); return; }
  const created = db.createService({ name, category, description: description || 'Professional on-demand service.', price: Number(price), durationMinutes: Number(durationMinutes), features: Array.isArray(features) ? features : [], iconName: iconName || 'Sparkles', available: true });
  res.status(201).json({ success: true, data: created });
});

serviceRouter.put('/:id', requireRole(['super_admin', 'ops_manager']), (req: Request, res: Response) => {
  const updated = db.updateService(req.params.id, req.body);
  if (!updated) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Service ${req.params.id} not found.` } }); return; }
  res.json({ success: true, data: updated });
});

serviceRouter.patch('/:id/toggle', requireRole(['super_admin', 'ops_manager']), (req: Request, res: Response) => {
  const toggled = db.toggleService(req.params.id);
  if (!toggled) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Service ${req.params.id} not found.` } }); return; }
  res.json({ success: true, data: toggled });
});
