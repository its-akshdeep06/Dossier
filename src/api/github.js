// Thin, typed-by-convention client for GitHub's public REST API.
// All data lives in memory only — refreshing the page clears it.

const API = 'https://api.github.com';

const cache = {
  users: new Map(),
  repos: new Map(),
  languages: new Map(),
};
const inflight = new Map();
const repoListeners = new Map();

/** Normalized error: type is 'not_found' | 'rate_limit' | 'network' | 'api' */
export class GitHubError extends Error {
  constructor(type, message, extra = {}) {
    super(message);
    this.type = type;
    Object.assign(this, extra);
  }
}

async function request(path) {
  let res;
  const headers = { Accept: 'application/vnd.github+json' };
  const token = import.meta.env?.VITE_GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    res = await fetch(API + path, { headers });
  } catch {
    throw new GitHubError('network', 'GitHub could not be reached.');
  }
  if (res.ok) return res.json();

  const remaining = res.headers.get('x-ratelimit-remaining');
  const reset = Number(res.headers.get('x-ratelimit-reset'));
  const resetAt = reset ? new Date(reset * 1000) : null;
  if (res.status === 429 || (res.status === 403 && remaining === '0')) {
    throw new GitHubError('rate_limit', 'GitHub API rate limit reached.', { status: res.status, resetAt });
  }
  if (res.status === 404) throw new GitHubError('not_found', 'Not found.', { status: 404 });

  let message = '';
  try { message = (await res.json()).message; } catch { /* body not JSON */ }
  throw new GitHubError('api', message || `GitHub responded with ${res.status}.`, { status: res.status });
}

function dedupe(flightKey, store, key, loader) {
  if (store.has(key)) return Promise.resolve(store.get(key));
  if (!inflight.has(flightKey)) {
    const p = loader()
      .then((value) => { store.set(key, value); return value; })
      .finally(() => inflight.delete(flightKey));
    inflight.set(flightKey, p);
  }
  return inflight.get(flightKey);
}

const k = (s) => s.toLowerCase();

export const peekUser = (username) => cache.users.get(k(username)) ?? null;
export const peekRepos = (login) => cache.repos.get(k(login)) ?? null;
export const peekLanguages = (owner, repo) => cache.languages.get(k(`${owner}/${repo}`)) ?? null;

/** GET /users/:username */
export function fetchUser(username) {
  return dedupe(`u:${k(username)}`, cache.users, k(username), () =>
    request(`/users/${encodeURIComponent(username)}`));
}

/** GET /users/:username/repos — every page, 100 at a time. */
export function fetchAllRepos(login, onProgress) {
  const key = k(login);
  if (cache.repos.has(key)) return Promise.resolve(cache.repos.get(key));

  if (!repoListeners.has(key)) repoListeners.set(key, new Set());
  const listeners = repoListeners.get(key);
  if (onProgress) listeners.add(onProgress);

  return dedupe(`r:${key}`, cache.repos, key, async () => {
    const all = [];
    try {
      for (let page = 1; ; page++) {
        const batch = await request(
          `/users/${encodeURIComponent(login)}/repos?per_page=100&page=${page}&type=owner&sort=updated`);
        all.push(...batch);
        listeners.forEach((fn) => fn({ page, count: all.length }));
        if (batch.length < 100) break;
      }
      return all;
    } finally {
      repoListeners.delete(key);
    }
  });
}

/** GET /repos/:owner/:repo/languages — only called on demand. */
export function fetchLanguages(owner, repo) {
  const key = k(`${owner}/${repo}`);
  return dedupe(`l:${key}`, cache.languages, key, () =>
    request(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`));
}