import React from 'react';
import { motion } from 'framer-motion';
import { MobileMockupScreen, DesktopMockupScreen } from '@/components/previews/DedicatedMockups';

// iPhone 15 Pro Frame
const IPhoneFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    {/* Phone body with realistic bezel */}
    <div 
      className="relative rounded-[2.5rem] border-[8px] border-[#1a1a1a] bg-black shadow-2xl"
      style={{
        boxShadow: '0 0 50px -12px rgba(74,222,128,0.3), 0 25px 50px -12px rgba(0,0,0,0.8)'
      }}
    >
      {/* Inner screen container */}
      <div className="relative rounded-[2rem] overflow-hidden bg-zinc-950">
        {/* Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-24 h-7 bg-black rounded-full" />
        
        {/* Screen content */}
        <div className="relative aspect-[9/19.5]">
          {children}
        </div>
        
        {/* Glass reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none rounded-[2rem]" />
      </div>
    </div>
    
    {/* Side buttons */}
    <div className="absolute left-0 top-24 w-[3px] h-8 bg-[#2a2a2a] rounded-l-sm" />
    <div className="absolute left-0 top-36 w-[3px] h-12 bg-[#2a2a2a] rounded-l-sm" />
    <div className="absolute left-0 top-52 w-[3px] h-12 bg-[#2a2a2a] rounded-l-sm" />
    <div className="absolute right-0 top-32 w-[3px] h-16 bg-[#2a2a2a] rounded-r-sm" />
  </div>
);

// MacBook Pro Frame
const MacBookFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    {/* Screen housing */}
    <div className="relative bg-[#0d0d0d] rounded-t-xl pt-3 px-3 pb-2 border border-white/10 border-b-0">
      {/* Camera notch */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-black border border-white/10 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
      </div>
      
      {/* Screen bezel */}
      <div className="relative bg-zinc-950 rounded-lg overflow-hidden border border-white/5">
        {/* Screen content */}
        <div className="relative aspect-[16/10]">
          {children}
        </div>
        
        {/* Glass reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.06] pointer-events-none" />
      </div>
    </div>
    
    {/* Hinge */}
    <div className="relative h-3 bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-b-sm mx-[10%]" />
    
    {/* Keyboard base - trapezoid effect */}
    <div className="relative">
      <div 
        className="h-4 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-b-xl"
        style={{
          clipPath: 'polygon(3% 0%, 97% 0%, 100% 100%, 0% 100%)',
          boxShadow: '0 0 50px -12px rgba(74,222,128,0.3)'
        }}
      />
      {/* Trackpad hint */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-zinc-700/50 rounded-full" />
    </div>
    
    {/* Shadow */}
    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[95%] h-10 bg-black/50 blur-2xl rounded-full" />
  </div>
);

export default function HeroDeviceMockup() {
  const deviceVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div className="relative w-full flex items-center justify-center">
      {/* Glow effect behind device */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="absolute inset-x-0 top-1/4 h-[400px] blur-[100px] rounded-full" 
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(74,222,128,0.15) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Mobile: iPhone */}
      <motion.div 
        className="block md:hidden w-[280px] max-w-[85vw]"
        variants={deviceVariants}
        initial="hidden"
        animate="visible"
      >
        <IPhoneFrame>
          <MobileMockupScreen />
        </IPhoneFrame>
      </motion.div>

      {/* Desktop: MacBook */}
      <motion.div 
        className="hidden md:block w-[800px] max-w-[90vw]"
        variants={deviceVariants}
        initial="hidden"
        animate="visible"
      >
        <MacBookFrame>
          <DesktopMockupScreen />
        </MacBookFrame>
      </motion.div>
    </div>
  );
}
