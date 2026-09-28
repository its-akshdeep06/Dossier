import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimationControls } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Magnetic from '@/components/shared/Magnetic';
import { validateUsername } from '@/lib/validate';

const EXAMPLES = ['torvalds', 'octocat', 'gaearon', 'sindresorhus'];

export default function SearchForm({ id = 'search', size = 'lg' }) {
  const navigate = useNavigate();
  const controls = useAnimationControls();
  const [value, setValue] = useState('');
  const [error, setError] = useState(null);
  const lg = size === 'lg';

  const go = (raw) => {
    const result = validateUsername(raw);
    if (result.error) {
      setError(result.error);
      controls.start({ x: [0, -12, 9, -6, 3, 0], transition: { duration: 0.45 } });
      return;
    }
    setError(null);
    navigate(`/profile/${result.value}`);
  };

  return (
    <form role="search" noValidate onSubmit={(e) => { e.preventDefault(); go(value); }} className="w-full">
      <motion.div animate={controls} className={`flex items-end gap-3 border-b-2 pb-2 transition-colors duration-300 ${error ? 'border-signal' : 'border-ink focus-within:border-signal'}`}>
        <label htmlFor={id} className="sr-only">GitHub username</label>
        <span aria-hidden className={`hidden shrink-0 font-mono text-dust sm:inline ${lg ? 'pb-3 text-sm' : 'pb-2 text-xs'}`}>github.com/</span>
        <input
          id={id}
          value={value}
          onChange={(e) => { setValue(e.target.value); if (error) setError(null); }}
          placeholder="username"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          aria-invalid={!!error}
          aria-describedby={`${id}-error`}
          className={`min-w-0 flex-1 bg-transparent font-display leading-none outline-none placeholder:text-ink/20 ${lg ? 'text-5xl md:text-6xl' : 'text-4xl'}`}
        />
        <Magnetic>
          <button type="submit" aria-label="Analyze profile" className={`group grid place-items-center rounded-full bg-ink text-paper transition-colors duration-300 hover:bg-signal ${lg ? 'h-14 w-14' : 'h-11 w-11'}`}>
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </Magnetic>
      </motion.div>
      <p id={`${id}-error`} role="alert" className="min-h-[1.75rem] pt-2 font-mono text-xs text-signal">{error}</p>
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <span className="mr-1 text-dust">try</span>
        {EXAMPLES.map((n) => (
          <button key={n} type="button" onClick={() => { setValue(n); go(n); }} className="rounded-full border border-ink/20 px-3 py-1.5 transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-paper">
            {n}
          </button>
        ))}
      </div>
    </form>
  );
}