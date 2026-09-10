import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { socketManager } from '../sockets/socketManager.js';
import { StripeWebhookEvent } from '../types/index.js';

export const webhookRouter = Router();

const HANDLED_EVENTS = new Set(['payment_intent.succeeded', 'payment_intent.payment_failed', 'charge.refunded']);

webhookRouter.post('/stripe', (req: Request, res: Response) => {
  res.status(200).json({ received: true });

  const event = req.body as StripeWebhookEvent;
  if (!event?.type || !HANDLED_EVENTS.has(event.type)) return;

  const pi = event.data?.object;
  if (!pi?.orderId) { console.warn(`[Webhook] ${event.type} missing orderId — skipping.`); return; }

  console.log(`[Webhook] ${event.type} for order ${pi.orderId}`);
  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const updated = db.updateOrderPaymentStatus(pi.orderId, 'paid');
        if (updated) socketManager.broadcastOrderUpdate(updated);
        break;
      }
      case 'payment_intent.payment_failed': {
        const order = db.getOrderById(pi.orderId);
        if (order) socketManager.broadcast('dispatch:board', 'payment:failed', { orderId: pi.orderId, orderNumber: order.orderNumber, amount: pi.amount / 100 });
        break;
      }
      case 'charge.refunded': {
        const updated = db.updateOrderPaymentStatus(pi.orderId, 'refunded');
        if (updated) socketManager.broadcastOrderUpdate(updated);
        break;
      }
    }
  } catch (err: unknown) {
    console.error(`[Webhook] Error processing ${event.type}:`, err instanceof Error ? err.message : err);
  }
});

webhookRouter.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ready', endpoint: 'POST /api/v1/webhooks/stripe', handledEvents: Array.from(HANDLED_EVENTS) });
});
