import { useState } from 'react';
import { motion } from 'framer-motion';
import { languageColor } from '@/lib/languageColors';
import { pct } from '@/lib/format';

export default function LanguageSpectrum({ languages, withLanguage, onPick }) {
  const [hover, setHover] = useState(null);
  const dim = (name) => hover && hover !== name;
  const bind = (name) => ({
    onClick: () => onPick(name),
    onPointerEnter: () => setHover(name),
    onPointerLeave: () => setHover(null),
    onFocus: () => setHover(name),
    onBlur: () => setHover(null),
  });

  return (
    <div className="mt-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dust">
        Language distribution · primary language across {withLanguage} repositories · click to filter
      </p>
      <div className="mt-4 flex h-16 w-full gap-[2px] md:h-24">
        {languages.map((l, i) => (
          <motion.button
            key={l.name}
            {...bind(l.name)}
            aria-label={`${l.name}: ${l.count} repositories, ${pct(l.share)}%. Filter repositories by ${l.name}`}
            className="h-full origin-left"
            style={{ backgroundColor: languageColor(l.name), flexGrow: l.share, flexBasis: 0, minWidth: 3 }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            animate={{ opacity: dim(l.name) ? 0.2 : 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </div>
      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs">
        {languages.map((l) => (
          <li key={l.name}>
            <button {...bind(l.name)} tabIndex={-1} className={`inline-flex items-center gap-2 transition-opacity duration-200 ${dim(l.name) ? 'opacity-25' : ''}`}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: languageColor(l.name) }} />
              {l.name}
              <span className="text-dust">{l.count} · {pct(l.share)}%</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}