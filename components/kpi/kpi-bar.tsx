import type { CityKpi } from "@/types/city";
import { t } from "@/utils/i18n";
import type { Locale } from "@/types/city";

export function KpiBar({ kpi, locale }: { kpi: CityKpi; locale: Locale }) {
  const i18n = t(locale);
  const items = [
    { label: i18n.traffic, value: `${kpi.avgTraffic}%` },
    { label: i18n.co2, value: `${kpi.avgCo2} ppm` },
    { label: i18n.alerts, value: `${kpi.alertsCount}` },
    { label: i18n.activity, value: `${kpi.cityActivityIndex}` },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
        >
          <p className="text-xs text-zinc-400">{item.label}</p>
          <p className="text-xl font-semibold text-zinc-100">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
