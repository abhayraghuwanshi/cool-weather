import { motion } from "framer-motion";
import type { WeatherInput } from "@/services/weatherService";

function StatCell({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="border-2 border-ink/10 p-4 text-center bg-cream-dark/50">
      <p className="font-body text-muted text-xs tracking-[0.2em] uppercase mb-1">
        {label}
      </p>
      <p className="font-display text-2xl text-ink leading-none">
        {value}
        <span className="font-body text-base text-muted ml-1">{unit}</span>
      </p>
    </div>
  );
}

interface Props {
  weather: WeatherInput;
}

export default function WeatherStats({ weather }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.0 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-lg"
    >
      <StatCell label="Temp" value={weather.temp_c.toFixed(1)} unit="°C" />
      <StatCell label="Humidity" value={String(weather.humidity)} unit="%" />
      <StatCell label="Wind" value={weather.wind_kph.toFixed(0)} unit="km/h" />
      <StatCell label="Rain" value={weather.precip_mm.toFixed(1)} unit="mm" />
    </motion.div>
  );
}
