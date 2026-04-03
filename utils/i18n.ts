import type { Locale } from "@/types/city";

export const dict = {
  ru: {
    title: "CityPulse",
    subtitle: "Пульс Алматы в реальном времени",
    traffic: "Пробки",
    co2: "CO2",
    alerts: "Алерты",
    activity: "Индекс активности",
    weather: "Погода",
    air: "Качество воздуха",
    district: "Район",
    insights: "Инсайты",
    recommendations: "Рекомендации",
    camera: "Камера",
    layers: "Слои",
    allDistricts: "Все районы",
    visiblePoints: "Точек в области",
    layerTraffic: "Трафик",
    layerPollution: "Загрязнение",
    layerSeismic: "Сейсмика",
  },
  en: {
    title: "CityPulse",
    subtitle: "Real-time pulse of Almaty",
    traffic: "Traffic",
    co2: "CO2",
    alerts: "Alerts",
    activity: "Activity index",
    weather: "Weather",
    air: "Air quality",
    district: "District",
    insights: "Insights",
    recommendations: "Recommendations",
    camera: "Camera",
    layers: "Layers",
    allDistricts: "All districts",
    visiblePoints: "Points in view",
    layerTraffic: "Traffic",
    layerPollution: "Pollution",
    layerSeismic: "Seismic",
  },
} as const;

export function t(locale: Locale) {
  return dict[locale];
}
