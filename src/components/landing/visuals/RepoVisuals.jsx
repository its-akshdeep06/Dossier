import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1];
const NAMES = ['portfolio-site', 'dotfiles', 'portfolio-v2', 'cli-tools', 'blog-engine', 'my-portfolio', 'notes'];

function useTick(ms, mod) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => (x + 1) % mod), ms);
    return () => clearInterval(t);
  }, [ms, mod]);
  return tick;
}

export function ExplorerV() {
  const tick = useTick(160, 34);
  const q = tick < 24 ? 'portfolio'.slice(0, tick) : '';
  const shown = NAMES.filter((n) => n.includes(q));
  return (
    <div className="w-full max-w-md">
      <div className="flex items-center border-b-2 border-ink pb-2 font-mono text-sm">
        <span className="mr-2 text-dust">search /</span>{q}<span className="ml-0.5 inline-block h-4 w-[2px] animate-blink bg-signal" />
      </div>
      <ul className="mt-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((n) => (
            <motion.li key={n} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.35, ease }} className="flex items-center justify-between border-b border-ink/15 py-2.5">
              <span className="font-display text-xl md:text-2xl">{n}</span>
              <span className="h-1.5 w-12 rounded-full bg-ink/20" />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export function DetailsV() {
  const open = useTick(2200, 2) === 1;
  return (
    <div className="w-full max-w-md border-y border-ink/20">
      <div className="flex items-center justify-between py-4">
        <span className="font-display text-2xl md:text-3xl">example-repo</span>
        <span className={`rounded-full border border-ink px-3 py-1 font-mono text-[10px] uppercase transition-colors ${open ? 'bg-ink text-paper' : ''}`}>{open ? 'Hide details' : 'Show details'}</span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease }} className="overflow-hidden">
            <div className="space-y-3 pb-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-signal">GET /repos/…/languages — on demand</p>
              <div className="flex h-2.5 overflow-hidden rounded-full">
                {[['#f1e05a', 55], ['#563d7c', 30], ['#e34c26', 15]].map(([c, w], i) => (
                  <motion.span key={c} style={{ background: c }} initial={{ width: 0 }} animate={{ width: `${w}%` }} transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease }} />
                ))}
              </div>
              {['license', 'topics', 'open issues'].map((t) => (
                <div key={t} className="flex items-center gap-3 font-mono text-[10px] uppercase text-dust"><span className="w-24">{t}</span><span className="h-1.5 w-20 rounded-full bg-ink/20" /></div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const EX = [['JavaScript', 62000, '#f1e05a'], ['CSS', 25000, '#563d7c'], ['HTML', 13000, '#e34c26']];

export function LanguagesV() {
  return (
    <div className="w-full max-w-md">
      <p className="font-mono text-[10px] uppercase tracking-widest text-dust">Example · bytes ÷ total bytes × 100</p>
      <div className="mt-4 flex h-10 gap-[2px]">
        {EX.map(([n, b, c], i) => (
          <motion.span key={n} className="h-full origin-left" style={{ background: c, flexGrow: b }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: i * 0.15, duration: 0.9, ease }} />
        ))}
      </div>
      <ul className="mt-5 space-y-2.5">
        {EX.map(([n, b, c], i) => (
          <motion.li key={n} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 font-mono text-xs">
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: c }} />{n}</span>
            <span className="text-dust">{b.toLocaleString('en')} B</span>
            <span className="w-12 text-right text-base">{Number(b) / 1000}%</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}