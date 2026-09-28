import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

const defaultFormat = (n) => Math.round(n).toLocaleString('en');

export default function CountUp({ value, format = defaultFormat, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el) return;
    if (reduce) { el.textContent = format(value); return; }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => { el.textContent = format(v); },
    });
    return () => controls.stop();
  }, [inView, value, reduce, format]);

  return <span ref={ref} className={className} title={value.toLocaleString('en')}>{format(0)}</span>;
}