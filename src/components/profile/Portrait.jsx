import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate, useScroll, useReducedMotion } from 'framer-motion';
import LanguageRing from '@/components/profile/LanguageRing';
import OrbitTag from '@/components/profile/OrbitTag';
import TickRing from '@/components/profile/TickRing';
import { avatar, compact, pct } from '@/lib/format';

const ease = [0.16, 1, 0.3, 1];
const SLICES = 7;
const spring = { stiffness: 140, damping: 16 };

export default function Portrait({ user, analysis }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [lang, setLang] = useState(null);
  const src = avatar(user.avatar_url, 560);

  useEffect(() => {
    const img = new Image();
    img.onload = img.onerror = () => setLoaded(true);
    img.src = src;
  }, [src]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [14, -14]), spring);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), spring);
  const gx = useTransform(mx, [-0.5, 0.5], [15, 85]);
  const gy = useTransform(my, [-0.5, 0.5], [15, 85]);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.28), transparent 55%)`;
  const { scrollY } = useScroll();
  const tickRotate = useTransform(scrollY, [0, 1500], [0, 140]);
  const scale = useTransform(scrollY, [0, 800], [1, 0.86]);

  const onMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <figure className="relative mx-auto w-full max-w-[min(520px,82vw)]">
      <motion.div ref={ref} onPointerMove={onMove} onPointerLeave={() => { mx.set(0); my.set(0); }} style={{ scale }} className="relative aspect-square [perspective:1100px]">
        <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} className="relative h-full w-full">
          <TickRing rotate={tickRotate} />
          <LanguageRing languages={analysis?.languages ?? []} onHover={setLang} />
          <div className="absolute inset-[12%] overflow-hidden rounded-full bg-ink" style={{ transform: 'translateZ(40px)' }}>
            {Array.from({ length: SLICES }, (_, i) => (
              <motion.div
                key={i} aria-hidden className="absolute top-0 h-full"
                style={{ left: `${(i * 100) / SLICES}%`, width: `${100 / SLICES + 0.5}%`, backgroundImage: `url(${src})`, backgroundSize: `${SLICES * 100}% 100%`, backgroundPosition: `${(i / (SLICES - 1)) * 100}% 0` }}
                initial={{ y: i % 2 ? '-101%' : '101%' }}
                animate={loaded ? { y: '0%' } : undefined}
                transition={{ duration: 1.1, ease, delay: 0.2 + i * 0.07 }}
              />
            ))}
            <motion.img src={src} alt={`GitHub profile picture of ${user.login}`} className="absolute inset-0 h-full w-full object-cover" initial={{ opacity: 0 }} animate={loaded ? { opacity: 1 } : undefined} transition={{ delay: 1.35, duration: 0.3 }} />
            <motion.div aria-hidden className="absolute inset-0" style={{ background: glare }} />
          </div>
        </motion.div>
        <OrbitTag className="right-0 top-[5%]" depth={26} mx={mx} my={my} delay={1.4}>{compact(user.followers)} followers</OrbitTag>
        <OrbitTag className="left-0 top-[47%]" depth={16} mx={mx} my={my} delay={1.55}>{compact(user.following)} following</OrbitTag>
        {analysis && <OrbitTag className="bottom-[5%] right-[6%]" depth={34} mx={mx} my={my} delay={1.7}>★ {compact(analysis.totalStars)} earned</OrbitTag>}
      </motion.div>
      <figcaption className="mt-5 h-5 text-center font-mono text-[11px] text-dust">
        <AnimatePresence mode="wait">
          <motion.span key={lang?.name ?? 'hint'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="inline-block">
            {lang ? <><span className="text-ink">{lang.name}</span> · primary in {lang.count} repos · {pct(lang.share)}%</> : analysis?.languages.length ? 'The ring is their language mix — hover a segment' : 'No primary languages on record'}
          </motion.span>
        </AnimatePresence>
      </figcaption>
    </figure>
  );
}