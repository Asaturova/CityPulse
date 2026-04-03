import type { AirQualityData, Locale, WeatherData } from "@/types/city";
import { t } from "@/utils/i18n";

export function WeatherAirWidget({
  weather,
  air,
  locale,
}: {
  weather: WeatherData;
  air: AirQualityData;
  locale: Locale;
}) {
  const i18n = t(locale);
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
        <p className="text-xs text-zinc-400">{i18n.weather}</p>
        <p className="text-lg text-zinc-100">{weather.temperatureC}°C</p>
        <p className="text-sm text-zinc-300">Wind {weather.windSpeedMs} m/s · Humidity {weather.humidity}%</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
        <p className="text-xs text-zinc-400">{i18n.air}</p>
        <p className="text-lg text-zinc-100">AQI {air.aqi}</p>
        <p className="text-sm text-zinc-300">PM2.5 {air.pm25} · PM10 {air.pm10}</p>
      </div>
    </div>
  );
}
