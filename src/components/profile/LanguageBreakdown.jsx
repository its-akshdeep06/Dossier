import { useMemo } from 'react';
import { motion } from 'framer-motion';
import InlineError from '@/components/profile/InlineError';
import { useRepoLanguages } from '@/hooks/useRepoLanguages';
import { languagePercentages } from '@/lib/analyze';
import { languageColor } from '@/lib/languageColors';
import { bytes } from '@/lib/format';

const ease = [0.16, 1, 0.3, 1];
const MAX = 8;

export default function LanguageBreakdown({ owner, repo }) {
  const { data, error, loading, retry } = useRepoLanguages(owner, repo);
  const rows = useMemo(() => (data ? languagePercentages(data) : []), [data]);
  const total = rows.reduce((s, r) => s + r.bytes, 0);
  const rest = rows.slice(MAX).reduce((s, r) => s + r.percent, 0);

  return (
    <div aria-live="polite">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dust">Language composition</p>
      {loading && (
        <div className="mt-4">
          <div className="relative h-3 overflow-hidden rounded-full bg-ink/10">
            <motion.span className="absolute inset-y-0 w-1/3 rounded-full bg-signal/70" animate={{ x: ['-100%', '300%'] }} transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }} />
          </div>
          <p className="mt-3 font-mono text-xs text-dust">Reading byte counts from GitHub…</p>
        </div>
      )}
      {error && <div className="mt-4"><InlineError error={error} onRetry={retry} compact /></div>}
      {data && rows.length === 0 && <p className="mt-4 text-sm text-ink/60">GitHub detected no languages in this repository.</p>}
      {rows.length > 0 && (
        <>
          <div className="mt-4 flex h-3 w-full gap-[2px] overflow-hidden rounded-full">
            {rows.map((r, i) => (
              <motion.span key={r.name} className="h-full" style={{ backgroundColor: languageColor(r.name) }} initial={{ width: 0 }} animate={{ width: `${r.percent}%` }} transition={{ duration: 0.9, ease, delay: i * 0.05 }} title={`${r.name} ${r.percent.toFixed(1)}%`} />
            ))}
          </div>
          <ul className="mt-5 space-y-2">
            {rows.slice(0, MAX).map((r, i) => (
              <motion.li key={r.name} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.05, ease }} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 font-mono text-xs">
                <span className="flex min-w-0 items-center gap-2 truncate"><span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: languageColor(r.name) }} />{r.name}</span>
                <span className="text-dust">{bytes(r.bytes)}</span>
                <span className="w-14 text-right text-sm text-ink">{r.percent.toFixed(1)}%</span>
              </motion.li>
            ))}
          </ul>
          {rows.length > MAX && <p className="mt-2 font-mono text-xs text-dust">+ {rows.length - MAX} more languages ({rest.toFixed(1)}%)</p>}
          <p className="mt-4 font-mono text-[10px] text-dust">{bytes(total)} measured · percent = language bytes ÷ total bytes</p>
        </>
      )}
    </div>
  );
}