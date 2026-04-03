import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import type { CityKpi, Locale } from "@/types/city";
import { t } from "@/utils/i18n";

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current).toString());
  
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);
  
  return <motion.span>{display}</motion.span>;
}

function TrafficKpiVisual({ value, locale }: { value: number; locale: Locale }) {
  const i18n = t(locale);
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="space-y-2">
      <div className="flex h-2 overflow-hidden rounded-full">
        <div className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-400/70" title={i18n.legendLow} />
        <div className="flex-1 bg-gradient-to-r from-amber-400 to-amber-300/80" title={i18n.legendMid} />
        <div className="flex-1 bg-gradient-to-r from-orange-500 to-red-500" title={i18n.legendHigh} />
      </div>
      <div className="relative h-3">
        <motion.div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-zinc-900 shadow-[0_0_12px_rgba(255,255,255,0.45)]"
          animate={{ left: `${clamped}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
      <p className="text-[10px] uppercase tracking-wide text-zinc-500">
        {i18n.legendLow} · {i18n.legendMid} · {i18n.legendHigh}
      </p>
    </div>
  );
}

export function KpiBar({ kpi, locale }: { kpi: CityKpi; locale: Locale }) {
  const i18n = t(locale);

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition hover:border-cyan-500/15">
        <p className="text-xs text-zinc-400">{i18n.traffic}</p>
        <TrafficKpiVisual value={kpi.avgTraffic} locale={locale} />
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition hover:border-cyan-500/15">
        <p className="text-xs text-zinc-400">{i18n.co2}</p>
        <p className="text-xl font-semibold text-zinc-100"><AnimatedNumber value={kpi.avgCo2} /> ppm</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition hover:border-cyan-500/15">
        <p className="text-xs text-zinc-400">{i18n.alerts}</p>
        <p className="text-xl font-semibold text-zinc-100"><AnimatedNumber value={kpi.alertsCount} /></p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition hover:border-cyan-500/15">
        <p className="text-xs text-zinc-400">{i18n.activity}</p>
        <p className="text-xl font-semibold text-zinc-100"><AnimatedNumber value={kpi.cityActivityIndex} /></p>
      </div>
    </div>
  );
}
