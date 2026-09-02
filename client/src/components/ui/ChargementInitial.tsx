import { motion } from 'framer-motion';

export function ChargementInitial() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-beton dark:bg-bitume">
      <motion.span
        initial={{ scale: 0.8, opacity: 0.6 }}
        animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-10 h-10 bg-marquage-voirie"
        style={{ borderRadius: '62% 38% 55% 45% / 48% 52% 48% 52%' }}
      />
    </div>
  );
}