import type { AlertItem, Locale } from "@/types/city";
import { t } from "@/utils/i18n";

export function AlertsWidget({ alerts, locale }: { alerts: AlertItem[]; locale: Locale }) {
  const i18n = t(locale);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
      <h4 className="mb-2 text-sm font-medium text-zinc-100">{i18n.alerts}</h4>
      <div className="space-y-2">
        {alerts.slice(0, 3).map((a) => (
          <div key={a.id} className="rounded-lg border border-white/10 bg-black/20 p-2">
            <p className="text-xs text-zinc-300">{a.title}</p>
            <p className="text-xs text-zinc-500">{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
