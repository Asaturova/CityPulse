"use client";

import { useEffect, useMemo, useState } from "react";
import type { AirQualityData, DistrictData, Locale, MapPoint, SeismicData, TrafficRoute, WeatherData } from "@/types/city";
import { getDistricts, getMapPoints, getSeismicData, getTrafficRoutes } from "@/services/mockCityService";
import {
  buildAlerts,
  buildInsights,
  buildKpi,
  buildRecommendations,
} from "@/services/analyticsService";

const fallbackWeather: WeatherData = {
  temperatureC: 18,
  humidity: 40,
  windSpeedMs: 4,
  weatherCode: 1,
};

const fallbackAir: AirQualityData = {
  co2: 690,
  pm25: 16,
  pm10: 27,
  aqi: 61,
  trend: "up",
};

function aggregateDistricts(districts: DistrictData[], locale: Locale): DistrictData {
  const n = districts.length || 1;
  const avgTraffic = Math.round(districts.reduce((acc, d) => acc + d.trafficLevel, 0) / n);
  const avgCo2 = Math.round(districts.reduce((acc, d) => acc + d.air.co2, 0) / n);
  const avgPm25 = Math.round((districts.reduce((acc, d) => acc + d.air.pm25, 0) / n) * 10) / 10;
  const avgPm10 = Math.round((districts.reduce((acc, d) => acc + d.air.pm10, 0) / n) * 10) / 10;
  const avgAqi = Math.round(districts.reduce((acc, d) => acc + d.air.aqi, 0) / n);
  const upVotes = districts.filter((d) => d.air.trend === "up").length;
  const trend: AirQualityData["trend"] = upVotes >= n / 2 ? "up" : "down";
  return {
    id: "all",
    name: locale === "ru" ? "Алматы (агрегат)" : "Almaty (aggregate)",
    center: { lat: 43.2389, lng: 76.8897 },
    trafficLevel: avgTraffic,
    air: {
      co2: avgCo2,
      pm25: avgPm25,
      pm10: avgPm10,
      aqi: avgAqi,
      trend,
    },
    points: districts.flatMap((d) => d.points),
  };
}

export function useDashboardData(weather?: WeatherData, air?: AirQualityData) {
  const [locale, setLocale] = useState<Locale>("ru");
  const [selectedDistrictId, setSelectedDistrictId] = useState("all");
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);

  const [districts, setDistricts] = useState<DistrictData[]>(() => getDistricts());
  const [points, setPoints] = useState<MapPoint[]>(() => getMapPoints());
  const [seismic, setSeismic] = useState<SeismicData[]>(() => getSeismicData());
  const [routes, setRoutes] = useState<TrafficRoute[]>(() => getTrafficRoutes());
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints((prev) =>
        prev.map((p) => {
          const trafficChange = Math.floor(Math.random() * 5) - 2;
          const co2Change = Math.floor(Math.random() * 21) - 10;
          return {
            ...p,
            trafficLevel: Math.max(0, Math.min(100, p.trafficLevel + trafficChange)),
            air: {
              ...p.air,
              co2: Math.max(400, Math.min(2000, p.air.co2 + co2Change)),
            },
          };
        }),
      );
      setDistricts((prev) =>
        prev.map((d) => {
          const trafficChange = Math.floor(Math.random() * 3) - 1;
          const co2Change = Math.floor(Math.random() * 11) - 5;
          return {
            ...d,
            trafficLevel: Math.max(0, Math.min(100, d.trafficLevel + trafficChange)),
            air: {
              ...d.air,
              co2: Math.max(400, Math.min(2000, d.air.co2 + co2Change)),
            },
          };
        }),
      );
      setRoutes((prev) => 
        prev.map((r) => ({
           ...r,
           trafficLevel: Math.max(0, Math.min(100, r.trafficLevel + (Math.floor(Math.random() * 5) - 2)))
        }))
      );
      setLastUpdated(Date.now());
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  const alerts = useMemo(() => buildAlerts(districts, seismic), [districts, seismic]);
  const kpi = useMemo(() => buildKpi(districts, alerts.length), [districts, alerts]);

  const contextDistrict = useMemo(() => {
    const aggregate = aggregateDistricts(districts, locale);
    if (selectedDistrictId === "all") {
      return aggregate;
    }
    return districts.find((d) => d.id === selectedDistrictId) ?? aggregate;
  }, [districts, locale, selectedDistrictId]);

  const insightDistrict = useMemo(() => {
    if (selectedPoint) {
      return districts.find((d) => d.id === selectedPoint.districtId) ?? contextDistrict;
    }
    return contextDistrict;
  }, [selectedPoint, districts, contextDistrict]);

  const insights = useMemo(() => buildInsights(insightDistrict, locale), [insightDistrict, locale]);
  const recommendations = useMemo(
    () => buildRecommendations(insightDistrict, locale),
    [insightDistrict, locale],
  );

  return {
    locale,
    setLocale,
    selectedDistrictId,
    setSelectedDistrictId,
    selectedPoint,
    setSelectedPoint,
    districts,
    points,
    seismic,
    routes,
    alerts,
    kpi,
    insights,
    recommendations,
    contextDistrict,
    weather: weather ?? fallbackWeather,
    air: air ?? fallbackAir,
    lastUpdated,
  };
}
