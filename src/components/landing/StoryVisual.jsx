import { motion, AnimatePresence } from 'framer-motion';
import { IdentityV, HighlightsV } from '@/components/landing/visuals/ProfileVisuals';
import { ExplorerV, DetailsV, LanguagesV } from '@/components/landing/visuals/RepoVisuals';

const VISUALS = [
  ['Identity', IdentityV],
  ['Highlights', HighlightsV],
  ['Repository explorer', ExplorerV],
  ['Repository details', DetailsV],
  ['Language analysis', LanguagesV],
];

export default function StoryVisual({ index }) {
  const [label, Visual] = VISUALS[index];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        className="absolute inset-0 flex flex-col"
        initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -40, filter: 'blur(8px)' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex justify-between border-b border-ink/15 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-dust">
          <span>Fig. 0{index + 1} — {label}</span>
          <span>Illustration</span>
        </div>
        <div className="relative grid flex-1 place-items-center overflow-hidden p-5 md:p-10">
          <Visual />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}