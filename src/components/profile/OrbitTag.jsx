import { motion, useTransform } from 'framer-motion';

export default function OrbitTag({ className, depth, mx, my, delay, children }) {
  const x = useTransform(mx, [-0.5, 0.5], [-depth, depth]);
  const y = useTransform(my, [-0.5, 0.5], [-depth, depth]);
  return (
    <motion.div className={`absolute z-10 ${className}`} style={{ x, y }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay, type: 'spring', stiffness: 300, damping: 20 }}
        className="whitespace-nowrap rounded-full border border-ink bg-paper px-3 py-1.5 font-mono text-[10px] shadow-[3px_3px_0_#141413] md:text-[11px]"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}