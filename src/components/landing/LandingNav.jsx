import { Link } from 'react-router-dom';
import { Swords } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import Clock from '@/components/shared/Clock';

export default function LandingNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-5 text-white mix-blend-difference md:px-10">
      <Logo />
      <div className="flex items-center gap-4">
        <Clock />
        <Link to="/duel" className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors hover:border-white hover:bg-white hover:text-black">
          <Swords className="h-3 w-3" /> Duel
        </Link>
      </div>
    </header>
  );
}