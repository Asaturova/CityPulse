type Rings = number[][][];
type MultiRings = number[][][][];
type LooseGeometry =
  | { type: "Polygon"; coordinates: Rings }
  | { type: "MultiPolygon"; coordinates: MultiRings };

export interface LooseFeatureCollection {
  type: "FeatureCollection";
  features: Array<{
    geometry?: LooseGeometry | null;
  }>;
}

function expandRing(
  coords: number[][],
  acc: { minLng: number; maxLng: number; minLat: number; maxLat: number },
) {
  for (const pair of coords) {
    const lng = pair[0];
    const lat = pair[1];
    acc.minLng = Math.min(acc.minLng, lng);
    acc.maxLng = Math.max(acc.maxLng, lng);
    acc.minLat = Math.min(acc.minLat, lat);
    acc.maxLat = Math.max(acc.maxLat, lat);
  }
}

function expandGeometry(geometry: LooseGeometry, acc: ReturnType<typeof seed>) {
  if (geometry.type === "Polygon") {
    for (const ring of geometry.coordinates) {
      expandRing(ring, acc);
    }
  } else if (geometry.type === "MultiPolygon") {
    for (const polygon of geometry.coordinates) {
      for (const ring of polygon) {
        expandRing(ring, acc);
      }
    }
  }
}

function seed() {
  return { minLng: 180, maxLng: -180, minLat: 90, maxLat: -90 };
}

export function boundsFromFeatureCollection(fc: LooseFeatureCollection): [number, number, number, number] | null {
  const acc = seed();
  let any = false;
  for (const feature of fc.features) {
    if (!feature.geometry) continue;
    expandGeometry(feature.geometry, acc);
    any = true;
  }
  if (!any) return null;
  return [acc.minLng, acc.minLat, acc.maxLng, acc.maxLat];
}
