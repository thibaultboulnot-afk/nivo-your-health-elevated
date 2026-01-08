import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Flame, Building2 } from 'lucide-react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { GlassCard } from '@/components/ui/GlassCard';
import { useLifetimeSpots } from '@/hooks/useLifetimeSpots';

// Premium text reveal animation - words appear one by one
const TextReveal = ({ 
  children, 
  className = "",
  delay = 0 
}: { 
  children: string; 
  className?: string;
  delay?: number;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const words = children.split(' ');
  
  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ 
            duration: 0.5, 
            delay: delay + i * 0.08,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

// Scroll reveal with directional animation
const ScrollReveal = ({ 
  children, 
  delay = 0,
  direction = 'up'
}: { 
  children: React.ReactNode; 
  delay?: number;
  direction?: 'up' | 'left' | 'right';
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const variants = {
    hidden: { 
      opacity: 0, 
      x: direction === 'left' ? -80 : direction === 'right' ? 80 : 0,
      y: direction === 'up' ? 60 : 0
    },
    visible: { 
      opacity: 1, 
      x: 0,
      y: 0
    }
  };
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.9, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

// Floating animation for visuals
const FloatingElement = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    className={className}
    animate={{ 
      y: [0, -12, 0],
      rotateZ: [0, 0.5, 0, -0.5, 0]
    }}
    transition={{ 
      duration: 6, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
  >
    {children}
  </motion.div>
);

// Infinite Marquee Component
const InfiniteMarquee = ({ 
  children, 
  direction = 'left',
  speed = 30
}: { 
  children: React.ReactNode; 
  direction?: 'left' | 'right';
  speed?: number;
}) => {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex gap-6"
        animate={{ 
          x: direction === 'left' ? [0, -1920] : [-1920, 0]
        }}
        transition={{ 
          duration: speed,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
};

// Theme Card for Marquee
const ThemeCard = ({ 
  name, 
  gradient, 
  accent 
}: { 
  name: string; 
  gradient: string; 
  accent: string;
}) => (
  <div className="flex-shrink-0 w-72 h-48 rounded-2xl overflow-hidden relative group cursor-pointer">
    {/* Glass background */}
    <div className={`absolute inset-0 ${gradient}`} />
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
    
    {/* Inner border glow */}
    <div className="absolute inset-[1px] rounded-2xl border border-white/10" />
    
    {/* Fake UI elements */}
    <div className="relative h-full p-5 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${accent}`} />
        <div className="h-2 w-16 rounded-full bg-white/20" />
      </div>
      
      {/* Content blocks */}
      <div className="flex-1 space-y-3">
        <div className="h-3 w-full rounded bg-white/10" />
        <div className="h-3 w-3/4 rounded bg-white/10" />
        <div className="flex gap-2 mt-4">
          <div className="h-8 w-20 rounded-lg bg-white/5 border border-white/10" />
          <div className={`h-8 w-20 rounded-lg ${accent} opacity-60`} />
        </div>
      </div>
      
      {/* Label */}
      <div className="mt-auto">
        <span className="font-data text-[10px] uppercase tracking-[0.15em] text-white/50">{name}</span>
      </div>
    </div>
    
    {/* Hover glow */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-white/5 to-transparent" />
  </div>
);

export default function Landing() {
  const isMobile = useIsMobile();
  const { spotsRemaining, loading } = useLifetimeSpots();
  const displaySpots = loading ? 93 : (spotsRemaining ?? 93);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Theme cards data
  const themeCards = [
    { name: "Dark Mode", gradient: "bg-gradient-to-br from-slate-900 to-slate-950", accent: "bg-blue-500" },
    { name: "Focus Mode", gradient: "bg-gradient-to-br from-emerald-950 to-slate-950", accent: "bg-emerald-500" },
    { name: "Midnight Blue", gradient: "bg-gradient-to-br from-blue-950 to-indigo-950", accent: "bg-indigo-400" },
    { name: "Obsidian", gradient: "bg-gradient-to-br from-zinc-900 to-neutral-950", accent: "bg-zinc-400" },
    { name: "Deep Ocean", gradient: "bg-gradient-to-br from-cyan-950 to-slate-950", accent: "bg-cyan-400" },
    { name: "Noir", gradient: "bg-gradient-to-br from-neutral-900 to-black", accent: "bg-white" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground selection:bg-primary selection:text-primary-foreground">
      
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-background/60 backdrop-blur-2xl border-b border-white/[0.04]" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-24 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(46,92,255,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]">
              <span className="font-heading text-white font-bold text-lg">N</span>
            </div>
            <span className="font-heading text-xl font-semibold tracking-tight">NIVO</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-foreground/50 hover:text-foreground hover:bg-white/[0.03] text-sm font-medium">
                Connexion
              </Button>
            </Link>
            <Link to="/onboarding">
              <Button className="bg-white text-background hover:bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.15),inset_0_1px_0_rgba(255,255,255,0.2)] text-sm px-5 font-semibold rounded-xl">
                Commencer
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== SECTION 1: HERO ===== */}
      <section ref={heroRef} className="min-h-screen pt-32 md:pt-40 pb-20 relative z-10 flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            {/* Left: Text Content */}
            <motion.div 
              className="max-w-xl"
              style={{ y: heroY, opacity: heroOpacity }}
            >
              <ScrollReveal direction="left">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 backdrop-blur-xl"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-data text-xs text-foreground/60 uppercase tracking-wider">Système Opérationnel</span>
                </motion.div>
                
                <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold mb-8 leading-[0.95] tracking-tight">
                  <TextReveal>Optimisez votre</TextReveal>
                  <br />
                  <span className="text-primary">
                    <TextReveal delay={0.3}>architecture corporelle.</TextReveal>
                  </span>
                </h1>

                <motion.p 
                  className="text-lg md:text-xl text-foreground/50 font-body mb-10 leading-relaxed max-w-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  Le premier OS de performance pour les professionnels du digital. Corrigez votre posture et prolongez votre endurance en <span className="text-foreground font-medium font-data">8 minutes</span> par jour.
                </motion.p>

                {/* CTA */}
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  <Link to="/onboarding">
                    <Button 
                      size="xl" 
                      className="relative overflow-hidden bg-white text-background hover:bg-white/95 h-16 px-10 text-lg rounded-2xl font-semibold transition-all shadow-[0_0_60px_rgba(255,255,255,0.2),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_0_80px_rgba(255,255,255,0.3)] group"
                    >
                      <span className="relative z-10 flex items-center">
                        Lancer le Diagnostic Gratuit
                        <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                  
                  <p className="text-sm text-foreground/30 font-data">Pas de CB requise</p>
                </motion.div>
              </ScrollReveal>
            </motion.div>

            {/* Right: Dashboard Visual - Off-screen effect */}
            <ScrollReveal direction="right" delay={0.3}>
              <FloatingElement className="relative lg:-mr-32 xl:-mr-48">
                {/* Dashboard mockup with off-screen effect */}
                <div className="relative">
                  {/* Outer glow */}
                  <div className="absolute -inset-8 bg-primary/20 blur-[100px] rounded-full -z-10" />
                  
                  <div className="relative rounded-3xl overflow-hidden bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] p-1 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]">
                    {/* Inner content */}
                    <div className="rounded-[20px] bg-background/80 p-6 md:p-8 space-y-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                            <span className="font-data text-2xl font-bold text-primary">78</span>
                          </div>
                          <div>
                            <div className="font-heading text-lg font-semibold">Score NIVO</div>
                            <div className="font-data text-xs text-foreground/40">Calibration active</div>
                          </div>
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                          <span className="font-data text-sm text-emerald-400 font-medium">+12 pts</span>
                        </div>
                      </div>
                      
                      {/* Chart placeholder */}
                      <div className="h-36 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-end justify-around px-6 pb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                        {[40, 55, 45, 65, 70, 78, 85].map((h, i) => (
                          <motion.div 
                            key={i}
                            className="w-8 rounded-t-lg bg-gradient-to-t from-primary/40 to-primary shadow-[0_0_20px_rgba(46,92,255,0.3)]"
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: 1.2 + i * 0.1, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                          />
                        ))}
                      </div>
                      
                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: 'Sessions', value: '42' },
                          { label: 'Heures', value: '12.5' },
                          { label: 'Progrès', value: '+34%' }
                        ].map((stat, i) => (
                          <div key={i} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                            <div className="font-data text-xl font-bold text-foreground">{stat.value}</div>
                            <div className="font-data text-[10px] text-foreground/40 uppercase tracking-wider">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </FloatingElement>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: LE PROBLÈME ===== */}
      <section className="min-h-[90vh] py-32 relative z-10 flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left: Visual */}
            <ScrollReveal direction="left">
              <FloatingElement className="relative">
                <div className="relative aspect-square max-w-lg mx-auto lg:mx-0">
                  {/* Background glow */}
                  <div className="absolute inset-0 bg-red-500/10 blur-[80px] rounded-full" />
                  
                  {/* Glass container */}
                  <div className="absolute inset-0 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      {/* Silhouette at desk */}
                      <svg viewBox="0 0 300 300" className="w-full h-full">
                        {/* Desk */}
                        <motion.rect
                          x="40" y="200" width="220" height="8" rx="2"
                          fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                          transition={{ duration: 1 }}
                        />
                        
                        {/* Monitor */}
                        <motion.rect
                          x="100" y="120" width="100" height="70" rx="4"
                          fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                        <motion.rect
                          x="140" y="190" width="20" height="10"
                          fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        />
                        
                        {/* Hunched person silhouette - spine highlighted */}
                        <motion.path
                          d="M 150 80 Q 145 95 142 110 Q 138 130 140 150 Q 142 170 150 190"
                          fill="none"
                          stroke="rgba(239, 68, 68, 0.6)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                        />
                        
                        {/* Head */}
                        <motion.circle
                          cx="150" cy="70" r="20"
                          fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.8 }}
                        />
                        
                        {/* Pressure points */}
                        {[{ cx: 142, cy: 120 }, { cx: 140, cy: 145 }, { cx: 145, cy: 170 }].map((point, i) => (
                          <motion.circle
                            key={i}
                            cx={point.cx} cy={point.cy} r="6"
                            fill="rgba(239, 68, 68, 0.4)"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                            transition={{ delay: 1.5 + i * 0.3, duration: 2, repeat: Infinity }}
                          />
                        ))}
                        
                        {/* Warning indicator */}
                        <motion.text
                          x="200" y="140"
                          fill="rgba(239, 68, 68, 0.8)"
                          fontSize="12"
                          fontFamily="JetBrains Mono"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ delay: 2, duration: 2, repeat: Infinity }}
                        >
                          ALERT
                        </motion.text>
                      </svg>
                    </div>
                  </div>
                </div>
              </FloatingElement>
            </ScrollReveal>

            {/* Right: Text */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="max-w-lg lg:ml-auto">
                <motion.span 
                  className="font-data text-xs text-red-400/80 uppercase tracking-[0.2em] mb-6 block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  // DIAGNOSTIC SYSTÈME
                </motion.span>
                
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-8">
                  <TextReveal>Une défaillance</TextReveal>
                  <br />
                  <span className="text-red-400">
                    <TextReveal delay={0.3}>critique silencieuse.</TextReveal>
                  </span>
                </h2>
                
                <motion.p 
                  className="text-foreground/50 text-lg md:text-xl leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <span className="font-data text-foreground/70">2 200 heures</span> de position assise par an créent une compression continue. Ce n'est pas de la fatigue, c'est une <span className="text-foreground/70 font-medium">usure structurelle</span> qui réduit votre productivité cognitive de <span className="font-data text-red-400">40%</span>.
                </motion.p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: LA SOLUTION ===== */}
      <section className="min-h-[90vh] py-32 relative z-10 flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left: Text */}
            <ScrollReveal direction="left">
              <div className="max-w-lg">
                <motion.span 
                  className="font-data text-xs text-primary/80 uppercase tracking-[0.2em] mb-6 block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  // PROTOCOLE DE RÉHABILITATION
                </motion.span>
                
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-8">
                  <TextReveal>Calibration</TextReveal>
                  <br />
                  <span className="text-primary">
                    <TextReveal delay={0.3}>Biométrique.</TextReveal>
                  </span>
                </h2>
                
                <motion.p 
                  className="text-foreground/50 text-lg md:text-xl leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  NIVO analyse votre posture via webcam et génère un protocole de maintenance précis. Pas d'effort inutile, juste de la <span className="text-foreground/70 font-medium">réhabilitation ciblée</span>.
                </motion.p>
              </div>
            </ScrollReveal>

            {/* Right: Visual - Scanner/Chart */}
            <ScrollReveal direction="right" delay={0.2}>
              <FloatingElement className="relative lg:-mr-16">
                {/* Outer glow */}
                <div className="absolute -inset-8 bg-primary/15 blur-[80px] rounded-full -z-10" />
                
                <div className="relative rounded-3xl overflow-hidden bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] p-1 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <div className="rounded-[20px] bg-background/80 p-6 md:p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-data text-xs text-foreground/40 uppercase tracking-wider">Évolution Architecture</span>
                      <span className="font-data text-sm text-primary font-medium">+34%</span>
                    </div>
                    
                    {/* Chart with upward trend */}
                    <div className="h-44 relative rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                      <svg className="w-full h-full" viewBox="0 0 400 180" preserveAspectRatio="none">
                        {/* Grid lines */}
                        {[0, 45, 90, 135, 180].map((y) => (
                          <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.03)" />
                        ))}
                        
                        {/* Gradient fill under curve */}
                        <defs>
                          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(46,92,255,0.3)" />
                            <stop offset="100%" stopColor="rgba(46,92,255,0.8)" />
                          </linearGradient>
                          <linearGradient id="chartFill" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(46,92,255,0.3)" />
                            <stop offset="100%" stopColor="rgba(46,92,255,0)" />
                          </linearGradient>
                        </defs>
                        
                        <motion.path
                          d="M 0 150 Q 50 140, 100 130 T 200 100 T 300 50 T 400 20 L 400 180 L 0 180 Z"
                          fill="url(#chartFill)"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.5, duration: 1 }}
                        />
                        
                        {/* Ascending curve */}
                        <motion.path
                          d="M 0 150 Q 50 140, 100 130 T 200 100 T 300 50 T 400 20"
                          fill="none"
                          stroke="url(#chartGradient)"
                          strokeWidth={3}
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2.5, ease: "easeOut" }}
                        />
                        
                        {/* End point glow */}
                        <motion.circle
                          cx="400" cy="20" r="6"
                          fill="rgba(46,92,255,1)"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 2.5 }}
                        />
                        <motion.circle
                          cx="400" cy="20" r="12"
                          fill="none"
                          stroke="rgba(46,92,255,0.5)"
                          strokeWidth="2"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ delay: 2.5, duration: 2, repeat: Infinity }}
                        />
                      </svg>
                    </div>
                    
                    {/* Data points */}
                    <div className="flex justify-between mt-4 px-2">
                      {['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'].map((week) => (
                        <div key={week} className="text-center">
                          <div className="font-data text-[10px] text-foreground/30">{week}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FloatingElement>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: EFFET OPAL - MARQUEE INFINI ===== */}
      <section className="py-32 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mb-16">
          <ScrollReveal>
            <div className="text-center">
              <span className="font-data text-xs text-foreground/40 uppercase tracking-[0.2em] mb-4 block">
                // PERSONNALISATION
              </span>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Intégrez NIVO à votre
                <br />
                <span className="text-primary">Espace de Travail.</span>
              </h2>
            </div>
          </ScrollReveal>
        </div>
        
        {/* Marquee Row 1 - Left */}
        <div className="mb-6">
          <InfiniteMarquee direction="left" speed={40}>
            {themeCards.map((theme, i) => (
              <ThemeCard key={`row1-${i}`} {...theme} />
            ))}
          </InfiniteMarquee>
        </div>
        
        {/* Marquee Row 2 - Right */}
        <div>
          <InfiniteMarquee direction="right" speed={35}>
            {[...themeCards].reverse().map((theme, i) => (
              <ThemeCard key={`row2-${i}`} {...theme} />
            ))}
          </InfiniteMarquee>
        </div>
        
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      </section>

      {/* ===== SECTION 5: NIVO CORPORATE ===== */}
      <section className="py-32 relative z-10 bg-[#111]">
        {/* Border top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="max-w-lg">
                <div className="inline-flex items-center gap-3 mb-8">
                  <Building2 className="w-5 h-5 text-foreground/40" />
                  <span className="font-data text-xs text-foreground/40 uppercase tracking-[0.2em]">Enterprise</span>
                </div>
                
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                  <TextReveal>Offre Entreprise</TextReveal>
                  <br />
                  <span className="text-foreground/60">
                    <TextReveal delay={0.2}>& Flottes.</TextReveal>
                  </span>
                </h2>
                
                <motion.p 
                  className="text-foreground/40 text-lg leading-relaxed mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  Réduisez les arrêts de travail et maximisez la longévité de vos équipes. Solution déployable instantanément sur l'ensemble de votre organisation.
                </motion.p>
                
                <Link to="/contact">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-white/20 text-foreground/80 hover:bg-white/5 hover:border-white/30 rounded-xl px-8 h-14 font-medium transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                  >
                    Contacter le pôle Entreprise
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="right" delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '-40%', label: 'Arrêts maladie' },
                  { value: '+25%', label: 'Productivité' },
                  { value: '8min', label: 'Par jour' },
                  { value: '100+', label: 'Entreprises' }
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <div className="font-data text-2xl md:text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                    <div className="font-data text-xs text-foreground/40 uppercase tracking-wider">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
        
        {/* Border bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      {/* ===== SECTION 6: OFFRE FOUNDER ===== */}
      <section id="founder" className="min-h-[90vh] py-32 relative z-10 flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              {/* Massive Titanium Glass Card */}
              <div className="relative">
                {/* Outer glow */}
                <div className="absolute -inset-4 bg-primary/10 blur-[60px] rounded-[40px] -z-10" />
                
                {/* Card */}
                <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-2xl border border-white/[0.1] p-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]">
                  {/* Inner container */}
                  <div className="rounded-[24px] bg-background/60 p-10 md:p-16 text-center">
                    <motion.span 
                      className="font-data text-xs text-primary uppercase tracking-[0.25em] mb-8 block"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      // LAUNCH EDITION
                    </motion.span>
                    
                    <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-6">
                      <TextReveal>Accès Founder</TextReveal>
                      <br />
                      <span className="text-primary">
                        <TextReveal delay={0.2}>(Launch Edition)</TextReveal>
                      </span>
                    </h2>
                    
                    <motion.p 
                      className="text-foreground/50 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      Accédez à la licence NIVO à vie pour le prix d'une chaise de bureau.
                    </motion.p>
                    
                    {/* Price */}
                    <motion.div 
                      className="mb-10"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <span className="font-data text-6xl md:text-7xl lg:text-8xl font-bold text-foreground">149€</span>
                      <span className="text-foreground/40 text-base ml-3">Paiement unique à vie</span>
                    </motion.div>
                    
                    {/* Counter */}
                    <motion.div 
                      className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-red-500/10 border border-red-500/20 mb-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      <Flame className="w-5 h-5 text-red-400" />
                      <span className="font-data text-sm text-red-400">
                        <span className="font-bold">{displaySpots}</span> places restantes avant passage à l'abonnement mensuel
                      </span>
                    </motion.div>
                    
                    {/* CTA */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                    >
                      <Link to="/checkout?plan=lifetime">
                        <Button 
                          size="xl"
                          className="bg-primary hover:bg-primary/90 text-white h-16 px-12 text-lg rounded-2xl font-semibold shadow-[0_0_60px_rgba(46,92,255,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(46,92,255,0.6)] transition-all"
                        >
                          Sécuriser ma licence à vie
                          <ArrowRight className="ml-3 h-5 w-5" />
                        </Button>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-16 px-6 md:px-12 lg:px-24 border-t border-white/[0.04] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(46,92,255,0.3)]">
                <span className="font-heading text-white font-bold text-sm">N</span>
              </div>
              <span className="font-heading text-base font-semibold">NIVO</span>
              <span className="text-foreground/30 text-xs font-data ml-2">© 2025</span>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-foreground/40 font-data">
              <Link to="/mentions-legales" className="hover:text-foreground/60 transition-colors">Mentions Légales</Link>
              <Link to="/confidentialite" className="hover:text-foreground/60 transition-colors">Confidentialité</Link>
              <Link to="/cgv" className="hover:text-foreground/60 transition-colors">CGV</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
