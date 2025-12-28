import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

// Dashboard skeleton placeholder component
const DashboardSkeleton = ({ device }: { device: 'mobile' | 'tablet' | 'desktop' }) => {
  const isMobileLayout = device === 'mobile';
  const isTabletLayout = device === 'tablet';
  
  return (
    <div className="w-full h-full bg-[#0a0a0a] p-3 md:p-4 flex flex-col gap-2 md:gap-3">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-primary/30 animate-pulse" />
          <div className="w-16 md:w-20 h-3 md:h-4 rounded bg-white/10 animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/10 animate-pulse" />
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/10 animate-pulse" />
        </div>
      </div>
      
      {/* Bento Grid skeleton */}
      <div className={`flex-1 grid gap-2 md:gap-3 ${
        isMobileLayout 
          ? 'grid-cols-2 grid-rows-3' 
          : isTabletLayout 
            ? 'grid-cols-3 grid-rows-2' 
            : 'grid-cols-4 grid-rows-2'
      }`}>
        {/* Score card - larger */}
        <div className={`${isMobileLayout ? 'col-span-1 row-span-2' : 'col-span-1 row-span-2'} rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 p-3 flex flex-col justify-between`}>
          <div className="w-12 h-2 rounded bg-white/20 animate-pulse" />
          <div className="space-y-1">
            <div className="text-2xl md:text-4xl font-bold text-white/80">72</div>
            <div className="w-8 h-1.5 rounded bg-emerald-400/50 animate-pulse" />
          </div>
        </div>
        
        {/* Other cards */}
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-2 md:p-3 flex flex-col gap-1">
          <div className="w-10 h-1.5 rounded bg-white/10 animate-pulse" />
          <div className="w-6 h-4 rounded bg-white/20 animate-pulse mt-auto" />
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-2 md:p-3 flex flex-col gap-1">
          <div className="w-10 h-1.5 rounded bg-white/10 animate-pulse" />
          <div className="flex-1 flex items-end">
            <div className="w-full h-8 rounded bg-white/5 animate-pulse" />
          </div>
        </div>
        {!isMobileLayout && (
          <>
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-2 md:p-3 flex flex-col gap-1">
              <div className="w-10 h-1.5 rounded bg-white/10 animate-pulse" />
              <div className="w-full h-4 rounded bg-emerald-400/20 animate-pulse mt-auto" />
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-2 md:p-3 flex flex-col gap-1">
              <div className="w-10 h-1.5 rounded bg-white/10 animate-pulse" />
              <div className="w-8 h-4 rounded bg-white/20 animate-pulse mt-auto" />
            </div>
          </>
        )}
        <div className={`${isMobileLayout ? 'col-span-2' : 'col-span-2'} rounded-xl bg-white/[0.03] border border-white/5 p-2 md:p-3`}>
          <div className="w-16 h-1.5 rounded bg-white/10 animate-pulse mb-2" />
          <div className="flex gap-1">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex-1 h-10 md:h-16 rounded bg-white/5 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        </div>
        {!isMobileLayout && (
          <div className="rounded-xl bg-primary/10 border border-primary/20 p-2 md:p-3 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-primary/40 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};

// iPhone Frame Component
const IPhoneFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    {/* Phone body */}
    <div className="relative bg-[#1a1a1a] rounded-[2.5rem] p-[8px] shadow-2xl shadow-black/50">
      {/* Inner bezel */}
      <div className="relative bg-[#0d0d0d] rounded-[2rem] overflow-hidden">
        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-24 h-7 bg-black rounded-full" />
        
        {/* Screen content */}
        <div className="relative aspect-[9/19.5] overflow-hidden">
          {children}
        </div>
        
        {/* Glass reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] via-transparent to-white/[0.08] pointer-events-none rounded-[2rem]" />
      </div>
    </div>
    
    {/* Side buttons - volume */}
    <div className="absolute left-0 top-24 w-[3px] h-8 bg-[#2a2a2a] rounded-l-sm" />
    <div className="absolute left-0 top-36 w-[3px] h-12 bg-[#2a2a2a] rounded-l-sm" />
    <div className="absolute left-0 top-52 w-[3px] h-12 bg-[#2a2a2a] rounded-l-sm" />
    {/* Power button */}
    <div className="absolute right-0 top-32 w-[3px] h-16 bg-[#2a2a2a] rounded-r-sm" />
  </div>
);

// iPad Frame Component
const IPadFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    {/* Tablet body */}
    <div className="relative bg-[#1a1a1a] rounded-[1.5rem] p-[10px] shadow-2xl shadow-black/50">
      {/* Inner bezel */}
      <div className="relative bg-[#0d0d0d] rounded-[1rem] overflow-hidden">
        {/* Front camera */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-2.5 h-2.5 bg-[#1a1a1a] rounded-full border border-[#333]" />
        
        {/* Screen content - landscape aspect ratio */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {children}
        </div>
        
        {/* Glass reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-white/[0.06] pointer-events-none rounded-[1rem]" />
      </div>
    </div>
    
    {/* Side buttons */}
    <div className="absolute right-6 top-0 h-[3px] w-12 bg-[#2a2a2a] rounded-t-sm" />
    <div className="absolute right-20 top-0 h-[3px] w-8 bg-[#2a2a2a] rounded-t-sm" />
  </div>
);

// MacBook Frame Component
const MacBookFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    {/* Screen housing */}
    <div className="relative bg-[#1a1a1a] rounded-t-xl pt-3 px-3 pb-2">
      {/* Camera notch */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#0d0d0d] border border-[#333] flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[#222]" />
      </div>
      
      {/* Screen bezel */}
      <div className="relative bg-[#0d0d0d] rounded-lg overflow-hidden border border-[#2a2a2a]">
        {/* Screen content */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {children}
        </div>
        
        {/* Glass reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-white/[0.05] pointer-events-none" />
      </div>
    </div>
    
    {/* Hinge/connector */}
    <div className="relative h-3 bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-b-sm mx-[10%]" />
    
    {/* Keyboard base - perspective trapezoid effect */}
    <div className="relative">
      <div 
        className="h-4 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-b-xl"
        style={{
          clipPath: 'polygon(3% 0%, 97% 0%, 100% 100%, 0% 100%)',
        }}
      />
      {/* Trackpad indicator */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-[#333] rounded-full" />
    </div>
    
    {/* Shadow */}
    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-8 bg-black/40 blur-xl rounded-full" />
  </div>
);

// Main component with responsive device switching
export default function HeroDeviceMockup() {
  const isMobile = useIsMobile();
  
  // Animation variants for 3D entrance
  const deviceVariants = {
    hidden: { 
      opacity: 0, 
      rotateX: 15, 
      y: 60,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      rotateX: 0, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div className="relative w-full flex items-center justify-center" style={{ perspective: '2000px' }}>
      {/* Glow effect behind device */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="absolute inset-x-0 top-1/4 h-[400px] blur-[100px] rounded-full" 
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,107,74,0.2) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Mobile: iPhone */}
      <motion.div 
        className="block md:hidden w-[280px] max-w-[85vw]"
        variants={deviceVariants}
        initial="hidden"
        animate="visible"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <IPhoneFrame>
          {/* Placeholder - will be replaced with image */}
          <img 
            src="/src/assets/dashboard-mobile.png" 
            alt="NIVO Dashboard Mobile"
            className="w-full h-full object-cover hidden"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <DashboardSkeleton device="mobile" />
        </IPhoneFrame>
      </motion.div>

      {/* Tablet: iPad (768px - 1024px) */}
      <motion.div 
        className="hidden md:block lg:hidden w-[600px] max-w-[90vw]"
        variants={deviceVariants}
        initial="hidden"
        animate="visible"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <IPadFrame>
          {/* Placeholder - will be replaced with image */}
          <img 
            src="/src/assets/dashboard-tablet.png" 
            alt="NIVO Dashboard Tablet"
            className="w-full h-full object-cover hidden"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <DashboardSkeleton device="tablet" />
        </IPadFrame>
      </motion.div>

      {/* Desktop: MacBook (> 1024px) */}
      <motion.div 
        className="hidden lg:block w-[900px] max-w-[90vw]"
        variants={deviceVariants}
        initial="hidden"
        animate="visible"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <MacBookFrame>
          {/* Placeholder - will be replaced with image */}
          <img 
            src="/src/assets/dashboard-desktop.png" 
            alt="NIVO Dashboard Desktop"
            className="w-full h-full object-cover hidden"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <DashboardSkeleton device="desktop" />
        </MacBookFrame>
      </motion.div>
    </div>
  );
}

