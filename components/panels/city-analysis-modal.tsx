"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, MapPin, Wind, X, Zap } from "lucide-react";
import type { DistrictData, Locale } from "@/types/city";
import { t } from "@/utils/i18n";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  districts: DistrictData[];
  locale: Locale;
}

export function CityAnalysisModal({ isOpen, onClose, districts, locale }: Props) {
  const i18n = t(locale);

  if (!districts.length) return null;

  // Analysis Logic
  const sortedByTraffic = [...districts].sort((a, b) => b.trafficLevel - a.trafficLevel);
  const sortedByCo2 = [...districts].sort((a, b) => b.air.co2 - a.air.co2);
  const sortedByAqi = [...districts].sort((a, b) => b.air.aqi - a.air.aqi);

  // Overall worst district (simple composite score)
  const sortedByWorst = [...districts].sort((a, b) => {
    const scoreA = a.trafficLevel + (a.air.co2 / 10) + a.air.aqi;
    const scoreB = b.trafficLevel + (b.air.co2 / 10) + b.air.aqi;
    return scoreB - scoreA;
  });

  const worstOverall = sortedByWorst[0];
  const worstTraffic = sortedByTraffic[0];
  const worstCo2 = sortedByCo2[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-[70] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/90 p-1 shadow-[0_0_50px_rgba(34,211,238,0.15)] ring-1 ring-white/5 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Zap className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white">{locale === "ru" ? "Глубокий анализ города" : "Deep City Analysis"}</h2>
                  <p className="text-xs text-zinc-400">{locale === "ru" ? "Автоматический сводный отчёт" : "Automated summary report"}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                  <div className="mb-2 flex items-center gap-2 text-red-400">
                    <AlertTriangle className="size-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">{locale === "ru" ? "Самый проблемный" : "Most Critical"}</span>
                  </div>
                  <p className="text-lg font-bold text-red-50">{worstOverall.name}</p>
                  <p className="mt-1 text-xs text-red-200/70">{locale === "ru" ? "Максимальная совокупная нагрузка" : "Maximum cumulative load"}</p>
                </div>

                <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 p-4">
                  <div className="mb-2 flex items-center gap-2 text-orange-400">
                    <MapPin className="size-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">{locale === "ru" ? "Сильные пробки" : "Heavy Traffic"}</span>
                  </div>
                  <p className="text-lg font-bold text-orange-50">{worstTraffic.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-orange-200/70">
                    {locale === "ru" ? "Уровень:" : "Level:"} <strong className="text-orange-300">{worstTraffic.trafficLevel} / 100</strong>
                  </p>
                </div>

                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
                  <div className="mb-2 flex items-center gap-2 text-yellow-500">
                    <Wind className="size-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">{locale === "ru" ? "Худший воздух" : "Worst Air Quality"}</span>
                  </div>
                  <p className="text-lg font-bold text-yellow-50">{worstCo2.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-yellow-200/70">
                    CO₂: <strong className="text-yellow-300">{worstCo2.air.co2} ppm</strong>
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-white/5 p-4 border border-white/5">
                <h3 className="mb-3 text-sm font-semibold text-zinc-200">{locale === "ru" ? "AI Рекомендации для города:" : "AI City Recommendations:"}</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                     <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-[10px] text-red-400 ring-1 ring-red-500/30">1</span>
                     <p className="text-sm text-zinc-300 leading-relaxed">
                       {locale === "ru" ? `Рекомендуется немедленно перенаправить трафик от района ${worstTraffic.name} для снижения заторов.` : `It is recommended to immediately reroute traffic away from ${worstTraffic.name} to reduce congestion.`}
                     </p>
                  </li>
                  <li className="flex items-start gap-3">
                     <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-yellow-500/20 text-[10px] text-yellow-500 ring-1 ring-yellow-500/30">2</span>
                     <p className="text-sm text-zinc-300 leading-relaxed">
                       {locale === "ru" ? `В районе ${worstCo2.name} наблюдается опасный уровень загрязнения. Жителям рекомендуется ограничить активность на открытом воздухе.` : `Dangerous pollution levels observed in ${worstCo2.name}. Residents should limit outdoor activities.`}
                     </p>
                  </li>
                  <li className="flex items-start gap-3">
                     <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] text-emerald-400 ring-1 ring-emerald-500/30">3</span>
                     <p className="text-sm text-zinc-300 leading-relaxed">
                       {locale === "ru" ? "В целом, система фиксирует ухудшение экологической обстановки. Городским службам стоит активировать эко-протокол." : "Overall system reflects degrading ecological stability. City services are advised to trigger the eco-protocol."}
                     </p>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
