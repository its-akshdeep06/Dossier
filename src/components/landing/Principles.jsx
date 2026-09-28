import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const TEXT = "No account. No login. No database. Dossier asks GitHub's public API only for what it needs — and forgets everything the moment you leave.";
const FACTS = [
  ['1', 'request for the profile'],
  ['⌈n ÷ 100⌉', 'requests to collect every repository'],
  ['1', 'request per repository you open'],
  ['0', 'bytes stored anywhere'],
];

function Word({ progress, range, children }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return <motion.span style={{ opacity }} className="mr-[0.24em] inline-block">{children}</motion.span>;
}

export default function Principles() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.6'] });
  const words = TEXT.split(' ');

  return (
    <section className="bg-ink px-5 py-28 text-paper md:px-10 md:py-44">
      <p className="mb-10 font-mono text-[11px] uppercase tracking-[0.22em] text-signal">§ Principles</p>
      <p ref={ref} className="max-w-6xl font-display text-4xl leading-[1.05] md:text-7xl">
        <span className="sr-only">{TEXT}</span>
        <span aria-hidden>
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>
          ))}
        </span>
      </p>
      <dl className="mt-20 grid grid-cols-2 gap-px bg-paper/15 md:grid-cols-4">
        {FACTS.map(([k, v], i) => (
          <motion.div key={v} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ delay: i * 0.1, duration: 0.7 }} className="bg-ink p-5 md:p-6">
            <dt className="font-display text-5xl text-signal md:text-6xl">{k}</dt>
            <dd className="mt-3 font-mono text-[11px] uppercase leading-relaxed tracking-wider text-paper/60">{v}</dd>
          </motion.div>
        ))}
      </dl>
    </section>
  );
}