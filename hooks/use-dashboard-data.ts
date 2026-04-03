"use client";

import { useMemo, useState } from "react";
import type { AirQualityData, DistrictData, Locale, MapPoint, WeatherData } from "@/types/city";
import { getDistricts, getMapPoints, getSeismicData } from "@/services/mockCityService";
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

export function useDashboardData(weather?: WeatherData, air?: AirQualityData) {
  const [locale, setLocale] = useState<Locale>("ru");
  const [selectedDistrictId, setSelectedDistrictId] = useState("all");
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);

  const districts = useMemo<DistrictData[]>(() => getDistricts(), []);
  const points = useMemo<MapPoint[]>(() => getMapPoints(), []);
  const seismic = useMemo(() => getSeismicData(), []);
  const alerts = useMemo(() => buildAlerts(districts, seismic), [districts, seismic]);
  const kpi = useMemo(() => buildKpi(districts, alerts.length), [districts, alerts]);

  const selectedDistrict =
    selectedDistrictId === "all" ? districts[0] : districts.find((d) => d.id === selectedDistrictId) || districts[0];

  const insights = useMemo(() => buildInsights(selectedDistrict), [selectedDistrict]);
  const recommendations = useMemo(
    () => buildRecommendations(selectedDistrict),
    [selectedDistrict],
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
    alerts,
    kpi,
    insights,
    recommendations,
    weather: weather ?? fallbackWeather,
    air: air ?? fallbackAir,
  };
}
