import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import Logo from '@/components/shared/Logo';
import RevealText from '@/components/shared/RevealText';

export default function NotFound() {
  return (
    <PageTransition>
      <header className="fixed left-5 top-5 z-40 md:left-10"><Logo /></header>
      <main className="flex min-h-[100svh] flex-col justify-center px-5 md:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Error 404 — page not on file</p>
        <h1 className="mt-4 font-display text-[26vw] leading-[0.85] md:text-[16vw]">
          <RevealText text="Misfiled." />
        </h1>
        <p className="mt-6 max-w-md text-lg text-ink/70">
          This address isn't part of Dossier. Profiles live at <span className="font-mono text-base">/profile/username</span>.
        </p>
        <Link to="/" className="group mt-10 inline-flex w-fit items-center gap-3 rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-paper transition-colors hover:bg-signal">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to search
        </Link>
      </main>
    </PageTransition>
  );
}