import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { SORTS } from '@/lib/analyze';
import { languageColor } from '@/lib/languageColors';

const pill = { type: 'spring', stiffness: 500, damping: 38 };

function Pill({ on, layoutId, onClick, children }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className="relative shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider">
      {on && <motion.span layoutId={layoutId} className="absolute inset-0 rounded-full bg-ink" transition={pill} />}
      <span className={`relative inline-flex items-center gap-2 transition-colors ${on ? 'text-paper' : 'text-ink/60 hover:text-ink'}`}>{children}</span>
    </button>
  );
}

export default function RepoControls({ filters, setFilters, analysis }) {
  const set = (patch) => setFilters((f) => ({ ...f, ...patch }));
  const chips = [
    { id: 'all', label: 'All languages', count: analysis.total },
    ...analysis.languages.map((l) => ({ id: l.name, label: l.name, count: l.count, color: languageColor(l.name) })),
    ...(analysis.noLanguage ? [{ id: 'none', label: 'Unlabeled', count: analysis.noLanguage }] : []),
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-xl flex-1">
          <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-dust" />
          <label htmlFor="repo-search" className="sr-only">Search repositories by name</label>
          <input id="repo-search" type="text" value={filters.query} onChange={(e) => set({ query: e.target.value })} placeholder="Search repositories by name" autoComplete="off" className="w-full border-b border-ink/30 bg-transparent py-3 pl-7 pr-9 text-lg outline-none transition-colors placeholder:text-ink/30 focus:border-signal" />
          {filters.query && (
            <button type="button" aria-label="Clear search" onClick={() => set({ query: '' })} className="absolute right-0 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full hover:bg-ink hover:text-paper">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div role="group" aria-label="Sort repositories" className="no-scrollbar -mx-5 flex overflow-x-auto px-5 lg:mx-0 lg:rounded-full lg:border lg:border-ink/20 lg:p-1">
          {SORTS.map((s) => <Pill key={s.id} layoutId="sort-pill" on={filters.sort === s.id} onClick={() => set({ sort: s.id })}>{s.label}</Pill>)}
        </div>
      </div>
      <div role="group" aria-label="Filter by language" className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
        {chips.map((c) => (
          <Pill key={c.id} layoutId="lang-pill" on={filters.language === c.id} onClick={() => set({ language: c.id })}>
            {c.color && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />}
            {c.label}<span className="opacity-50">{c.count}</span>
          </Pill>
        ))}
      </div>
    </div>
  );
}