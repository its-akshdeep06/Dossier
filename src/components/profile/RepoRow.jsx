import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, GitFork, Plus, ArrowUpRight } from 'lucide-react';
import RepoDetails from '@/components/profile/RepoDetails';
import { languageColor } from '@/lib/languageColors';
import { full, ago } from '@/lib/format';

const Tag = ({ children }) => (
  <span className="rounded-full border border-ink/25 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink/60">{children}</span>
);

function RepoRow({ repo, index, open, onToggle }) {
  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 380, damping: 36 }}
      className="group relative border-b border-ink/15"
    >
      <span aria-hidden className={`absolute left-0 top-0 h-full w-[3px] origin-top bg-signal transition-transform duration-500 ${open ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}`} />
      <div className="grid grid-cols-[2.25rem_1fr] items-start gap-x-3 py-6 pl-3 md:grid-cols-[3.5rem_1fr_auto] md:gap-x-4 md:pl-5">
        <span className="pt-2 font-mono text-[11px] text-dust">{String(index + 1).padStart(3, '0')}</span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="break-all font-display text-3xl leading-none md:text-4xl">
              <a href={repo.html_url} target="_blank" rel="noreferrer" className="inline-flex items-baseline gap-1 transition-colors hover:text-signal">
                {repo.name}<ArrowUpRight className="h-4 w-4 self-start opacity-0 transition-opacity group-hover:opacity-60" />
              </a>
            </h3>
            {repo.fork && <Tag>Fork</Tag>}
            {repo.archived && <Tag>Archived</Tag>}
            {repo.visibility && repo.visibility !== 'public' && <Tag>{repo.visibility}</Tag>}
          </div>
          {repo.description && <p className="mt-2 line-clamp-2 max-w-2xl text-ink/70">{repo.description}</p>}
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-ink/60">
            {repo.language && <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: languageColor(repo.language) }} />{repo.language}</span>}
            <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5" />{full(repo.stargazers_count)}</span>
            <span className="inline-flex items-center gap-1"><GitFork className="h-3.5 w-3.5" />{full(repo.forks_count)}</span>
            <span>Updated {ago(repo.updated_at)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onToggle(repo.id)}
          aria-expanded={open}
          aria-controls={`repo-${repo.id}`}
          className={`col-start-2 mt-4 inline-flex items-center gap-2 justify-self-start rounded-full border border-ink px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors md:col-start-3 md:mt-1 ${open ? 'bg-ink text-paper' : 'hover:bg-ink hover:text-paper'}`}
        >
          {open ? 'Hide details' : 'Show details'}
          <Plus className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-45' : ''}`} />
        </button>
      </div>
      <AnimatePresence initial={false}>{open && <RepoDetails repo={repo} />}</AnimatePresence>
    </motion.li>
  );
}

export default memo(RepoRow);