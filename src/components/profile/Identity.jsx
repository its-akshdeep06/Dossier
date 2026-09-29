import { motion } from 'framer-motion';
import { MapPin, Building2, Link2, CalendarDays, AtSign, ArrowUpRight, Swords } from 'lucide-react';
import { Link } from 'react-router-dom';
import RevealText from '@/components/shared/RevealText';
import { date, href, stripProtocol } from '@/lib/format';

const ease = [0.16, 1, 0.3, 1];
const list = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.8 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } };

export default function Identity({ user }) {
  const fields = [
    user.location && { icon: MapPin, label: 'Location', value: user.location },
    user.company && { icon: Building2, label: 'Company', value: user.company },
    user.blog && { icon: Link2, label: 'Website', value: stripProtocol(user.blog), link: href(user.blog) },
    user.twitter_username && { icon: AtSign, label: 'X / Twitter', value: `@${user.twitter_username}`, link: `https://x.com/${user.twitter_username}` },
    { icon: CalendarDays, label: 'Joined GitHub', value: date(user.created_at) },
    { icon: ArrowUpRight, label: 'Profile', value: `github.com/${user.login}`, link: user.html_url },
  ].filter(Boolean);

  return (
    <div className="min-w-0">
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="font-mono text-[11px] uppercase tracking-[0.22em] text-dust">
        File — {user.type === 'Organization' ? 'Organization' : 'Developer'} · Nº {user.id}
      </motion.p>
      <h1 className="mt-4 break-words font-display text-[15vw] leading-[0.88] tracking-tight sm:text-7xl lg:text-8xl xl:text-9xl">
        <RevealText text={user.name || user.login} delay={0.2} />
      </h1>
      {user.name && (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="mt-3 flex items-center gap-4">
          <a href={user.html_url} target="_blank" rel="noreferrer" className="font-mono text-sm text-signal hover:underline">
            @{user.login}
          </a>
          <Link to={`/duel/${user.login}`} className="flex items-center gap-1.5 rounded-full border border-ink/20 px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors hover:border-signal hover:bg-signal hover:text-paper">
            <Swords className="h-3 w-3" /> Duel
          </Link>
        </motion.div>
      )}
      {!user.name && (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="mt-3">
          <Link to={`/duel/${user.login}`} className="flex w-fit items-center gap-1.5 rounded-full border border-ink/20 px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors hover:border-signal hover:bg-signal hover:text-paper">
            <Swords className="h-3 w-3" /> Duel
          </Link>
        </motion.div>
      )}
      {user.bio && (
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7, ease }} className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75 md:text-xl">
          {user.bio}
        </motion.p>
      )}
      <motion.dl variants={list} initial="hidden" animate="show" className="mt-10 grid gap-x-8 gap-y-5 border-t border-ink/15 pt-6 sm:grid-cols-2">
        {fields.map((f) => (
          <motion.div key={f.label} variants={item} className="flex min-w-0 gap-3">
            <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-dust" />
            <div className="min-w-0">
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-dust">{f.label}</dt>
              <dd className="mt-0.5 truncate">
                {f.link
                  ? <a href={f.link} target="_blank" rel="noreferrer" className="underline decoration-ink/20 underline-offset-4 transition-colors hover:text-signal hover:decoration-signal">{f.value}</a>
                  : f.value}
              </dd>
            </div>
          </motion.div>
        ))}
      </motion.dl>
    </div>
  );
}