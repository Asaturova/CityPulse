import { fetchAirQualityData } from "@/services/airQualityService";
import { fetchWeatherData } from "@/services/weatherService";
import { DashboardClient } from "@/components/dashboard-client";

export default async function Home() {
  const [weather, air] = await Promise.allSettled([fetchWeatherData(), fetchAirQualityData()]);
  return (
    <DashboardClient
      weather={weather.status === "fulfilled" ? weather.value : undefined}
      air={air.status === "fulfilled" ? air.value : undefined}
    />
  );
}
