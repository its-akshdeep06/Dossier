import { motion } from 'framer-motion';

const ease = [0.76, 0, 0.24, 1];

export default function PageTransition({ children }) {
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }}>
        {children}
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] bg-ink"
        initial={{ scaleY: 1, originY: 0 }}
        animate={{ scaleY: 0, originY: 0, transition: { duration: 0.75, ease, delay: 0.05 } }}
        exit={{ scaleY: 1, originY: 1, transition: { duration: 0.5, ease } }}
      />
    </>
  );
}