import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import StoryVisual from '@/components/landing/StoryVisual';

const ease = [0.16, 1, 0.3, 1];
const CHAPTERS = [
  { n: '01', kicker: 'Identity', title: 'It starts with the person.', body: 'Their GitHub profile picture, name, bio, location, company, website and the day they joined — only what GitHub actually has on file. Followers and following included.' },
  { n: '02', kicker: 'Highlights', title: 'Then the numbers speak.', body: 'Stars earned, forks, repository count — plus facts derived from real data: the most-starred project, the latest activity, the language they reach for most.' },
  { n: '03', kicker: 'Explorer', title: 'Every repository. Not ten.', body: 'All public repositories are collected page by page. Search by name, filter by the languages this developer actually uses, sort by stars or recency — instantly, with no extra requests.' },
  { n: '04', kicker: 'Inspection', title: 'Open any repository.', body: 'Show Details expands a single repository — topics, license, issues, size, branch — and fetches its extra data only at the moment you ask.' },
  { n: '05', kicker: 'Languages', title: 'Bytes become proportions.', body: 'GitHub reports how many bytes of each language a repository contains. Dossier converts those counts into exact percentages — calculated, never guessed.' },
];

export default function StoryScroll() {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) =>
    setActive(Math.max(0, Math.min(CHAPTERS.length - 1, Math.floor(v * CHAPTERS.length)))));
  const c = CHAPTERS[active];

  return (
    <section ref={ref} aria-label="How Dossier reads a profile" style={{ height: `${CHAPTERS.length * 90}vh` }} className="relative">
      <div className="sticky top-0 flex h-[100svh] flex-col gap-5 px-5 pb-6 pt-20 md:grid md:grid-cols-12 md:gap-10 md:px-10 md:pb-10 md:pt-24">
        <div className="flex flex-col gap-4 md:col-span-5 md:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-dust">§ How a profile is read</p>
          <div className="relative min-h-[12.5rem] md:min-h-[20rem]">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -28 }} transition={{ duration: 0.45, ease }}>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">{c.n} / {c.kicker}</p>
                <h2 className="mt-3 font-display text-4xl leading-[0.95] md:text-6xl lg:text-7xl">{c.title}</h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/70 md:text-base">{c.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div>
            <ol className="mb-3 hidden gap-4 font-mono text-[11px] uppercase tracking-wider md:flex">
              {CHAPTERS.map((ch, i) => (
                <li key={ch.n} className={`transition-colors duration-300 ${i === active ? 'text-ink' : 'text-ink/25'}`}>{ch.n}</li>
              ))}
            </ol>
            <div className="h-px w-full bg-ink/15">
              <motion.div className="h-[2px] origin-left bg-signal" style={{ scaleX: scrollYProgress }} />
            </div>
          </div>
        </div>
        <div className="relative min-h-0 flex-1 overflow-hidden border border-ink/20 md:col-span-7">
          <StoryVisual index={active} />
        </div>
      </div>
    </section>
  );
}