import { useEffect, useState, useCallback } from 'react';
import { fetchUser, fetchAllRepos, peekUser, peekRepos } from '@/api/github';

export function useGithubProfile(username) {
  const [user, setUser] = useState(() => peekUser(username));
  const [userError, setUserError] = useState(null);
  const [userAttempt, setUserAttempt] = useState(0);

  const [repos, setRepos] = useState(() => peekRepos(username));
  const [reposError, setReposError] = useState(null);
  const [reposAttempt, setReposAttempt] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let active = true;
    setUserError(null);
    fetchUser(username).then(
      (u) => active && setUser(u),
      (e) => active && setUserError(e),
    );
    return () => { active = false; };
  }, [username, userAttempt]);

  const login = user?.login;
  useEffect(() => {
    if (!login) return;
    let active = true;
    setReposError(null);
    setRepos(peekRepos(login));
    fetchAllRepos(login, (p) => active && setProgress(p.count)).then(
      (r) => active && setRepos(r),
      (e) => active && setReposError(e),
    );
    return () => { active = false; };
  }, [login, reposAttempt]);

  const retryUser = useCallback(() => setUserAttempt((a) => a + 1), []);
  const retryRepos = useCallback(() => setReposAttempt((a) => a + 1), []);

  return { user, userError, retryUser, repos, reposError, retryRepos, progress };
}