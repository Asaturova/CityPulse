import type { AirQualityData } from "@/types/city";
import { normalizeAir } from "@/services/normalizers";

const ALMATY_LAT = 43.238949;
const ALMATY_LNG = 76.889709;

export async function fetchAirQualityData(previousAqi = 0): Promise<AirQualityData> {
  const url =
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${ALMATY_LAT}&longitude=${ALMATY_LNG}` +
    "&current=pm10,pm2_5,carbon_monoxide,us_aqi";

  const response = await fetch(url, { next: { revalidate: 900 } });
  if (!response.ok) {
    throw new Error("Failed to fetch air quality data");
  }
  const json = await response.json();
  return normalizeAir(json, previousAqi);
}
