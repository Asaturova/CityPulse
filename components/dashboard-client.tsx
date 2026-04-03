"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { CityMap } from "@/components/map/city-map";
import { KpiBar } from "@/components/kpi/kpi-bar";
import { WeatherAirWidget } from "@/components/widgets/weather-air-widget";
import { AlertsWidget } from "@/components/widgets/alerts-widget";
import { LocationDetailPanel } from "@/components/panels/location-detail-panel";
import { CityChat } from "@/components/chat/city-chat";
import { CityAnalysisModal } from "@/components/panels/city-analysis-modal";
import { Button } from "@/components/ui/button";
import { BarChart3, Clock } from "lucide-react";
import type { AirQualityData, MapLayerMode, WeatherData } from "@/types/city";
import { t } from "@/utils/i18n";

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
  const [visiblePointIds, setVisiblePointIds] = useState<string[]>(() => data.points.map((p) => p.id));
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [timeAgo, setTimeAgo] = useState(0);

  // Update relative time
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(Math.floor((Date.now() - data.lastUpdated) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [data.lastUpdated]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#030712] text-white">
      <CityMap
        points={data.points}
        seismic={data.seismic}
        districts={data.districts}
        routes={data.routes}
        selectedDistrictId={data.selectedDistrictId}
        layerMode={layerMode}
        activePointId={data.selectedPoint?.id}
        onSelectPoint={data.setSelectedPoint}
        onSelectDistrict={(id) => {
          data.setSelectedDistrictId(id);
          data.setSelectedPoint(null);
        }}
        onViewportPointsChange={setVisiblePointIds}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/65" />

      <motion.div
        className="absolute left-3 right-3 top-3 z-10 space-y-3 sm:left-4 sm:right-4 sm:top-4"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{i18n.title}</h1>
            <p className="text-sm text-zinc-300">{i18n.subtitle}</p>
          </div>
          <div className="pointer-events-auto flex flex-wrap items-center gap-2">
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
              className="rounded-lg border border-white/15 bg-black/45 px-2 py-1.5 text-sm backdrop-blur-md"
              value={data.selectedDistrictId}
              onChange={(e) => {
                data.setSelectedDistrictId(e.target.value);
                data.setSelectedPoint(null);
              }}
            >
              <option value="all">{i18n.allDistricts}</option>
              {data.districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <div className="flex rounded-lg border border-white/15 bg-black/45 p-0.5 text-[11px] backdrop-blur-md sm:text-xs">
              <button
                type="button"
                className={`rounded-md px-3 py-1.5 transition-colors duration-300 ${layerMode === "traffic" ? "bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.2)]" : "text-zinc-400 hover:text-zinc-200"}`}
                onClick={() => setLayerMode("traffic")}
              >
                {i18n.layerTraffic}
              </button>
              <button
                type="button"
                className={`rounded-md px-3 py-1.5 transition-colors duration-300 ${layerMode === "pollution" ? "bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.2)]" : "text-zinc-400 hover:text-zinc-200"}`}
                onClick={() => setLayerMode("pollution")}
              >
                {i18n.layerPollution}
              </button>
              <button
                type="button"
                className={`rounded-md px-3 py-1.5 transition-colors duration-300 ${layerMode === "seismic" ? "bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.2)]" : "text-zinc-400 hover:text-zinc-200"}`}
                onClick={() => setLayerMode("seismic")}
              >
                {i18n.layerSeismic}
              </button>
            </div>
            
            <button
               onClick={() => setIsAnalysisOpen(true)}
               className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(34,211,238,0.4)] transition hover:scale-105 hover:shadow-[0_0_25px_rgba(34,211,238,0.6)]"
            >
               <BarChart3 className="size-3.5" />
               {data.locale === "ru" ? "Анализ города" : "City Analysis"}
            </button>
          </div>
        </div>
        <div className="flex justify-between items-end">
          <p className="text-xs text-zinc-400">
            {i18n.visiblePoints}: <span className="text-cyan-200/90">{visiblePointIds.length}</span>
          </p>
          <div className="flex items-center gap-1 text-[10px] text-zinc-500 opacity-80 transition-opacity motion-safe:animate-pulse">
            <Clock className="size-3" />
            <span>{data.locale === "ru" ? `Обновлено ${timeAgo} сек. назад` : `Updated ${timeAgo}s ago`}</span>
          </div>
        </div>
        <KpiBar kpi={data.kpi} locale={data.locale} />
      </motion.div>

      <motion.div
        className="absolute bottom-3 left-3 z-10 max-h-[38vh] w-[min(100%-7rem,28rem)] space-y-3 overflow-y-auto pr-1 sm:bottom-4 sm:left-4 sm:max-h-[42vh]"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <WeatherAirWidget weather={data.weather} air={data.air} locale={data.locale} />
        <AlertsWidget alerts={data.alerts} locale={data.locale} />
      </motion.div>

      <motion.div
        className="absolute right-3 top-[7.5rem] z-10 w-[min(92vw,22rem)] sm:right-4 sm:top-28"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.45 }}
      >
        <LocationDetailPanel
          locale={data.locale}
          point={data.selectedPoint}
          insights={data.insights}
          recommendations={data.recommendations}
        />
      </motion.div>

      <CityChat
        key={data.locale}
        locale={data.locale}
        weather={data.weather}
        air={data.air}
        districts={data.districts}
      />

      <CityAnalysisModal 
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        districts={data.districts}
        locale={data.locale}
      />
    </div>
  );
}
