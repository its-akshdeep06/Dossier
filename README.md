# Dossier

Dossier is a client-side, read-only explorer for public GitHub profiles. Enter a GitHub username (or a full GitHub profile URL) to view the public account, repositories, repository statistics, and language information in a single report.

It does not require a Dossier account, GitHub login, backend service, database, or API key.

## What it shows

### Profile report

For a public GitHub account, Dossier displays the information GitHub makes available through its public REST API:

- Avatar, display name, username, bio, location, company, website, and account creation date.
- Followers, following, public repository count, and other account metadata.
- A visual summary of the account's primary languages.
- Animated loading stages while the profile and repository list are being collected.

### Repository findings

Once the repository list is available, Dossier calculates useful totals in the browser:

- Total stars and forks across repositories.
- Original, forked, and archived repository counts.
- The most-starred repository and most recently updated repository.
- The number and share of repositories whose primary language is each detected language.

These are calculations based on the returned GitHub data; Dossier does not infer or invent profile information.

### Repository explorer

The repository section supports practical browsing without extra requests:

- Search repositories by name.
- Filter by primary language, including filters selected from the language chart.
- Sort by stars or last-updated date in either direction.
- Load more matching repositories incrementally.
- Expand one repository at a time to inspect its description, topics, license, issues, default branch, size, dates, stars, forks, and links.

Language byte counts are fetched only when a repository is opened. Dossier turns GitHub's `{ language: bytes }` response into a proportional bar and percentage breakdown, so it avoids fetching this detail for repositories the visitor never inspects.

### Dossier Duel

Compare two public GitHub profiles in a head-to-head report. Start from the landing page, or use the Duel link on a profile to prefill that account as the first player. The comparison scores six dimensions from public profile and repository data:

- Community: follower count.
- Repository impact: total stars across public repositories.
- Open-source reach: total forks across public repositories.
- Portfolio breadth: repository count combined with primary-language diversity.
- Original work: the share of repositories that are not forks.
- Repository recency: the share of repositories updated within the last six months.

Each category awards a point to the higher value. If category points are tied, Dossier checks total stars, total forks, original-work ratio, repository recency, and language diversity in that order; if all remain equal, the result is a tie. These are Dossier's comparison heuristics, not an overall measure of developer skill. Results include category-by-category values and a winner summary. Comparing the same account against itself produces a mirror match.

The landing-page call to action and navigation both link to Duel. A live clock appears in the navigation, and fine-pointer devices get an animated Octocat cursor with click ripples.

### Friendly failure states

The app validates usernames before making a request and gives specific guidance for invalid usernames, missing profiles, network failures, GitHub API errors, and unauthenticated rate limits. Retry controls are available for recoverable failures.

## How data is handled

All requests go directly from the browser to the GitHub REST API:

1. `GET /users/:username` retrieves the profile.
2. `GET /users/:username/repos` retrieves every page of public owned repositories, 100 at a time.
3. `GET /repos/:owner/:repo/languages` runs only when the visitor opens a repository's language section.

Responses are cached in memory for the current page session to avoid duplicate requests and to share in-flight requests. Refreshing or closing the page clears that cache. No account data, search history, or GitHub response is persisted by Dossier.

GitHub's unauthenticated API quota is typically 60 requests per hour per network/IP address. Large profiles can use several requests because the complete repository list is paginated, and opening repositories for language details adds one request per repository.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page and username search |
| `/profile/:username` | Profile report for a GitHub username |
| `/duel` | Enter two GitHub usernames to compare |
| `/duel/:usernameA` | Duel setup with the first username prefilled |
| `/duel/:usernameA/:usernameB` | Head-to-head comparison results |
| Any unmatched path | Not-found page |

## Technology

- React 18 and Vite
- React Router for client-side routes
- Framer Motion for motion with reduced-motion support
- Tailwind CSS for styling
- `canvas-confetti` for the reduced-motion-aware Duel winner celebration
- GitHub REST API for public data

The project intentionally keeps its runtime dependency set small and connects only to GitHub's public API for application data.

## Project layout

```text
src/
  api/github.js          GitHub requests, memory cache, and API error handling
  hooks/                 Profile and per-repository language data hooks
  lib/                   Validation, formatting, profile analysis, Duel scoring, colors, and error copy
  components/landing/    Landing-page sections and illustrative visuals
  components/profile/    Profile report, findings, repository explorer, and detail view
  components/shared/     Reusable navigation, search, motion, and visual components
  pages/                 Landing, profile, Duel setup/results, and not-found routes
public/                  Static assets, including the Octocat cursor image
```

## Development

Requirements: Node.js and npm.

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
```

Run the quality checks:

```bash
npm run lint
npm run typecheck
```

Preview a production build locally:

```bash
npm run preview
```

## Notes for contributors

- Keep GitHub calls in `src/api/github.js` so caching, request de-duplication, and error handling remain consistent.
- Keep derived metrics in `src/lib/analyze.js`; UI components should receive prepared values where practical.
- Do not add persistent storage or authentication without documenting the resulting privacy change.
- Build output lives in `dist/` and is intentionally ignored because it is generated by `npm run build`.
