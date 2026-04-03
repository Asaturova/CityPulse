import Image from "next/image";
import { useEffect, useState } from "react";
import type { InsightItem, Locale, MapPoint, RecommendationItem } from "@/types/city";
import { t } from "@/utils/i18n";
import { TrafficScale } from "@/components/panels/traffic-scale";
import { trafficFillRgba } from "@/utils/traffic";

interface Props {
  locale: Locale;
  point: MapPoint | null;
  insights: InsightItem[];
  recommendations: RecommendationItem[];
}

export function LocationDetailPanel({ locale, point, insights, recommendations }: Props) {
  const i18n = t(locale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!point) {
    return (
      <aside className="rounded-2xl border border-white/10 bg-black/35 p-4 text-zinc-300 backdrop-blur-md">
        {i18n.selectMapPoint}
      </aside>
    );
  }

  // Generate fake sparkline patterns based on the current level
  const trendLine = (val: number, max: number) => {
    const pts = Array.from({ length: 12 }, (_, i) => {
      const x = i * 10;
      const y = 30 - ((val * (0.8 + Math.random() * 0.4)) / max) * 30;
      return `${x},${Math.max(2, Math.min(28, y))}`;
    }).join(" L ");
    return `M 0,30 L ${pts}`;
  };

  return (
    <aside className="space-y-4 rounded-2xl border border-white/10 bg-black/60 p-4 text-zinc-100 backdrop-blur-xl shadow-2xl">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-zinc-400 text-xs">{point.type === "camera" ? (locale === "ru" ? "Камера" : "Camera") : (locale === "ru" ? "Сенсор" : "Sensor")}</p>
            <h3 className="text-lg font-semibold">{point.name}</h3>
          </div>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 font-mono text-[10px] text-zinc-400">
            {point.type === "camera" ? "C" : "S"}
          </span>
        </div>
        {point.description && <p className="mt-1 text-xs text-zinc-300 leading-relaxed">{point.description}</p>}
      </div>

      <div
        className="rounded-xl border border-white/10 p-3 transition-colors duration-500"
        style={{
          background: `linear-gradient(135deg, ${trafficFillRgba(point.trafficLevel, 0.25)}, transparent)`,
        }}
      >
        <div className="flex justify-between items-end mb-2">
          <p className="text-xs text-zinc-300 font-medium">{i18n.trafficLoad}</p>
          <svg width="60" height="24" viewBox="0 0 110 32" className="overflow-visible stroke-white/50 w-16 fill-none" strokeWidth="2" strokeLinecap="round">
            <path d={trendLine(point.trafficLevel, 100)} />
          </svg>
        </div>
        <TrafficScale level={point.trafficLevel} locale={locale} />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
         <div className="flex justify-between items-end mb-2">
          <p className="text-xs text-zinc-300 font-medium">{i18n.co2}</p>
          <svg width="60" height="24" viewBox="0 0 110 32" className="overflow-visible stroke-teal-400/50 w-16 fill-none" strokeWidth="2" strokeLinecap="round">
            <path d={trendLine(point.air.co2, 1000)} />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10 shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(100, (point.air.co2 / 900) * 100)}%`,
                background: "linear-gradient(90deg, #10b981, #f59e0b, #ef4444)",
              }}
            />
          </div>
          <span className="text-xs font-mono">{point.air.co2}</span>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs text-zinc-300 font-medium">{point.type === "camera" ? (locale === "ru" ? "Прямой эфир" : "Live Feed") : (locale === "ru" ? "Фото" : "Snapshot")}</p>
        <div className="relative overflow-hidden rounded-xl bg-black ring-1 ring-white/10">
          {point.cameraVideoUrl && mounted ? (
            <video
              src={point.cameraVideoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full object-cover aspect-video opacity-90 transition hover:opacity-100"
              poster={point.cameraPreviewUrl}
            />
          ) : (
             <Image
              src={point.cameraPreviewUrl}
              alt="camera"
              width={480}
              height={270}
              unoptimized
              className="w-full object-cover aspect-video"
            />
          )}
          {point.type === "camera" && (
             <div className="absolute top-2 right-2 flex items-center gap-1.5 rounded-md bg-black/60 backdrop-blur-md px-2 py-1">
               <span className="size-1.5 animate-pulse rounded-full bg-red-500"></span>
               <span className="text-[9px] font-medium tracking-wider text-white">LIVE</span>
             </div>
          )}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div>
          <p className="text-[10px] uppercase font-semibold text-cyan-400/80 tracking-wider mb-1">AI {i18n.insights}</p>
          <div className="rounded-lg bg-cyan-950/30 border border-cyan-500/20 p-2.5">
             <p className="text-sm leading-relaxed text-cyan-50">{insights[0]?.text}</p>
          </div>
        </div>
        <div>
           <p className="text-[10px] uppercase font-semibold text-emerald-400/80 tracking-wider mb-1">AI {i18n.recommendations}</p>
           <div className="rounded-lg bg-emerald-950/30 border border-emerald-500/20 p-2.5">
             <p className="text-sm leading-relaxed text-emerald-50">{recommendations[0]?.text}</p>
           </div>
        </div>
      </div>
    </aside>
  );
}
