import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Lock, CheckCircle, Sparkles, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ApexForgeProps {
  isOpen: boolean;
  onClose: () => void;
  victoryTokens: number;
  currentApexTier: number;
  onForge: (newTier: number) => Promise<void>;
}

const APEX_TIERS = [
  {
    tier: 1,
    name: 'APEX ACIER',
    description: 'Structure renforcée basique',
    tokensRequired: 1,
    color: 'from-gray-400 to-gray-600',
    glowColor: 'shadow-gray-400/30',
    borderColor: 'border-gray-400/50',
  },
  {
    tier: 2,
    name: 'APEX OR',
    description: 'Alliage noble à haute conductivité',
    tokensRequired: 5,
    color: 'from-yellow-400 to-amber-600',
    glowColor: 'shadow-yellow-500/40',
    borderColor: 'border-yellow-400/50',
  },
  {
    tier: 3,
    name: 'APEX NÉON',
    description: 'Matrice bio-luminescente ultime',
    tokensRequired: 20,
    color: 'from-emerald-400 via-cyan-400 to-purple-500',
    glowColor: 'shadow-emerald-500/50',
    borderColor: 'border-emerald-400/50',
  },
];

export function ApexForge({ isOpen, onClose, victoryTokens, currentApexTier, onForge }: ApexForgeProps) {
  const [isForging, setIsForging] = useState(false);
  const [forgedTier, setForgedTier] = useState<number | null>(null);

  const handleForge = async (tier: number) => {
    setIsForging(true);
    setForgedTier(tier);
    
    // Forging animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await onForge(tier);
    
    setIsForging(false);
    setForgedTier(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-black/95 border border-emerald-500/30 backdrop-blur-xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-3 text-emerald-400 font-heading text-xl">
            <Zap className="w-6 h-6" />
            FORGE APEX
          </DialogTitle>
        </DialogHeader>

        {/* Victory Tokens Display */}
        <div className="text-center py-4 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-lg font-bold text-emerald-400">{victoryTokens}</span>
            <span className="font-mono text-xs text-foreground/50">Jetons Apex</span>
          </div>
        </div>

        {/* Forging Animation Overlay */}
        <AnimatePresence>
          {isForging && forgedTier && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
            >
              <div className="text-center space-y-6">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${APEX_TIERS[forgedTier - 1].color} flex items-center justify-center`}
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="font-mono text-emerald-400"
                >
                  FORGE EN COURS...
                </motion.div>
                <div className="w-48 h-2 mx-auto bg-black/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2 }}
                    className={`h-full bg-gradient-to-r ${APEX_TIERS[forgedTier - 1].color}`}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tiers Grid */}
        <div className="py-4 space-y-4">
          {APEX_TIERS.map((apex) => {
            const isUnlocked = currentApexTier >= apex.tier;
            const canForge = victoryTokens >= apex.tokensRequired && currentApexTier < apex.tier;
            const isNextTier = currentApexTier === apex.tier - 1;
            const progress = isNextTier 
              ? Math.min((victoryTokens / apex.tokensRequired) * 100, 100) 
              : currentApexTier >= apex.tier ? 100 : 0;

            return (
              <motion.div
                key={apex.tier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: apex.tier * 0.1 }}
                className={`
                  relative rounded-xl p-4 border transition-all
                  ${isUnlocked 
                    ? `${apex.borderColor} bg-gradient-to-r ${apex.color} bg-opacity-10` 
                    : 'border-white/10 bg-black/30'
                  }
                  ${canForge ? 'ring-2 ring-emerald-500/50 animate-pulse' : ''}
                `}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`
                    w-14 h-14 rounded-lg flex items-center justify-center
                    ${isUnlocked 
                      ? `bg-gradient-to-br ${apex.color} ${apex.glowColor} shadow-lg` 
                      : 'bg-black/50 border border-white/10'
                    }
                  `}>
                    {isUnlocked ? (
                      <CheckCircle className="w-7 h-7 text-white" />
                    ) : (
                      <Lock className="w-6 h-6 text-foreground/30" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className={`font-heading font-bold ${isUnlocked ? 'text-white' : 'text-foreground/60'}`}>
                      {apex.name}
                    </div>
                    <div className="font-mono text-xs text-foreground/50 truncate">
                      {apex.description}
                    </div>
                    
                    {/* Progress bar for next tier */}
                    {isNextTier && !isUnlocked && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-[10px] font-mono text-foreground/40 mb-1">
                          <span>{victoryTokens}/{apex.tokensRequired} Jetons</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${apex.color} transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex-shrink-0">
                    {isUnlocked ? (
                      <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs">
                        FORGÉ
                      </div>
                    ) : canForge ? (
                      <Button
                        size="sm"
                        onClick={() => handleForge(apex.tier)}
                        disabled={isForging}
                        className={`bg-gradient-to-r ${apex.color} text-white font-heading shadow-lg ${apex.glowColor}`}
                      >
                        <ChevronUp className="w-4 h-4 mr-1" />
                        FORGER
                      </Button>
                    ) : (
                      <div className="text-right">
                        <div className="font-mono text-xs text-foreground/40">
                          {apex.tokensRequired} <Zap className="w-3 h-3 inline" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info */}
        <div className="text-center font-mono text-[10px] text-foreground/30 pt-2 border-t border-white/10">
          Gagnez des Jetons Apex en finissant dans le Top 100 hebdomadaire
        </div>
      </DialogContent>
    </Dialog>
  );
}
