import { motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1];

export function IdentityV() {
  return (
    <div className="flex items-center gap-6 md:gap-10">
      <div className="relative h-28 w-28 shrink-0 sm:h-40 sm:w-40 md:h-56 md:w-56">
        <motion.div className="absolute inset-0 rounded-full border border-dashed border-ink/40" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} />
        <div className="absolute inset-[10%] flex overflow-hidden rounded-full">
          {Array.from({ length: 7 }, (_, i) => (
            <motion.div key={i} className="h-full flex-1" style={{ background: i % 2 ? '#141413' : '#3a3833' }} initial={{ y: i % 2 ? '-100%' : '100%' }} animate={{ y: '0%' }} transition={{ delay: 0.1 + i * 0.06, duration: 0.9, ease }} />
          ))}
        </div>
        <motion.span className="absolute -right-1 top-3 rounded-full border border-ink bg-paper px-2 py-1 font-mono text-[9px]" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: 'spring' }}>followers</motion.span>
      </div>
      <div className="space-y-3">
        {['name', '@username', 'bio', 'location', 'joined'].map((t, i) => (
          <motion.div key={t} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.08, ease }} className="flex items-center gap-3">
            <span className="w-16 font-mono text-[10px] uppercase tracking-widest text-dust md:w-24">{t}</span>
            <span className="h-2 rounded-full bg-ink/80" style={{ width: 30 + ((i * 37) % 70) }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Reel({ duration }) {
  return (
    <span className="inline-block h-[1em] overflow-hidden align-bottom leading-none">
      <motion.span className="flex flex-col" animate={{ y: ['0%', '-90.9%'] }} transition={{ duration, repeat: Infinity, ease: 'linear' }}>
        {'01234567890'.split('').map((d, i) => <span key={i} className="h-[1em] leading-none">{d}</span>)}
      </motion.span>
    </span>
  );
}

export function HighlightsV() {
  const cells = ['Followers', 'Following', 'Stars earned', 'Forks'];
  return (
    <div className="grid w-full max-w-lg grid-cols-2 gap-px bg-ink/15">
      {cells.map((c, i) => (
        <motion.div key={c} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, ease }} className="bg-paper p-4 md:p-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-dust">{c}</p>
          <p className="mt-4 font-display text-4xl md:text-6xl">
            <Reel duration={1.4 + i * 0.3} /><Reel duration={2.1 + i * 0.2} /><Reel duration={0.9 + i * 0.25} />
          </p>
        </motion.div>
      ))}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="col-span-2 flex justify-between bg-ink px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-paper md:px-6">
        <span>Most starred →</span><span>Leading language →</span>
      </motion.div>
    </div>
  );
}