import { Link } from 'react-router-dom';
import { Swords } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import Clock from '@/components/shared/Clock';

export default function LandingNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-ink/10 bg-paper px-5 py-5 text-ink md:px-10">
      <Logo />
      <div className="flex items-center gap-4">
        <Clock />
        <Link to="/duel" className="flex items-center gap-2 rounded-full border border-ink/20 px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-black transition-colors hover:border-black hover:bg-black hover:text-white">
          <Swords className="h-3 w-3" /> Duel
        </Link>
      </div>
    </header>
  );
}