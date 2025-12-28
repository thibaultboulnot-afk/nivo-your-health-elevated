import React from 'react';
import { motion } from 'framer-motion';
import DashboardPreview from '@/components/previews/DashboardPreview';

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

// Scaled Dashboard container for device frames
const ScaledDashboard = ({ 
  scale, 
  width, 
  height,
  forceMobile = false 
}: { 
  scale: number; 
  width: number; 
  height: number;
  forceMobile?: boolean;
}) => (
  <div 
    className="absolute inset-0 overflow-hidden"
    style={{ 
      width: '100%',
      height: '100%',
    }}
  >
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      <DashboardPreview forceMobile={forceMobile} />
    </div>
  </div>
);

// Main component with responsive device switching
export default function HeroDeviceMockup() {
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
          {/* Dashboard scaled to fit iPhone - 375px width scaled down */}
          <ScaledDashboard scale={0.56} width={500} height={1050} forceMobile={true} />
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
          {/* Dashboard scaled to fit iPad - 1024px width scaled down */}
          <ScaledDashboard scale={0.52} width={1100} height={825} forceMobile={false} />
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
          {/* Dashboard scaled to fit MacBook - 1440px width scaled down */}
          <ScaledDashboard scale={0.58} width={1500} height={938} forceMobile={false} />
        </MacBookFrame>
      </motion.div>
    </div>
  );
}

