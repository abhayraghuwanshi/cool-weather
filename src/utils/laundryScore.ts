import type { WeatherInput } from "@/services/weatherService";

export function calculateLaundryScore(w: WeatherInput): number {
  let score = 100;

  if (w.humidity > 80) score -= 40;
  else if (w.humidity > 60) score -= 20;
  else if (w.humidity > 40) score -= 5;

  if (w.precip_mm > 0) score -= 50;

  if (w.temp_c >= 18 && w.temp_c <= 26) score += 10;
  else if (w.temp_c < 10 || w.temp_c > 33) score -= 15;

  if (w.wind_kph >= 10 && w.wind_kph <= 30) score += 5;
  else if (w.wind_kph > 50) score -= 10;

  if (w.uv >= 6) score += 5;
  else if (w.uv >= 3) score += 2;

  if (w.cloud > 80) score -= 10;
  else if (w.cloud > 50) score -= 5;

  return Math.max(0, Math.min(100, score));
}

export function getScoreColor(score: number): string {
  if (score >= 90) return "#22c55e";
  if (score >= 70) return "#84cc16";
  if (score >= 50) return "#F4C430";
  if (score >= 30) return "#f97316";
  if (score >= 10) return "#ef4444";
  return "#991b1b";
}
