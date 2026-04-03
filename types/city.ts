export type Locale = "ru" | "en";
export type MapLayerMode = "traffic" | "pollution" | "seismic";

export interface CityKpi {
  avgTraffic: number;
  avgCo2: number;
  alertsCount: number;
  cityActivityIndex: number;
}

export type AlertSeverity = "low" | "medium" | "high";

export interface AlertItem {
  id: string;
  districtId: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
}

export interface InsightItem {
  id: string;
  districtId: string;
  text: string;
}

export interface RecommendationItem {
  id: string;
  districtId: string;
  text: string;
}

export interface AirQualityData {
  co2: number;
  pm25: number;
  pm10: number;
  aqi: number;
  trend: "up" | "down";
}

export interface WeatherData {
  temperatureC: number;
  windSpeedMs: number;
  humidity: number;
  weatherCode: number;
}

export interface SeismicData {
  id: string;
  intensity: number;
  locationName: string;
  lat: number;
  lng: number;
  timestamp: string;
}

export interface MapPoint {
  id: string;
  districtId: string;
  name: string;
  lat: number;
  lng: number;
  trafficLevel: number;
  air: AirQualityData;
  cameraPreviewUrl: string;
}

export interface DistrictData {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  trafficLevel: number;
  air: AirQualityData;
  points: MapPoint[];
}
