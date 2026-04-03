import Image from "next/image";
import type { InsightItem, Locale, MapPoint, RecommendationItem } from "@/types/city";
import { t } from "@/utils/i18n";

interface Props {
  locale: Locale;
  point: MapPoint | null;
  insights: InsightItem[];
  recommendations: RecommendationItem[];
}

export function LocationDetailPanel({ locale, point, insights, recommendations }: Props) {
  const i18n = t(locale);
  if (!point) {
    return (
      <aside className="rounded-2xl border border-white/10 bg-black/35 p-4 text-zinc-300 backdrop-blur-md">
        Select a map point
      </aside>
    );
  }
  return (
    <aside className="space-y-4 rounded-2xl border border-white/10 bg-black/35 p-4 text-zinc-100 backdrop-blur-md">
      <div>
        <p className="text-zinc-400 text-xs">{i18n.district}</p>
        <h3 className="text-lg font-semibold">{point.name}</h3>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-white/5 p-2">{i18n.traffic}: {point.trafficLevel}%</div>
        <div className="rounded-xl bg-white/5 p-2">{i18n.co2}: {point.air.co2}</div>
      </div>
      <div className="rounded-xl bg-white/5 p-3">
        <p className="mb-2 text-xs text-zinc-400">Mini analytics</p>
        <div className="space-y-2">
          <div>
            <div className="mb-1 flex justify-between text-[11px] text-zinc-400">
              <span>Traffic load</span>
              <span>{point.trafficLevel}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-cyan-400" style={{ width: `${point.trafficLevel}%` }} />
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[11px] text-zinc-400">
              <span>AQI score</span>
              <span>{point.air.aqi}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-amber-400" style={{ width: `${Math.min(100, point.air.aqi)}%` }} />
            </div>
          </div>
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs text-zinc-400">{i18n.camera}</p>
        <Image
          src={point.cameraPreviewUrl}
          alt="camera"
          width={480}
          height={270}
          unoptimized
          className="rounded-xl w-full"
        />
      </div>
      <div>
        <p className="text-xs text-zinc-400">{i18n.insights}</p>
        <p className="text-sm">{insights[0]?.text}</p>
      </div>
      <div>
        <p className="text-xs text-zinc-400">{i18n.recommendations}</p>
        <p className="text-sm">{recommendations[0]?.text}</p>
      </div>
    </aside>
  );
}
