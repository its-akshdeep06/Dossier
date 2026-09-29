import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useGithubProfile } from '@/hooks/useGithubProfile';
import { compareProfiles } from '@/lib/duel';
import PageTransition from '@/components/shared/PageTransition';
import LandingNav from '@/components/landing/LandingNav';
import ErrorState from '@/components/profile/ErrorState';
import CountUp from '@/components/shared/CountUp';
import confetti from 'canvas-confetti';

const ease = [0.16, 1, 0.3, 1];

export default function Duel() {
  const { usernameA, usernameB } = useParams();

  const profileA = useGithubProfile(usernameA);
  const profileB = useGithubProfile(usernameB);

  const readyA = !!profileA.user && (!!profileA.repos || !!profileA.reposError);
  const readyB = !!profileB.user && (!!profileB.repos || !!profileB.reposError);

  const error = profileA.userError || profileA.reposError || profileB.userError || profileB.reposError;

  const comparison = useMemo(() => {
    if (readyA && readyB && !error) {
      if (profileA.user.login.toLowerCase() === profileB.user.login.toLowerCase()) {
        return 'mirror';
      }
      return compareProfiles(profileA.user, profileA.repos, profileB.user, profileB.repos);
    }
    return null;
  }, [readyA, readyB, error, profileA.user, profileA.repos, profileB.user, profileB.repos]);

  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (comparison) {
      const timer = setTimeout(() => setRevealed(true), 800);
      return () => clearTimeout(timer);
    }
  }, [comparison]);

  if (error) {
    return (
      <PageTransition>
        <LandingNav />
        <ErrorState error={error} username={profileA.userError ? usernameA : usernameB} />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <LandingNav />
      <main className="min-h-[100svh] px-5 pt-24 pb-28 md:px-10">
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="loader"
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
                className="font-display text-5xl mb-10"
              >
                Preparing Duel
              </motion.h2>
              <div className="flex flex-col gap-5 w-full max-w-sm text-lg font-mono">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, ease }}
                  className="flex justify-between items-center border-b border-ink/10 pb-3"
                >
                  <span>Loading {usernameA}</span>
                  <motion.span
                    key={readyA ? 'done' : 'loading'}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={readyA ? 'text-signal' : 'text-ink/40'}
                  >
                    {readyA ? '✓' : '...'}
                  </motion.span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35, duration: 0.5, ease }}
                  className="flex justify-between items-center border-b border-ink/10 pb-3"
                >
                  <span>Loading {usernameB}</span>
                  <motion.span
                    key={readyB ? 'done' : 'loading'}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={readyB ? 'text-signal' : 'text-ink/40'}
                  >
                    {readyB ? '✓' : '...'}
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="duel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
              {comparison === 'mirror' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease }}
                  className="text-center py-20"
                >
                  <h1 className="font-display text-6xl text-signal mb-4">MIRROR MATCH</h1>
                  <p className="text-xl text-ink/70">Same profile on both sides. Every comparable metric is tied.</p>
                  <Link to="/duel" className="inline-block mt-8 text-ink underline hover:text-signal transition-colors">Select two different profiles</Link>
                </motion.div>
              ) : (
                <DuelBoard comparison={comparison} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </PageTransition>
  );
}

/* ─── Trophy SVG badge shown on the winner ─── */
function TrophyBadge() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 15 }}
      className="absolute -top-3 -right-3 z-10"
    >
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="24" cy="24" r="24" fill="#FF4D1A" />
        <path d="M24 12l2.47 7.6h7.99l-6.47 4.7 2.47 7.6L24 27.2l-6.47 4.7 2.47-7.6-6.47-4.7h7.99L24 12z" fill="#EEEBE3" />
      </svg>
    </motion.div>
  );
}

/* ─── Confetti burst helper ─── */
function useConfettiBurst(result, reduced) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current || reduced || result === 'tie') return;
    firedRef.current = true;

    const side = result === 'a' ? 0.15 : 0.85;
    const defaults = { origin: { x: side, y: 0.35 }, disableForReducedMotion: true };

    const fire = (opts) => confetti({ ...defaults, ...opts });

    fire({ spread: 55, particleCount: 60, startVelocity: 30 });
    setTimeout(() => fire({ spread: 70, particleCount: 40, startVelocity: 45 }), 200);
    setTimeout(() => fire({ spread: 90, particleCount: 30, decay: 0.92 }), 400);
  }, [result, reduced]);
}

/* ─── Main duel board ─── */
function DuelBoard({ comparison }) {
  const { profiles, categories, score, result, tieBreaker } = comparison;
  const { a: pA, b: pB } = profiles;
  const reduced = useReducedMotion();

  useConfettiBurst(result, reduced);

  return (
    <div className="space-y-16">
      {/* Head to head */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-10">
        <PlayerCard user={pA} score={score.a} isWinner={result === 'a'} isLoser={result === 'b'} />
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 12 }}
          className="font-display text-5xl text-signal italic shrink-0"
        >
          VS
        </motion.div>
        <PlayerCard user={pB} score={score.b} isWinner={result === 'b'} isLoser={result === 'a'} alignRight />
      </header>

      {/* Final Result Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8, ease }}
        whileHover={{ scale: 1.02 }}
        className="text-center py-10 border-y-2 border-ink transition-colors duration-300 hover:border-signal"
      >
        <h2 className="font-display text-5xl md:text-6xl mb-4">
          {result === 'a' && `${pA.login} wins the Duel`}
          {result === 'b' && `${pB.login} wins the Duel`}
          {result === 'tie' && `Absolute Tie`}
        </h2>
        {tieBreaker && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-signal font-mono text-sm uppercase"
          >
            Tie broken by: {tieBreaker.metric}
          </motion.p>
        )}
        {result !== 'tie' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="text-ink/50 font-mono text-xs mt-3 uppercase tracking-wider"
          >
            {score.a} categories won by {pA.login} · {score.b} categories won by {pB.login} · {6 - score.a - score.b} tied
          </motion.p>
        )}
      </motion.div>

      {/* Categories */}
      <div className="space-y-4">
        {categories.map((c, i) => (
          <CategoryRow key={c.id} category={c} pA={pA} pB={pB} index={i} />
        ))}
      </div>

      {/* Rematch */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="text-center pt-8"
      >
        <Link
          to="/duel"
          className="inline-block rounded-full border-2 border-ink px-8 py-3 font-display text-lg uppercase tracking-wider transition-all duration-300 hover:bg-ink hover:text-paper hover:scale-105"
        >
          New Duel
        </Link>
      </motion.div>
    </div>
  );
}

/* ─── Player card with winner/loser PFP logic ─── */
function PlayerCard({ user, score, isWinner, isLoser, alignRight }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: alignRight ? 60 : -60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease }}
      whileHover={{ scale: 1.03 }}
      className={`group flex items-center gap-6 transition-transform duration-300 ${alignRight ? 'flex-row-reverse md:text-right' : ''}`}
    >
      {/* PFP container */}
      <div className="relative">
        {isWinner && <TrophyBadge />}
        <motion.img
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
          src={user.avatar_url}
          alt={user.login}
          className={`w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg transition-all duration-500 ${
            isLoser
              ? 'grayscale opacity-70'
              : isWinner
                ? 'grayscale-0 ring-4 ring-signal/40 shadow-lg shadow-signal/20'
                : ''
          } group-hover:scale-105`}
        />
        {isWinner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute inset-0 rounded-lg ring-2 ring-signal animate-pulse pointer-events-none"
          />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease }}
          className="font-display text-3xl md:text-5xl truncate max-w-[200px] md:max-w-xs"
        >
          {user.login}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-ink/60 font-mono text-sm mt-1 mb-3 group-hover:text-ink/80 transition-colors"
        >
          {user.name || 'No name'}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 300 }}
          className={`font-display text-6xl md:text-7xl leading-none ${isWinner ? 'text-signal' : isLoser ? 'text-ink/40' : 'text-ink'}`}
        >
          <CountUp value={score} />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Category comparison row ─── */
function CategoryRow({ category, pA, pB, index }) {
  const winnerIsA = category.winner === 'a';
  const winnerIsB = category.winner === 'b';
  const isTie = category.winner === 'tie';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.15, duration: 0.6, ease }}
      whileHover={{ scale: 1.015, y: -2 }}
      className="group grid grid-cols-1 md:grid-cols-3 items-center gap-6 p-6 border border-ink/10 bg-ink/[0.03] transition-all duration-300 hover:border-ink/30 hover:bg-ink/[0.06] hover:shadow-lg hover:shadow-ink/5"
    >
      {/* Player A value */}
      <div className="text-center md:text-left order-2 md:order-1">
        <motion.div
          whileHover={{ scale: 1.08 }}
          className={`text-3xl font-display transition-colors duration-300 ${winnerIsA ? 'text-signal' : 'group-hover:text-ink/80'}`}
        >
          {formatValue(category.aValue, category.isPercentage)}
        </motion.div>
        {category.aDetails && <div className="text-xs text-ink/60 font-mono mt-1">{category.aDetails}</div>}
        {winnerIsA && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + index * 0.15 }}
            className="text-signal text-xs font-mono uppercase mt-2 inline-flex items-center gap-1"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden><path d="M6 0l1.8 3.6L12 4.2 8.9 7.1l.7 4.1L6 9.3 2.4 11.2l.7-4.1L0 4.2l4.2-.6L6 0z" /></svg>
            +1 Point
          </motion.div>
        )}
      </div>

      {/* Category label */}
      <div className="text-center order-1 md:order-2 border-b md:border-b-0 border-ink/10 pb-4 md:pb-0">
        <h4 className="font-display text-2xl uppercase tracking-wider group-hover:tracking-[0.15em] transition-all duration-300">{category.label}</h4>
        <p className="text-xs font-mono text-ink/50 mt-1">{category.metric}</p>
        {isTie && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.15 }}
            className="text-ink text-xs font-mono uppercase mt-2 border border-ink px-3 py-1 inline-block"
          >
            Tie
          </motion.div>
        )}
      </div>

      {/* Player B value */}
      <div className="text-center md:text-right order-3">
        <motion.div
          whileHover={{ scale: 1.08 }}
          className={`text-3xl font-display transition-colors duration-300 ${winnerIsB ? 'text-signal' : 'group-hover:text-ink/80'}`}
        >
          {formatValue(category.bValue, category.isPercentage)}
        </motion.div>
        {category.bDetails && <div className="text-xs text-ink/60 font-mono mt-1">{category.bDetails}</div>}
        {winnerIsB && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + index * 0.15 }}
            className="text-signal text-xs font-mono uppercase mt-2 inline-flex items-center gap-1 justify-end"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden><path d="M6 0l1.8 3.6L12 4.2 8.9 7.1l.7 4.1L6 9.3 2.4 11.2l.7-4.1L0 4.2l4.2-.6L6 0z" /></svg>
            +1 Point
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function formatValue(val, isPercentage) {
  if (isPercentage) {
    return (val * 100).toFixed(1) + '%';
  }
  return new Intl.NumberFormat('en-US').format(val);
}
