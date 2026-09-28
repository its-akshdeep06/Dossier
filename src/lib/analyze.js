// Deterministic calculations derived only from GitHub API responses.

export function analyzeRepos(repos) {
  let totalStars = 0, totalForks = 0, forkCount = 0, archived = 0;
  let mostStarred = null, latest = null;
  const langCounts = new Map();

  for (const r of repos) {
    totalStars += r.stargazers_count;
    totalForks += r.forks_count;
    if (r.fork) forkCount++;
    if (r.archived) archived++;
    if (!mostStarred || r.stargazers_count > mostStarred.stargazers_count) mostStarred = r;
    if (!latest || r.updated_at > latest.updated_at) latest = r;
    if (r.language) langCounts.set(r.language, (langCounts.get(r.language) || 0) + 1);
  }

  const withLanguage = [...langCounts.values()].reduce((a, b) => a + b, 0);
  const languages = [...langCounts]
    .map(([name, count]) => ({ name, count, share: count / withLanguage }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return {
    total: repos.length,
    totalStars,
    totalForks,
    forkCount,
    originalCount: repos.length - forkCount,
    archived,
    mostStarred: mostStarred && mostStarred.stargazers_count > 0 ? mostStarred : null,
    latest,
    languages,
    withLanguage,
    noLanguage: repos.length - withLanguage,
  };
}

export const SORTS = [
  { id: 'stars-desc', label: 'Most stars' },
  { id: 'stars-asc', label: 'Fewest stars' },
  { id: 'updated-desc', label: 'Newest updated' },
  { id: 'updated-asc', label: 'Oldest updated' },
];

const byUpdated = (a, b) => (a.updated_at < b.updated_at ? 1 : a.updated_at > b.updated_at ? -1 : 0);
const COMPARATORS = {
  'stars-desc': (a, b) => b.stargazers_count - a.stargazers_count || byUpdated(a, b),
  'stars-asc': (a, b) => a.stargazers_count - b.stargazers_count || byUpdated(a, b),
  'updated-desc': byUpdated,
  'updated-asc': (a, b) => byUpdated(b, a),
};

export function filterAndSort(repos, { query, language, sort }) {
  const q = query.trim().toLowerCase();
  return repos
    .filter((r) => (!q || r.name.toLowerCase().includes(q))
      && (language === 'all' || (r.language ?? 'none') === language))
    .sort(COMPARATORS[sort]);
}

/** Converts GitHub's { Language: bytes } map into sorted percentages. */
export function languagePercentages(data) {
  const entries = Object.entries(data);
  const total = entries.reduce((s, [, b]) => s + b, 0);
  return entries
    .map(([name, bytes]) => ({ name, bytes, percent: total ? (bytes / total) * 100 : 0 }))
    .sort((a, b) => b.bytes - a.bytes);
}