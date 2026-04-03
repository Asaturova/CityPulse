import { z } from "zod";
import type { AirQualityData, WeatherData } from "@/types/city";

const weatherSchema = z.object({
  current: z.object({
    temperature_2m: z.number(),
    wind_speed_10m: z.number(),
    weather_code: z.number(),
    relative_humidity_2m: z.number().optional(),
  }),
});

const airSchema = z.object({
  current: z.object({
    carbon_monoxide: z.number().optional(),
    pm2_5: z.number().optional(),
    pm10: z.number().optional(),
    us_aqi: z.number().optional(),
  }),
});

export function normalizeWeather(payload: unknown): WeatherData {
  const parsed = weatherSchema.parse(payload);
  return {
    temperatureC: parsed.current.temperature_2m,
    windSpeedMs: parsed.current.wind_speed_10m,
    humidity: parsed.current.relative_humidity_2m ?? 45,
    weatherCode: parsed.current.weather_code,
  };
}

export function normalizeAir(payload: unknown, previousAqi = 0): AirQualityData {
  const parsed = airSchema.parse(payload);
  const aqi = parsed.current.us_aqi ?? 40;
  return {
    co2: Math.round((parsed.current.carbon_monoxide ?? 250) * 3.2),
    pm25: Math.round((parsed.current.pm2_5 ?? 10) * 10) / 10,
    pm10: Math.round((parsed.current.pm10 ?? 18) * 10) / 10,
    aqi,
    trend: aqi >= previousAqi ? "up" : "down",
  };
}
