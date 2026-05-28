import { motion } from "framer-motion";
import type { WindowResult } from "@/utils/bestWindow";
import { hrLabel } from "@/utils/bestWindow";

interface Props {
  result: WindowResult;
}

export default function BestWindow({ result }: Props) {
  const now = new Date();
  const currentHour = now.getHours();

  const noWindow = !result.hasWindow || result.hangHour === null || result.collectHour === null;
  const isPast = !noWindow && currentHour >= result.collectHour!;
  const isNow = !noWindow && !isPast && currentHour >= result.hangHour!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.15 }}
      className="w-full border-2 border-ink/10 bg-cream-dark/40 px-6 py-5"
    >
      <p className="font-body text-muted text-xs tracking-[0.25em] uppercase text-center mb-4">
        Today&rsquo;s Laundry Window
      </p>

      {noWindow && (
        <div className="text-center">
          <p className="font-display text-2xl text-ink">No good window today.</p>
          <p className="font-body italic text-muted text-lg mt-1">
            Save it for tomorrow.
          </p>
        </div>
      )}

      {isPast && !noWindow && (
        <div className="text-center">
          <p className="font-display text-xl text-muted tracking-wide">Window has closed.</p>
          <p className="font-body text-muted text-base mt-1">
            Best window was{" "}
            <span className="text-ink font-semibold">
              {hrLabel(result.hangHour!)}–{hrLabel(result.collectHour!)}
            </span>
            .
          </p>
        </div>
      )}

      {!noWindow && !isPast && (
        <>
          <div className="flex items-center justify-center gap-6 md:gap-10">
            {/* Hang time */}
            <div className="text-center">
              <p className="font-body text-muted text-xs tracking-[0.2em] uppercase mb-1">
                {isNow ? "Hang Now" : "Hang at"}
              </p>
              <p className="font-display leading-none text-ink"
                style={{ fontSize: isNow ? "2.8rem" : "3.5rem" }}>
                {isNow ? "NOW" : hrLabel(result.hangHour!)}
              </p>
            </div>

            {/* Arrow */}
            <div className="text-ink/25 font-display text-2xl select-none mt-4">→</div>

            {/* Collect time */}
            <div className="text-center">
              <p className="font-body text-muted text-xs tracking-[0.2em] uppercase mb-1">
                Collect by
              </p>
              <p className="font-display leading-none text-ink" style={{ fontSize: "3.5rem" }}>
                {hrLabel(result.collectHour!)}
              </p>
            </div>
          </div>

          <p className="font-body text-muted text-sm text-center mt-4">
            ~{result.dryHours} hour{result.dryHours !== 1 ? "s" : ""} to dry
            {result.windowEnd && result.windowEnd > result.collectHour! && (
              <span>
                {" · "}window open until{" "}
                <span className="text-ink">{hrLabel(result.windowEnd)}</span>
              </span>
            )}
          </p>
        </>
      )}
    </motion.div>
  );
}
