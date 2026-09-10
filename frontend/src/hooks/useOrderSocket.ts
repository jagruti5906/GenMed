import { useEffect, useRef, useCallback } from 'react';
import { Order, Specialist } from '../types';

type SSEEvent = 'order:created' | 'order:updated' | 'specialist:updated' | 'telemetry:updated' | 'connected';

export interface TelemetryPayload {
  lat: number;
  lng: number;
  speedMph: number;
  distanceRemainingMiles: number;
  etaMinutes: number;
}

interface UseOrderSocketOptions {
  channel: string;
  onOrderCreated?: (order: Order) => void;
  onOrderUpdated?: (order: Order) => void;
  onSpecialistUpdated?: (specialist: Specialist) => void;
  onTelemetryUpdated?: (payload: TelemetryPayload) => void;
  onConnected?: (meta: { clientId: string; channel: string; serverTime: string }) => void;
  enabled?: boolean;
}

/**
 * Phase 3: React hook that subscribes to the OmniFlow SSE real-time event bus.
 * Connects to /api/v1/events?channel=<channel> and dispatches typed callbacks
 * for each domain event. Automatically reconnects on disconnect with exponential backoff.
 */
export function useOrderSocket({
  channel,
  onOrderCreated,
  onOrderUpdated,
  onSpecialistUpdated,
  onTelemetryUpdated,
  onConnected,
  enabled = true
}: UseOrderSocketOptions): { isConnected: boolean; disconnect: () => void } {
  const esRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectDelayRef = useRef<number>(1000);
  const isConnectedRef = useRef<boolean>(false);

  const connect = useCallback(() => {
    if (!enabled) return;
    if (esRef.current) {
      esRef.current.close();
    }

    const url = `/api/v1/events?channel=${encodeURIComponent(channel)}`;
    const es = new EventSource(url);
    esRef.current = es;

    const handleEvent = (eventName: SSEEvent, rawData: string) => {
      try {
        const parsed = JSON.parse(rawData);
        switch (eventName) {
          case 'connected':
            isConnectedRef.current = true;
            reconnectDelayRef.current = 1000; // reset backoff on successful connect
            onConnected?.(parsed);
            break;
          case 'order:created':
            onOrderCreated?.(parsed as Order);
            break;
          case 'order:updated':
            onOrderUpdated?.(parsed as Order);
            break;
          case 'specialist:updated':
            onSpecialistUpdated?.(parsed as Specialist);
            break;
          case 'telemetry:updated':
            onTelemetryUpdated?.(parsed as TelemetryPayload);
            break;
        }
      } catch {
        // Silently ignore malformed SSE payloads
      }
    };

    // Register named event listeners for each domain event type
    const eventTypes: SSEEvent[] = [
      'connected',
      'order:created',
      'order:updated',
      'specialist:updated',
      'telemetry:updated'
    ];

    eventTypes.forEach((eventName) => {
      es.addEventListener(eventName, (e: MessageEvent) => {
        handleEvent(eventName, e.data);
      });
    });

    es.onerror = () => {
      isConnectedRef.current = false;
      es.close();
      esRef.current = null;

      // Exponential backoff reconnect: 1s → 2s → 4s → 8s → cap at 30s
      const delay = Math.min(reconnectDelayRef.current, 30000);
      reconnectDelayRef.current = delay * 2;

      reconnectTimerRef.current = setTimeout(() => {
        if (enabled) connect();
      }, delay);
    };
  }, [channel, enabled, onConnected, onOrderCreated, onOrderUpdated, onSpecialistUpdated, onTelemetryUpdated]);

  const disconnect = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
    isConnectedRef.current = false;
  }, []);

  useEffect(() => {
    if (enabled) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [connect, disconnect, enabled]);

  return { isConnected: isConnectedRef.current, disconnect };
}

/**
 * Convenience hook for subscribing to a specific order's live tracking channel.
 */
export function useOrderTracking(
  orderId: string | undefined,
  callbacks: Pick<UseOrderSocketOptions, 'onOrderUpdated' | 'onTelemetryUpdated'>
) {
  return useOrderSocket({
    channel: orderId ? `order:${orderId}` : 'noop',
    enabled: !!orderId,
    ...callbacks
  });
}

/**
 * Convenience hook for the admin dispatch board channel.
 */
export function useDispatchBoard(
  callbacks: Pick<UseOrderSocketOptions, 'onOrderCreated' | 'onOrderUpdated' | 'onSpecialistUpdated'>
) {
  return useOrderSocket({
    channel: 'dispatch:board',
    ...callbacks
  });
}
