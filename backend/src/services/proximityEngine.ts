export {
  calculateHaversineDistanceMiles,
  scoreSpecialistsForOrder,
  generateRouteWaypoints,
  DISTRICT_COORDINATES
} from './dispatchEngine.js';

export type { GeoCoordinate, RouteWaypoint, SpecialistScoring } from './dispatchEngine.js';

import { GeoCoordinate, calculateHaversineDistanceMiles } from './dispatchEngine.js';

export function filterSpecialistsByRadius(
  customerCoord: GeoCoordinate,
  specialists: Array<{ id: string; locationCoord: GeoCoordinate }>,
  radiusMiles = 10
): Array<{ id: string; distanceMiles: number }> {
  return specialists
    .map(s => ({ id: s.id, distanceMiles: calculateHaversineDistanceMiles(customerCoord, s.locationCoord) }))
    .filter(r => r.distanceMiles <= radiusMiles)
    .sort((a, b) => a.distanceMiles - b.distanceMiles);
}

export function calcEtaMinutes(distanceMiles: number, avgSpeedMph = 18): number {
  return Math.max(5, Math.round((distanceMiles / avgSpeedMph) * 60 + 3));
}

export function isInsideServiceZone(point: GeoCoordinate, zoneCentre: GeoCoordinate, zoneRadiusMiles: number): boolean {
  return calculateHaversineDistanceMiles(point, zoneCentre) <= zoneRadiusMiles;
}
