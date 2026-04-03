import type { Locale } from "@/types/city";
import { t } from "@/utils/i18n";
import { trafficLoad } from "@/utils/traffic";

export function TrafficScale({ level, locale }: { level: number; locale: Locale }) {
  const i18n = t(locale);
  const load = trafficLoad(level);
  return (
    <div className="space-y-2">
      <div className="flex h-3 overflow-hidden rounded-full ring-1 ring-white/10">
        <div
          className={`flex-1 transition ${load === "low" ? "brightness-125 ring-2 ring-emerald-300/80" : "opacity-45"}`}
          style={{ background: "linear-gradient(90deg,#22c55e,#4ade80)" }}
        />
        <div
          className={`flex-1 transition ${load === "medium" ? "brightness-125 ring-2 ring-amber-300/90" : "opacity-45"}`}
          style={{ background: "linear-gradient(90deg,#eab308,#facc15)" }}
        />
        <div
          className={`flex-1 transition ${load === "high" ? "brightness-125 ring-2 ring-rose-300/90" : "opacity-45"}`}
          style={{ background: "linear-gradient(90deg,#f97316,#ef4444)" }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-zinc-500">
        <span>{i18n.legendLow}</span>
        <span>{i18n.legendMid}</span>
        <span>{i18n.legendHigh}</span>
      </div>
    </div>
  );
}
