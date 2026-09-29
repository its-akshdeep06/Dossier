import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { avatar } from '@/lib/format';
import Clock from '@/components/shared/Clock';

function Stage({ label, note = '', state, delay = 0 }) {
  return (
    <li className={`flex items-center gap-4 transition-colors duration-300 ${state === 'idle' ? 'text-paper/30' : 'text-paper'}`}>
      <span className="relative grid h-5 w-5 place-items-center">
        {state === 'done' && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay, type: 'spring', stiffness: 400, damping: 18 }} className="grid h-5 w-5 place-items-center rounded-full bg-signal"><Check className="h-3 w-3 text-ink" strokeWidth={3} /></motion.span>}
        {state === 'active' && <motion.span className="h-2.5 w-2.5 rounded-full bg-signal" animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }} />}
        {state === 'idle' && <span className="h-1.5 w-1.5 rounded-full bg-paper/30" />}
        {state === 'failed' && <X className="h-4 w-4 text-signal" />}
      </span>
      <span className="flex-1">{label}</span>
      {note && <span className="text-paper/50">{note}</span>}
    </li>
  );
}

export default function AnalyzingScreen({ username, user, repos, reposError, progress, onComplete }) {
  const ready = !!user && (!!repos || !!reposError);
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(onComplete, 750);
    return () => clearTimeout(t);
  }, [ready, onComplete]);

  const total = user?.public_repos ?? 0;
  const repoPct = repos || reposError ? 1 : total ? Math.min(1, progress / total) : 0;
  const width = ready ? 1 : (user ? 0.25 : 0.06) + repoPct * 0.65;
  const repoState = repos ? 'done' : reposError ? 'failed' : user ? 'active' : 'idle';

  return (
    <motion.div role="status" aria-live="polite" className="fixed inset-0 z-50 flex flex-col justify-between bg-ink px-5 py-6 text-paper md:px-10 md:py-8" exit={{ y: '-100%', transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } }}>
      <div className="flex justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-paper/50">
        <span>Dossier</span>
        <div className="flex items-center gap-3">
          <Clock />
          <span>Opening file</span>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-4 md:gap-6">
          {user && <motion.img src={avatar(user.avatar_url, 160)} alt="" initial={{ scale: 0.4, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }} className="h-14 w-14 shrink-0 rounded-full ring-2 ring-signal md:h-24 md:w-24" />}
          <h1 className="min-w-0 break-all font-display text-[13vw] leading-none md:text-[8vw]">@{user?.login ?? username}</h1>
        </div>
        <ol className="mt-10 max-w-xl space-y-3 font-mono text-xs md:text-sm">
          <Stage label="Finding profile" state={user ? 'done' : 'active'} note={user ? 'found' : `GET /users/${username}`} />
          <Stage label="Loading repositories" state={repoState} note={user ? (reposError ? 'failed — continuing' : `${repos ? repos.length : progress} / ${total}`) : ''} />
          <Stage label="Analyzing repository data" state={ready ? 'done' : 'idle'} delay={0.15} />
          <Stage label="Preparing profile" state={ready ? 'done' : 'idle'} delay={0.3} />
        </ol>
      </div>
      <div className="relative h-px bg-paper/15">
        <motion.div className="absolute -top-px left-0 h-[3px] bg-signal" animate={{ width: `${width * 100}%` }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
      </div>
    </motion.div>
  );
}