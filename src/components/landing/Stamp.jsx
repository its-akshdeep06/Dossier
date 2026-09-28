import { motion } from 'framer-motion';

const TEXT = 'PUBLIC RECORD · NO ACCOUNT · LIVE FROM GITHUB · ';

export default function Stamp({ rotate }) {
  return (
    <motion.div
      aria-hidden
      style={{ rotate }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.8 }}
      className="pointer-events-none absolute right-10 top-[22%] hidden h-44 w-44 md:block"
    >
      <svg viewBox="0 0 200 200" className="h-full w-full animate-spin-slow">
        <defs>
          <path id="stamp-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-ink font-mono" style={{ fontSize: 13, letterSpacing: 2 }}>
          <textPath href="#stamp-circle">{TEXT}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="h-14 w-14 rounded-full bg-signal" />
      </div>
    </motion.div>
  );
}