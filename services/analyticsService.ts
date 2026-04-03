import type {
  AlertItem,
  CityKpi,
  DistrictData,
  InsightItem,
  Locale,
  RecommendationItem,
  SeismicData,
} from "@/types/city";

export function buildKpi(districts: DistrictData[], alertsCount: number): CityKpi {
  const avgTraffic = Math.round(
    districts.reduce((acc, d) => acc + d.trafficLevel, 0) / districts.length,
  );
  const avgCo2 = Math.round(districts.reduce((acc, d) => acc + d.air.co2, 0) / districts.length);
  const cityActivityIndex = Math.round(avgTraffic * 0.55 + (avgCo2 / 10) * 0.45);
  return { avgTraffic, avgCo2, alertsCount, cityActivityIndex };
}

export function buildAlerts(districts: DistrictData[], seismic: SeismicData[]): AlertItem[] {
  const alerts: AlertItem[] = [];
  districts.forEach((d) => {
    if (d.air.co2 > 730) {
      alerts.push({
        id: `co2-${d.id}`,
        districtId: d.id,
        title: "High CO2",
        description: `${d.name}: CO2 выше нормы.`,
        severity: "high",
        timestamp: new Date().toISOString(),
      });
    }
    if (d.trafficLevel > 85) {
      alerts.push({
        id: `traffic-${d.id}`,
        districtId: d.id,
        title: "Heavy congestion",
        description: `${d.name}: критическая загруженность.`,
        severity: "medium",
        timestamp: new Date().toISOString(),
      });
    }
  });

  seismic.forEach((s) => {
    alerts.push({
      id: s.id,
      districtId: "city",
      title: "Seismic activity",
      description: `Magnitude ${s.intensity.toFixed(1)} — ${s.locationName}.`,
      severity: s.intensity >= 4 ? "high" : "medium",
      timestamp: s.timestamp,
    });
  });
  return alerts;
}

export function buildInsights(district: DistrictData, locale: Locale): InsightItem[] {
  if (locale === "ru") {
    return [
      {
        id: `insight-${district.id}`,
        districtId: district.id,
        text: `Давление загрязнения в ${district.name}: тренд ${district.air.trend === "up" ? "рост" : "снижение"}, AQI ${district.air.aqi}.`,
      },
    ];
  }
  return [
    {
      id: `insight-${district.id}`,
      districtId: district.id,
      text: `Pollution pressure in ${district.name} is ${district.air.trend === "up" ? "rising" : "falling"} with AQI ${district.air.aqi}.`,
    },
  ];
}

export function buildRecommendations(district: DistrictData, locale: Locale): RecommendationItem[] {
  if (locale === "ru") {
    return [
      {
        id: `rec-${district.id}`,
        districtId: district.id,
        text:
          district.trafficLevel > 80
            ? "Включить адаптивные светофоры и перенаправить потоки."
            : "Сохранить текущую политику и мониторить пики.",
      },
    ];
  }
  return [
    {
      id: `rec-${district.id}`,
      districtId: district.id,
      text:
        district.trafficLevel > 80
          ? "Enable adaptive traffic lights and recommend alternate routes."
          : "Maintain current traffic policy and monitor peak hours.",
    },
  ];
}
