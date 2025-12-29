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
        boxShadow: '0 0 60px -12px rgba(74,222,128,0.25), 0 25px 50px -12px rgba(0,0,0,0.8)'
      }}
    >
      {/* Inner metallic bevel ring */}
      <div className="absolute inset-0 rounded-[2rem] ring-1 ring-white/20 ring-inset pointer-events-none" />
      
      {/* Inner screen container */}
      <div className="relative rounded-[2rem] overflow-hidden bg-zinc-950">
        {/* Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-24 h-7 bg-black rounded-full">
          {/* Subtle camera lens inside dynamic island */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-zinc-900 ring-1 ring-zinc-700">
            <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-zinc-600/50 to-zinc-800" />
          </div>
        </div>
        
        {/* Screen content */}
        <div className="relative aspect-[9/19.5]">
          {children}
        </div>
        
        {/* Glass reflection overlay - diagonal sweep */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-[2rem]"
          style={{
            background: 'linear-gradient(135deg, transparent 0%, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%, transparent 100%)'
          }}
        />
      </div>
    </div>
    
    {/* Side buttons with metallic look */}
    <div className="absolute left-0 top-24 w-[3px] h-8 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] rounded-l-sm" />
    <div className="absolute left-0 top-36 w-[3px] h-12 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] rounded-l-sm" />
    <div className="absolute left-0 top-52 w-[3px] h-12 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] rounded-l-sm" />
    <div className="absolute right-0 top-32 w-[3px] h-16 bg-gradient-to-l from-[#1a1a1a] to-[#2a2a2a] rounded-r-sm" />
  </div>
);

// MacBook Pro Frame
const MacBookFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    {/* Screen housing */}
    <div 
      className="relative bg-[#0d0d0d] rounded-t-xl pt-3 px-3 pb-2 border border-white/10 border-b-0"
      style={{
        boxShadow: '0 0 60px -12px rgba(74,222,128,0.2)'
      }}
    >
      {/* Camera notch */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-black border border-white/10 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 relative overflow-hidden">
          {/* Camera lens reflection */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-transparent to-transparent" />
          <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-white/40" />
        </div>
      </div>
      
      {/* Screen bezel */}
      <div className="relative bg-zinc-950 rounded-lg overflow-hidden border border-white/5">
        {/* Screen content */}
        <div className="relative aspect-[16/10]">
          {children}
        </div>
        
        {/* Glass reflection overlay - diagonal sweep */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent 0%, transparent 35%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.04) 55%, transparent 65%, transparent 100%)'
          }}
        />
      </div>
    </div>
    
    {/* Hinge */}
    <div className="relative h-3 bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-b-sm mx-[10%]" />
    
    {/* Keyboard base - trapezoid effect with aluminum texture */}
    <div className="relative">
      <div 
        className="h-4 rounded-b-xl relative overflow-hidden"
        style={{
          clipPath: 'polygon(3% 0%, 97% 0%, 100% 100%, 0% 100%)',
          background: 'linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 50%, #1a1a1a 100%)',
          boxShadow: '0 20px 50px -12px rgba(74,222,128,0.15), 0 8px 24px -4px rgba(0,0,0,0.5)'
        }}
      >
        {/* Subtle aluminum grain texture */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.02) 1px, rgba(255,255,255,0.02) 2px)'
          }}
        />
      </div>
      {/* Trackpad hint */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-zinc-600/40 rounded-full" />
    </div>
    
    {/* Diffuse green-tinted shadow */}
    <div 
      className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-12 rounded-full blur-2xl"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(74,222,128,0.12) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)'
      }}
    />
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
