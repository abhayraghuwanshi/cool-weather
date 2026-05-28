import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { motion } from "framer-motion";
import {
  getWeatherByCoords,
  extractWeatherInput,
  type WeatherData,
} from "@/services/weatherService";
import { calculateLaundryScore } from "@/utils/laundryScore";
import { getVerdict } from "@/utils/verdictGenerator";
import ScoreCard from "@/components/ScoreCard";
import VerdictBanner from "@/components/VerdictBanner";
import FunnyMessage from "@/components/FunnyMessage";
import WeatherStats from "@/components/WeatherStats";

type Status = "loading" | "success" | "denied" | "error";

export default function Home() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [cityInput, setCityInput] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const data = await getWeatherByCoords(
            pos.coords.latitude,
            pos.coords.longitude
          );
          setWeather(data);
          setStatus("success");
        } catch {
          setErrorMsg("Could not fetch weather data.");
          setStatus("error");
        }
      },
      () => setStatus("denied")
    );
  }, []);

  function handleCitySubmit(e: React.FormEvent) {
    e.preventDefault();
    const city = cityInput.trim();
    if (city) router.push(`/${encodeURIComponent(city.toLowerCase())}`);
  }

  const score = weather ? calculateLaundryScore(extractWeatherInput(weather)) : 0;
  const verdict = weather ? getVerdict(score) : null;
  const weatherInput = weather ? extractWeatherInput(weather) : null;

  return (
    <>
      <Head>
        <title>Cool Weather — Should you do laundry today?</title>
        <meta
          name="description"
          content="The only weather app that judges your laundry decisions."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <header className="w-full flex items-center justify-between px-6 py-5 border-b-2 border-ink/10">
          <div>
            <span className="font-display text-xl tracking-widest text-ink uppercase">
              Cool Weather
            </span>
            <p className="font-body text-muted text-xs tracking-wider hidden sm:block">
              The laundry forecast
            </p>
          </div>
          <form onSubmit={handleCitySubmit} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search a city..."
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              className="font-body text-base bg-transparent border-b-2 border-ink/25 focus:border-ink focus:outline-none px-1 py-0.5 w-32 sm:w-44 text-ink placeholder:text-muted/70 transition-colors"
            />
            <button
              type="submit"
              className="font-display text-xs tracking-widest bg-ink text-cream px-3 py-1.5 hover:bg-gold hover:text-ink transition-colors uppercase"
            >
              Go
            </button>
          </form>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-10 w-full max-w-2xl mx-auto">
          {status === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-8 h-8 border-2 border-ink/20 border-t-ink rounded-full animate-spin" />
              <p className="font-body text-muted text-xl">Checking the skies...</p>
            </motion.div>
          )}

          {status === "denied" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <p className="font-display text-3xl text-ink tracking-wide">
                Location not shared.
              </p>
              <p className="font-body text-muted text-xl">
                Search a city above to check the laundry forecast.
              </p>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <p className="font-display text-2xl text-ink">Something went wrong.</p>
              <p className="font-body text-muted text-lg">{errorMsg}</p>
            </motion.div>
          )}

          {status === "success" && weather && verdict && weatherInput && (
            <div className="flex flex-col items-center gap-6 w-full">
              <ScoreCard
                score={score}
                locationName={weather.location.name}
                locationCountry={weather.location.country}
              />
              <VerdictBanner label={verdict.label} color={verdict.color} />
              <FunnyMessage message={verdict.message} />
              <WeatherStats weather={weatherInput} />
            </div>
          )}
        </main>

        <footer className="w-full text-center py-4 border-t-2 border-ink/10">
          <p className="font-body text-muted text-sm">
            The only weather app that judges your laundry decisions.
          </p>
        </footer>
      </div>
    </>
  );
}
