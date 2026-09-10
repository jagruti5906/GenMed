import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Order } from '../../types';
import { useOrderTracking, TelemetryPayload } from '../../hooks/useOrderSocket';
import {
  MapPin,
  Car,
  Navigation,
  Wifi,
  WifiOff,
  Gauge,
  Clock,
  Route
} from 'lucide-react';

interface LiveMapViewProps {
  order: Order;
}

interface MarkerPosition {
  xPct: number; // 0–100 percentage across SVG canvas
  yPct: number;
}

// Approximate geo bounds of the simulated metro map viewport
const MAP_BOUNDS = {
  latMin: 37.745,
  latMax: 37.800,
  lngMin: -122.475,
  lngMax: -122.390
};

function geoToCanvas(lat: number, lng: number): MarkerPosition {
  const xPct = ((lng - MAP_BOUNDS.lngMin) / (MAP_BOUNDS.lngMax - MAP_BOUNDS.lngMin)) * 100;
  const yPct = 100 - ((lat - MAP_BOUNDS.latMin) / (MAP_BOUNDS.latMax - MAP_BOUNDS.latMin)) * 100;
  return {
    xPct: Math.max(5, Math.min(95, xPct)),
    yPct: Math.max(5, Math.min(95, yPct))
  };
}

// Default simulated telemetry starting position (specialist origin)
const DEFAULT_SPECIALIST_GEO = { lat: 37.783, lng: -122.463 };
// Customer destination geo
const DEFAULT_CUSTOMER_GEO   = { lat: 37.764, lng: -122.410 };

/**
 * Phase 3: Live animated map component.
 * Connects to the SSE telemetry channel for the given order and renders
 * a smooth-moving specialist vehicle marker with animated polyline routing.
 * Falls back to simulated waypoint interpolation when the backend is offline.
 */
export const LiveMapView: React.FC<LiveMapViewProps> = ({ order }) => {
  const [telemetry, setTelemetry] = useState<TelemetryPayload>({
    lat: DEFAULT_SPECIALIST_GEO.lat,
    lng: DEFAULT_SPECIALIST_GEO.lng,
    speedMph: 24,
    distanceRemainingMiles: 2.4,
    etaMinutes: order.etaMinutes
  });
  const [isLive, setIsLive] = useState<boolean>(false);
  const [routeHistory, setRouteHistory] = useState<MarkerPosition[]>([]);
  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const simStepRef = useRef<number>(0);

  const handleTelemetry = useCallback((payload: TelemetryPayload) => {
    setIsLive(true);
    setTelemetry(payload);
    const pos = geoToCanvas(payload.lat, payload.lng);
    setRouteHistory(prev => [...prev.slice(-40), pos]); // keep last 40 trail points
    // Stop simulation once live data arrives
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
  }, []);

  const handleOrderUpdated = useCallback(() => {
    // Order status changes don't directly drive the map here
  }, []);

  // Subscribe to live SSE telemetry
  useOrderTracking(
    order.status === 'assigned' || order.status === 'in_progress' ? order.id : undefined,
    { onOrderUpdated: handleOrderUpdated, onTelemetryUpdated: handleTelemetry }
  );

  // Simulation fallback: smoothly interpolate specialist toward customer when no live data
  useEffect(() => {
    if (order.status !== 'assigned' && order.status !== 'in_progress') return;
    if (isLive) return;

    const totalSteps = 60; // ~60 ticks of 1.5s = 90 second demo journey
    simIntervalRef.current = setInterval(() => {
      simStepRef.current = Math.min(simStepRef.current + 1, totalSteps);
      const t = simStepRef.current / totalSteps;
      const curve = Math.sin(t * Math.PI) * 0.003;

      const lat = DEFAULT_SPECIALIST_GEO.lat + (DEFAULT_CUSTOMER_GEO.lat - DEFAULT_SPECIALIST_GEO.lat) * t + curve;
      const lng = DEFAULT_SPECIALIST_GEO.lng + (DEFAULT_CUSTOMER_GEO.lng - DEFAULT_SPECIALIST_GEO.lng) * t - curve;
      const dist = parseFloat((2.4 * (1 - t)).toFixed(2));
      const eta = Math.max(0, Math.round(dist * 3.5));
      const speed = simStepRef.current === totalSteps ? 0 : Math.round(20 + Math.sin(t * 8) * 8);

      const payload: TelemetryPayload = { lat, lng, speedMph: speed, distanceRemainingMiles: dist, etaMinutes: eta };
      setTelemetry(payload);
      const pos = geoToCanvas(lat, lng);
      setRouteHistory(prev => [...prev.slice(-40), pos]);
    }, 1500);

    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, [order.status, order.id, isLive]);

  const specialistPos = geoToCanvas(telemetry.lat, telemetry.lng);
  const customerPos   = geoToCanvas(DEFAULT_CUSTOMER_GEO.lat, DEFAULT_CUSTOMER_GEO.lng);

  const isActive = order.status === 'assigned' || order.status === 'in_progress';

  return (
    <div className="relative overflow-hidden rounded-xl bg-slate-900" style={{ height: '200px' }}>

      {/* ── Grid backdrop ── */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:18px_18px]" />

      {/* ── SVG canvas: roads, route polyline, trail ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* City road network */}
        <line x1="0" y1="140" x2="400" y2="60" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
        <line x1="0" y1="80"  x2="400" y2="120" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
        <line x1="80"  y1="0" x2="140" y2="200" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
        <line x1="260" y1="0" x2="300" y2="200" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
        <line x1="0"   y1="40" x2="400" y2="170" stroke="#0f172a" strokeWidth="10" strokeLinecap="round" />

        {/* Planned route dashed line: specialist → customer */}
        {isActive && (
          <line
            x1={`${specialistPos.xPct * 4}`}
            y1={`${specialistPos.yPct * 2}`}
            x2={`${customerPos.xPct * 4}`}
            y2={`${customerPos.yPct * 2}`}
            stroke="#6366f1"
            strokeWidth="2"
            strokeDasharray="6 5"
            opacity="0.7"
          />
        )}

        {/* GPS trail polyline from route history */}
        {routeHistory.length > 1 && (
          <polyline
            points={routeHistory.map(p => `${p.xPct * 4},${p.yPct * 2}`).join(' ')}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
          />
        )}
      </svg>

      {/* ── Customer destination pin ── */}
      <div
        className="absolute z-20 flex flex-col items-center"
        style={{
          left: `${customerPos.xPct}%`,
          top:  `${customerPos.yPct}%`,
          transform: 'translate(-50%, -100%)'
        }}
      >
        <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg ring-4 ring-rose-500/30">
          <MapPin className="w-3.5 h-3.5 fill-white" />
        </div>
        <span className="mt-1 px-1.5 py-0.5 bg-slate-900/90 text-white text-[8px] font-bold rounded border border-slate-700 whitespace-nowrap">
          Your Location
        </span>
      </div>

      {/* ── Specialist vehicle marker ── */}
      {isActive && (
        <div
          className="absolute z-20 flex flex-col items-center transition-all duration-1000"
          style={{
            left: `${specialistPos.xPct}%`,
            top:  `${specialistPos.yPct}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative">
            <span className="absolute -inset-3 rounded-full bg-indigo-500/25 animate-ping" />
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl ring-4 ring-indigo-400/40 relative">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <span className="mt-1 px-1.5 py-0.5 bg-indigo-900/90 text-indigo-200 text-[8px] font-bold rounded border border-indigo-500/30 flex items-center gap-1 whitespace-nowrap">
            <Navigation className="w-2 h-2 animate-spin" style={{ animationDuration: '3s' }} />
            {order.specialistName || 'Technician'}
          </span>
        </div>
      )}

      {/* ── Top-left status badge ── */}
      <div className="absolute top-2 left-2 z-30 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-slate-700/60 text-[9px] text-slate-300">
        {isLive ? (
          <><Wifi className="w-2.5 h-2.5 text-emerald-400" /><span className="text-emerald-300">Live GPS (±3m)</span></>
        ) : (
          <><WifiOff className="w-2.5 h-2.5 text-amber-400" /><span className="text-amber-300">Simulated GPS</span></>
        )}
      </div>

      {/* ── Bottom telemetry bar ── */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-slate-900/85 backdrop-blur-sm border-t border-slate-700/50 px-3 py-1.5 flex items-center justify-between text-[9px] text-slate-300">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-indigo-400" />
              <span className="font-bold text-white">{telemetry.etaMinutes} min</span>
              <span className="text-slate-400">ETA</span>
            </div>
            <div className="flex items-center gap-1">
              <Route className="w-2.5 h-2.5 text-cyan-400" />
              <span className="font-bold text-white">{telemetry.distanceRemainingMiles} mi</span>
            </div>
            <div className="flex items-center gap-1">
              <Gauge className="w-2.5 h-2.5 text-emerald-400" />
              <span className="font-bold text-white">{telemetry.speedMph} mph</span>
            </div>
          </div>
          <div className="text-[8px] text-slate-500 font-mono">
            {telemetry.lat.toFixed(4)}, {telemetry.lng.toFixed(4)}
          </div>
        </div>
      )}

      {/* Completed / pending state overlay */}
      {!isActive && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="text-center">
            <MapPin className="w-7 h-7 text-slate-400 mx-auto mb-1" />
            <p className="text-xs font-semibold text-slate-300">
              {order.status === 'completed' ? 'Service Completed' : 'Awaiting Specialist Dispatch'}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {order.status === 'completed' ? 'Job verified at your location.' : 'Live tracking activates once a specialist is assigned.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
