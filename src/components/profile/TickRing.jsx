import { motion } from 'framer-motion';

const TICKS = Array.from({ length: 72 }, (_, i) => i);

export default function TickRing({ rotate }) {
  return (
    <motion.svg aria-hidden viewBox="0 0 100 100" style={{ rotate }} className="absolute inset-0 h-full w-full overflow-visible">
      {TICKS.map((i) => {
        const a = (i / TICKS.length) * Math.PI * 2;
        const long = i % 6 === 0;
        const r1 = long ? 47.5 : 48.5;
        return (
          <line
            key={i}
            x1={50 + Math.cos(a) * r1} y1={50 + Math.sin(a) * r1}
            x2={50 + Math.cos(a) * 50} y2={50 + Math.sin(a) * 50}
            stroke={i === 0 ? '#FF4D1A' : '#141413'}
            strokeOpacity={i === 0 ? 1 : long ? 0.6 : 0.25}
            strokeWidth={i === 0 ? 0.8 : 0.3}
          />
        );
      })}
    </motion.svg>
  );
}