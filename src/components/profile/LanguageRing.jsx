import { motion } from 'framer-motion';
import { languageColor } from '@/lib/languageColors';

const R = 44;
const C = 2 * Math.PI * R;

export default function LanguageRing({ languages, onHover }) {
  const gap = languages.length > 1 ? 0.8 : 0;
  let offset = 0;
  const segments = languages.map((l) => {
    const seg = { ...l, len: Math.max(0.4, l.share * C - gap), offset };
    offset += l.share * C;
    return seg;
  });
  const summary = languages.slice(0, 5).map((l) => `${l.name} ${Math.round(l.share * 100)}%`).join(', ');

  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" role="img" aria-label={summary ? `Primary languages: ${summary}` : 'No language data'}>
      <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(20,20,19,0.1)" strokeWidth="3" />
      <g transform="rotate(-90 50 50)">
        {segments.map((s, i) => (
          <motion.circle
            key={s.name}
            cx="50" cy="50" r={R}
            fill="none"
            stroke={languageColor(s.name)}
            strokeWidth="3"
            strokeDashoffset={-s.offset}
            initial={{ strokeDasharray: `0 ${C}` }}
            animate={{ strokeDasharray: `${s.len} ${C - s.len}` }}
            whileHover={{ strokeWidth: 6 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.7 + i * 0.05 }}
            onPointerEnter={() => onHover(s)}
            onPointerLeave={() => onHover(null)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </g>
    </svg>
  );
}