import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import LanguageBreakdown from '@/components/profile/LanguageBreakdown';
import { date, ago, full, bytes, href, stripProtocol } from '@/lib/format';

export default function RepoDetails({ repo }) {
  const license = repo.license && (repo.license.spdx_id && repo.license.spdx_id !== 'NOASSERTION' ? repo.license.spdx_id : repo.license.name);
  const facts = [
    { label: 'Created', value: date(repo.created_at) },
    repo.pushed_at && { label: 'Last push', value: ago(repo.pushed_at) },
    { label: 'Open issues & PRs', value: full(repo.open_issues_count) },
    { label: 'Size', value: bytes(repo.size * 1024) },
    repo.default_branch && { label: 'Default branch', value: repo.default_branch },
    license && { label: 'License', value: license },
    repo.homepage && { label: 'Homepage', value: stripProtocol(repo.homepage), link: href(repo.homepage) },
  ].filter(Boolean);

  return (
    <motion.div
      id={`repo-${repo.id}`}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
    >
      <div className="grid gap-10 pb-10 pl-3 pr-1 md:grid-cols-12 md:pl-[calc(3.5rem+2.25rem)]">
        <div className="md:col-span-7">
          <LanguageBreakdown owner={repo.owner.login} repo={repo.name} />
        </div>
        <div className="md:col-span-5">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            {facts.map((f) => (
              <div key={f.label} className="min-w-0">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-dust">{f.label}</dt>
                <dd className="mt-0.5 truncate text-sm">
                  {f.link ? <a href={f.link} target="_blank" rel="noreferrer" className="underline decoration-ink/20 underline-offset-4 hover:text-signal">{f.value}</a> : f.value}
                </dd>
              </div>
            ))}
          </dl>
          {repo.topics?.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Topics">
              {repo.topics.map((t) => <li key={t} className="rounded-full bg-ink/5 px-2.5 py-1 font-mono text-[10px] text-ink/70">#{t}</li>)}
            </ul>
          )}
          <a href={repo.html_url} target="_blank" rel="noreferrer" className="group mt-6 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-signal">
            Open on GitHub <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}