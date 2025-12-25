import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Crown, Zap, Shield, Headphones, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Price ID for NIVO PRO subscription (9.90€/month)
const NIVO_PRO_PRICE_ID = 'price_NIVO_PRO_MONTHLY'; // Placeholder - replace with actual Stripe price ID

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const features = [
    { icon: Headphones, text: 'Protocoles ciblés (Sciatique, Cou Texto...)' },
    { icon: Zap, text: 'Programmes pilotes de 6+ semaines' },
    { icon: Shield, text: 'Algorithme personnalisé NIVO' },
  ];

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { programId: 'NIVO_PRO' }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la session de paiement. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#0a0a12] border border-white/10 p-0 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-40 bg-primary/20 rounded-full blur-3xl" />
        </div>

        <div className="relative p-6 md:p-8">
          <DialogHeader className="text-center mb-6">
            {/* Pro Badge */}
            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Crown className="h-8 w-8 text-primary" />
            </div>
            
            <DialogTitle className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              Passez à NIVO PRO
            </DialogTitle>
            
            <DialogDescription className="font-mono text-sm text-foreground/50 mt-2">
              Débloquez l'intégralité de votre potentiel physique
            </DialogDescription>
          </DialogHeader>

          {/* Price */}
          <div className="text-center mb-6">
            <span className="font-heading text-4xl font-bold text-foreground">9.90€</span>
            <span className="font-mono text-sm text-foreground/40">/mois</span>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="font-mono text-xs text-foreground/70">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <Button 
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-[0_0_30px_rgba(255,107,74,0.4)] hover:shadow-[0_0_50px_rgba(255,107,74,0.6)] transition-all duration-300 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Chargement...
              </>
            ) : (
              <>
                <Crown className="h-5 w-5 mr-2" />
                DEVENIR PRO
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>

          {/* Cancel hint */}
          <p className="text-center font-mono text-[10px] text-foreground/30 mt-4">
            Annulable à tout moment • Paiement sécurisé Stripe
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
