import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, XCircle, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ValidationModal({ isOpen, onClose, onConfirm }: ValidationModalProps) {
  const [isValidating, setIsValidating] = useState(false);

  const handleConfirm = () => {
    setIsValidating(true);
    // Quick validation animation
    setTimeout(() => {
      setIsValidating(false);
      onConfirm();
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-black/95 border border-emerald-500/30 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-3 text-emerald-400 font-heading text-xl">
            <Shield className="w-6 h-6" />
            VÉRIFICATION PROTOCOLE
          </DialogTitle>
        </DialogHeader>

        <div className="py-8 text-center">
          <AnimatePresence mode="wait">
            {isValidating ? (
              <motion.div
                key="validating"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto border-2 border-emerald-500/30 border-t-emerald-500 rounded-full"
                />
                <div className="font-mono text-sm text-emerald-400 animate-pulse">
                  VALIDATION EN COURS...
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="question"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Scan className="w-10 h-10 text-emerald-400" />
                </div>
                
                <div className="space-y-2">
                  <p className="font-heading text-lg text-foreground">
                    Mouvements effectués ?
                  </p>
                  <p className="font-mono text-xs text-foreground/50">
                    Confirmez avoir suivi les instructions audio
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!isValidating && (
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              NON
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-heading shadow-lg shadow-emerald-500/25"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              OUI, SYSTÈME CALIBRÉ
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
