import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  getWeatherByCity,
  extractWeatherInput,
  type WeatherData,
} from "@/services/weatherService";
import { calculateLaundryScore } from "@/utils/laundryScore";
import { getVerdict } from "@/utils/verdictGenerator";
import ScoreCard from "@/components/ScoreCard";
import VerdictBanner from "@/components/VerdictBanner";
import FunnyMessage from "@/components/FunnyMessage";
import WeatherStats from "@/components/WeatherStats";

export default function CityPage() {
  const router = useRouter();
  const { city } = router.query;
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cityInput, setCityInput] = useState("");

  useEffect(() => {
    if (!city || typeof city !== "string") return;
    setLoading(true);
    setError("");
    setWeather(null);
    getWeatherByCity(city)
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch(() => {
        setError(`Could not find weather for "${city}".`);
        setLoading(false);
      });
  }, [city]);

  function handleCitySubmit(e: React.FormEvent) {
    e.preventDefault();
    const c = cityInput.trim();
    if (c) {
      setCityInput("");
      router.push(`/${encodeURIComponent(c.toLowerCase())}`);
    }
  }

  const cityLabel = typeof city === "string" ? city : "";
  const score = weather ? calculateLaundryScore(extractWeatherInput(weather)) : 0;
  const verdict = weather ? getVerdict(score) : null;
  const weatherInput = weather ? extractWeatherInput(weather) : null;

  return (
    <>
      <Head>
        <title>
          {cityLabel
            ? `${cityLabel.charAt(0).toUpperCase() + cityLabel.slice(1)} — Cool Weather`
            : "Cool Weather"}
        </title>
        <meta
          name="description"
          content={`Laundry weather score for ${cityLabel}.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <header className="w-full flex items-center justify-between px-6 py-5 border-b-2 border-ink/10">
          <div>
            <Link
              href="/"
              className="font-display text-xl tracking-widest text-ink uppercase hover:text-gold transition-colors"
            >
              Cool Weather
            </Link>
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
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-8 h-8 border-2 border-ink/20 border-t-ink rounded-full animate-spin" />
              <p className="font-body text-muted text-xl capitalize">
                Looking up {cityLabel}...
              </p>
            </motion.div>
          )}

          {!loading && error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <p className="font-display text-2xl text-ink">City not found.</p>
              <p className="font-body text-muted text-lg">{error}</p>
            </motion.div>
          )}

          {!loading && !error && weather && verdict && weatherInput && (
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
