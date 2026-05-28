import { motion } from "framer-motion";

interface Props {
  label: string;
  color: string;
}

export default function VerdictBanner({ label, color }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.85, ease: "easeOut" }}
      className="text-center px-4"
    >
      <span
        className="font-display tracking-widest"
        style={{ fontSize: "clamp(2rem, 8vw, 3.5rem)", color }}
      >
        {label}
      </span>
    </motion.div>
  );
}
