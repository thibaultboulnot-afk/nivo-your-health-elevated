import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, Loader2, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { safeStripeRedirect } from '@/lib/url-validator';

interface StreakFreezeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStreak: number;
}

export function StreakFreezeModal({ isOpen, onClose, currentStreak }: StreakFreezeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      // Call dedicated streak freeze edge function
      const { data, error } = await supabase.functions.invoke('purchase-streak-freeze');

      if (error) throw new Error(error.message);

      if (data?.url) {
        if (!safeStripeRedirect(data.url)) {
          throw new Error('URL de paiement invalide');
        }
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la session de paiement.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-950/90 backdrop-blur-2xl border border-red-500/20 p-0 overflow-hidden shadow-[0_8px_32px_0_rgba(239,68,68,0.2)]">
        {/* Warning glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-red-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative p-8">
          <DialogHeader className="text-center mb-6">
            {/* Broken streak animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mx-auto mb-4 relative"
            >
              <div className="w-20 h-20 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <Shield className="w-10 h-10 text-red-400" strokeWidth={1.5} />
              </div>
              <motion.div
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-4 h-4 text-black" strokeWidth={2} />
              </motion.div>
            </motion.div>

            <DialogTitle className="font-heading text-2xl font-bold text-red-400">
              SÉRIE BRISÉE
            </DialogTitle>
            
            <p className="font-mono text-sm text-foreground/50 mt-2">
              Intégrité temporelle compromise
            </p>
          </DialogHeader>

          {/* Streak info */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-foreground/40" strokeWidth={1.5} />
              <span className="font-mono text-xs text-foreground/40">SÉQUENCE PERDUE</span>
            </div>
            <span className="font-mono text-3xl font-bold text-amber-400">{currentStreak}</span>
            <span className="font-mono text-sm text-foreground/40 ml-1">jours</span>
          </div>

          {/* Message */}
          <p className="text-center text-foreground/60 text-sm mb-6">
            Injectez <span className="text-primary font-bold">2,99€</span> pour restaurer l'intégrité temporelle de votre série.
          </p>

          {/* Purchase button */}
          <Button
            onClick={handlePurchase}
            disabled={isLoading}
            className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold shadow-[0_0_30px_rgba(245,158,11,0.4)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Chargement...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 mr-2" strokeWidth={1.5} />
                MODULE DE RÉPARATION — 2,99€
              </>
            )}
          </Button>

          <p className="text-center font-mono text-[10px] text-foreground/30 mt-4">
            Paiement unique • Effet immédiat
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
