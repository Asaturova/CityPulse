"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Camera, RadioReceiver } from "lucide-react";
import MapGL, {
  Layer,
  Marker,
  Popup,
  NavigationControl,
  Source,
  type MapMouseEvent,
  type MapRef,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { DistrictData, MapLayerMode, MapPoint, SeismicData, TrafficRoute } from "@/types/city";
import { boundsFromFeatureCollection, type LooseFeatureCollection } from "@/utils/geo-bbox";
import { trafficHeatRgba } from "@/utils/traffic";

interface GeoDistrictProps {
  id: string;
  name: string;
  trafficLevel: number;
  osm_relation_id?: number;
}

interface Props {
  points: MapPoint[];
  seismic: SeismicData[];
  districts: DistrictData[];
  routes: TrafficRoute[];
  selectedDistrictId: string;
  layerMode: MapLayerMode;
  activePointId?: string;
  onSelectPoint: (point: MapPoint) => void;
  onSelectDistrict: (districtId: string) => void;
  onViewportPointsChange: (pointIds: string[]) => void;
}

function mergeDistrictData(base: LooseFeatureCollection, districts: DistrictData[]): LooseFeatureCollection {
  const trafficById = new Map(districts.map((d) => [d.id, d.trafficLevel]));
  return {
    type: "FeatureCollection",
    features: base.features.map((feature) => {
      const props = (feature as { properties?: GeoDistrictProps }).properties;
      if (!props?.id) {
        return feature;
      }
      const trafficLevel = trafficById.get(props.id) ?? 50;
      return {
        ...feature,
        properties: {
          ...props,
          trafficLevel,
        },
      };
    }),
  } as LooseFeatureCollection;
}

export function CityMap({
  points,
  seismic,
  districts,
  routes,
  selectedDistrictId,
  layerMode,
  activePointId,
  onSelectPoint,
  onSelectDistrict,
  onViewportPointsChange,
}: Props) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapRef = useRef<MapRef | null>(null);
  const [baseGeo, setBaseGeo] = useState<LooseFeatureCollection | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedRouteInfo, setSelectedRouteInfo] = useState<{id: string, name: string, level: number, lng: number, lat: number} | null>(null);
  const [flowPhase, setFlowPhase] = useState(0);
  const noneToken = "__none__";

  useEffect(() => {
    const handle = setInterval(() => {
      setFlowPhase((p) => (p + 1) % 100);
    }, 150);
    return () => clearInterval(handle);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/almaty-districts.geojson")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setBaseGeo(data as LooseFeatureCollection);
      })
      .catch(() => {
        if (!cancelled) setBaseGeo(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const districtData = useMemo(() => {
    if (!baseGeo) return null;
    return mergeDistrictData(baseGeo, districts);
  }, [baseGeo, districts]);

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

  const routesSource = useMemo(
    () => ({
      type: "FeatureCollection",
      features: routes.map((r) => ({
         type: "Feature",
         properties: {
            id: r.id,
            name: r.name,
            trafficLevel: r.trafficLevel
         },
         geometry: {
            type: "LineString",
            coordinates: r.coordinates
         }
      }))
    }),
    [routes]
  );

  useEffect(() => {
    if (!districtData) return;
    const map = mapRef.current?.getMap();
    if (!map) return;
    const bbox = boundsFromFeatureCollection(districtData);
    if (!bbox) return;
    const apply = () => {
      map.fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ],
        { padding: 52, duration: 1100, maxZoom: 12.2 },
      );
    };
    if (map.isStyleLoaded()) {
      apply();
    } else {
      map.once("load", apply);
    }
  }, [districtData]);

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
      zoom: 12,
      duration: 1100,
      essential: true,
    });
  }, [districts, selectedDistrictId]);

  const interactiveIds = useMemo(
    () => (districtData ? ["district-fill", "district-outline", "routes-hitbox"] : []),
    [districtData],
  );

  const onDistrictHover = useCallback((event: MapMouseEvent) => {
    const feature = event.features?.[0];
    const id = (feature?.properties as GeoDistrictProps | undefined)?.id ?? null;
    setHoverId(id);
    const target = event.target;
    target.getCanvas().style.cursor = id ? "pointer" : "";
  }, []);

  const onDistrictClick = useCallback(
    (event: MapMouseEvent) => {
      const routeFeature = event.features?.find(f => f.layer?.id === "routes-hitbox");
      if (routeFeature && routeFeature.properties?.id) {
         setSelectedRouteInfo({
            id: routeFeature.properties.id,
            name: routeFeature.properties.name,
            level: routeFeature.properties.trafficLevel,
            lng: event.lngLat.lng,
            lat: event.lngLat.lat
         });
         return;
      }
      setSelectedRouteInfo(null);
      
      const feature = event.features?.find(f => f.layer?.id === "district-fill" || f.layer?.id === "district-outline");
      const id = (feature?.properties as GeoDistrictProps | undefined)?.id;
      if (id) {
        onSelectDistrict(id);
      }
    },
    [onSelectDistrict],
  );

  if (!token) {
    return <div className="h-full w-full grid place-items-center text-zinc-300">Missing Mapbox token</div>;
  }

  const hoverPaintToken = hoverId ?? noneToken;
  const selectedPaintToken = selectedDistrictId === "all" ? noneToken : selectedDistrictId;

  return (
    <MapGL
      ref={mapRef}
      mapboxAccessToken={token}
      initialViewState={{ latitude: 43.2389, longitude: 76.8897, zoom: 10.7 }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      style={{ width: "100%", height: "100%" }}
      interactiveLayerIds={interactiveIds}
      onMouseMove={onDistrictHover}
      onClick={onDistrictClick}
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
      <NavigationControl position="top-right" showCompass={false} />
      {districtData && (
        <Source id="districts" type="geojson" data={districtData as unknown as GeoJSON.FeatureCollection} promoteId="id">
          <Layer
            id="district-fill"
            type="fill"
            paint={{
              "fill-color": [
                "interpolate",
                ["linear"],
                ["get", "trafficLevel"],
                0,
                "rgba(34,197,94,0.22)",
                45,
                "rgba(34,197,94,0.15)",
                55,
                "rgba(250,204,21,0.28)",
                75,
                "rgba(249,115,22,0.32)",
                100,
                "rgba(239,68,68,0.38)",
              ],
              "fill-opacity": [
                "case",
                ["==", ["get", "id"], hoverPaintToken],
                0.72,
                ["==", ["get", "id"], selectedPaintToken],
                0.55,
                0.35,
              ],
            }}
          />
          <Layer
            id="district-outline"
            type="line"
            paint={{
              "line-color": [
                "case",
                ["==", ["get", "id"], hoverPaintToken],
                "rgba(255,255,255,0.95)",
                ["==", ["get", "id"], selectedPaintToken],
                "rgba(34,211,238,0.95)",
                "rgba(148,163,184,0.45)",
              ],
              "line-width": [
                "case",
                ["==", ["get", "id"], hoverPaintToken],
                2.4,
                ["==", ["get", "id"], selectedPaintToken],
                2.1,
                0.9,
              ],
            }}
          />
        </Source>
      )}
      {layerMode === "traffic" && (
         <Source id="routes-source" type="geojson" data={routesSource as GeoJSON.FeatureCollection}>
            <Layer 
               id="routes-bg"
               type="line"
               paint={{
                 "line-color": [
                   "interpolate",
                   ["linear"],
                   ["get", "trafficLevel"],
                   0, "rgba(34,197,94,0.85)",
                   45, "rgba(250,204,21,0.85)",
                   75, "rgba(249,115,22,0.85)",
                   100, "rgba(239,68,68,0.95)"
                 ],
                 "line-width": ["interpolate", ["linear"], ["zoom"], 10, 3, 15, 12],
                 "line-blur": 1
               }}
            />
            {/* Flow effect overlay layer */}
            <Layer
               id="routes-flow"
               type="line"
               paint={{
                 "line-color": "#ffffff",
                 "line-width": ["interpolate", ["linear"], ["zoom"], 10, 1, 15, 3],
                 "line-opacity": (Math.sin(flowPhase * 0.2) + 1) * 0.25,
                 "line-dasharray": [2, 4]
               }}
            />
            {/* Invisible thicker hitbox for reliable clicking */}
            <Layer
               id="routes-hitbox"
               type="line"
               paint={{
                 "line-color": "transparent",
                 "line-width": ["interpolate", ["linear"], ["zoom"], 10, 10, 15, 30]
               }}
            />
         </Source>
      )}
      
      {selectedRouteInfo && (
        <Popup
          longitude={selectedRouteInfo.lng}
          latitude={selectedRouteInfo.lat}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setSelectedRouteInfo(null)}
          anchor="bottom"
          className="rounded-xl overflow-hidden shadow-2xl"
          maxWidth="220px"
        >
          <div className="bg-zinc-950 p-3 text-white border border-white/10 rounded-xl">
             <p className="font-semibold text-sm mb-1">{selectedRouteInfo.name}</p>
             <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/10">
                   <div className="h-full" style={{
                      width: `${selectedRouteInfo.level}%`,
                      background: selectedRouteInfo.level < 45 ? "#22c55e" : selectedRouteInfo.level < 75 ? "#eab308" : "#ef4444"
                   }} />
                </div>
                <span className="text-xs font-mono">{selectedRouteInfo.level}</span>
             </div>
             <p className="mt-1.5 text-xs text-zinc-400">
               {selectedRouteInfo.level < 45 ? "Свободное движение" : selectedRouteInfo.level < 75 ? "Средняя загруженность" : "Сильные пробки"}
             </p>
          </div>
        </Popup>
      )}

      {layerMode !== "seismic" && (
        <Source id="heat-source" type="geojson" data={heatSource as GeoJSON.FeatureCollection}>
          <Layer
            id="heatmap-layer"
            type="heatmap"
            paint={{
              "heatmap-weight": [
                "interpolate",
                ["linear"],
                layerMode === "traffic" ? ["get", "trafficLevel"] : ["get", "co2"],
                layerMode === "traffic" ? 0 : 400, 0,
                layerMode === "traffic" ? 100 : 1000, 1
              ],
              "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 10, 1, 14, 3],
              "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0, "rgba(34,197,94,0)",
                0.2, "rgba(34,197,94,0.4)",
                0.5, "rgba(250,204,21,0.6)",
                0.8, "rgba(249,115,22,0.8)",
                1, "rgba(239,68,68,0.9)"
              ],
              "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 10, 35, 14, 90],
              "heatmap-opacity": 0.85,
            }}
          />
        </Source>
      )}
      {points.map((point) => (
        <Marker
          key={point.id}
          latitude={point.lat}
          longitude={point.lng}
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            onSelectPoint(point);
          }}
        >
          <MarkerDot level={point.trafficLevel} active={point.id === activePointId} type={point.type} />
        </Marker>
      ))}
      {layerMode === "seismic" &&
        seismic.map((s) => (
          <Marker key={s.id} latitude={s.lat} longitude={s.lng}>
            <div className="size-5 rounded-full bg-rose-500/70 shadow-[0_0_24px_rgba(244,63,94,0.9)]" />
          </Marker>
        ))}
    </MapGL>
  );
}

function MarkerDot({ level, active, type }: { level: number; active: boolean; type?: "camera" | "sensor" }) {
  const load = level < 45 ? "low" : level < 75 ? "mid" : "high";
  const palette =
    load === "low"
      ? "border-emerald-200/80 bg-emerald-500 shadow-[0_0_15px_rgba(34,197,94,0.9)] text-emerald-950"
      : load === "mid"
        ? "border-amber-200/90 bg-amber-400 shadow-[0_0_15px_rgba(250,204,21,0.85)] text-amber-950"
        : "border-rose-100/90 bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.92)] text-rose-950";
  const isActive = active ? "ring-2 ring-white ring-offset-2 ring-offset-transparent scale-125" : "hover:scale-110";
  
  if (type === "camera") {
    return (
      <button 
        type="button" 
        className={`relative flex items-center justify-center p-1.5 rounded-lg border-2 ${palette} transition-all duration-300 ${isActive}`} 
        aria-label="camera"
      >
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
        <Camera className="w-3.5 h-3.5" strokeWidth={2.5} />
      </button>
    );
  }

  return (
    <button type="button" className={`relative flex items-center justify-center p-1 rounded-full border-2 ${palette} transition-all duration-300 ${isActive}`} aria-label="sensor">
        <RadioReceiver className="w-3 h-3" strokeWidth={2.5} />
    </button>
  );
}
