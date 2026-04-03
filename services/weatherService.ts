import type { WeatherData } from "@/types/city";
import { normalizeWeather } from "@/services/normalizers";

const ALMATY_LAT = 43.238949;
const ALMATY_LNG = 76.889709;

export async function fetchWeatherData(): Promise<WeatherData> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${ALMATY_LAT}&longitude=${ALMATY_LNG}` +
    "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m";

  const response = await fetch(url, { next: { revalidate: 900 } });
  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }
  const json = await response.json();
  return normalizeWeather(json);
}
