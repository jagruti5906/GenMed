import { Specialist, Order } from '../types/index.js';

export interface GeoCoordinate { lat: number; lng: number; name?: string; }
export interface RouteWaypoint extends GeoCoordinate { stepIndex: number; distanceRemainingMiles: number; etaMinutes: number; speedMph: number; }
export interface SpecialistScoring { specialistId: string; specialistName: string; specialty: string; rating: number; distanceMiles: number; score: number; etaMinutes: number; isAvailable: boolean; }

export const DISTRICT_COORDINATES: Record<string, GeoCoordinate> = {
  'Downtown Logistics Hub':                         { lat: 37.7749, lng: -122.4194 },
  'Midtown Residential Sector':                     { lat: 37.7833, lng: -122.4167 },
  'West End Tech Corridor':                         { lat: 37.7691, lng: -122.4467 },
  'Central Transit Hub':                            { lat: 37.7892, lng: -122.4014 },
  '742 Evergreen Terrace, Suite 4B, Metro City':    { lat: 37.7648, lng: -122.4632 },
  '120 Market St, 15th Floor, Financial Hub':       { lat: 37.7936, lng: -122.3958 },
  '55 University Parkway, Apt 3C':                  { lat: 37.7512, lng: -122.4312 }
};

export function calculateHaversineDistanceMiles(c1: GeoCoordinate, c2: GeoCoordinate): number {
  const R = 3958.8;
  const dLat = (c2.lat - c1.lat) * (Math.PI / 180);
  const dLng = (c2.lng - c1.lng) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(c1.lat * Math.PI / 180) * Math.cos(c2.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2));
}

export function scoreSpecialistsForOrder(order: Order, specialists: Specialist[]): SpecialistScoring[] {
  const customerCoord = DISTRICT_COORDINATES[order.customerAddress] || { lat: 37.77, lng: -122.43 };
  const W_d = 0.45, W_r = 0.40, W_q = 0.15;
  return specialists.map(spec => {
    const specCoord = DISTRICT_COORDINATES[spec.currentLocationName] || { lat: 37.78, lng: -122.41 };
    const distanceMiles = calculateHaversineDistanceMiles(specCoord, customerCoord);
    const distanceScore = Math.max(0, 100 - (distanceMiles / 15) * 100);
    const ratingScore   = Math.max(0, ((spec.rating - 4.0) / 1.0) * 100);
    const queuePenalty  = spec.status === 'available' ? 0 : 50;
    const totalScore    = parseFloat((W_d * distanceScore + W_r * ratingScore - W_q * queuePenalty).toFixed(1));
    return { specialistId: spec.id, specialistName: spec.name, specialty: spec.specialty, rating: spec.rating, distanceMiles, score: Math.max(0, totalScore), etaMinutes: Math.max(8, Math.round(distanceMiles * 3.2 + 5)), isAvailable: spec.status === 'available' };
  }).sort((a, b) => b.score - a.score);
}

export function generateRouteWaypoints(origin: GeoCoordinate, destination: GeoCoordinate, totalSteps = 20): RouteWaypoint[] {
  const totalDistance = calculateHaversineDistanceMiles(origin, destination);
  return Array.from({ length: totalSteps + 1 }, (_, i) => {
    const t = i / totalSteps;
    const curve = Math.sin(t * Math.PI) * 0.005;
    return {
      lat: origin.lat + (destination.lat - origin.lat) * t + curve,
      lng: origin.lng + (destination.lng - origin.lng) * t - curve,
      stepIndex: i,
      distanceRemainingMiles: parseFloat((totalDistance * (1 - t)).toFixed(2)),
      etaMinutes: Math.max(0, Math.round(totalDistance * (1 - t) * 3.5)),
      speedMph: i === totalSteps ? 0 : Math.round(24 + Math.sin(t * 5) * 8)
    };
  });
}
