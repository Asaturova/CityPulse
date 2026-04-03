"use client";

import { motion } from "framer-motion";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { CityMap } from "@/components/map/city-map";
import { KpiBar } from "@/components/kpi/kpi-bar";
import { WeatherAirWidget } from "@/components/widgets/weather-air-widget";
import { AlertsWidget } from "@/components/widgets/alerts-widget";
import { LocationDetailPanel } from "@/components/panels/location-detail-panel";
import { Button } from "@/components/ui/button";
import type { AirQualityData, MapLayerMode, WeatherData } from "@/types/city";
import { t } from "@/utils/i18n";
import { useState } from "react";

export function DashboardClient({
  weather,
  air,
}: {
  weather?: WeatherData;
  air?: AirQualityData;
}) {
  const data = useDashboardData(weather, air);
  const i18n = t(data.locale);
  const [layerMode, setLayerMode] = useState<MapLayerMode>("traffic");
  const [visiblePointIds, setVisiblePointIds] = useState<string[]>(data.points.map((point) => point.id));

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#030712] text-white">
      <CityMap
        points={data.points}
        seismic={data.seismic}
        districts={data.districts}
        selectedDistrictId={data.selectedDistrictId}
        layerMode={layerMode}
        activePointId={data.selectedPoint?.id}
        onSelectPoint={data.setSelectedPoint}
        onViewportPointsChange={setVisiblePointIds}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      <motion.div
        className="absolute left-4 right-4 top-4 space-y-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{i18n.title}</h1>
            <p className="text-sm text-zinc-300">{i18n.subtitle}</p>
          </div>
          <div className="pointer-events-auto flex gap-2">
            <Button
              variant={data.locale === "ru" ? "default" : "ghost"}
              size="sm"
              onClick={() => data.setLocale("ru")}
            >
              RU
            </Button>
            <Button
              variant={data.locale === "en" ? "default" : "ghost"}
              size="sm"
              onClick={() => data.setLocale("en")}
            >
              EN
            </Button>
            <select
              className="rounded-md border border-white/15 bg-black/40 px-2 text-sm pointer-events-auto"
              value={data.selectedDistrictId}
              onChange={(e) => data.setSelectedDistrictId(e.target.value)}
            >
              <option value="all">{i18n.allDistricts}</option>
              {data.districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <div className="rounded-md border border-white/15 bg-black/40 p-1 text-xs">
              <button
                className={`px-2 py-1 ${layerMode === "traffic" ? "text-cyan-300" : "text-zinc-300"}`}
                onClick={() => setLayerMode("traffic")}
              >
                {i18n.layerTraffic}
              </button>
              <button
                className={`px-2 py-1 ${layerMode === "pollution" ? "text-cyan-300" : "text-zinc-300"}`}
                onClick={() => setLayerMode("pollution")}
              >
                {i18n.layerPollution}
              </button>
              <button
                className={`px-2 py-1 ${layerMode === "seismic" ? "text-cyan-300" : "text-zinc-300"}`}
                onClick={() => setLayerMode("seismic")}
              >
                {i18n.layerSeismic}
              </button>
            </div>
          </div>
        </div>
        <p className="text-xs text-zinc-400">
          {i18n.visiblePoints}: {visiblePointIds.length}
        </p>
        <KpiBar kpi={data.kpi} locale={data.locale} />
      </motion.div>

      <div className="absolute bottom-4 left-4 right-[24rem] space-y-3">
        <WeatherAirWidget weather={data.weather} air={data.air} locale={data.locale} />
        <AlertsWidget alerts={data.alerts} locale={data.locale} />
      </div>

      <div className="absolute right-4 top-28 w-[22rem] max-w-[36vw]">
        <LocationDetailPanel
          locale={data.locale}
          point={data.selectedPoint}
          insights={data.insights}
          recommendations={data.recommendations}
        />
      </div>
    </div>
  );
}
