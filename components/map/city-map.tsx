"use client";

import { useEffect, useMemo, useRef } from "react";
import Map, { Layer, Marker, NavigationControl, Source, type MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { DistrictData, MapLayerMode, MapPoint, SeismicData } from "@/types/city";

const districtGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { id: "almaly" },
      geometry: {
        type: "Polygon",
        coordinates: [[[76.9, 43.245], [76.94, 43.245], [76.94, 43.27], [76.9, 43.27], [76.9, 43.245]]],
      },
    },
    {
      type: "Feature",
      properties: { id: "bostandyk" },
      geometry: {
        type: "Polygon",
        coordinates: [[[76.89, 43.205], [76.95, 43.205], [76.95, 43.24], [76.89, 43.24], [76.89, 43.205]]],
      },
    },
    {
      type: "Feature",
      properties: { id: "medeu" },
      geometry: {
        type: "Polygon",
        coordinates: [[[76.93, 43.225], [76.99, 43.225], [76.99, 43.26], [76.93, 43.26], [76.93, 43.225]]],
      },
    },
  ],
};

interface Props {
  points: MapPoint[];
  seismic: SeismicData[];
  districts: DistrictData[];
  selectedDistrictId: string;
  layerMode: MapLayerMode;
  activePointId?: string;
  onSelectPoint: (point: MapPoint) => void;
  onViewportPointsChange: (pointIds: string[]) => void;
}

export function CityMap({
  points,
  seismic,
  districts,
  selectedDistrictId,
  layerMode,
  activePointId,
  onSelectPoint,
  onViewportPointsChange,
}: Props) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapRef = useRef<MapRef | null>(null);

  const heatSource = useMemo(
    () => ({
      type: "FeatureCollection",
      features: points.map((point) => ({
        type: "Feature",
        properties: {
          id: point.id,
          trafficLevel: point.trafficLevel,
          co2: point.air.co2,
        },
        geometry: {
          type: "Point",
          coordinates: [point.lng, point.lat],
        },
      })),
    }),
    [points],
  );

  useEffect(() => {
    if (!mapRef.current || selectedDistrictId === "all") {
      return;
    }
    const district = districts.find((item) => item.id === selectedDistrictId);
    if (!district) {
      return;
    }
    mapRef.current.flyTo({
      center: [district.center.lng, district.center.lat],
      zoom: 12.5,
      duration: 900,
      essential: true,
    });
  }, [districts, selectedDistrictId]);

  if (!token) {
    return <div className="h-full w-full grid place-items-center text-zinc-300">Missing Mapbox token</div>;
  }

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={token}
      initialViewState={{ latitude: 43.2389, longitude: 76.8897, zoom: 11.5 }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      style={{ width: "100%", height: "100%" }}
      onMoveEnd={(event) => {
        const bounds = event.target.getBounds();
        if (!bounds) {
          return;
        }
        const visible = points
          .filter(
            (point) =>
              point.lat <= bounds.getNorth() &&
              point.lat >= bounds.getSouth() &&
              point.lng <= bounds.getEast() &&
              point.lng >= bounds.getWest(),
          )
          .map((point) => point.id);
        onViewportPointsChange(visible);
      }}
    >
      <NavigationControl position="top-right" />
      <Source id="districts" type="geojson" data={districtGeoJson as GeoJSON.FeatureCollection}>
        <Layer
          id="district-fill"
          type="fill"
          paint={{
            "fill-color": [
              "match",
              ["get", "id"],
              selectedDistrictId,
              "#22d3ee",
              "rgba(34,211,238,0.13)",
            ],
            "fill-outline-color": "rgba(34,211,238,0.55)",
          }}
        />
      </Source>
      {layerMode !== "seismic" && (
        <Source id="heat-source" type="geojson" data={heatSource as GeoJSON.FeatureCollection}>
          <Layer
            id="heat-circles"
            type="circle"
            paint={{
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 12, 14, 28],
              "circle-color":
                layerMode === "traffic"
                  ? [
                      "interpolate",
                      ["linear"],
                      ["get", "trafficLevel"],
                      30,
                      "rgba(56,189,248,0.18)",
                      60,
                      "rgba(250,204,21,0.32)",
                      90,
                      "rgba(248,113,113,0.58)",
                    ]
                  : [
                      "interpolate",
                      ["linear"],
                      ["get", "co2"],
                      500,
                      "rgba(34,197,94,0.22)",
                      700,
                      "rgba(250,204,21,0.35)",
                      850,
                      "rgba(244,63,94,0.58)",
                    ],
              "circle-blur": 0.5,
              "circle-opacity": 0.85,
            }}
          />
        </Source>
      )}
      {points.map((point) => (
        <Marker key={point.id} latitude={point.lat} longitude={point.lng} onClick={() => onSelectPoint(point)}>
          <button
            className={
              point.id === activePointId
                ? "size-5 rounded-full border border-cyan-100 bg-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.95)]"
                : "size-4 rounded-full border border-cyan-200 bg-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,0.8)]"
            }
          />
        </Marker>
      ))}
      {layerMode === "seismic" &&
        seismic.map((s) => (
          <Marker key={s.id} latitude={s.lat} longitude={s.lng}>
            <div className="size-5 rounded-full bg-rose-500/70 shadow-[0_0_24px_rgba(244,63,94,0.9)]" />
          </Marker>
        ))}
    </Map>
  );
}
