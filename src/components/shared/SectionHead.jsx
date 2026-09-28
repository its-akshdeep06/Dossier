import { motion } from 'framer-motion';

export default function SectionHead({ n, title, id, aside }) {
  return (
    <div className="relative mb-10 flex flex-wrap items-end justify-between gap-4 pb-4">
      <motion.h2
        id={id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-5xl leading-none md:text-7xl"
      >
        <span className="mr-3 align-top font-mono text-xs tracking-widest text-signal">§{n}</span>
        {title}
      </motion.h2>
      {aside}
      <motion.span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-ink"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}