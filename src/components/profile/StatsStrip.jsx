import { motion } from 'framer-motion';
import CountUp from '@/components/shared/CountUp';
import { smart } from '@/lib/format';

export default function StatsStrip({ user, analysis }) {
  const items = [
    { label: 'Public repositories', value: user.public_repos },
    { label: 'Followers', value: user.followers },
    { label: 'Following', value: user.following },
    { label: 'Stars earned', value: analysis?.totalStars },
    { label: 'Times forked', value: analysis?.totalForks },
  ];
  return (
    <section aria-label="Raw statistics" className="mt-20 grid grid-cols-2 gap-px border-y border-ink/15 bg-ink/15 md:grid-cols-5">
      {items.map((it, i) => (
        <motion.div
          key={it.label}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ delay: i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`group bg-paper p-5 transition-colors duration-300 hover:bg-ink hover:text-paper md:p-6 ${i === 4 ? 'col-span-2 md:col-span-1' : ''}`}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dust">{it.label}</p>
          <p className="mt-8 font-display text-5xl leading-none md:text-6xl xl:text-7xl">
            {it.value == null ? '—' : <CountUp value={it.value} format={smart} />}
          </p>
        </motion.div>
      ))}
    </section>
  );
}