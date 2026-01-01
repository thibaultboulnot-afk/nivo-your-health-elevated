import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lock, Check, Crown, Sparkles, Flame, Zap, Star, Shield, Trophy, Eye, Snowflake, Sun, Moon, Heart, Target, Crosshair, Hexagon, Circle, Diamond, Gem } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGamification } from '@/hooks/useGamification';
import { UpgradeModal } from './UpgradeModal';
import { SKINS_REGISTRY, isSkinUnlocked, getRequirementLabel, RARITY_COLORS, type SkinDefinition } from '@/lib/gamificationData';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Icon mapping
const ICON_MAP: Record<string, React.ElementType> = {
  Flame, Zap, Star, Shield, Trophy, Eye, Snowflake, Sun, Moon, Heart, 
  Target, Crosshair, Hexagon, Circle, Diamond, Crown, Sparkles, Gem
};

function SkinIcon({ iconName, className }: { iconName: string; className?: string }) {
  const IconComponent = ICON_MAP[iconName] || Circle;
  return <IconComponent className={className} />;
}

export function VaultModal({ isOpen, onClose }: VaultModalProps) {
  const { level, currentStreak, unlockedSkins, equippedSkin, isPro, subscriptionTier, equipSkin } = useGamification();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'level' | 'streak' | 'pro'>('all');

  const filteredSkins = filter === 'all' 
    ? SKINS_REGISTRY 
    : SKINS_REGISTRY.filter(s => s.category === filter || (filter === 'pro' && s.category === 'special'));

  const unlockedCount = SKINS_REGISTRY.filter(s => 
    isSkinUnlocked(s, level, currentStreak, isPro, unlockedSkins)
  ).length;

  const handleSkinClick = (skin: SkinDefinition) => {
    const unlocked = isSkinUnlocked(skin, level, currentStreak, isPro, unlockedSkins);
    
    if (unlocked) {
      equipSkin(skin.id);
    } else if (skin.requirement.type === 'pro' || skin.requirement.type === 'top100') {
      setShowUpgradeModal(true);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] nivo-glass-intense border-white/10 p-0 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-40 bg-emerald-500/10 rounded-full blur-[60px]" />
          </div>

          <div className="relative p-6">
            <DialogHeader className="text-center mb-4">
              <div className="mx-auto mb-3 w-12 h-12 rounded-xl nivo-glass flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-emerald-400" />
              </div>
              <DialogTitle className="font-heading text-xl font-bold text-foreground">
                Le Coffre
              </DialogTitle>
              <DialogDescription className="font-mono text-xs text-foreground/50">
                {unlockedCount}/{SKINS_REGISTRY.length} modules débloqués
              </DialogDescription>
            </DialogHeader>

            {/* Filter Tabs */}
            <div className="flex justify-center gap-2 mb-4">
              {(['all', 'level', 'streak', 'pro'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all ${
                    filter === f 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-white/5 text-foreground/50 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {f === 'all' ? 'Tous' : f === 'level' ? 'Niveau' : f === 'streak' ? 'Série' : 'PRO'}
                </button>
              ))}
            </div>

            {/* Skins Grid - Scrollable */}
            <div className="overflow-y-auto max-h-[50vh] pr-2 -mr-2">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {filteredSkins.map((skin, index) => {
                  const unlocked = isSkinUnlocked(skin, level, currentStreak, isPro, unlockedSkins);
                  const isEquipped = equippedSkin === skin.id;
                  const rarityStyle = RARITY_COLORS[skin.rarity];

                  return (
                    <motion.button
                      key={skin.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => handleSkinClick(skin)}
                      disabled={!unlocked && skin.requirement.type !== 'pro' && skin.requirement.type !== 'top100'}
                      className={`
                        relative p-3 rounded-xl transition-all duration-200 text-center group
                        ${isEquipped 
                          ? 'ring-2 ring-emerald-500 bg-emerald-500/10' 
                          : unlocked 
                            ? 'bg-white/5 hover:bg-white/10 border border-white/10' 
                            : 'bg-black/20 border border-white/5 opacity-60'
                        }
                      `}
                    >
                      {/* Skin Icon */}
                      <div 
                        className={`
                          w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-2
                          bg-gradient-to-br from-${skin.colorFrom} ${skin.colorVia ? `via-${skin.colorVia}` : ''} to-${skin.colorTo}
                          ${unlocked ? '' : 'grayscale'}
                        `}
                        style={{ 
                          boxShadow: unlocked ? `0 0 20px ${skin.glowColor}` : 'none',
                        }}
                      >
                        <SkinIcon iconName={skin.iconName} className="w-6 h-6 text-white/90" />
                        
                        {/* Lock Overlay */}
                        {!unlocked && (
                          <div className="absolute inset-0 rounded-lg bg-black/60 flex items-center justify-center">
                            {skin.requirement.type === 'pro' || skin.requirement.type === 'top100' ? (
                              <Crown className="w-4 h-4 text-amber-400" />
                            ) : (
                              <Lock className="w-4 h-4 text-white/40" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Skin Name */}
                      <p className="font-mono text-[10px] font-medium text-foreground truncate">
                        {skin.name}
                      </p>

                      {/* Rarity Badge */}
                      <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider ${rarityStyle.bg} ${rarityStyle.text} ${rarityStyle.border} border`}>
                        {skin.rarity}
                      </span>

                      {/* Equipped Badge */}
                      {isEquipped && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}

                      {/* Hover Tooltip */}
                      {!unlocked && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 rounded text-[9px] text-foreground/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          {getRequirementLabel(skin, level, currentStreak)}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span className="font-mono text-[10px] text-foreground/50">
                  Niv. {level} • Série {currentStreak}j • {subscriptionTier === 'free' ? 'Free' : 'PRO'}
                </span>
              </div>
              {!isPro && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowUpgradeModal(true)}
                  className="h-7 text-[10px] font-mono border-amber-400/30 text-amber-400 hover:bg-amber-400/10"
                >
                  <Crown className="w-3 h-3 mr-1" />
                  Débloquer PRO
                </Button>
              )}
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