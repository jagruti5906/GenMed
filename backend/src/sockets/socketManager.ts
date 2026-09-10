import { Response, Request } from 'express';
import { Order, Specialist } from '../types/index.js';

export interface ClientConnection { id: string; res: Response; channel: string; }

class RealtimeSocketManager {
  private clients: Map<string, ClientConnection> = new Map();

  constructor() {
    setInterval(() => {
      this.clients.forEach(client => {
        try { client.res.write(': heartbeat\n\n'); }
        catch { this.removeClient(client.id); }
      });
    }, 30000);
  }

  public handleConnection(req: Request, res: Response): void {
    const channel = (req.query.channel as string) || 'dispatch:board';
    const clientId = 'client-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders?.();
    const client: ClientConnection = { id: clientId, res, channel };
    this.clients.set(clientId, client);
    console.log(`📡 [SSE] Client connected [${clientId}] → [${channel}]. Total: ${this.clients.size}`);
    this.sendToClient(client, 'connected', { clientId, channel, serverTime: new Date().toISOString() });
    req.on('close', () => this.removeClient(clientId));
  }

  public removeClient(clientId: string): void {
    if (this.clients.has(clientId)) {
      this.clients.delete(clientId);
      console.log(`🔌 [SSE] Client disconnected [${clientId}]. Remaining: ${this.clients.size}`);
    }
  }

  private sendToClient(client: ClientConnection, event: string, data: unknown): void {
    try { client.res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`); }
    catch { this.removeClient(client.id); }
  }

  public broadcast(channel: string, event: string, data: unknown): void {
    let count = 0;
    this.clients.forEach(client => {
      if (client.channel === channel || client.channel === 'all' || channel === 'all') {
        this.sendToClient(client, event, data); count++;
      }
    });
    if (count > 0) console.log(`📢 [SSE] Broadcast "${event}" → [${channel}] (${count} recipients)`);
  }

  public broadcastNewOrder(order: Order): void { this.broadcast('dispatch:board', 'order:created', order); }
  public broadcastOrderUpdate(order: Order): void {
    this.broadcast(`order:${order.id}`, 'order:updated', order);
    this.broadcast('dispatch:board', 'order:updated', order);
  }
  public broadcastSpecialistUpdate(specialist: Specialist): void {
    this.broadcast('dispatch:board', 'specialist:updated', specialist);
    this.broadcast(`specialist:${specialist.id}`, 'specialist:updated', specialist);
  }
  public broadcastTelemetry(orderId: string, telemetry: { lat: number; lng: number; speedMph: number; distanceRemainingMiles: number; etaMinutes: number; }): void {
    this.broadcast(`order:${orderId}`, 'telemetry:updated', telemetry);
  }
}

export const socketManager = new RealtimeSocketManager();
