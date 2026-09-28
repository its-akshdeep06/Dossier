// GitHub-linguist colors for common languages; stable hashed hue for the rest.
const COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', Java: '#b07219',
  'C++': '#f34b7d', C: '#555555', 'C#': '#178600', Go: '#00ADD8', Rust: '#dea584',
  Ruby: '#701516', PHP: '#4F5D95', Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB',
  HTML: '#e34c26', CSS: '#563d7c', SCSS: '#c6538c', Shell: '#89e051', Vue: '#41b883',
  Svelte: '#ff3e00', 'Jupyter Notebook': '#DA5B0B', Lua: '#000080', Haskell: '#5e5086',
  Elixir: '#6e4a7e', Scala: '#c22d40', 'Objective-C': '#438eff', R: '#198CE7',
  Perl: '#0298c3', Makefile: '#427819', Dockerfile: '#384d54', Nix: '#7e7eff',
  Zig: '#ec915c', Clojure: '#db5855', OCaml: '#3be133', Assembly: '#6E4C13',
  'Vim Script': '#199f4b', TeX: '#3D6117', MDX: '#fcb32c', Astro: '#ff5a03',
  PowerShell: '#012456', Julia: '#a270ba', Erlang: '#B83998', Groovy: '#4298b8',
};

export function languageColor(name) {
  if (!name) return '#8A857A';
  if (COLORS[name]) return COLORS[name];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  return `hsl(${h} 45% 50%)`;
}