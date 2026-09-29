import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUp, Swords } from 'lucide-react';
import SearchForm from '@/components/shared/SearchForm';

export default function FinalCta() {
  const backToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <section className="flex min-h-[90svh] flex-col justify-between px-5 pt-28 md:px-10">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-dust">File Nº 002 - yours to open</p>
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 font-display text-[18vw] leading-[0.85] md:text-[10vw]"
        >
          Open a <em className="text-signal">file.</em>
        </motion.h2>
        <div className="mt-12 max-w-3xl">
          <SearchForm id="cta-search" />
        </div>
        <div className="mt-8 flex gap-4 font-mono text-sm uppercase tracking-widest text-signal">
          <Link to="/duel" className="flex items-center gap-2 hover:underline">
            <Swords className="h-4 w-4" /> Start a Duel
          </Link>
        </div>
      </div>
      <footer className="mt-24 flex flex-col justify-between gap-4 border-t border-ink/20 py-8 px-5 md:px-10 font-mono text-[11px] text-paper bg-ink sm:flex-row sm:items-center -mx-5 md:-mx-10 -mb-28">
        <span className="text-paper/70">Dossier, a read-only GitHub profile analyzer</span>
        <span className="text-paper/70">Data: GitHub REST API · 60 requests/hour without login</span>
        <motion.button
          type="button"
          onClick={backToTop}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.96 }}
          className="group inline-flex w-fit items-center gap-2 self-start text-paper transition-colors hover:text-signal sm:self-auto"
          aria-label="Jump back to the hero section"
        >
          <span className="uppercase tracking-[0.18em]">Back to top</span>
          <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1" />
        </motion.button>
      </footer>
    </section>
  );
}