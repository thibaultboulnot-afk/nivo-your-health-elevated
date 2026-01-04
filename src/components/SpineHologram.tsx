/**
 * SpineHologram - Organic Holographic Spine Visualization
 * Obsidian Glass style with curved SVG paths and breathing animations
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SpineHologramProps {
  integrity: number; // 0-100, null means "not calibrated"
  className?: string;
  isCalibrated?: boolean;
}

// Get state config based on integrity level
function getStateConfig(integrity: number | null) {
  if (integrity === null) {
    return {
      state: 'UNCALIBRATED',
      color: 'gray',
      primaryColor: '#6b7280',
      secondaryColor: '#9ca3af',
      glowColor: 'rgba(107, 114, 128, 0.3)',
      pulseSpeed: 4,
      label: 'NON CALIBRÉ',
    };
  }
  if (integrity >= 80) {
    return {
      state: 'OPTIMAL',
      color: 'emerald',
      primaryColor: '#10b981',
      secondaryColor: '#34d399',
      glowColor: 'rgba(16, 185, 129, 0.6)',
      pulseSpeed: 3,
      label: 'SYSTÈME OPTIMAL',
    };
  }
  if (integrity >= 50) {
    return {
      state: 'INSTABLE',
      color: 'amber',
      primaryColor: '#f59e0b',
      secondaryColor: '#fbbf24',
      glowColor: 'rgba(245, 158, 11, 0.5)',
      pulseSpeed: 1.5,
      label: 'TENSIONS DÉTECTÉES',
    };
  }
  return {
    state: 'CRITIQUE',
    color: 'red',
    primaryColor: '#ef4444',
    secondaryColor: '#f87171',
    glowColor: 'rgba(239, 68, 68, 0.6)',
    pulseSpeed: 0.5,
    label: 'ÉTAT CRITIQUE',
  };
}

// Organic vertebra segment with curved paths
function OrganicVertebra({ 
  index, 
  config, 
  integrity 
}: { 
  index: number; 
  config: ReturnType<typeof getStateConfig>;
  integrity: number | null;
}) {
  const isCritical = integrity !== null && integrity < 20;
  const segmentIntegrity = integrity !== null 
    ? Math.max(0, Math.min(100, integrity + (Math.random() * 10 - 5)))
    : 50;
  
  // Y position for each vertebra
  const y = 25 + index * 22;
  const width = 32 - index * 0.6;
  const centerX = 50;
  
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: isCritical ? [0, (Math.random() - 0.5) * 2, 0] : 0,
      }}
      transition={{ 
        delay: index * 0.05,
        x: isCritical ? { 
          repeat: Infinity, 
          duration: 0.1, 
          repeatType: 'mirror' 
        } : undefined,
      }}
    >
      {/* Main vertebra body - organic curved shape */}
      <motion.path
        d={`
          M${centerX - width/2},${y + 6}
          Q${centerX - width/2 - 3},${y + 3} ${centerX - width/3},${y}
          Q${centerX},${y - 2} ${centerX + width/3},${y}
          Q${centerX + width/2 + 3},${y + 3} ${centerX + width/2},${y + 6}
          Q${centerX + width/2 + 2},${y + 9} ${centerX + width/3},${y + 12}
          Q${centerX},${y + 14} ${centerX - width/3},${y + 12}
          Q${centerX - width/2 - 2},${y + 9} ${centerX - width/2},${y + 6}
          Z
        `}
        fill={config.primaryColor}
        fillOpacity={0.1 + (segmentIntegrity / 100) * 0.3}
        stroke={config.primaryColor}
        strokeWidth={1.5}
        strokeOpacity={0.5 + (segmentIntegrity / 100) * 0.5}
        animate={{
          fillOpacity: isCritical 
            ? [0.15, 0.4, 0.15] 
            : [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: config.pulseSpeed,
          repeat: Infinity,
          delay: index * 0.1,
        }}
      />
      
      {/* Spinous process (back spike) - curved */}
      <motion.path
        d={`M${centerX},${y} Q${centerX + 2},${y - 6} ${centerX},${y - 10}`}
        stroke={config.secondaryColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeOpacity={0.4 + (segmentIntegrity / 100) * 0.4}
        fill="none"
      />
      
      {/* Transverse processes (side wings) - organic curves */}
      <motion.path
        d={`M${centerX - width/2},${y + 6} Q${centerX - width/2 - 8},${y + 3} ${centerX - width/2 - 12},${y + 5}`}
        stroke={config.secondaryColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeOpacity={0.3}
        fill="none"
      />
      <motion.path
        d={`M${centerX + width/2},${y + 6} Q${centerX + width/2 + 8},${y + 3} ${centerX + width/2 + 12},${y + 5}`}
        stroke={config.secondaryColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeOpacity={0.3}
        fill="none"
      />
      
      {/* Intervertebral disc - soft organic shape */}
      {index < 11 && (
        <motion.ellipse
          cx={centerX}
          cy={y + 18}
          rx={width/3}
          ry={2.5}
          fill={config.primaryColor}
          fillOpacity={0.15}
          animate={{
            fillOpacity: [0.1, 0.25, 0.1],
            ry: [2.5, 3, 2.5],
          }}
          transition={{
            duration: config.pulseSpeed * 1.5,
            repeat: Infinity,
            delay: index * 0.08,
          }}
        />
      )}
    </motion.g>
  );
}

export function SpineHologram({ integrity, className, isCalibrated = true }: SpineHologramProps) {
  const effectiveIntegrity = isCalibrated ? integrity : null;
  const config = getStateConfig(effectiveIntegrity);
  const isCritical = effectiveIntegrity !== null && effectiveIntegrity < 20;
  
  // Generate 11 vertebrae (simplified spine)
  const vertebrae = Array.from({ length: 11 }, (_, i) => i);

  return (
    <div className={cn('relative', className)}>
      {/* Frosted glass glow effect container */}
      <motion.div 
        className="absolute inset-0 blur-3xl opacity-40"
        style={{ backgroundColor: config.glowColor }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: config.pulseSpeed * 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Main SVG */}
      <motion.svg
        viewBox="0 0 100 290"
        className="relative z-10 w-full h-full"
        style={{
          filter: `drop-shadow(0 0 15px ${config.glowColor})`,
        }}
        animate={isCritical ? {
          opacity: [1, 0.7, 1],
        } : {
          opacity: [0.9, 1, 0.9],
        }}
        transition={isCritical ? {
          duration: 0.3,
          repeat: Infinity,
          repeatType: 'mirror',
        } : {
          duration: config.pulseSpeed * 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Background scan lines */}
        <defs>
          <pattern id="scanlines-organic" patternUnits="userSpaceOnUse" width="100" height="4">
            <line x1="0" y1="0" x2="100" y2="0" stroke={config.primaryColor} strokeOpacity="0.05" strokeWidth="1" />
          </pattern>
          
          {/* Frosted glass glow filter */}
          <filter id="glow-organic" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Neon gradient */}
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={config.primaryColor} stopOpacity="0.8"/>
            <stop offset="50%" stopColor={config.secondaryColor} stopOpacity="0.5"/>
            <stop offset="100%" stopColor={config.primaryColor} stopOpacity="0.8"/>
          </linearGradient>
        </defs>
        
        {/* Scan lines overlay */}
        <rect width="100" height="290" fill="url(#scanlines-organic)" />
        
        {/* Central spinal cord - organic curved line */}
        <motion.path
          d="M50,15 Q48,80 50,145 Q52,210 50,275"
          stroke="url(#neonGradient)"
          strokeWidth={1.5}
          strokeOpacity={0.4}
          fill="none"
          strokeDasharray="6 4"
          animate={{
            strokeOpacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: config.pulseSpeed,
            repeat: Infinity,
          }}
        />
        
        {/* Vertebrae */}
        <g filter="url(#glow-organic)">
          {vertebrae.map((index) => (
            <OrganicVertebra 
              key={index} 
              index={index} 
              config={config}
              integrity={effectiveIntegrity}
            />
          ))}
        </g>
        
        {/* Sacrum (bottom) - organic curved shape */}
        <motion.path
          d="M35,268 Q40,260 50,258 Q60,260 65,268 L62,278 Q50,285 38,278 Z"
          fill={config.primaryColor}
          fillOpacity={0.15}
          stroke={config.primaryColor}
          strokeWidth={1.5}
          strokeOpacity={0.4}
          animate={{
            fillOpacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: config.pulseSpeed,
            repeat: Infinity,
          }}
        />
        
        {/* Skull indicator (top) - organic circle with pulse */}
        <motion.circle
          cx={50}
          cy={10}
          r={7}
          fill="none"
          stroke={config.primaryColor}
          strokeWidth={1.5}
          strokeOpacity={0.4}
          animate={{
            strokeOpacity: [0.3, 0.6, 0.3],
            r: [7, 8, 7],
          }}
          transition={{
            duration: config.pulseSpeed * 2,
            repeat: Infinity,
          }}
        />
        
        {/* Inner circle for skull */}
        <motion.circle
          cx={50}
          cy={10}
          r={3}
          fill={config.primaryColor}
          fillOpacity={0.3}
          animate={{
            fillOpacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: config.pulseSpeed,
            repeat: Infinity,
          }}
        />
      </motion.svg>
      
      {/* Status overlay with frosted glass effect */}
      <div className="absolute bottom-0 left-0 right-0 text-center pb-2">
        <motion.div
          className={cn(
            'inline-block px-4 py-1.5 rounded-full font-mono text-[10px] tracking-wider border backdrop-blur-sm',
            config.color === 'gray' && 'bg-gray-500/10 border-gray-500/30 text-gray-400',
            config.color === 'emerald' && 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
            config.color === 'amber' && 'bg-amber-500/10 border-amber-500/30 text-amber-400',
            config.color === 'red' && 'bg-red-500/10 border-red-500/30 text-red-400',
          )}
          animate={isCritical ? {
            opacity: [1, 0.5, 1],
          } : undefined}
          transition={isCritical ? {
            duration: 0.5,
            repeat: Infinity,
          } : undefined}
        >
          {config.label}
        </motion.div>
      </div>
    </div>
  );
}
