/**
 * LevelUpModal - Interactive Loot Box / Crypto-Container Experience
 * Opal-inspired tap-to-break reward reveal
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
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
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ArmorSkin, RARITY_STYLES } from '@/lib/gamificationRegistry';

// Icon mapping
const ICON_MAP: Record<string, React.ElementType> = {
  Circle, Shield, Eye, Flame, Crown, Star, Hexagon, Diamond, Sun, Moon,
  Target, Crosshair, Snowflake, Heart, Gem, Trophy, Sparkles, Zap,
};

// Crack patterns for the container
const CRACK_PATTERNS = [
  'M 50 0 L 45 25 L 30 40 L 50 50',
  'M 100 30 L 75 35 L 60 50 L 50 50',
  'M 80 100 L 70 75 L 55 60 L 50 50',
  'M 0 70 L 25 65 L 40 55 L 50 50',
  'M 20 0 L 30 30 L 45 45 L 50 50',
  'M 100 80 L 80 70 L 60 55 L 50 50',
];

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  skin: ArmorSkin;
  onEquip: () => void;
}

type Phase = 'container' | 'breaking' | 'reveal' | 'complete';

export function LevelUpModal({ isOpen, onClose, skin, onEquip }: LevelUpModalProps) {
  const [phase, setPhase] = useState<Phase>('container');
  const [containerHealth, setContainerHealth] = useState(100);
  const [hitCount, setHitCount] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  
  const containerControls = useAnimation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const IconComponent = ICON_MAP[skin.iconName] || Circle;
  const rarityStyle = RARITY_STYLES[skin.rarity];

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPhase('container');
      setContainerHealth(100);
      setHitCount(0);
      setShowFlash(false);
      setParticles([]);
    }
  }, [isOpen]);

  // Handle container break
  const handleContainerHit = useCallback(async () => {
    if (phase !== 'container' || containerHealth <= 0) return;

    setPhase('breaking');
    const newHitCount = hitCount + 1;
    setHitCount(newHitCount);
    
    // Reduce health (3 hits to break)
    const damage = 35 + Math.random() * 5;
    const newHealth = Math.max(0, containerHealth - damage);
    setContainerHealth(newHealth);

    // Shake animation
    await containerControls.start({
      x: [-8, 8, -6, 6, -4, 4, 0],
      transition: { duration: 0.4, ease: 'easeOut' },
    });

    // Add particles at random positions
    const newParticles = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: 30 + Math.random() * 40,
      y: 30 + Math.random() * 40,
    }));
    setParticles(prev => [...prev, ...newParticles]);

    // Check if container is broken
    if (newHealth <= 0) {
      // Trigger reveal sequence
      setTimeout(() => {
        setShowFlash(true);
        setTimeout(() => {
          setShowFlash(false);
          setPhase('reveal');
        }, 200);
      }, 300);
    } else {
      setPhase('container');
    }
  }, [phase, containerHealth, hitCount, containerControls]);

  // Move to complete phase after reveal
  useEffect(() => {
    if (phase === 'reveal') {
      const timer = setTimeout(() => setPhase('complete'), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleEquip = () => {
    onEquip();
    onClose();
  };

  // Calculate visible cracks based on damage
  const visibleCracks = Math.floor((1 - containerHealth / 100) * CRACK_PATTERNS.length);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md nivo-glass-intense border-white/10 p-0 overflow-hidden">
        {/* Flash overlay */}
        <AnimatePresence>
          {showFlash && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-white"
              transition={{ duration: 0.1 }}
            />
          )}
        </AnimatePresence>

        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{ 
              background: phase === 'reveal' || phase === 'complete'
                ? `radial-gradient(circle at 50% 50%, ${skin.glowColor}, transparent 70%)`
                : 'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.2), transparent 70%)',
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
            {/* Container Phase - Tap to Break */}
            {(phase === 'container' || phase === 'breaking') && (
              <motion.div
                key="container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="text-center space-y-6"
              >
                {/* Header */}
                <motion.div
                  className="font-mono text-xs text-emerald-400 tracking-widest flex items-center justify-center gap-2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Lock className="w-3 h-3" />
                  CONTENEUR CRYPTÉ
                </motion.div>

                {/* Health Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center font-mono text-[10px] uppercase tracking-wider">
                    <span className="text-foreground/50">Intégrité du Chiffrement</span>
                    <span className={cn(
                      containerHealth > 50 ? 'text-emerald-400' : 
                      containerHealth > 20 ? 'text-orange-400' : 'text-red-400'
                    )}>
                      {Math.round(containerHealth)}%
                    </span>
                  </div>
                  <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-white/10">
                    <motion.div
                      className={cn(
                        'h-full transition-all duration-300',
                        containerHealth > 50 ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' : 
                        containerHealth > 20 ? 'bg-gradient-to-r from-orange-500 to-yellow-400' : 
                        'bg-gradient-to-r from-red-500 to-orange-400'
                      )}
                      style={{ width: `${containerHealth}%` }}
                    />
                  </div>
                </div>

                {/* Crypto Container */}
                <motion.div
                  animate={containerControls}
                  className="relative mx-auto"
                  onClick={handleContainerHit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Main Container - Oval Shape */}
                  <div className="relative w-40 h-48 mx-auto">
                    {/* Outer glow ring */}
                    <motion.div
                      className="absolute inset-0 rounded-[50%] border-2"
                      style={{
                        borderColor: containerHealth > 50 ? 'rgb(74 222 128 / 0.5)' : 
                                    containerHealth > 20 ? 'rgb(251 146 60 / 0.5)' : 'rgb(239 68 68 / 0.5)',
                        boxShadow: containerHealth > 50 
                          ? '0 0 30px rgb(74 222 128 / 0.3), inset 0 0 20px rgb(74 222 128 / 0.1)' 
                          : containerHealth > 20
                          ? '0 0 30px rgb(251 146 60 / 0.3), inset 0 0 20px rgb(251 146 60 / 0.1)'
                          : '0 0 30px rgb(239 68 68 / 0.3), inset 0 0 20px rgb(239 68 68 / 0.1)',
                      }}
                      animate={{
                        scale: [1, 1.02, 1],
                        opacity: [0.8, 1, 0.8],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* Inner container */}
                    <div 
                      className="absolute inset-2 rounded-[50%] bg-gradient-to-b from-gray-900 via-black to-gray-900 border border-white/10 overflow-hidden"
                      style={{
                        boxShadow: 'inset 0 -10px 30px rgba(0,0,0,0.8), inset 0 10px 30px rgba(255,255,255,0.05)',
                      }}
                    >
                      {/* Mystery icon hint */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ 
                            opacity: [0.1, 0.2, 0.1],
                            scale: [0.9, 1, 0.9],
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <Lock className="w-12 h-12 text-white/20" />
                        </motion.div>
                      </div>

                      {/* Cracks SVG overlay */}
                      <svg 
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        {CRACK_PATTERNS.slice(0, visibleCracks).map((path, i) => (
                          <motion.path
                            key={i}
                            d={path}
                            fill="none"
                            stroke="rgba(255,255,255,0.6)"
                            strokeWidth="0.8"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        ))}
                      </svg>

                      {/* Particle effects */}
                      <AnimatePresence>
                        {particles.map(particle => (
                          <motion.div
                            key={particle.id}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            initial={{ 
                              left: `${particle.x}%`, 
                              top: `${particle.y}%`,
                              scale: 1,
                              opacity: 1,
                            }}
                            animate={{ 
                              y: [0, -30, -50],
                              x: [0, (Math.random() - 0.5) * 40],
                              scale: [1, 0.5, 0],
                              opacity: [1, 0.5, 0],
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                          />
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Pulsing ring indicator */}
                    <motion.div
                      className="absolute -inset-4 rounded-[50%] border border-white/10"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0, 0.3],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                </motion.div>

                {/* Instruction */}
                <motion.div
                  className="font-mono text-xs text-foreground/50 uppercase tracking-wider"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ◆ Cliquez pour décrypter ◆
                </motion.div>

                {/* Hit counter */}
                <div className="flex justify-center gap-2">
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      className={cn(
                        'w-2 h-2 rounded-full transition-colors',
                        hitCount >= i ? 'bg-emerald-400' : 'bg-white/20'
                      )}
                      animate={hitCount >= i ? { scale: [1, 1.3, 1] } : {}}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reveal Phase - The Reveal */}
            {phase === 'reveal' && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-4 py-4"
              >
                <motion.div
                  className="font-mono text-sm text-amber-400 tracking-widest"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  ◆ SCHÉMA DÉCRYPTÉ ◆
                </motion.div>

                {/* Skin reveal with Opal-style floating effect */}
                <motion.div
                  className="relative mx-auto"
                  initial={{ scale: 0, rotateY: 180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 150, 
                    damping: 15,
                    delay: 0.2,
                  }}
                >
                  {/* Burst rays */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(16)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-0.5 h-24 origin-bottom"
                        style={{
                          rotate: `${i * 22.5}deg`,
                          background: `linear-gradient(to top, ${skin.glowColor}, transparent)`,
                        }}
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: [0, 1, 0], opacity: [0, 0.8, 0] }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.02 }}
                      />
                    ))}
                  </div>

                  {/* Floating skin with breathing animation */}
                  <motion.div
                    className="relative w-32 h-32 mx-auto"
                    animate={{
                      y: [0, -8, 0],
                      rotateY: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                      rotateY: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                    }}
                    style={{
                      filter: `drop-shadow(0 20px 25px ${skin.glowColor})`,
                    }}
                  >
                    {/* Skin icon with breathing scale */}
                    <motion.div 
                      className={cn(
                        'w-full h-full rounded-2xl flex items-center justify-center',
                        skin.visualClass
                      )}
                      animate={{
                        scale: [1, 1.03, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      style={{ 
                        boxShadow: `0 0 60px ${skin.glowColor}, inset 0 0 30px rgba(255,255,255,0.2)`,
                      }}
                    >
                      <IconComponent className="w-14 h-14 text-white drop-shadow-lg" />
                    </motion.div>

                    {/* Orbiting particles */}
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-white/80"
                        style={{
                          boxShadow: `0 0 10px ${skin.glowColor}`,
                        }}
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 3 + i,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      >
                        <motion.div
                          className="absolute"
                          style={{
                            left: `${50 + i * 10}px`,
                            top: '50%',
                            transform: 'translateY(-50%)',
                          }}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Dramatic name reveal */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-2"
                >
                  <div 
                    className="font-heading text-2xl font-bold"
                    style={{ 
                      textShadow: `0 0 20px ${skin.glowColor}`,
                      color: 'white',
                    }}
                  >
                    {skin.name}
                  </div>
                  <div className={cn(
                    'inline-block px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider border',
                    rarityStyle.bg, rarityStyle.text, rarityStyle.border
                  )}>
                    {skin.rarity === 'common' && 'COMMUN'}
                    {skin.rarity === 'rare' && 'RARE'}
                    {skin.rarity === 'epic' && 'ÉPIQUE'}
                    {skin.rarity === 'legendary' && 'LÉGENDAIRE'}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Complete Phase - Equip Option */}
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
                
                {/* Skin display with persistent floating effect */}
                <motion.div
                  className="relative"
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <div 
                    className={cn(
                      'mx-auto w-24 h-24 rounded-2xl flex items-center justify-center',
                      skin.visualClass
                    )}
                    style={{ 
                      boxShadow: `0 0 40px ${skin.glowColor}`,
                      filter: `drop-shadow(0 15px 20px ${skin.glowColor})`,
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <IconComponent className="w-10 h-10 text-white" />
                    </motion.div>
                  </div>
                </motion.div>

                <div className="space-y-2">
                  <div 
                    className="font-heading text-xl font-bold text-foreground"
                    style={{ textShadow: `0 0 15px ${skin.glowColor}` }}
                  >
                    {skin.name}
                  </div>
                  <div className="font-mono text-xs text-foreground/50 max-w-xs mx-auto">
                    {skin.description}
                  </div>
                  
                  {/* Rarity badge */}
                  <div className={cn(
                    'inline-block px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider border',
                    rarityStyle.bg, rarityStyle.text, rarityStyle.border
                  )}>
                    {skin.rarity === 'common' && 'COMMUN'}
                    {skin.rarity === 'rare' && 'RARE'}
                    {skin.rarity === 'epic' && 'ÉPIQUE'}
                    {skin.rarity === 'legendary' && 'LÉGENDAIRE'}
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 font-mono text-xs border-white/10 hover:bg-white/5"
                  >
                    Plus tard
                  </Button>
                  <Button
                    onClick={handleEquip}
                    className="flex-1 font-mono text-xs bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black shadow-lg"
                    style={{
                      boxShadow: `0 0 20px ${skin.glowColor}`,
                    }}
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
