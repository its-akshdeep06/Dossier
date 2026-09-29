import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const spring = { stiffness: 500, damping: 35, mass: 0.35 };

// Octocat theme colors extracted from the SVG
const THEME = {
  blue: '#0db4f1ff',
  deepBlue: '#62afe2ff',
  mint: '#C4E5D9',
  skin: '#F5CCB3',
  iris: '#AF5C51',
  dark: '#010101',
};

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [ripples, setRipples] = useState([]);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  // Trail ring — a larger, delayed ring that follows the octocat
  const trailX = useSpring(x, { stiffness: 180, damping: 30, mass: 0.6 });
  const trailY = useSpring(y, { stiffness: 180, damping: 30, mass: 0.6 });

  const rippleId = useRef(0);

  const spawnRipple = useCallback((cx, cy) => {
    const id = ++rippleId.current;
    setRipples((prev) => [...prev, { id, x: cx, y: cy }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
  }, []);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setEnabled(true);

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHover(!!e.target.closest?.('a, button, input, select, textarea, [data-cursor]'));
    };

    const down = (e) => {
      setClicking(true);
      spawnRipple(e.clientX, e.clientY);
    };
    const up = () => setClicking(false);

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [x, y, spawnRipple]);

  if (!enabled) return null;

  const cursorSize = hover ? 28 : 20;

  return (
    <>
      {/* Click ripples */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.div
            key={r.id}
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[99] rounded-full"
            style={{
              x: r.x,
              y: r.y,
              translateX: '-50%',
              translateY: '-50%',
            }}
            initial={{ width: 8, height: 8, opacity: 0.7, borderWidth: 2 }}
            animate={{ width: 60, height: 60, opacity: 0, borderWidth: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            <div
              className="h-full w-full rounded-full"
              style={{
                border: `2px solid ${THEME.blue}`,
                boxShadow: `0 0 12px ${THEME.deepBlue}60`,
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Trailing ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99] rounded-full"
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
          border: `1.5px solid ${THEME.mint}`,
        }}
        animate={{
          width: hover ? 52 : 36,
          height: hover ? 52 : 36,
          opacity: clicking ? 0.3 : 0.45,
          borderColor: hover ? THEME.deepBlue : THEME.mint,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      />

      {/* Hover glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99] rounded-full"
        style={{
          x: sx,
          y: sy,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: hover ? 56 : 0,
          height: hover ? 56 : 0,
          opacity: hover ? 0.2 : 0,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 26 }}
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background: `radial-gradient(circle, ${THEME.blue}50 0%, ${THEME.deepBlue}10 60%, transparent 100%)`,
          }}
        />
      </motion.div>

      {/* Octocat cursor image */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100]"
        style={{
          x: sx,
          y: sy,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: cursorSize,
          height: cursorSize,
          rotate: clicking ? -12 : hover ? 8 : 0,
          scale: clicking ? 0.85 : 1,
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      >
        <img
          src="/octocat.svg"
          alt=""
          draggable={false}
          className="h-full w-full select-none"
          style={{
            filter: `drop-shadow(0 0 ${hover ? '6px' : '3px'} ${THEME.blue}90)`,
            transition: 'filter 0.25s ease',
          }}
        />
      </motion.div>
    </>
  );
}