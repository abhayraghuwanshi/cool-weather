export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp_c: number;
    humidity: number;
    wind_kph: number;
    precip_mm: number;
    uv: number;
    cloud: number;
    condition: {
      text: string;
    };
    feelslike_c: number;
  };
}

export interface WeatherInput {
  temp_c: number;
  humidity: number;
  wind_kph: number;
  precip_mm: number;
  uv: number;
  cloud: number;
}

const MOCK_DATA: WeatherData = {
  location: { name: "Demo City", country: "Laundry Land", lat: 0, lon: 0 },
  current: {
    temp_c: 22,
    humidity: 45,
    wind_kph: 18,
    precip_mm: 0,
    uv: 5,
    cloud: 20,
    condition: { text: "Partly Cloudy" },
    feelslike_c: 21,
  },
};

function mockWithName(name: string): WeatherData {
  return { ...MOCK_DATA, location: { ...MOCK_DATA.location, name } };
}

export async function getWeatherByCoords(
  lat: number,
  lon: number
): Promise<WeatherData> {
  const key = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;
  if (!key) return MOCK_DATA;
  const res = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${key}&q=${lat},${lon}&aqi=no`
  );
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  return res.json();
}

export async function getWeatherByCity(city: string): Promise<WeatherData> {
  const key = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;
  if (!key) return mockWithName(city);
  const res = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${key}&q=${encodeURIComponent(city)}&aqi=no`
  );
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  return res.json();
}

export function extractWeatherInput(data: WeatherData): WeatherInput {
  return {
    temp_c: data.current.temp_c,
    humidity: data.current.humidity,
    wind_kph: data.current.wind_kph,
    precip_mm: data.current.precip_mm,
    uv: data.current.uv,
    cloud: data.current.cloud,
  };
}
