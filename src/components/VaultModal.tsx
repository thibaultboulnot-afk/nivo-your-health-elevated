import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lock, Check, Crown, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGamification } from '@/hooks/useGamification';
import { UpgradeModal } from './UpgradeModal';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSkin?: (skinId: string) => void;
  selectedSkin?: string;
}

interface Skin {
  id: string;
  name: string;
  description: string;
  color: string;
  glowColor: string;
  requirement: 'free' | 'level10' | 'pro';
  icon: React.ReactNode;
  hasliquidEffect?: boolean;
}

const SKINS: Skin[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Module de base - Vert néon classique',
    color: 'from-green-500 to-emerald-500',
    glowColor: 'rgba(34, 197, 94, 0.4)',
    requirement: 'free',
    icon: <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-emerald-600" />,
  },
  {
    id: 'xray',
    name: 'X-Ray',
    description: 'Vision radiographique - Déverrouillé Niveau 10',
    color: 'from-blue-400 to-cyan-400',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    requirement: 'level10',
    icon: <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 animate-pulse" />,
  },
  {
    id: 'titanium',
    name: 'Titanium',
    description: 'Alliage premium - Exclusif PRO',
    color: 'from-amber-400 to-yellow-500',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    requirement: 'pro',
    icon: <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600" />,
    hasliquidEffect: true,
  },
];

export function VaultModal({ isOpen, onClose, onSelectSkin, selectedSkin = 'standard' }: VaultModalProps) {
  const { level, unlockedSkins, isPro, subscriptionTier } = useGamification();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const isSkinUnlocked = (skin: Skin): boolean => {
    if (skin.requirement === 'free') return true;
    if (skin.requirement === 'level10') return level >= 10 || unlockedSkins.includes(skin.id);
    if (skin.requirement === 'pro') return isPro;
    return false;
  };

  const getRequirementLabel = (skin: Skin): string => {
    if (skin.requirement === 'free') return 'Débloqué';
    if (skin.requirement === 'level10') return `Niveau 10 requis (actuel: ${level})`;
    if (skin.requirement === 'pro') return 'PRO requis';
    return '';
  };

  const handleSkinClick = (skin: Skin) => {
    if (isSkinUnlocked(skin)) {
      onSelectSkin?.(skin.id);
    } else if (skin.requirement === 'pro') {
      setShowUpgradeModal(true);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg nivo-glass-intense border-white/10 p-0 overflow-hidden">
          {/* Top glow through glass */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-40 bg-emerald-500/10 rounded-full blur-[60px]" />
          </div>

          <div className="relative p-6 md:p-8">
            <DialogHeader className="text-center mb-6">
              <div className="mx-auto mb-4 w-14 h-14 rounded-xl nivo-glass flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-emerald-400" />
              </div>
              
              <DialogTitle className="font-heading text-2xl font-bold text-foreground">
                Le Coffre
              </DialogTitle>
              
              <DialogDescription className="font-mono text-xs text-foreground/50 mt-2">
                Modules optiques pour le scanner de posture
              </DialogDescription>
            </DialogHeader>

            {/* Skins Grid - Vitrine Style */}
            <div className="space-y-3">
              {SKINS.map((skin, index) => {
                const unlocked = isSkinUnlocked(skin);
                const isSelected = selectedSkin === skin.id;

                return (
                  <motion.button
                    key={skin.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSkinClick(skin)}
                    disabled={!unlocked && skin.requirement !== 'pro'}
                    className={`
                      w-full p-4 rounded-xl transition-all duration-300 text-left relative overflow-hidden
                      ${isSelected 
                        ? 'vitrine-glass shadow-[0_0_30px_rgba(74,222,128,0.2)]' 
                        : unlocked 
                          ? 'vitrine-glass' 
                          : 'vitrine-glass opacity-60'
                      }
                      ${isSelected ? 'ring-1 ring-emerald-500/50' : ''}
                    `}
                    style={{
                      borderColor: isSelected ? 'rgba(74, 222, 128, 0.3)' : undefined,
                    }}
                  >
                    {/* Liquid Refraction for Titanium */}
                    {skin.hasliquidEffect && unlocked && (
                      <div className="liquid-refraction absolute inset-0 pointer-events-none" />
                    )}

                    <div className="flex items-center gap-4 relative z-10">
                      {/* Skin Preview */}
                      <div 
                        className="w-12 h-12 rounded-lg p-1 relative nivo-glass-static"
                        style={{ 
                          boxShadow: unlocked ? `0 0 25px ${skin.glowColor}` : 'none',
                        }}
                      >
                        {skin.icon}
                        
                        {/* Lock Overlay */}
                        {!unlocked && (
                          <div className="absolute inset-0 rounded-lg bg-black/70 backdrop-blur-sm flex items-center justify-center">
                            {skin.requirement === 'pro' ? (
                              <Crown className="w-5 h-5 text-amber-400" />
                            ) : (
                              <Lock className="w-4 h-4 text-white/50" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Skin Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-heading text-sm font-semibold text-foreground">
                            {skin.name}
                          </span>
                          {isSelected && (
                            <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">
                              Actif
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-[10px] text-foreground/40 mt-0.5">
                          {skin.description}
                        </p>
                        {!unlocked && (
                          <p className="font-mono text-[10px] text-amber-400/70 mt-1">
                            {getRequirementLabel(skin)}
                          </p>
                        )}
                      </div>

                      {/* Status Icon */}
                      <div className="shrink-0">
                        {unlocked ? (
                          isSelected ? (
                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(74,222,128,0.5)]">
                              <Check className="w-3.5 h-3.5 text-white" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border border-white/20 nivo-glass-static" />
                          )
                        ) : skin.requirement === 'pro' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-[10px] font-mono border-amber-400/30 text-amber-400 hover:bg-amber-400/10 nivo-glass-static"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowUpgradeModal(true);
                            }}
                          >
                            Upgrade
                          </Button>
                        ) : (
                          <Lock className="w-4 h-4 text-white/30" />
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Current Tier Display */}
            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <div className="inline-flex items-center gap-3 nivo-glass-static px-4 py-2 rounded-full">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span className="font-mono text-[10px] text-foreground/50">
                  Niveau {level} • {subscriptionTier === 'free' ? 'Gratuit' : 'PRO'}
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />
    </>
  );
}
