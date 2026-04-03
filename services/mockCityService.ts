import type { DistrictData, MapPoint, SeismicData, TrafficRoute } from "@/types/city";

const points: MapPoint[] = [
  {
    id: "p-almaly-1",
    districtId: "almaly",
    name: "Төле би / Панфилов",
    type: "camera",
    description: "Центральный перекрёсток, плотное движение.",
    lat: 43.2553,
    lng: 76.9289,
    trafficLevel: 91,
    cameraPreviewUrl: "https://placehold.co/480x270/111827/22c55e?text=CAM1",
    cameraVideoUrl: "https://cdn.pixabay.com/video/2021/08/04/83866-585324505_large.mp4",
    air: { co2: 790, pm25: 22, pm10: 36, aqi: 74, trend: "up" },
  },
  {
    id: "p-bostandyk-1",
    districtId: "bostandyk",
    name: "Аль-Фараби / Есентай",
    type: "camera",
    description: "Скоростная магистраль, высокая нагрузка в часы пик.",
    lat: 43.2184,
    lng: 76.9272,
    trafficLevel: 68,
    cameraPreviewUrl: "https://placehold.co/480x270/111827/facc15?text=CAM2",
    cameraVideoUrl: "https://cdn.pixabay.com/video/2019/11/05/28795-372070381_large.mp4",
    air: { co2: 650, pm25: 14, pm10: 23, aqi: 54, trend: "down" },
  },
  {
    id: "p-medeu-1",
    districtId: "medeu",
    name: "Достык / Абай",
    type: "camera",
    description: "Туристический центр города.",
    lat: 43.2385,
    lng: 76.945,
    trafficLevel: 72,
    cameraPreviewUrl: "https://placehold.co/480x270/111827/facc15?text=CAM3",
    air: { co2: 720, pm25: 18, pm10: 30, aqi: 62, trend: "up" },
  },
  {
    id: "p-auezov-1",
    districtId: "auezov",
    name: "Толе би / Рыскулова",
    type: "sensor",
    description: "Датчик качества воздуха.",
    lat: 43.197,
    lng: 76.838,
    trafficLevel: 38,
    cameraPreviewUrl: "https://placehold.co/480x270/111827/22c55e?text=SENSOR",
    air: { co2: 520, pm25: 11, pm10: 19, aqi: 44, trend: "down" },
  },
  {
    id: "p-alatau-1",
    districtId: "alatau",
    name: "Рыскулов / БАК",
    type: "camera",
    description: "Транзитная транспортная артерия.",
    lat: 43.314,
    lng: 76.945,
    trafficLevel: 42,
    cameraPreviewUrl: "https://placehold.co/480x270/111827/22c55e?text=CAM4",
    cameraVideoUrl: "https://cdn.pixabay.com/video/2019/04/18/22880-331777085_large.mp4",
    air: { co2: 560, pm25: 12, pm10: 20, aqi: 48, trend: "up" },
  },
  {
    id: "p-zhetysu-1",
    districtId: "zhetysu",
    name: "Жандосова / Момышұлы",
    type: "sensor",
    description: "Датчик движения и воздуха.",
    lat: 43.23,
    lng: 76.878,
    trafficLevel: 58,
    cameraPreviewUrl: "https://placehold.co/480x270/111827/facc15?text=SENSOR",
    air: { co2: 610, pm25: 15, pm10: 25, aqi: 52, trend: "down" },
  },
  {
    id: "p-turksib-1",
    districtId: "turksib",
    name: "Сейфуллина / Жансугурова",
    type: "camera",
    description: "Оживленный транспортный узел на севере.",
    lat: 43.282,
    lng: 76.935,
    trafficLevel: 48,
    cameraPreviewUrl: "https://placehold.co/480x270/111827/22c55e?text=CAM5",
    air: { co2: 580, pm25: 13, pm10: 22, aqi: 49, trend: "up" },
  },
  {
    id: "p-nauryzbay-1",
    districtId: "nauryzbay",
    name: "Қабанбай батыр ш. / Саялы",
    type: "sensor",
    description: "Датчик в экологически чистом районе.",
    lat: 43.194,
    lng: 76.978,
    trafficLevel: 33,
    cameraPreviewUrl: "https://placehold.co/480x270/111827/22c55e?text=SENSOR",
    air: { co2: 500, pm25: 10, pm10: 18, aqi: 41, trend: "down" },
  },
];

const districtSeed: Omit<DistrictData, "points">[] = [
  {
    id: "almaly",
    name: "Алмалы",
    center: { lat: 43.257, lng: 76.924 },
    trafficLevel: 88,
    air: { co2: 760, pm25: 21, pm10: 34, aqi: 72, trend: "up" },
  },
  {
    id: "bostandyk",
    name: "Бостандық",
    center: { lat: 43.218, lng: 76.92 },
    trafficLevel: 67,
    air: { co2: 640, pm25: 13, pm10: 22, aqi: 52, trend: "down" },
  },
  {
    id: "medeu",
    name: "Медеу",
    center: { lat: 43.24, lng: 76.95 },
    trafficLevel: 70,
    air: { co2: 710, pm25: 17, pm10: 29, aqi: 60, trend: "up" },
  },
  {
    id: "auezov",
    name: "Әуезов",
    center: { lat: 43.198, lng: 76.85 },
    trafficLevel: 40,
    air: { co2: 540, pm25: 11, pm10: 19, aqi: 46, trend: "down" },
  },
  {
    id: "alatau",
    name: "Алатау",
    center: { lat: 43.32, lng: 76.92 },
    trafficLevel: 44,
    air: { co2: 570, pm25: 12, pm10: 20, aqi: 50, trend: "up" },
  },
  {
    id: "zhetysu",
    name: "Жетісу",
    center: { lat: 43.225, lng: 76.88 },
    trafficLevel: 56,
    air: { co2: 600, pm25: 14, pm10: 24, aqi: 51, trend: "down" },
  },
  {
    id: "turksib",
    name: "Түрксіб",
    center: { lat: 43.275, lng: 76.93 },
    trafficLevel: 50,
    air: { co2: 575, pm25: 13, pm10: 21, aqi: 48, trend: "up" },
  },
  {
    id: "nauryzbay",
    name: "Наурызбай",
    center: { lat: 43.2, lng: 76.99 },
    trafficLevel: 36,
    air: { co2: 505, pm25: 10, pm10: 17, aqi: 42, trend: "down" },
  },
];

export function getDistricts(): DistrictData[] {
  return districtSeed.map((d) => ({
    ...d,
    points: points.filter((p) => p.districtId === d.id),
  }));
}

export function getMapPoints(): MapPoint[] {
  return points;
}

export function getSeismicData(): SeismicData[] {
  return [
    {
      id: "s1",
      intensity: 3.8,
      locationName: "Шығыс сыртқылы",
      lat: 43.18,
      lng: 77.02,
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
  ];
}

const mockRoutes: TrafficRoute[] = [
  {
    id: "r-alfarabi",
    name: "Проспект Аль-Фараби",
    trafficLevel: 85,
    coordinates: [
      [76.885, 43.208],
      [76.905, 43.214],
      [76.927, 43.218],
      [76.950, 43.220],
      [76.972, 43.228],
    ],
  },
  {
    id: "r-abay",
    name: "Проспект Абая",
    trafficLevel: 65,
    coordinates: [
      [76.840, 43.235],
      [76.878, 43.238],
      [76.915, 43.242],
      [76.950, 43.243],
    ],
  },
  {
    id: "r-ryskulov",
    name: "Проспект Рыскулова",
    trafficLevel: 45,
    coordinates: [
      [76.838, 43.305],
      [76.880, 43.310],
      [76.920, 43.312],
      [76.960, 43.305],
    ],
  },
  {
    id: "r-seifullin",
    name: "Проспект Сейфуллина",
    trafficLevel: 75,
    coordinates: [
      [76.935, 43.210],
      [76.935, 43.235],
      [76.935, 43.270],
      [76.935, 43.300],
    ],
  },
];

export function getTrafficRoutes(): TrafficRoute[] {
  return mockRoutes;
}
