import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import RevealText from '@/components/shared/RevealText';
import SearchForm from '@/components/shared/SearchForm';

const ease = [0.16, 1, 0.3, 1];

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col justify-between gap-10 overflow-hidden px-5 pb-12 pt-24 md:px-10 md:pt-28">
      <motion.h1 style={{ y, opacity }} className="font-display text-[15.5vw] leading-[0.86] tracking-[-0.02em] md:text-[9.6vw]">
        <RevealText text="Every developer" /><br />
        <RevealText text="leaves a" delay={0.15} />{' '}
        <em className="text-signal"><RevealText text="paper trail." delay={0.3} /></em>
      </motion.h1>

      <div className="grid items-end gap-8 md:grid-cols-12">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8, ease }} className="max-w-sm text-base leading-relaxed text-ink/70 md:col-span-4">
          Dossier opens the public GitHub file of anyone — identity, every repository, stars, forks and languages — read live from the GitHub API. No account. No login.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.9, ease }} className="md:col-span-7 md:col-start-6">
          <SearchForm id="hero-search" />
        </motion.div>
      </div>
    </section>
  );
}