import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';
import { Asterisk } from 'lucide-react';

const ITEMS = [
  'Profile analysis', 'Followers & following', 'Repository explorer', 'Search by name',
  'Filter by language', 'Sort by stars or recency', 'Stars & forks', 'Language percentages',
  'Detail inspection', 'No account required', 'Real-time public data',
];

export default function Marquee() {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const skewX = useSpring(useTransform(velocity, [-2500, 2500], [10, -10]), { stiffness: 200, damping: 40 });
  const row = [...ITEMS, ...ITEMS];

  return (
    <div className="group overflow-hidden border-y border-ink bg-paper py-5" aria-label={`Capabilities: ${ITEMS.join(', ')}`}>
      <motion.div style={{ skewX }}>
        <div aria-hidden className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {row.map((t, i) => (
            <span key={i} className="flex items-center gap-8 whitespace-nowrap pr-8 font-display text-3xl md:text-5xl">
              {t}
              <Asterisk className="h-6 w-6 text-signal md:h-8 md:w-8" />
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}