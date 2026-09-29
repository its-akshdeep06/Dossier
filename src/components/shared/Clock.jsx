import { useState, useEffect } from 'react';

export default function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <div
      className="shrink-0 font-mono text-[11px] tracking-[0.18em] text-white mix-blend-difference"
      aria-live="off"
      aria-label={`Current time: ${time}`}
    >
      {time}
    </div>
  );
}
