/**
 * LevelUpModal - System Upgrade Animation
 * Cyberpunk-style reward reveal for skin unlocks
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Check, 
  Zap,
  Circle,
  Shield,
  Eye,
  Flame,
  Crown,
  Star,
  Hexagon,
  Diamond,
  Sun,
  Moon,
  Target,
  Crosshair,
  Snowflake,
  Heart,
  Gem,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ArmorSkin, RARITY_STYLES } from '@/lib/gamificationRegistry';

// Icon mapping
const ICON_MAP: Record<string, React.ElementType> = {
  Circle, Shield, Eye, Flame, Crown, Star, Hexagon, Diamond, Sun, Moon,
  Target, Crosshair, Snowflake, Heart, Gem, Trophy, Sparkles, Zap,
};

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  skin: ArmorSkin;
  onEquip: () => void;
}

export function LevelUpModal({ isOpen, onClose, skin, onEquip }: LevelUpModalProps) {
  const [phase, setPhase] = useState<'loading' | 'reveal' | 'complete'>('loading');
  const [progress, setProgress] = useState(0);
  
  const IconComponent = ICON_MAP[skin.iconName] || Circle;
  const rarityStyle = RARITY_STYLES[skin.rarity];

  // Simulate loading progress
  useEffect(() => {
    if (!isOpen) {
      setPhase('loading');
      setProgress(0);
      return;
    }

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setPhase('reveal');
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [isOpen]);

  // Move to complete phase after reveal
  useEffect(() => {
    if (phase === 'reveal') {
      const timer = setTimeout(() => setPhase('complete'), 1500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleEquip = () => {
    onEquip();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md nivo-glass-intense border-white/10 p-0 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{ 
              background: `radial-gradient(circle at 50% 50%, ${skin.glowColor}, transparent 70%)`,
            }}
            animate={{
              scale: phase === 'reveal' ? [1, 1.5, 1.2] : 1,
              opacity: phase === 'reveal' ? [0.3, 0.8, 0.5] : 0.2,
            }}
            transition={{ duration: 1 }}
          />
          
          {/* Scan lines */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            }}
          />
        </div>

        <div className="relative p-8">
          <AnimatePresence mode="wait">
            {/* Loading Phase */}
            {phase === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-6"
              >
                <motion.div
                  className="font-mono text-xs text-emerald-400 tracking-widest"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  ● MISE À JOUR SYSTÈME
                </motion.div>
                
                <div className="space-y-2">
                  <div className="font-mono text-[10px] text-foreground/50 uppercase tracking-wider">
                    Décryptage du schéma en cours...
                  </div>
                  
                  {/* Progress bar */}
                  <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-white/10">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  
                  <div className="font-mono text-xs text-foreground/30">
                    {Math.min(Math.round(progress), 100)}%
                  </div>
                </div>
                
                {/* Fake terminal output */}
                <div className="text-left bg-black/40 rounded-lg p-3 font-mono text-[9px] text-emerald-400/70 space-y-1">
                  <div>{'>'} Analyse structurelle...</div>
                  <motion.div
                    animate={{ opacity: [0, 1] }}
                    transition={{ delay: 0.3 }}
                  >
                    {'>'} Validation des paramètres...
                  </motion.div>
                  <motion.div
                    animate={{ opacity: [0, 1] }}
                    transition={{ delay: 0.6 }}
                  >
                    {'>'} Intégration au châssis...
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Reveal Phase */}
            {phase === 'reveal' && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-4"
              >
                <motion.div
                  className="font-mono text-sm text-amber-400 tracking-widest"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                >
                  ◆ SCHÉMA DÉCRYPTÉ ◆
                </motion.div>
                
                {/* Skin reveal with burst effect */}
                <motion.div
                  className="relative mx-auto w-32 h-32"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 200, 
                    damping: 15,
                    delay: 0.2,
                  }}
                >
                  {/* Burst rays */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-1 h-20 origin-bottom"
                      style={{
                        rotate: `${i * 30}deg`,
                        background: `linear-gradient(to top, ${skin.glowColor}, transparent)`,
                      }}
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: [0, 1, 0], opacity: [0, 0.8, 0] }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.02 }}
                    />
                  ))}
                  
                  {/* Skin icon */}
                  <div 
                    className={cn(
                      'absolute inset-4 rounded-2xl flex items-center justify-center',
                      skin.visualClass
                    )}
                    style={{ boxShadow: `0 0 40px ${skin.glowColor}` }}
                  >
                    <IconComponent className="w-12 h-12 text-white" />
                  </div>
                </motion.div>
                
                <motion.div
                  className="font-mono text-lg font-bold text-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {skin.name}
                </motion.div>
              </motion.div>
            )}

            {/* Complete Phase */}
            {phase === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-6"
              >
                <div className="font-mono text-xs text-emerald-400 tracking-widest flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  NOUVELLE ARCHITECTURE DÉTECTÉE
                </div>
                
                {/* Skin display */}
                <div className="space-y-3">
                  <div 
                    className={cn(
                      'mx-auto w-24 h-24 rounded-2xl flex items-center justify-center',
                      skin.visualClass
                    )}
                    style={{ boxShadow: `0 0 30px ${skin.glowColor}` }}
                  >
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  
                  <div>
                    <div className="font-mono text-lg font-bold text-foreground">
                      {skin.name}
                    </div>
                    <div className="font-mono text-xs text-foreground/50 mt-1">
                      {skin.description}
                    </div>
                  </div>
                  
                  {/* Rarity badge */}
                  <div className={cn(
                    'inline-block px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider border',
                    rarityStyle.bg, rarityStyle.text, rarityStyle.border
                  )}>
                    {skin.rarity}
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 font-mono text-xs border-white/10 hover:bg-white/5"
                  >
                    Plus tard
                  </Button>
                  <Button
                    onClick={handleEquip}
                    className="flex-1 font-mono text-xs bg-emerald-500 hover:bg-emerald-600 text-black"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    ÉQUIPER LE MODULE
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
