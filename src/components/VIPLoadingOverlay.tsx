import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

interface VIPLoadingOverlayProps {
  isVisible: boolean;
}

export function VIPLoadingOverlay({ isVisible }: VIPLoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-nivo-bg flex flex-col items-center justify-center"
    >
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-orb-float" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-[120px] animate-orb-float" style={{ animationDelay: '-10s' }} />
      </div>

      {/* Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 flex items-center justify-center">
          <Cpu className="w-10 h-10 text-primary" strokeWidth={1.5} />
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="font-mono text-sm text-primary uppercase tracking-widest mb-2">
            SYSTÈME EN SYNCHRONISATION
          </p>
          <p className="font-mono text-xs text-foreground/40">
            Chargement des modules premium...
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-orange-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
