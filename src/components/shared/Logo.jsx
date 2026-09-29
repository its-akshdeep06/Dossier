import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" aria-label="Dossier — back to search" className="group inline-flex items-baseline gap-1.5 text-ink">
      <span className="font-display text-3xl leading-none sm:text-4xl md:text-5xl">dossier</span>
      <span className="inline-block h-3 w-3 rounded-full bg-current transition-transform duration-500 group-hover:scale-150" />
    </Link>
  );
}