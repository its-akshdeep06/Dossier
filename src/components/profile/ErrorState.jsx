import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RotateCw, ArrowLeft } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import Clock from '@/components/shared/Clock';
import SearchForm from '@/components/shared/SearchForm';
import { describeError } from '@/lib/errors';

export default function ErrorState({ error, username, onRetry = undefined, showHeader = true }) {
  const copy = describeError(error, username);
  return (
    <>
      {showHeader && (
        <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-ink/10 bg-paper px-5 py-5 md:px-10">
          <Logo />
          <Clock />
        </header>
      )}
      <main role="alert" className="flex min-h-[100svh] flex-col justify-center px-5 pb-16 pt-28 md:px-10">
        <motion.div initial={{ scale: 2.4, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 1, rotate: -5 }} transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.3 }} className="self-start border-[3px] border-signal px-4 py-2 font-mono text-sm uppercase tracking-[0.3em] text-signal md:text-base">
          {copy.stamp}
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.8 }} className="mt-8 max-w-5xl break-words font-display text-5xl leading-[0.95] md:text-8xl">
          {copy.title}
        </motion.h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">{copy.body}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {copy.canRetry && onRetry && (
            <button onClick={onRetry} className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-paper transition-colors hover:bg-signal">
              <RotateCw className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180" /> Try again
            </button>
          )}
          <Link to="/" className="group inline-flex items-center gap-2 rounded-full border border-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-paper">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to search
          </Link>
        </div>
        <div className="mt-16 max-w-2xl">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-dust">Or open a different file</p>
          <SearchForm id="error-search" size="md" />
        </div>
      </main>
    </>
  );
}