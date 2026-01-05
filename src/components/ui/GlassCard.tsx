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
        // Base Deep Glass Style
        "relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-300",
        // Hover effect
        onClick && "cursor-pointer hover:bg-white/[0.05] hover:border-white/[0.12]",
        // Premium breathing border
        premium && "animate-breathe-border border-amber-400/20",
        // Glowing effect
        glowing && "shadow-[0_0_30px_-5px_rgba(255,107,74,0.3)]",
        className
      )}
    >
      {/* Optional shine effect for premium cards */}
      {premium && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-card-shine" />
        </div>
      )}
      {children}
    </div>
  );
}

// Stat card variant
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
      <span className="font-mono text-[10px] text-foreground/40 uppercase tracking-wider block mb-1">
        {label}
      </span>
      <span className={cn("font-mono text-2xl font-bold tabular-nums tracking-tight", valueColor)}>
        {value}
      </span>
    </GlassCard>
  );
}
