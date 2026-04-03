import type { DistrictData, MapPoint, SeismicData } from "@/types/city";

const points: MapPoint[] = [
  {
    id: "p1",
    districtId: "medeu",
    name: "Dostyk Ave / Abay",
    lat: 43.2385,
    lng: 76.945,
    trafficLevel: 82,
    cameraPreviewUrl: "https://placehold.co/480x270/111827/7dd3fc?text=Camera+Feed",
    air: { co2: 720, pm25: 18, pm10: 30, aqi: 62, trend: "up" },
  },
  {
    id: "p2",
    districtId: "bostandyk",
    name: "Al-Farabi / Esentai",
    lat: 43.2184,
    lng: 76.9272,
    trafficLevel: 68,
    cameraPreviewUrl: "https://placehold.co/480x270/111827/7dd3fc?text=Camera+Feed",
    air: { co2: 650, pm25: 14, pm10: 23, aqi: 54, trend: "down" },
  },
  {
    id: "p3",
    districtId: "almaly",
    name: "Tole Bi / Panfilov",
    lat: 43.2553,
    lng: 76.9289,
    trafficLevel: 91,
    cameraPreviewUrl: "https://placehold.co/480x270/111827/7dd3fc?text=Camera+Feed",
    air: { co2: 790, pm25: 22, pm10: 36, aqi: 74, trend: "up" },
  },
];

export function getDistricts(): DistrictData[] {
  return [
    {
      id: "almaly",
      name: "Almaly",
      center: { lat: 43.257, lng: 76.924 },
      trafficLevel: 88,
      air: { co2: 760, pm25: 21, pm10: 34, aqi: 72, trend: "up" },
      points: points.filter((p) => p.districtId === "almaly"),
    },
    {
      id: "bostandyk",
      name: "Bostandyk",
      center: { lat: 43.218, lng: 76.92 },
      trafficLevel: 67,
      air: { co2: 640, pm25: 13, pm10: 22, aqi: 52, trend: "down" },
      points: points.filter((p) => p.districtId === "bostandyk"),
    },
    {
      id: "medeu",
      name: "Medeu",
      center: { lat: 43.24, lng: 76.95 },
      trafficLevel: 80,
      air: { co2: 710, pm25: 17, pm10: 29, aqi: 60, trend: "up" },
      points: points.filter((p) => p.districtId === "medeu"),
    },
  ];
}

export function getMapPoints(): MapPoint[] {
  return points;
}

export function getSeismicData(): SeismicData[] {
  return [
    {
      id: "s1",
      intensity: 3.8,
      locationName: "Foothills East",
      lat: 43.18,
      lng: 77.02,
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
  ];
}
