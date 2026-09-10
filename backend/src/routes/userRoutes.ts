import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';

export const userRouter = Router();

userRouter.get('/', (req: Request, res: Response) => {
  res.json({ success: true, count: db.getUsers().length, data: db.getUsers() });
});

userRouter.get('/:id', (req: Request, res: Response) => {
  const user = db.getUserById(req.params.id);
  if (!user) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `User ${req.params.id} not found.` } }); return; }
  res.json({ success: true, data: user });
});

userRouter.post('/:id/wallet/topup', (req: Request, res: Response) => {
  const amount = Number(req.body.amount);
  if (isNaN(amount) || amount <= 0) { res.status(400).json({ success: false, error: { code: 'INVALID_AMOUNT', message: 'Amount must be a positive number.' } }); return; }
  const updated = db.topUpWallet(req.params.id, amount);
  if (!updated) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `User ${req.params.id} not found.` } }); return; }
  res.json({ success: true, data: updated });
});
