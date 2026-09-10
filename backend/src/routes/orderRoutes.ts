import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { requireRole } from '../middleware/auth.js';
import { OrderStatus, AuthoritativeRole } from '../types/index.js';
import { socketManager } from '../sockets/socketManager.js';
import { scoreSpecialistsForOrder } from '../services/dispatchEngine.js';

export const orderRouter = Router();

orderRouter.get('/', (req: Request, res: Response) => {
  let orders = db.getOrders();
  if (typeof req.query.status === 'string' && req.query.status) orders = orders.filter(o => o.status === req.query.status);
  if (typeof req.query.customerId === 'string' && req.query.customerId) orders = orders.filter(o => o.customerId === req.query.customerId);
  res.json({ success: true, count: orders.length, data: orders });
});

orderRouter.get('/:id', (req: Request, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Order ${req.params.id} not found.` } }); return; }
  res.json({ success: true, data: order });
});

orderRouter.post('/', (req: Request, res: Response) => {
  const { serviceId, scheduledDate, scheduledTimeSlot, paymentMethod, customAddress, notes, customerId } = req.body;
  if (!serviceId || !scheduledDate || !scheduledTimeSlot || !paymentMethod) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing required fields: serviceId, scheduledDate, scheduledTimeSlot, paymentMethod.' } }); return;
  }
  try {
    const order = db.createOrder({ customerId: customerId || req.user?.id || 'cust-101', serviceId, scheduledDate, scheduledTimeSlot, paymentMethod, customAddress, notes });
    socketManager.broadcastNewOrder(order);
    res.status(201).json({ success: true, data: order });
  } catch (err: unknown) {
    res.status(400).json({ success: false, error: { code: 'ORDER_CREATION_FAILED', message: err instanceof Error ? err.message : 'Could not place order.' } });
  }
});

orderRouter.patch('/:id/status', requireRole(['super_admin', 'ops_manager', 'support_lead']), (req: Request, res: Response) => {
  const { newStatus, note } = req.body;
  if (!newStatus) { res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'newStatus is required.' } }); return; }
  try {
    const actorRole = (req.user?.role as AuthoritativeRole) || 'ops_manager';
    const updated = db.updateOrderStatus(req.params.id, newStatus as OrderStatus, actorRole, note);
    if (!updated) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Order ${req.params.id} not found.` } }); return; }
    socketManager.broadcastOrderUpdate(updated);
    res.json({ success: true, data: updated });
  } catch (err: unknown) {
    res.status(400).json({ success: false, error: { code: 'INVALID_TRANSITION', message: err instanceof Error ? err.message : 'Transition failed.' } });
  }
});

orderRouter.patch('/:id/assign', requireRole(['super_admin', 'ops_manager']), (req: Request, res: Response) => {
  const { specialistId } = req.body;
  if (!specialistId) { res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'specialistId is required.' } }); return; }
  try {
    const actorRole = (req.user?.role as AuthoritativeRole) || 'ops_manager';
    const updated = db.assignSpecialist(req.params.id, specialistId, actorRole);
    if (!updated) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Order ${req.params.id} not found.` } }); return; }
    socketManager.broadcastOrderUpdate(updated);
    const specialist = db.getSpecialistById(specialistId);
    if (specialist) socketManager.broadcastSpecialistUpdate(specialist);
    res.json({ success: true, data: updated });
  } catch (err: unknown) {
    res.status(400).json({ success: false, error: { code: 'ASSIGNMENT_FAILED', message: err instanceof Error ? err.message : 'Assignment failed.' } });
  }
});

orderRouter.post('/:id/cancel', (req: Request, res: Response) => {
  const { reason } = req.body;
  try {
    const actorRole = (req.user?.role as AuthoritativeRole) || 'support_lead';
    const updated = db.updateOrderStatus(req.params.id, 'cancelled', actorRole, reason || 'Cancelled by user/operator');
    if (!updated) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Order ${req.params.id} not found.` } }); return; }
    res.json({ success: true, data: updated });
  } catch (err: unknown) {
    res.status(400).json({ success: false, error: { code: 'CANCELLATION_FAILED', message: err instanceof Error ? err.message : 'Cancellation failed.' } });
  }
});

orderRouter.get('/:id/score-specialists', requireRole(['super_admin', 'ops_manager']), (req: Request, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Order ${req.params.id} not found.` } }); return; }
  res.json({ success: true, data: scoreSpecialistsForOrder(order, db.getSpecialists()) });
});
