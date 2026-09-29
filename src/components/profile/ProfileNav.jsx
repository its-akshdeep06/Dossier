import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import Clock from '@/components/shared/Clock';
import { avatar } from '@/lib/format';

export default function ProfileNav({ user }) {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  useMotionValueEvent(scrollY, 'change', (v) => setCompact(v > 560));

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${compact ? 'border-b border-ink/10 bg-paper/95' : ''}`}>
      <div className="flex h-16 items-center justify-between gap-4 px-5 md:px-10">
        <Logo />
        <AnimatePresence>
          {compact && (
            <motion.button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label={`Back to top of ${user.login}'s profile`}
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              className="flex min-w-0 items-center gap-2.5"
            >
              <img src={avatar(user.avatar_url, 64)} alt="" className="h-8 w-8 rounded-full ring-2 ring-signal" />
              <span className="truncate font-mono text-sm">@{user.login}</span>
            </motion.button>
          )}
        </AnimatePresence>
        <div className="flex shrink-0 items-center gap-4">
          <Clock />
          <Link to="/" className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">New search</span>
          </Link>
        </div>
      </div>
    </header>
  );
}