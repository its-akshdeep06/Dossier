import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/shared/PageTransition';
import AnalyzingScreen from '@/components/profile/AnalyzingScreen';
import ErrorState from '@/components/profile/ErrorState';
import ProfileNav from '@/components/profile/ProfileNav';
import Portrait from '@/components/profile/Portrait';
import Identity from '@/components/profile/Identity';
import StatsStrip from '@/components/profile/StatsStrip';
import Insights from '@/components/profile/Insights';
import RepoExplorer from '@/components/profile/RepoExplorer';
import { useGithubProfile } from '@/hooks/useGithubProfile';
import { analyzeRepos } from '@/lib/analyze';

export default function ProfileView({ username }) {
  const p = useGithubProfile(username);
  const ready = !!p.user && (!!p.repos || !!p.reposError);
  const [revealed, setRevealed] = useState(ready);
  const reveal = useCallback(() => setRevealed(true), []);
  const analysis = useMemo(() => (p.repos ? analyzeRepos(p.repos) : null), [p.repos]);

  const [filters, setFilters] = useState({ query: '', language: 'all', sort: 'stars-desc' });
  const [expanded, setExpanded] = useState(null);
  const explorerRef = useRef(null);
  const toExplorer = () => explorerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const focusRepo = useCallback((repo) => {
    setFilters((f) => ({ ...f, query: repo.name, language: 'all' }));
    setExpanded(repo.id);
    toExplorer();
  }, []);
  const pickLanguage = useCallback((language) => {
    setFilters((f) => ({ ...f, query: '', language }));
    toExplorer();
  }, []);

  useEffect(() => {
    if (p.user) document.title = `${p.user.name || p.user.login} (@${p.user.login}) — Dossier`;
  }, [p.user]);

  if (p.userError) {
    return <PageTransition><ErrorState error={p.userError} username={username} onRetry={p.retryUser} /></PageTransition>;
  }

  return (
    <PageTransition>
      <AnimatePresence>
        {!revealed && <AnalyzingScreen key="loader" username={username} user={p.user} repos={p.repos} reposError={p.reposError} progress={p.progress} onComplete={reveal} />}
      </AnimatePresence>
      {revealed && (
        <>
          <ProfileNav user={p.user} />
          <main className="overflow-x-clip px-5 pb-28 pt-24 md:px-10">
            <section aria-label="Identity" className="grid items-center gap-12 lg:min-h-[calc(100svh-7rem)] lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5"><Portrait user={p.user} analysis={analysis} /></div>
              <div className="lg:col-span-7"><Identity user={p.user} /></div>
            </section>
            <StatsStrip user={p.user} analysis={analysis} />
            {analysis && <Insights user={p.user} analysis={analysis} onFocusRepo={focusRepo} onPickLanguage={pickLanguage} />}
            <RepoExplorer
              sectionRef={explorerRef} user={p.user} repos={p.repos} reposError={p.reposError} onRetry={p.retryRepos}
              analysis={analysis} filters={filters} setFilters={setFilters} expanded={expanded} setExpanded={setExpanded}
            />
          </main>
        </>
      )}
    </PageTransition>
  );
}