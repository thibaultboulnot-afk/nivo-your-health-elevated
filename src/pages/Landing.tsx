import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check, Zap, TrendingDown, AlertTriangle, Activity, Brain, Timer, Sparkles, Cpu, BarChart3, Clock, Target } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

// Scroll reveal animation wrapper
const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const
    }
  }
};

export default function Landing() {
  // Scroll animations for dashboard mockup
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"]
  });

  const dashboardRotateX = useTransform(heroScrollProgress, [0, 0.5], [15, 0]);
  const dashboardY = useTransform(heroScrollProgress, [0, 0.5], [80, 0]);
  const dashboardOpacity = useTransform(heroScrollProgress, [0, 0.3], [0.3, 1]);
  const smoothRotateX = useSpring(dashboardRotateX, { stiffness: 80, damping: 25 });
  const smoothY = useSpring(dashboardY, { stiffness: 80, damping: 25 });

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white selection:bg-primary selection:text-primary-foreground">
      
      {/* ===== CYBERPUNK GRID BACKGROUND ===== */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* ===== LIGHT ORBS ===== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary orb - top left */}
        <div 
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[150px]"
          style={{ background: 'radial-gradient(circle, rgba(255,107,74,0.15) 0%, transparent 70%)' }}
        />
        {/* Secondary orb - right */}
        <div 
          className="absolute top-1/3 -right-60 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)' }}
        />
        {/* Third orb - bottom */}
        <div 
          className="absolute -bottom-60 left-1/3 w-[700px] h-[400px] rounded-full blur-[150px]"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)' }}
        />
      </div>

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-2xl border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(255,107,74,0.4)]">
              <span className="font-sans text-white font-bold text-lg">N</span>
            </div>
            <span className="font-sans text-xl font-semibold tracking-tight">NIVO</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5 text-sm font-mono">
                Connexion
              </Button>
            </Link>
            <Link to="/onboarding">
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(255,107,74,0.4)] text-sm px-4 font-medium">
                Commencer
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== 1. HERO SECTION ===== */}
      <section className="pt-32 md:pt-44 pb-12 md:pb-20 px-4 md:px-6 relative z-10">
        <div className="container mx-auto text-center max-w-5xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* System Badge */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="font-mono text-xs text-emerald-400 uppercase tracking-wider">
                  SYSTEM V1.0 // ONLINE
                </span>
              </div>
            </motion.div>

            {/* Headline - MASSIVE */}
            <motion.h1 
              variants={itemVariants}
              className="font-sans text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[0.95] tracking-tighter"
            >
              L'OS de votre
              <br />
              <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
                colonne vertébrale.
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-white/50 font-normal mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Quantifiez votre santé dorsale. Optimisez votre posture. 
              <br className="hidden md:block" />
              Une boucle de maintenance quotidienne de <span className="text-white/80 font-medium">8 minutes</span> basée sur la data.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/onboarding">
                <Button 
                  size="lg" 
                  className="relative overflow-hidden bg-primary hover:bg-primary/90 text-white h-14 px-8 text-lg rounded-full font-semibold transition-all duration-500 hover:scale-105 shadow-[0_0_40px_rgba(255,107,74,0.4),0_0_80px_rgba(255,107,74,0.2)]"
                >
                  <span className="relative z-10 flex items-center">
                    Lancer mon Scan (Gratuit)
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </Button>
              </Link>
              <Link to="/login">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-14 px-8 rounded-full border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/80 backdrop-blur-sm"
                >
                  Connexion
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== ABSTRACT DASHBOARD VISUALIZATION ===== */}
      <section className="py-12 md:py-20 px-4 md:px-6 relative z-10" ref={heroRef}>
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            className="relative"
            style={{ 
              perspective: '2000px',
              opacity: dashboardOpacity,
            }}
          >
            {/* Glow behind dashboard */}
            <div className="absolute inset-0 -z-10">
              <div 
                className="absolute inset-x-0 top-1/4 h-[500px] blur-[120px] rounded-full" 
                style={{
                  background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,107,74,0.2) 0%, transparent 70%)'
                }}
              />
            </div>
            
            {/* Dashboard Window - Cyberpunk Style */}
            <motion.div 
              className="relative rounded-2xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl overflow-hidden"
              style={{
                rotateX: smoothRotateX,
                y: smoothY,
                transformStyle: 'preserve-3d',
                boxShadow: '0 60px 120px -30px rgba(0,0,0,0.9), 0 0 100px -30px rgba(255,107,74,0.15), inset 0 1px 0 rgba(255,255,255,0.05)'
              }}
            >
              {/* Window Chrome */}
              <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
                <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">app.nivo.health</span>
                <div className="w-16" />
              </div>
              
              {/* Dashboard Content - Abstract Grid */}
              <div className="p-6 md:p-10 grid grid-cols-3 gap-4 min-h-[320px]">
                {/* Left Panel - Score */}
                <div className="col-span-1 flex flex-col gap-4">
                  <div className="flex-1 rounded-xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md">
                    <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">NIVO SCORE</div>
                    <div className="text-5xl md:text-6xl font-bold text-white">72</div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-mono text-xs text-emerald-400">OPTIMAL</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md">
                    <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">STREAK</div>
                    <div className="text-2xl font-semibold text-primary">J-5</div>
                  </div>
                </div>

                {/* Center Panel - Circular Gauge */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className="relative w-36 h-36 md:w-44 md:h-44">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                      <circle 
                        cx="50" cy="50" r="42" fill="none" 
                        stroke="url(#scoreGradient)" 
                        strokeWidth="4" 
                        strokeLinecap="round"
                        strokeDasharray={`${72 * 2.64} ${100 * 2.64}`}
                        style={{ filter: 'drop-shadow(0 0 10px rgba(255,107,74,0.5))' }}
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ff6b4a" />
                          <stop offset="100%" stopColor="#ff9f7a" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">INTEGRITY</span>
                      <span className="text-3xl md:text-4xl font-bold text-white">72%</span>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Stats */}
                <div className="col-span-1 flex flex-col gap-4">
                  <div className="flex-1 rounded-xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md">
                    <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">PAIN INDEX</div>
                    <div className="text-2xl font-semibold text-emerald-400">-18%</div>
                    <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md">
                    <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">DAILY LOOP</div>
                    <div className="text-2xl font-semibold text-white">8 min</div>
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 backdrop-blur-md">
                    <div className="font-mono text-[10px] text-primary uppercase tracking-widest">READY TO SCAN</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== 2. PROBLÉMATIQUE SECTION ===== */}
      <section className="py-24 md:py-32 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="font-mono text-xs text-white/30 uppercase tracking-[0.2em] mb-4 block">
                // LE PROBLÈME
              </span>
              <h2 className="font-sans text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                La Sédentarité est une
                <br />
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  Dette Technique.
                </span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {/* Card 1 - Compression */}
            <ScrollReveal delay={0.1}>
              <div className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-500 hover:border-white/10 hover:bg-white/[0.04]">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,107,74,0.1) 0%, transparent 50%)' }} 
                />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(255,107,74,0.3)] transition-shadow">
                    <TrendingDown className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-sans text-xl font-semibold mb-3">Compression</h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Vos disques intervertébraux s'écrasent après 4h assis. Pression constante, usure silencieuse.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2 - Atrophie */}
            <ScrollReveal delay={0.2}>
              <div className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-500 hover:border-white/10 hover:bg-white/[0.04]">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,107,74,0.1) 0%, transparent 50%)' }} 
                />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(255,107,74,0.3)] transition-shadow">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-sans text-xl font-semibold mb-3">Atrophie</h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Vos muscles stabilisateurs s'éteignent progressivement. Moins de support, plus de vulnérabilité.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3 - Douleur */}
            <ScrollReveal delay={0.3}>
              <div className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-500 hover:border-white/10 hover:bg-white/[0.04]">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,107,74,0.1) 0%, transparent 50%)' }} 
                />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(255,107,74,0.3)] transition-shadow">
                    <AlertTriangle className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-sans text-xl font-semibold mb-3">Douleur</h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Le signal d'alarme du système. Quand ça fait mal, c'est que la dette est déjà accumulée.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== 3. SOLUTION - LE MOTEUR NIVO (RADAR SCAN) ===== */}
      <section className="py-24 md:py-32 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="font-mono text-xs text-white/30 uppercase tracking-[0.2em] mb-4 block">
                // LE MOTEUR
              </span>
              <h2 className="font-sans text-3xl md:text-5xl font-bold tracking-tight mb-6">
                Le NIVO Score :
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent"> votre métrique.</span>
              </h2>
              <p className="text-white/40 max-w-2xl mx-auto text-lg">
                Un algorithme propriétaire qui combine ressenti, mobilité et charge de travail.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Radar Scan Visualization */}
            <ScrollReveal delay={0.1}>
              <div className="relative aspect-square max-w-md mx-auto">
                {/* Pulsing glow effect */}
                <motion.div 
                  className="absolute inset-0 rounded-full blur-[80px] bg-primary/30"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.35, 0.2]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Radar container */}
                <div className="relative w-full h-full rounded-full border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl overflow-hidden">
                  
                  {/* Propagating waves - multiple rings expanding outward */}
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={`wave-${i}`}
                      className="absolute inset-0 rounded-full border border-primary/30"
                      initial={{ scale: 0.1, opacity: 0.8 }}
                      animate={{ 
                        scale: [0.1, 1.2],
                        opacity: [0.6, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 1,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                  
                  {/* Radar grid SVG */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                    {/* Concentric circles */}
                    <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    <circle cx="100" cy="100" r="20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    {/* Cross lines */}
                    <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    <line x1="29" y1="29" x2="171" y2="171" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                    <line x1="171" y1="29" x2="29" y2="171" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                    
                    {/* Data polygon with animated opacity */}
                    <motion.polygon 
                      points="100,35 155,75 145,140 55,140 45,75" 
                      fill="rgba(255,107,74,0.1)" 
                      stroke="rgba(255,107,74,0.6)" 
                      strokeWidth="1.5"
                      style={{ filter: 'drop-shadow(0 0 8px rgba(255,107,74,0.4))' }}
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Data points with pulse */}
                    {[
                      { cx: 100, cy: 35 },
                      { cx: 155, cy: 75 },
                      { cx: 145, cy: 140 },
                      { cx: 55, cy: 140 },
                      { cx: 45, cy: 75 }
                    ].map((point, i) => (
                      <g key={`point-${i}`}>
                        <motion.circle 
                          cx={point.cx} 
                          cy={point.cy} 
                          r="8" 
                          fill="rgba(255,107,74,0.2)"
                          animate={{ 
                            r: [4, 10, 4],
                            opacity: [0.4, 0.1, 0.4]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                        <circle 
                          cx={point.cx} 
                          cy={point.cy} 
                          r="4" 
                          fill="#ff6b4a" 
                          style={{ filter: 'drop-shadow(0 0 6px rgba(255,107,74,0.8))' }} 
                        />
                      </g>
                    ))}
                  </svg>
                  
                  {/* Scanning sweep - cone shape */}
                  <motion.div 
                    className="absolute top-1/2 left-1/2 w-1/2 h-1/2 origin-top-left"
                    style={{ 
                      background: 'conic-gradient(from 0deg, rgba(255,107,74,0.4) 0deg, rgba(255,107,74,0.1) 30deg, transparent 60deg)',
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  {/* Scanning line */}
                  <motion.div 
                    className="absolute top-1/2 left-1/2 w-1/2 h-0.5 origin-left"
                    style={{ 
                      background: 'linear-gradient(90deg, rgba(255,107,74,1) 0%, rgba(255,107,74,0.5) 50%, transparent 100%)',
                      boxShadow: '0 0 10px rgba(255,107,74,0.8), 0 0 20px rgba(255,107,74,0.4)'
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  {/* Floating particles */}
                  {[...Array(12)].map((_, i) => {
                    const angle = (i / 12) * Math.PI * 2;
                    const radius = 25 + Math.random() * 55;
                    const x = 50 + Math.cos(angle) * radius;
                    const y = 50 + Math.sin(angle) * radius;
                    return (
                      <motion.div
                        key={`particle-${i}`}
                        className="absolute w-1 h-1 rounded-full bg-primary"
                        style={{ 
                          left: `${x}%`, 
                          top: `${y}%`,
                          boxShadow: '0 0 4px rgba(255,107,74,0.8)'
                        }}
                        animate={{ 
                          opacity: [0, 1, 0],
                          scale: [0.5, 1.5, 0.5],
                          x: [0, (Math.random() - 0.5) * 20],
                          y: [0, (Math.random() - 0.5) * 20]
                        }}
                        transition={{ 
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                          ease: "easeInOut"
                        }}
                      />
                    );
                  })}
                  
                  {/* Center score */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <motion.span 
                      className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1"
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ANALYZING
                    </motion.span>
                    <span className="text-4xl md:text-5xl font-bold text-white">85</span>
                    <span className="font-mono text-xs text-primary mt-1">SCORE</span>
                  </div>
                </div>
                
                {/* Status labels with subtle animation */}
                <motion.div 
                  className="absolute -top-2 left-1/2 -translate-x-1/2 font-mono text-[10px] text-white/40 uppercase tracking-wider"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                >
                  SUBJECTIF: 45%
                </motion.div>
                <motion.div 
                  className="absolute top-1/2 -right-4 -translate-y-1/2 font-mono text-[10px] text-white/40 uppercase tracking-wider rotate-90 origin-center"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  FONCTIONNEL: 30%
                </motion.div>
                <motion.div 
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 font-mono text-[10px] text-white/40 uppercase tracking-wider"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  CHARGE: 25%
                </motion.div>
              </div>
            </ScrollReveal>
            
            {/* Technical Specs */}
            <ScrollReveal delay={0.2}>
              <div className="space-y-6">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="font-mono text-xs text-primary uppercase tracking-wider">INDEX_01</div>
                    <div className="flex-1 h-px bg-white/10" />
                    <div className="font-mono text-xs text-white/40">45%</div>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Index Subjectif</h4>
                  <p className="text-white/40 text-sm">Douleur VAS, fatigue perçue, raideur matinale. Auto-évaluation quotidienne.</p>
                  <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: '45%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="font-mono text-xs text-primary uppercase tracking-wider">INDEX_02</div>
                    <div className="flex-1 h-px bg-white/10" />
                    <div className="font-mono text-xs text-white/40">30%</div>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Index Fonctionnel</h4>
                  <p className="text-white/40 text-sm">Tests de mobilité McGill, flexion, extension. Mesures objectives du mouvement.</p>
                  <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: '30%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.4 }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="font-mono text-xs text-primary uppercase tracking-wider">INDEX_03</div>
                    <div className="flex-1 h-px bg-white/10" />
                    <div className="font-mono text-xs text-white/40">25%</div>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Index de Charge</h4>
                  <p className="text-white/40 text-sm">Heures assis, niveau de stress, activité physique. Facteurs de charge quotidiens.</p>
                  <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: '25%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>

                {/* Console output */}
                <div className="rounded-xl border border-white/5 bg-[#0a0a0a] p-4 font-mono text-xs">
                  <div className="text-white/30 mb-2">$ nivo --calculate-score</div>
                  <div className="text-emerald-400">&gt; LOAD: 42% | PROCESS: COMPLETE</div>
                  <div className="text-primary">&gt; SCORE_OUTPUT: 85/100</div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== 4. BENTO GRID - FEATURES ===== */}
      <section className="py-24 md:py-32 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="font-mono text-xs text-white/30 uppercase tracking-[0.2em] mb-4 block">
                // LE PROTOCOLE
              </span>
              <h2 className="font-sans text-3xl md:text-5xl font-bold tracking-tight mb-4">
                La Daily Loop :
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent"> 8 minutes.</span>
              </h2>
              <p className="text-white/40 text-lg">
                Pas du yoga. <span className="text-white/80">De l'ingénierie corporelle.</span>
              </p>
            </div>
          </ScrollReveal>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* Large Card - Algorithm */}
            <ScrollReveal delay={0.1}>
              <div className="col-span-2 row-span-2 group relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                  style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,107,74,0.1) 0%, transparent 50%)' }} 
                />
                <div className="relative h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-mono text-xs text-white/30 uppercase tracking-wider">CORE ENGINE</span>
                  </div>
                  <h3 className="font-sans text-2xl md:text-3xl font-bold mb-4">L'Algorithme Adaptatif</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-6">
                    Le système analyse vos données quotidiennes et ajuste le protocole en temps réel. Plus vous l'utilisez, plus il devient précis.
                  </p>
                  <div className="mt-auto grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
                    <div>
                      <div className="text-2xl font-bold text-primary">3</div>
                      <div className="font-mono text-[10px] text-white/30 uppercase">PHASES</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">8</div>
                      <div className="font-mono text-[10px] text-white/30 uppercase">MINUTES</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-400">∞</div>
                      <div className="font-mono text-[10px] text-white/30 uppercase">SCANS</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Small Card - Check-in */}
            <ScrollReveal delay={0.2}>
              <div className="col-span-1 group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-500 hover:border-primary/30">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" 
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,107,74,0.1) 0%, transparent 60%)' }} 
                />
                <div className="relative">
                  <Clock className="w-6 h-6 text-primary mb-4" />
                  <h4 className="font-semibold mb-2">Check-in 60s</h4>
                  <p className="text-white/40 text-xs leading-relaxed">Évaluez votre état en moins d'une minute.</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Small Card - NASA */}
            <ScrollReveal delay={0.25}>
              <div className="col-span-1 group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-500 hover:border-primary/30">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" 
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,107,74,0.1) 0%, transparent 60%)' }} 
                />
                <div className="relative">
                  <Sparkles className="w-6 h-6 text-primary mb-4" />
                  <h4 className="font-semibold mb-2">NASA Protocol</h4>
                  <p className="text-white/40 text-xs leading-relaxed">Basé sur les contre-mesures spatiales.</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Tall Card - History */}
            <ScrollReveal delay={0.3}>
              <div className="col-span-1 row-span-2 group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-500 hover:border-primary/30">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" 
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,107,74,0.1) 0%, transparent 50%)' }} 
                />
                <div className="relative h-full flex flex-col">
                  <BarChart3 className="w-6 h-6 text-primary mb-4" />
                  <h4 className="font-semibold mb-2">Suivi Historique</h4>
                  <p className="text-white/40 text-xs leading-relaxed mb-4">Visualisez l'évolution de votre score sur 30, 90, 365 jours.</p>
                  {/* Mini chart visualization */}
                  <div className="mt-auto flex items-end gap-1 h-20">
                    {[40, 55, 45, 60, 70, 65, 75, 80, 72, 85].map((h, i) => (
                      <div 
                        key={i}
                        className="flex-1 bg-gradient-to-t from-primary/60 to-primary rounded-sm"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Wide Card - 3 Steps */}
            <ScrollReveal delay={0.35}>
              <div className="col-span-1 group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-500 hover:border-primary/30">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" 
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,107,74,0.1) 0%, transparent 60%)' }} 
                />
                <div className="relative">
                  <Target className="w-6 h-6 text-primary mb-4" />
                  <h4 className="font-semibold mb-2">3 Phases</h4>
                  <div className="flex gap-2 text-[10px] font-mono text-white/40">
                    <span className="px-2 py-1 rounded bg-white/5">DECOMPRESS</span>
                    <span className="px-2 py-1 rounded bg-white/5">MOBILIZE</span>
                    <span className="px-2 py-1 rounded bg-white/5">STABILIZE</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Scientific Sources */}
          <ScrollReveal delay={0.4}>
            <div className="flex flex-wrap justify-center gap-4 mt-12 text-xs text-white/30">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02]">
                <Brain className="w-4 h-4" />
                <span className="font-mono">McGill Protocol</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02]">
                <Activity className="w-4 h-4" />
                <span className="font-mono">McKenzie Method</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02]">
                <Sparkles className="w-4 h-4" />
                <span className="font-mono">NASA Countermeasures</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== 5. PRICING ===== */}
      <section className="py-24 md:py-32 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="font-mono text-xs text-white/30 uppercase tracking-[0.2em] mb-4 block">
                // PRICING
              </span>
              <h2 className="font-sans text-3xl md:text-5xl font-bold tracking-tight">
                Choisissez votre niveau.
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Starter - Free */}
            <ScrollReveal delay={0.1}>
              <div className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm">
                <div className="mb-6">
                  <h3 className="font-sans text-xl font-semibold mb-1">Starter</h3>
                  <p className="text-white/40 text-sm">Pour surveiller vos signes vitaux.</p>
                </div>
                
                <div className="mb-8">
                  <span className="text-4xl font-bold">Gratuit</span>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm text-white/70">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Scan illimité</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/70">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Score du jour</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/70">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Routine de maintenance</span>
                  </li>
                </ul>

                <Link to="/onboarding" className="block">
                  <Button variant="outline" className="w-full h-12 border-white/10 bg-white/5 hover:bg-white/10 text-white">
                    Commencer gratuitement
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            {/* NIVO PRO */}
            <ScrollReveal delay={0.2}>
              <div className="relative rounded-2xl border border-primary/30 bg-primary/5 p-8 backdrop-blur-sm overflow-hidden">
                {/* Glow effect */}
                <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,107,74,0.3) 0%, transparent 60%)' }} />
                
                {/* Badge 7 jours */}
                <div className="absolute -top-px left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1.5 bg-primary text-white font-mono text-xs uppercase tracking-wider rounded-b-lg shadow-[0_0_30px_rgba(255,107,74,0.4)]">
                    <Timer className="w-3 h-3 inline mr-1" />
                    7 jours gratuits
                  </div>
                </div>

                <div className="relative">
                  <div className="mb-6 pt-4">
                    <h3 className="font-sans text-xl font-semibold mb-1">NIVO PRO</h3>
                    <p className="text-white/40 text-sm">Pour optimiser la machine.</p>
                  </div>
                  
                  <div className="mb-8">
                    <span className="text-4xl font-bold">9.90€</span>
                    <span className="text-white/40">/mois</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3 text-sm text-white/70">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Tout Starter</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white/70">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Protocoles Douleur (Sciatique, Cou...)</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white/70">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Historique Data</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white/70">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Mode Focus</span>
                    </li>
                  </ul>

                  <Link to="/onboarding" className="block">
                    <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(255,107,74,0.4)]">
                      Essayer 7 jours gratuit
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== 6. FOOTER ===== */}
      <footer className="py-12 px-4 md:px-6 border-t border-white/5 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(255,107,74,0.3)]">
                <span className="font-sans text-white font-bold text-lg">N</span>
              </div>
              <span className="font-sans text-lg font-semibold tracking-tight">NIVO</span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm text-white/30">
              <Link to="/cgv" className="hover:text-white/60 transition-colors font-mono text-xs">CGV</Link>
              <Link to="/confidentialite" className="hover:text-white/60 transition-colors font-mono text-xs">Confidentialité</Link>
              <Link to="/mentions-legales" className="hover:text-white/60 transition-colors font-mono text-xs">Mentions légales</Link>
            </div>

            {/* Copyright */}
            <p className="text-xs text-white/20 font-mono">
              © {new Date().getFullYear()} NIVO
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
