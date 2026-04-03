import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, OctagonAlert } from "lucide-react";
import type { AlertItem, Locale } from "@/types/city";
import { t } from "@/utils/i18n";

export function AlertsWidget({ alerts, locale }: { alerts: AlertItem[]; locale: Locale }) {
  const i18n = t(locale);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
      <h4 className="mb-2 text-sm font-medium text-zinc-100">{i18n.alerts}</h4>
      <div className="space-y-3">
        <AnimatePresence>
          {alerts.slice(0, 3).map((a) => {
            const isHigh = a.severity === "high";
            const isMid = a.severity === "medium";
            return (
              <motion.div 
                key={a.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative overflow-hidden rounded-xl border p-3 pl-10 transition-colors ${
                  isHigh 
                    ? "border-red-500/50 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                    : isMid
                      ? "border-yellow-500/30 bg-yellow-500/5"
                      : "border-white/10 bg-black/20"
                }`}
              >
                {isHigh && <div className="absolute inset-0 bg-red-500/5 animate-pulse rounded-xl" />}
                <div className="absolute left-3 top-3.5">
                   {isHigh ? <OctagonAlert className="size-4 text-red-500" /> : isMid ? <AlertTriangle className="size-4 text-yellow-500" /> : <Info className="size-4 text-blue-400" />}
                </div>
                <div className="relative">
                  <p className={`text-xs font-semibold ${isHigh ? "text-red-200" : isMid ? "text-yellow-200" : "text-zinc-200"}`}>{a.title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">{a.description}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
