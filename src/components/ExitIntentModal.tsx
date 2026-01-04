import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Percent, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExitIntentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptDownsell: () => void;
}

export function ExitIntentModal({ isOpen, onClose, onAcceptDownsell }: ExitIntentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-950/95 backdrop-blur-2xl border border-amber-500/20 p-0 overflow-hidden shadow-[0_8px_32px_0_rgba(245,158,11,0.2)]">
        {/* Warning glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative p-8 text-center">
          {/* Alert icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center"
          >
            <AlertTriangle className="w-8 h-8 text-amber-400" strokeWidth={1.5} />
          </motion.div>

          {/* Title */}
          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
            ATTENDEZ PILOTE
          </h2>
          
          <p className="font-mono text-xs text-amber-400 uppercase tracking-widest mb-4">
            Offre de dernière chance
          </p>

          {/* Message */}
          <p className="text-foreground/60 leading-relaxed mb-6">
            Le Lifetime est trop lourd pour le moment ?<br/>
            Prenez le <span className="text-primary font-bold">Mensuel</span> avec{' '}
            <span className="text-amber-400 font-bold">-50%</span> le premier mois.
          </p>

          {/* Discount badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full mb-6"
          >
            <Percent className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
            <span className="font-mono text-sm font-bold text-amber-400">4,95€ le 1er mois</span>
            <span className="font-mono text-xs text-foreground/40 line-through">9,90€</span>
          </motion.div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button
              onClick={onAcceptDownsell}
              className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold shadow-[0_0_30px_rgba(245,158,11,0.4)]"
            >
              ACCEPTER L'OFFRE
              <ArrowRight className="w-5 h-5 ml-2" strokeWidth={1.5} />
            </Button>

            <button
              onClick={onClose}
              className="w-full py-3 font-mono text-xs text-foreground/40 hover:text-foreground/60 transition-colors"
            >
              Non merci, je préfère partir
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
