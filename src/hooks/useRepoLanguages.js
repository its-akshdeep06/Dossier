import { useEffect, useState, useCallback } from 'react';
import { fetchLanguages, peekLanguages } from '@/api/github';

export function useRepoLanguages(owner, repo) {
  const [data, setData] = useState(() => peekLanguages(owner, repo));
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setError(null);
    fetchLanguages(owner, repo).then(
      (d) => active && setData(d),
      (e) => active && setError(e),
    );
    return () => { active = false; };
  }, [owner, repo, attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);
  return { data, error, loading: !data && !error, retry };
}