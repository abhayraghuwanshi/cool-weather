import { motion } from "framer-motion";
import { getScoreColor } from "@/utils/laundryScore";
import type { HourScore } from "@/utils/bestWindow";

interface Props {
  hourlyScores: HourScore[];
  windowStart: number | null;
  windowEnd: number | null;
}

function shortLabel(h: number): string {
  if (h === 6) return "6A";
  if (h === 9) return "9A";
  if (h === 12) return "12P";
  if (h === 15) return "3P";
  if (h === 18) return "6P";
  return "";
}

const BAR_H = 56; // px

export default function HourlyTimeline({ hourlyScores, windowStart, windowEnd }: Props) {
  const currentHour = new Date().getHours();
  const dayHours = hourlyScores.filter((h) => h.hour >= 6 && h.hour <= 20);

  if (dayHours.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.3 }}
      className="w-full"
    >
      <p className="font-body text-muted text-xs tracking-[0.25em] uppercase text-center mb-3">
        Hourly Forecast
      </p>

      {/* Bars */}
      <div
        className="flex items-end gap-0.5"
        style={{ height: `${BAR_H}px` }}
      >
        {dayHours.map(({ hour, score }) => {
          const inWindow =
            windowStart !== null &&
            windowEnd !== null &&
            hour >= windowStart &&
            hour < windowEnd;
          const isCurrent = hour === currentHour;
          const barH = Math.max(3, (score / 100) * BAR_H);

          return (
            <div
              key={hour}
              title={`${hour}:00 — score ${score}`}
              className="flex-1 rounded-t-sm transition-all duration-700"
              style={{
                height: `${barH}px`,
                backgroundColor: getScoreColor(score),
                opacity: inWindow ? 1 : 0.45,
                outline: isCurrent ? "2px solid #1C1C2E" : "none",
                outlineOffset: "1px",
              }}
            />
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex mt-1 gap-0.5">
        {dayHours.map(({ hour }) => (
          <div
            key={hour}
            className="flex-1 text-center font-body text-muted"
            style={{ fontSize: "0.6rem" }}
          >
            {shortLabel(hour)}
          </div>
        ))}
      </div>

      {/* Legend */}
      <p className="font-body text-muted/60 text-xs text-center mt-2">
        Highlighted = recommended drying window
      </p>
    </motion.div>
  );
}
