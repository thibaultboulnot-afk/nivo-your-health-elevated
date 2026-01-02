/**
 * VaultModal - Cyberpunk Armory Grid
 * 30+ skins display with French labels and unlock states
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Lock, 
  Check, 
  Crown, 
  Sparkles, 
  Flame, 
  Zap, 
  Star, 
  Shield, 
  Trophy, 
  Eye, 
  Snowflake, 
  Sun, 
  Moon, 
  Heart, 
  Target, 
  Crosshair, 
  Hexagon, 
  Circle, 
  Diamond, 
  Gem,
  Cpu,
  Skull,
  Cloud,
  Sword,
  Binary,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useGamification } from '@/hooks/useGamification';
import { UpgradeModal } from './UpgradeModal';
import { LevelUpModal } from './LevelUpModal';
import { 
  SKINS_REGISTRY, 
  isSkinUnlocked, 
  getRequirementLabel, 
  RARITY_STYLES,
  type ArmorSkin,
} from '@/lib/gamificationRegistry';
import { cn } from '@/lib/utils';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Icon mapping for skins
const ICON_MAP: Record<string, React.ElementType> = {
  Circle, Shield, Eye, Flame, Crown, Star, Hexagon, Diamond, Sun, Moon,
  Target, Crosshair, Snowflake, Heart, Gem, Trophy, Sparkles, Zap, 
  Cpu, Skull, Cloud, Sword, Binary,
};

function SkinIcon({ iconName, className }: { iconName: string; className?: string }) {
  const IconComponent = ICON_MAP[iconName] || Circle;
  return <IconComponent className={className} />;
}

type FilterType = 'all' | 'unlocked' | 'legendary';

export function VaultModal({ isOpen, onClose }: VaultModalProps) {
  const { level, currentStreak, unlockedSkins, equippedSkin, isPro, equipSkin } = useGamification();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedSkin, setSelectedSkin] = useState<ArmorSkin | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Filter skins based on current filter
  const filteredSkins = SKINS_REGISTRY.filter(skin => {
    const unlocked = isSkinUnlocked(skin, level, currentStreak, isPro, unlockedSkins);
    
    switch (filter) {
      case 'unlocked':
        return unlocked;
      case 'legendary':
        return skin.rarity === 'legendary';
      default:
        return true;
    }
  });

  // Count stats
  const unlockedCount = SKINS_REGISTRY.filter(s => 
    isSkinUnlocked(s, level, currentStreak, isPro, unlockedSkins)
  ).length;

  const handleSkinClick = (skin: ArmorSkin) => {
    const unlocked = isSkinUnlocked(skin, level, currentStreak, isPro, unlockedSkins);
    
    if (unlocked) {
      equipSkin(skin.id);
    } else if (skin.requirement.type === 'pro' || skin.requirement.type === 'top100') {
      setShowUpgradeModal(true);
    }
    // For level/streak locked skins, just show the tooltip (no action)
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] nivo-glass-intense border-white/10 p-0 overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-48 bg-purple-500/10 rounded-full blur-[80px]" />
          </div>

          <div className="relative p-6">
            {/* Header */}
            <DialogHeader className="text-center mb-6">
              <div className="mx-auto mb-3 w-14 h-14 rounded-xl nivo-glass flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-purple-400" />
              </div>
              <DialogTitle className="font-mono text-2xl font-bold text-foreground tracking-wider">
                ARMURERIE
              </DialogTitle>
              <DialogDescription className="font-mono text-xs text-foreground/50 uppercase tracking-widest">
                {unlockedCount}/{SKINS_REGISTRY.length} Modules Débloqués
              </DialogDescription>
            </DialogHeader>

            {/* Filter Tabs */}
            <div className="flex justify-center gap-2 mb-6">
              {([
                { key: 'all', label: 'TOUS' },
                { key: 'unlocked', label: 'DÉBLOQUÉS' },
                { key: 'legendary', label: 'LÉGENDAIRE' },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={cn(
                    'px-4 py-2 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all border',
                    filter === tab.key 
                      ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
                      : 'bg-white/5 text-foreground/50 border-white/10 hover:bg-white/10'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Skins Grid - Scrollable */}
            <div className="overflow-y-auto max-h-[50vh] pr-2 -mr-2 custom-scrollbar">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {filteredSkins.map((skin, index) => {
                  const unlocked = isSkinUnlocked(skin, level, currentStreak, isPro, unlockedSkins);
                  const isEquipped = equippedSkin === skin.id;
                  const rarityStyle = RARITY_STYLES[skin.rarity];

                  return (
                    <motion.button
                      key={skin.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.015 }}
                      onClick={() => handleSkinClick(skin)}
                      disabled={!unlocked && skin.requirement.type !== 'pro' && skin.requirement.type !== 'top100'}
                      className={cn(
                        'relative p-3 rounded-xl transition-all duration-200 text-center group border',
                        isEquipped 
                          ? 'ring-2 ring-emerald-500 bg-emerald-500/10 border-emerald-500/30' 
                          : unlocked 
                            ? 'bg-black/40 hover:bg-black/60 border-white/10 hover:border-white/20' 
                            : 'bg-black/60 border-white/5 opacity-50 hover:opacity-70'
                      )}
                    >
                      {/* Skin Icon Container */}
                      <div 
                        className={cn(
                          'w-14 h-14 mx-auto rounded-lg flex items-center justify-center mb-2 relative overflow-hidden',
                          unlocked ? skin.visualClass : 'bg-gray-800'
                        )}
                        style={{ 
                          boxShadow: unlocked ? `0 0 25px ${skin.glowColor}` : 'none',
                        }}
                      >
                        <SkinIcon iconName={skin.iconName} className="w-7 h-7 text-white/90 relative z-10" />
                        
                        {/* Lock Overlay */}
                        {!unlocked && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            {skin.requirement.type === 'pro' || skin.requirement.type === 'top100' ? (
                              <Crown className="w-5 h-5 text-amber-400/80" />
                            ) : (
                              <Lock className="w-5 h-5 text-white/40" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Skin Name */}
                      <p className="font-mono text-[10px] font-medium text-foreground truncate mb-1">
                        {skin.name}
                      </p>

                      {/* Rarity Badge */}
                      <span className={cn(
                        'inline-block px-2 py-0.5 rounded text-[8px] uppercase tracking-wider border',
                        rarityStyle.bg, rarityStyle.text, rarityStyle.border
                      )}>
                        {skin.rarity === 'common' ? 'COMMUN' : 
                         skin.rarity === 'rare' ? 'RARE' : 
                         skin.rarity === 'epic' ? 'ÉPIQUE' : 'LÉGENDAIRE'}
                      </span>

                      {/* Equipped Badge */}
                      {isEquipped && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg border-2 border-black">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}

                      {/* Hover Tooltip - Requirement */}
                      {!unlocked && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/95 border border-white/10 rounded-lg text-[9px] text-red-400 font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                          {getRequirementLabel(skin, level, currentStreak)}
                        </div>
                      )}

                      {/* Hover glow effect */}
                      {unlocked && (
                        <motion.div
                          className="absolute inset-0 rounded-xl pointer-events-none"
                          style={{ boxShadow: `0 0 0 0 ${skin.glowColor}` }}
                          whileHover={{ boxShadow: `0 0 20px ${skin.glowColor}` }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Empty state */}
              {filteredSkins.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <Lock className="w-8 h-8 text-foreground/30" />
                  </div>
                  <p className="font-mono text-sm text-foreground/50">Aucun module trouvé</p>
                  <p className="font-mono text-xs text-foreground/30 mt-1">Essayez un autre filtre</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span className="font-mono text-[10px] text-foreground/50">Niv. {level}</span>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3 h-3 text-orange-400" />
                  <span className="font-mono text-[10px] text-foreground/50">Séquence {currentStreak}J</span>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <span className={cn(
                  'font-mono text-[10px]',
                  isPro ? 'text-primary' : 'text-foreground/40'
                )}>
                  {isPro ? 'PRO' : 'FREE'}
                </span>
              </div>

              {!isPro && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowUpgradeModal(true)}
                  className="h-8 text-[10px] font-mono border-amber-400/30 text-amber-400 hover:bg-amber-400/10"
                >
                  <Crown className="w-3 h-3 mr-1.5" />
                  DEVENIR PRO
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sub-modals */}
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />

      {selectedSkin && (
        <LevelUpModal
          isOpen={showLevelUp}
          onClose={() => {
            setShowLevelUp(false);
            setSelectedSkin(null);
          }}
          skin={selectedSkin}
          onEquip={() => equipSkin(selectedSkin.id)}
        />
      )}
    </>
  );
}
