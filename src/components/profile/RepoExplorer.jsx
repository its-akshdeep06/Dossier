import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHead from '@/components/shared/SectionHead';
import RepoControls from '@/components/profile/RepoControls';
import RepoRow from '@/components/profile/RepoRow';
import InlineError from '@/components/profile/InlineError';
import { filterAndSort } from '@/lib/analyze';

const PAGE = 30;

function ResultCount({ shown, total }) {
  return (
    <p aria-live="polite" className="font-mono text-sm">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={shown} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} className="inline-block text-signal">{shown}</motion.span>
      </AnimatePresence>{' '}<span className="text-dust">of {total} shown</span>
    </p>
  );
}

export default function RepoExplorer({ sectionRef, user, repos, reposError, onRetry, analysis, filters, setFilters, expanded, setExpanded }) {
  const query = useDeferredValue(filters.query);
  const results = useMemo(
    () => (repos ? filterAndSort(repos, { query, language: filters.language, sort: filters.sort }) : []),
    [repos, query, filters.language, filters.sort]);
  const [limit, setLimit] = useState(PAGE);
  useEffect(() => setLimit(PAGE), [query, filters.language, filters.sort]);
  const toggle = useCallback((id) => setExpanded((cur) => (cur === id ? null : id)), [setExpanded]);
  const reset = () => setFilters((f) => ({ ...f, query: '', language: 'all' }));

  return (
    <section ref={sectionRef} aria-labelledby="repos-title" className="scroll-mt-20 pt-24 md:pt-32">
      <SectionHead n="03" id="repos-title" title="Repositories" aside={repos && repos.length > 0 && <ResultCount shown={results.length} total={repos.length} />} />
      {reposError && <InlineError error={reposError} onRetry={onRetry} title="Repositories couldn't be loaded" />}
      {repos && repos.length === 0 && <p className="font-display text-3xl text-ink/60">@{user.login} hasn't published any public repositories.</p>}
      {repos && repos.length > 0 && (
        <>
          <RepoControls filters={filters} setFilters={setFilters} analysis={analysis} />
          <ul className="mt-8 border-t border-ink">
            <AnimatePresence mode="popLayout" initial={false}>
              {results.slice(0, limit).map((r, i) => (
                <RepoRow key={r.id} repo={r} index={i} open={expanded === r.id} onToggle={toggle} />
              ))}
            </AnimatePresence>
          </ul>
          {results.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-16 text-center">
              <p className="font-display text-4xl md:text-5xl">Nothing on file{filters.query ? ` for “${filters.query}”` : ''}.</p>
              <p className="mt-3 text-ink/60">No repository matches the current search and language filter.</p>
              <button type="button" onClick={reset} className="mt-6 rounded-full bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-paper hover:bg-signal">Clear filters</button>
            </motion.div>
          )}
          {results.length > limit && (
            <button type="button" onClick={() => setLimit((l) => l + PAGE)} className="group mt-10 flex w-full items-center justify-center gap-3 border border-ink py-5 font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-paper">
              Show {Math.min(PAGE, results.length - limit)} more <span className="text-dust group-hover:text-paper/60">· {results.length - limit} remaining</span>
            </button>
          )}
        </>
      )}
    </section>
  );
}