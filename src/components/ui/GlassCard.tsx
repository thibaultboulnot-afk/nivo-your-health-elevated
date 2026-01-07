import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowing?: boolean;
  premium?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className, glowing = false, premium = false, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        // Base Cristal Engineering Style
        "relative rounded-2xl overflow-hidden transition-all duration-400 ease-apple",
        // Glass background with inner shadow
        "bg-white/[0.03] backdrop-blur-[20px] border border-white/[0.08]",
        // Inner shadow for physical depth (top light reflection)
        "[box-shadow:inset_0_1px_0_rgba(255,255,255,0.06),0_8px_32px_0_rgba(0,0,0,0.4)]",
        // Hover effect
        onClick && "cursor-pointer hover:bg-white/[0.05] hover:border-white/[0.12]",
        // Premium breathing border with blue glow
        premium && "animate-breathe-border border-primary/20 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.06),0_8px_32px_0_rgba(0,0,0,0.4),0_0_40px_-10px_rgba(46,92,255,0.3)]",
        // Glowing effect (blue bio-signal)
        glowing && "[box-shadow:inset_0_1px_0_rgba(255,255,255,0.06),0_8px_32px_0_rgba(0,0,0,0.4),0_0_30px_-5px_rgba(46,92,255,0.4)]",
        className
      )}
    >
      {/* Optional shine effect for premium cards */}
      {premium && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent animate-card-shine" />
        </div>
      )}
      {children}
    </div>
  );
}

// Stat card variant - Uses JetBrains Mono for data display
export function GlassStatCard({ 
  label, 
  value, 
  valueColor = "text-foreground",
  className 
}: { 
  label: string; 
  value: string | number; 
  valueColor?: string;
  className?: string;
}) {
  return (
    <GlassCard className={cn("p-4 text-center", className)}>
      <span className="font-data text-[10px] text-foreground/40 uppercase tracking-wider block mb-1">
        {label}
      </span>
      <span className={cn("font-data text-2xl font-bold tabular-nums tracking-tight", valueColor)}>
        {value}
      </span>
    </GlassCard>
  );
}

// Large stat card for dashboard hero metrics
export function GlassHeroStat({
  label,
  value,
  unit,
  className
}: {
  label: string;
  value: string | number;
  unit?: string;
  className?: string;
}) {
  return (
    <GlassCard className={cn("p-6", className)}>
      <span className="font-data text-[10px] text-foreground/40 uppercase tracking-[0.15em] block mb-2">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="font-data text-4xl font-bold tabular-nums tracking-tight text-foreground">
          {value}
        </span>
        {unit && (
          <span className="font-data text-sm text-foreground/50">
            {unit}
          </span>
        )}
      </div>
    </GlassCard>
  );
}