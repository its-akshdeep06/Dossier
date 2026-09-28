import { motion } from 'framer-motion';

export default function RevealText({ text, delay = 0, className = '' }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.1em] align-bottom mr-[0.22em] last:mr-0">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', rotate: 4 }}
            animate={{ y: '0%', rotate: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: delay + i * 0.07 }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}