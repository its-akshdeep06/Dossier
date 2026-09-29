export function compareProfiles(profileA, reposA, profileB, reposB) {
  // 1. Community: Followers
  const community = {
    id: "community",
    label: "Community",
    metric: "followers",
    aValue: profileA.followers || 0,
    bValue: profileB.followers || 0,
    winner: getWinner(profileA.followers || 0, profileB.followers || 0)
  };

  // 2. Repository Impact: Total stars
  const starsA = reposA.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  const starsB = reposB.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  const impact = {
    id: "impact",
    label: "Repository Impact",
    metric: "total stars across public repositories",
    aValue: starsA,
    bValue: starsB,
    winner: getWinner(starsA, starsB)
  };

  // 3. Open-source Reach: Total forks
  const forksA = reposA.reduce((sum, r) => sum + (r.forks_count || 0), 0);
  const forksB = reposB.reduce((sum, r) => sum + (r.forks_count || 0), 0);
  const reach = {
    id: "reach",
    label: "Open-source Reach",
    metric: "total forks across public repositories",
    aValue: forksA,
    bValue: forksB,
    winner: getWinner(forksA, forksB)
  };

  // 4. Portfolio Breadth: Formula based on repo count and language diversity
  const langCountA = new Set(reposA.map(r => r.language).filter(Boolean)).size;
  const langCountB = new Set(reposB.map(r => r.language).filter(Boolean)).size;
  
  // Normalized formula: repository count + (language count * 5)
  // This rewards both having repositories and using different languages
  const breadthScoreA = reposA.length + (langCountA * 5);
  const breadthScoreB = reposB.length + (langCountB * 5);
  
  const breadth = {
    id: "breadth",
    label: "Portfolio Breadth",
    metric: "repository count and language diversity",
    aValue: breadthScoreA,
    aDetails: `${reposA.length} repos, ${langCountA} languages`,
    bValue: breadthScoreB,
    bDetails: `${reposB.length} repos, ${langCountB} languages`,
    winner: getWinner(breadthScoreA, breadthScoreB)
  };

  // 5. Original Work: Original vs Forked repositories
  const originalA = reposA.filter(r => !r.fork).length;
  const originalB = reposB.filter(r => !r.fork).length;
  
  const originalRatioA = reposA.length > 0 ? originalA / reposA.length : 0;
  const originalRatioB = reposB.length > 0 ? originalB / reposB.length : 0;
  
  const originalWork = {
    id: "original",
    label: "Original Work",
    metric: "original repositories ratio",
    aValue: originalRatioA,
    aDetails: `${originalA} original / ${reposA.length} total`,
    bValue: originalRatioB,
    bDetails: `${originalB} original / ${reposB.length} total`,
    winner: getWinner(originalRatioA, originalRatioB),
    isPercentage: true
  };

  // 6. Repository Recency: Proportion of repos updated in the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const recentA = reposA.filter(r => new Date(r.updated_at) > sixMonthsAgo).length;
  const recentB = reposB.filter(r => new Date(r.updated_at) > sixMonthsAgo).length;
  
  const recentRatioA = reposA.length > 0 ? recentA / reposA.length : 0;
  const recentRatioB = reposB.length > 0 ? recentB / reposB.length : 0;
  
  const recency = {
    id: "recency",
    label: "Repository Recency",
    metric: "repositories updated in last 6 months",
    aValue: recentRatioA,
    aDetails: `${recentA} recently updated`,
    bValue: recentRatioB,
    bDetails: `${recentB} recently updated`,
    winner: getWinner(recentRatioA, recentRatioB),
    isPercentage: true
  };

  const categories = [community, impact, reach, breadth, originalWork, recency];

  let scoreA = 0;
  let scoreB = 0;

  categories.forEach(c => {
    if (c.winner === 'a') scoreA++;
    if (c.winner === 'b') scoreB++;
  });

  let result = getWinner(scoreA, scoreB);
  let tieBreaker = null;

  if (result === 'tie') {
    tieBreaker = resolveTie(
      { stars: starsA, forks: forksA, originalRatio: originalRatioA, recentRatio: recentRatioA, langCount: langCountA },
      { stars: starsB, forks: forksB, originalRatio: originalRatioB, recentRatio: recentRatioB, langCount: langCountB }
    );
    if (tieBreaker) {
      result = tieBreaker.winner;
    }
  }

  return {
    profiles: { a: profileA, b: profileB },
    categories,
    score: { a: scoreA, b: scoreB },
    result,
    tieBreaker
  };
}

function getWinner(a, b) {
  if (a > b) return 'a';
  if (b > a) return 'b';
  return 'tie';
}

function resolveTie(aMetrics, bMetrics) {
  if (aMetrics.stars !== bMetrics.stars) {
    return { metric: 'Total stars', winner: getWinner(aMetrics.stars, bMetrics.stars) };
  }
  if (aMetrics.forks !== bMetrics.forks) {
    return { metric: 'Total forks', winner: getWinner(aMetrics.forks, bMetrics.forks) };
  }
  if (aMetrics.originalRatio !== bMetrics.originalRatio) {
    return { metric: 'Original-work ratio', winner: getWinner(aMetrics.originalRatio, bMetrics.originalRatio) };
  }
  if (aMetrics.recentRatio !== bMetrics.recentRatio) {
    return { metric: 'Repository recency', winner: getWinner(aMetrics.recentRatio, bMetrics.recentRatio) };
  }
  if (aMetrics.langCount !== bMetrics.langCount) {
    return { metric: 'Language diversity', winner: getWinner(aMetrics.langCount, bMetrics.langCount) };
  }
  return null; // Absolute tie
}
