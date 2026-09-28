import { motion } from 'framer-motion';
import { differenceInYears, format } from 'date-fns';
import SectionHead from '@/components/shared/SectionHead';
import LanguageSpectrum from '@/components/profile/LanguageSpectrum';
import { full, ago, date, pct } from '@/lib/format';

const linkCls = 'text-left underline decoration-ink/15 decoration-2 underline-offset-[0.15em] transition-colors hover:text-signal hover:decoration-signal break-all';

export default function Insights({ user, analysis, onFocusRepo, onPickLanguage }) {
  const { mostStarred, latest, languages, withLanguage, originalCount, forkCount, archived, total } = analysis;
  const top = languages[0];
  const years = differenceInYears(new Date(), new Date(user.created_at));

  const rows = [
    mostStarred && { label: 'Most starred', value: <button className={linkCls} onClick={() => onFocusRepo(mostStarred)}>{mostStarred.name}</button>, note: `${full(mostStarred.stargazers_count)} stars · ${full(mostStarred.forks_count)} forks` },
    latest && { label: 'Most recently updated', value: <button className={linkCls} onClick={() => onFocusRepo(latest)}>{latest.name}</button>, note: `Updated ${ago(latest.updated_at)}` },
    top && { label: 'Leading language', value: <button className={linkCls} onClick={() => onPickLanguage(top.name)}>{top.name}</button>, note: `Primary language of ${top.count} of ${withLanguage} repositories that declare one (${pct(top.share)}%)` },
    total > 0 && { label: 'Originals / forks', value: `${originalCount} / ${forkCount}`, note: `${originalCount} original, ${forkCount} forked${archived ? `, ${archived} archived` : ''}` },
    { label: 'On GitHub since', value: format(new Date(user.created_at), 'yyyy'), note: `${date(user.created_at)} — ${years < 1 ? 'under a year' : `${years} year${years === 1 ? '' : 's'}`} ago` },
  ].filter(Boolean);

  return (
    <section aria-labelledby="findings-title" className="pt-24 md:pt-32">
      <SectionHead n="02" id="findings-title" title="Findings" aside={<p className="font-mono text-[11px] text-dust">Derived from {total} repositories</p>} />
      <dl>
        {rows.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="grid gap-2 border-b border-ink/15 py-6 md:grid-cols-12 md:items-baseline md:gap-6"
          >
            <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-dust md:col-span-3">{r.label}</dt>
            <dd className="font-display text-4xl leading-none md:col-span-6 md:text-6xl">{r.value}</dd>
            <dd className="font-mono text-xs leading-relaxed text-ink/60 md:col-span-3">{r.note}</dd>
          </motion.div>
        ))}
      </dl>
      {languages.length > 0 && <LanguageSpectrum languages={languages} withLanguage={withLanguage} onPick={onPickLanguage} />}
    </section>
  );
}