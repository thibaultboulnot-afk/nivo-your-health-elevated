/**
 * SpineHologram - Holographic Spine Visualization
 * Cyberpunk-style SVG with reactive states based on structural integrity
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SpineHologramProps {
  integrity: number; // 0-100
  className?: string;
}

// Get state config based on integrity level
function getStateConfig(integrity: number) {
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

// Vertebra segment component
function Vertebra({ 
  index, 
  config, 
  integrity 
}: { 
  index: number; 
  config: ReturnType<typeof getStateConfig>;
  integrity: number;
}) {
  const isCritical = integrity < 20;
  const segmentIntegrity = Math.max(0, Math.min(100, integrity + (Math.random() * 10 - 5)));
  
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
      {/* Vertebra body */}
      <motion.rect
        x={35 + index * 1.5}
        y={20 + index * 20}
        width={30 - index * 0.8}
        height={14}
        rx={3}
        fill={config.primaryColor}
        fillOpacity={0.15 + (segmentIntegrity / 100) * 0.4}
        stroke={config.primaryColor}
        strokeWidth={1.5}
        strokeOpacity={0.6 + (segmentIntegrity / 100) * 0.4}
        animate={{
          fillOpacity: isCritical 
            ? [0.2, 0.5, 0.2] 
            : [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: config.pulseSpeed,
          repeat: Infinity,
          delay: index * 0.1,
        }}
      />
      
      {/* Spinous process (back spike) */}
      <motion.path
        d={`M${50 + index * 0.5},${20 + index * 20} L${50 + index * 0.5},${12 + index * 20}`}
        stroke={config.secondaryColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeOpacity={0.5 + (segmentIntegrity / 100) * 0.5}
      />
      
      {/* Transverse processes (side wings) */}
      <motion.path
        d={`M${35 + index * 1.5},${27 + index * 20} L${25 + index * 1},${24 + index * 20}`}
        stroke={config.secondaryColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeOpacity={0.4}
      />
      <motion.path
        d={`M${65 - index * 0.8 + index * 1.5},${27 + index * 20} L${75 - index * 0.5},${24 + index * 20}`}
        stroke={config.secondaryColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeOpacity={0.4}
      />
      
      {/* Disc between vertebrae */}
      {index < 11 && (
        <motion.ellipse
          cx={50 + index * 0.5}
          cy={38 + index * 20}
          rx={12 - index * 0.3}
          ry={3}
          fill={config.primaryColor}
          fillOpacity={0.2}
          animate={{
            fillOpacity: [0.15, 0.3, 0.15],
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

export function SpineHologram({ integrity, className }: SpineHologramProps) {
  const config = getStateConfig(integrity);
  const isCritical = integrity < 20;
  
  // Generate 12 vertebrae (simplified spine)
  const vertebrae = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className={cn('relative', className)}>
      {/* Glow effect container */}
      <div 
        className="absolute inset-0 blur-2xl opacity-50"
        style={{ backgroundColor: config.glowColor }}
      />
      
      {/* Main SVG */}
      <motion.svg
        viewBox="0 0 100 280"
        className="relative z-10 w-full h-full"
        style={{
          filter: `drop-shadow(0 0 20px ${config.glowColor})`,
        }}
        animate={isCritical ? {
          opacity: [1, 0.7, 1],
        } : undefined}
        transition={isCritical ? {
          duration: 0.3,
          repeat: Infinity,
          repeatType: 'mirror',
        } : undefined}
      >
        {/* Background scan lines */}
        <defs>
          <pattern id="scanlines" patternUnits="userSpaceOnUse" width="100" height="4">
            <line x1="0" y1="0" x2="100" y2="0" stroke={config.primaryColor} strokeOpacity="0.1" strokeWidth="1" />
          </pattern>
          
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Scan lines overlay */}
        <rect width="100" height="280" fill="url(#scanlines)" />
        
        {/* Central spinal cord line */}
        <motion.line
          x1="50"
          y1="15"
          x2="50"
          y2="265"
          stroke={config.primaryColor}
          strokeWidth={1}
          strokeOpacity={0.3}
          strokeDasharray="4 2"
        />
        
        {/* Vertebrae */}
        <g filter="url(#glow)">
          {vertebrae.map((index) => (
            <Vertebra 
              key={index} 
              index={index} 
              config={config}
              integrity={integrity}
            />
          ))}
        </g>
        
        {/* Sacrum (bottom) */}
        <motion.path
          d="M35,260 L50,275 L65,260 L60,250 L40,250 Z"
          fill={config.primaryColor}
          fillOpacity={0.2}
          stroke={config.primaryColor}
          strokeWidth={1.5}
          animate={{
            fillOpacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: config.pulseSpeed,
            repeat: Infinity,
          }}
        />
        
        {/* Skull indicator (top) */}
        <motion.circle
          cx={50}
          cy={8}
          r={6}
          fill="none"
          stroke={config.primaryColor}
          strokeWidth={1.5}
          strokeOpacity={0.5}
          animate={{
            strokeOpacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: config.pulseSpeed * 2,
            repeat: Infinity,
          }}
        />
      </motion.svg>
      
      {/* Status overlay */}
      <div className="absolute bottom-0 left-0 right-0 text-center pb-2">
        <motion.div
          className={cn(
            'inline-block px-3 py-1 rounded-full font-mono text-[10px] tracking-wider border',
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
