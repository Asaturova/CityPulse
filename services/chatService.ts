import type { AirQualityData, DistrictData, Locale, WeatherData } from "@/types/city";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
}

function normalize(text: string) {
  return text.trim().toLowerCase();
}

export function answerCityQuestion(
  message: string,
  history: ChatMessage[],
  ctx: {
    locale: Locale;
    weather: WeatherData;
    air: AirQualityData;
    districts: DistrictData[];
  },
): string {
  const q = normalize(message);
  const { locale, weather, air, districts } = ctx;

  const isRu = locale === "ru";

  if (q.includes(isRu ? "где" : "where") && q.includes(isRu ? "плох" : "worst")) {
    const worstDistrict = [...districts].sort((a, b) => {
      const aScore = a.trafficLevel + (a.air.co2 / 10);
      const bScore = b.trafficLevel + (b.air.co2 / 10);
      return bScore - aScore;
    })[0];
    
    return isRu 
      ? `Самая сложная ситуация сейчас в районе **${worstDistrict.name}**: высокий уровень CO₂ (${worstDistrict.air.co2} ppm) и сильные пробки (загрузка ${worstDistrict.trafficLevel} из 100). Рекомендую избегать этот район.`
      : `The most critical situation right now is in **${worstDistrict.name}**: high CO₂ levels (${worstDistrict.air.co2} ppm) and heavy traffic (load ${worstDistrict.trafficLevel} of 100). I strongly advise choosing an alternative route.`;
  }

  // Check previous context
  const lastUserMsg = history.reverse().find(m => m.role === "user")?.text;
  if (lastUserMsg && (q === "а почему?" || q === "why?")) {
    if (normalize(lastUserMsg).includes(isRu ? "трафик" : "traffic")) {
      return isRu ? "Возможно, из-за недавней аварии на центральной магистрали." : "Likely due to a recent collision on the main highway.";
    }
  }

  const weatherKeys = isRu ? ["погод", "температ", "ветер", "влажн", "осадк"] : ["weather", "temperature", "wind", "humid", "forecast"];
  const airKeys = isRu ? ["воздух", "загряз", "aqi", "co2", "пм", "дым"] : ["air", "pollution", "aqi", "co2", "pm", "smog"];
  const trafficKeys = isRu ? ["пробк", "трафик", "затор", "дорог", "загружен", "маршрут"] : ["traffic", "congestion", "jam", "road", "gridlock", "route"];
  
  if (airKeys.some((k) => q.includes(k))) {
    const windEffect = weather.windSpeedMs < 2;
    const baseWarning = isRu 
      ? `Качество воздуха в среднем: AQI ${air.aqi}, CO₂ ≈ ${air.co2} ppm.`
      : `Average air quality: AQI ${air.aqi}, CO₂ proxy ${air.co2} ppm.`;
      
    if (windEffect) {
       return isRu 
         ? `${baseWarning} Из-за слабого ветра (${weather.windSpeedMs} м/с) загрязнение может усиливаться. Ожидается ухудшение ситуации в ближайшие 30 минут.`
         : `${baseWarning} Due to low wind (${weather.windSpeedMs} m/s), pollution is stagnating. We expect conditions to worsen in the next 30 mins.`;
    }
    return baseWarning;
  }

  if (trafficKeys.some((k) => q.includes(k))) {
    const ranked = [...districts].sort((a, b) => b.trafficLevel - a.trafficLevel);
    const top = ranked[0];
    if (top.trafficLevel > 70) {
      if (air.co2 > 800) {
         return isRu 
          ? `В районе **${top.name}** сильные пробки и крайне высокий уровень CO2. Категорически рекомендую выбрать альтернативный маршрут.`
          : `**${top.name}** has severe traffic and critically high CO2. I strongly recommend taking an alternative route.`;
      }
      return isRu
        ? `В центре города (особенно **${top.name}**) сейчас сильные пробки, лучше выбрать альтернативный маршрут.`
        : `Downtown (especially **${top.name}**) is experiencing heavy traffic jams. Best to select an alternative route.`;
    }
    return isRu ? "В данный момент на дорогах относительно свободно." : "Roads are relatively clear at the moment.";
  }

  return isRu
    ? "Я ИИ-аналитик умного города. Спросите меня: «Где сейчас самая плохая ситуация?» или «Какой тренд по пробкам?», и я проанализирую данные."
    : "I am the Smart City AI analyst. Ask me: 'Where is the worst situation right now?' or 'What is the traffic trend?' and I will analyze the live data.";
}

// Proactive Evaluation
export function evaluateProactiveState(
  ctx: {
    locale: Locale;
    weather: WeatherData;
    air: AirQualityData;
    districts: DistrictData[];
  }
): string | null {
  const { locale, air, weather } = ctx;
  const isRu = locale === "ru";
  
  if (air.co2 > 900 && weather.windSpeedMs < 1) {
    return isRu 
      ? "🚨 Обнаружено резкое ухудшение качества воздуха (опасный уровень CO2 при отсутствии ветра). Активирован протокол предупреждения."
      : "🚨 Sharp decline in air quality detected (hazardous CO2 with zero wind). Warning protocol activated.";
  }
  
  const highTrafficCount = ctx.districts.filter(d => d.trafficLevel > 85).length;
  if (highTrafficCount >= 2) {
    return isRu
      ? "⚠️ В нескольких районах образовались критические заторы. Рекомендовано отложить поездки."
      : "⚠️ Critical gridlock formed in multiple districts. Commutes should be delayed if possible.";
  }
  
  return null;
}
