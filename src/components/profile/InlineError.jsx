import { RotateCw, AlertTriangle } from 'lucide-react';
import { shortError } from '@/lib/errors';

export default function InlineError({ error, onRetry, compact = false, title = '' }) {
  return (
    <div role="alert" className={`flex flex-col gap-3 border-l-2 border-signal sm:flex-row sm:items-center sm:justify-between ${compact ? 'py-2 pl-4' : 'bg-signal/5 py-6 pl-6 pr-4'}`}>
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
        <div>
          {title && <p className="font-display text-2xl leading-tight">{title}</p>}
          <p className="text-sm text-ink/70">{shortError(error)}</p>
        </div>
      </div>
      <button type="button" onClick={onRetry} className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-ink px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors hover:bg-ink hover:text-paper sm:self-auto">
        <RotateCw className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" /> Retry
      </button>
    </div>
  );
}