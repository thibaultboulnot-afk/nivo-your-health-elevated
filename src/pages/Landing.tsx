import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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

// Animated floating orb component
const FloatingOrb = ({ 
  className, 
  color, 
  delay = 0,
  duration = 10,
  xRange = [0, 50, 0],
  yRange = [0, 30, 0],
  scaleRange = [1, 1.2, 1],
}: {
  className: string;
  color: string;
  delay?: number;
  duration?: number;
  xRange?: number[];
  yRange?: number[];
  scaleRange?: number[];
}) => (
  <motion.div
    className={className}
    style={{ background: color }}
    animate={{
      x: xRange,
      y: yRange,
      scale: scaleRange,
      opacity: [0.3, 0.5, 0.3],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  />
);

// Parallax wrapper for bento cards with stagger effect
const ParallaxCard = ({ 
  children, 
  delay = 0, 
  offsetY = 50,
  className = ""
}: { 
  children: React.ReactNode; 
  delay?: number;
  offsetY?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [offsetY, -offsetY]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y: smoothY }}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

// Pulsing badge component for "Recommandé" and "NIVO PRO"
const PulsingBadge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    className={className}
    animate={{
      boxShadow: [
        '0 0 20px rgba(255,107,74,0.3)',
        '0 0 40px rgba(255,107,74,0.5)',
        '0 0 20px rgba(255,107,74,0.3)',
      ],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
);

export default function Landing() {
  // Scroll animations for dashboard mockup with parallax
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"]
  });

  // Enhanced parallax: dashboard moves slower than content
  const dashboardRotateX = useTransform(heroScrollProgress, [0, 0.5], [15, 0]);
  const dashboardY = useTransform(heroScrollProgress, [0, 1], [80, -40]); // Parallax effect - moves slower
  const dashboardOpacity = useTransform(heroScrollProgress, [0, 0.3], [0.3, 1]);
  const smoothRotateX = useSpring(dashboardRotateX, { stiffness: 80, damping: 25 });
  const smoothDashboardY = useSpring(dashboardY, { stiffness: 60, damping: 20 });

  // Text parallax - moves faster than dashboard
  const textY = useTransform(heroScrollProgress, [0, 1], [0, 100]);
  const smoothTextY = useSpring(textY, { stiffness: 60, damping: 20 });

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
      
      {/* ===== ANIMATED LIGHT ORBS ===== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary orb - top left - animated */}
        <FloatingOrb
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[150px]"
          color="radial-gradient(circle, rgba(255,107,74,0.15) 0%, transparent 70%)"
          xRange={[0, 80, 0]}
          yRange={[0, 60, 0]}
          duration={12}
          delay={0}
        />
        {/* Secondary orb - right - animated */}
        <FloatingOrb
          className="absolute top-1/3 -right-60 w-[500px] h-[500px] rounded-full blur-[120px]"
          color="radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)"
          xRange={[0, -60, 0]}
          yRange={[0, 80, 0]}
          scaleRange={[1, 1.3, 1]}
          duration={15}
          delay={2}
        />
        {/* Third orb - bottom - animated */}
        <FloatingOrb
          className="absolute -bottom-60 left-1/3 w-[700px] h-[400px] rounded-full blur-[150px]"
          color="radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)"
          xRange={[0, 100, 0]}
          yRange={[0, -50, 0]}
          duration={18}
          delay={4}
        />
        {/* Fourth orb - center accent - subtle */}
        <FloatingOrb
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[200px]"
          color="radial-gradient(circle, rgba(255,107,74,0.05) 0%, transparent 60%)"
          xRange={[0, -40, 0]}
          yRange={[0, 40, 0]}
          scaleRange={[0.9, 1.1, 0.9]}
          duration={20}
          delay={1}
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

      {/* ===== 1. HERO SECTION WITH PARALLAX ===== */}
      <section className="pt-32 md:pt-44 pb-12 md:pb-20 px-4 md:px-6 relative z-10">
        <div className="container mx-auto text-center max-w-5xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ y: smoothTextY }}
          >
            {/* System Badge - with subtle pulse */}
            <motion.div variants={itemVariants} className="mb-8">
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
                animate={{
                  borderColor: ['rgba(255,255,255,0.1)', 'rgba(52,211,153,0.3)', 'rgba(255,255,255,0.1)'],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="font-mono text-xs text-emerald-400 uppercase tracking-wider">
                  SYSTEM V1.0 // ONLINE
                </span>
              </motion.div>
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
              Une boucle d'entretien quotidienne de <span className="text-white/80 font-medium">8 minutes</span> basée sur vos données.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/onboarding">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    size="lg" 
                    className="relative overflow-hidden bg-primary hover:bg-primary/90 text-white h-14 px-8 text-lg rounded-full font-semibold transition-all duration-500 shadow-[0_0_40px_rgba(255,107,74,0.4),0_0_80px_rgba(255,107,74,0.2)]"
                  >
                    <span className="relative z-10 flex items-center">
                      Lancer mon Scan (Gratuit)
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  </Button>
                </motion.div>
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

      {/* ===== ABSTRACT DASHBOARD VISUALIZATION WITH PARALLAX ===== */}
      <section className="py-12 md:py-20 px-4 md:px-6 relative z-10" ref={heroRef}>
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            className="relative w-full"
            style={{ 
              perspective: '2000px',
              opacity: dashboardOpacity,
            }}
          >
            {/* Glow behind dashboard - animated */}
            <motion.div 
              className="absolute inset-0 -z-10"
              animate={{
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div 
                className="absolute inset-x-0 top-1/4 h-[500px] blur-[120px] rounded-full" 
                style={{
                  background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,107,74,0.2) 0%, transparent 70%)'
                }}
              />
            </motion.div>
            
            {/* Dashboard Window - Cyberpunk Style with enhanced parallax */}
            <motion.div 
              className="relative rounded-2xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl overflow-hidden w-full"
              style={{
                rotateX: smoothRotateX,
                y: smoothDashboardY,
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
                <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest hidden sm:block">app.nivo.health</span>
                <div className="w-16" />
              </div>
              
              {/* Dashboard Content - Responsive Grid */}
              <div className="p-4 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[280px] md:min-h-[320px]">
                {/* Left Panel - Score (Full width on mobile) */}
                <div className="flex flex-row md:flex-col gap-4">
                  <div className="flex-1 rounded-xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md">
                    <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2 md:mb-3">NIVO SCORE</div>
                    <div className="text-4xl md:text-6xl font-bold text-white">72</div>
                    <div className="mt-2 flex items-center gap-2">
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-emerald-400"
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="font-mono text-xs text-emerald-400">OPTIMAL</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md">
                    <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">SÉRIE</div>
                    <div className="text-2xl font-semibold text-primary">J-5</div>
                  </div>
                </div>

                {/* Center Panel - Circular Gauge with slow rotation animation */}
                <div className="hidden md:flex items-center justify-center">
                  <motion.div 
                    className="relative w-36 h-36 md:w-44 md:h-44"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  >
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
                    <motion.div 
                      className="absolute inset-0 flex flex-col items-center justify-center"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    >
                      <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">INTÉGRITÉ</span>
                      <span className="text-3xl md:text-4xl font-bold text-white">72%</span>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Right Panel - Stats */}
                <div className="flex flex-row md:flex-col gap-4">
                  <div className="flex-1 rounded-xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md">
                    <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">INDICE DOULEUR</div>
                    <div className="text-xl md:text-2xl font-semibold text-emerald-400">-18%</div>
                    <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md">
                    <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">BOUCLE QUOTIDIENNE</div>
                    <div className="text-xl md:text-2xl font-semibold text-white">8 min</div>
                  </div>
                  <motion.div 
                    className="hidden md:block rounded-xl border border-primary/20 bg-primary/5 p-3 backdrop-blur-md"
                    animate={{ 
                      borderColor: ['rgba(255,107,74,0.2)', 'rgba(255,107,74,0.5)', 'rgba(255,107,74,0.2)'],
                      boxShadow: ['0 0 0px rgba(255,107,74,0)', '0 0 15px rgba(255,107,74,0.3)', '0 0 0px rgba(255,107,74,0)']
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="font-mono text-[10px] text-primary uppercase tracking-widest">PRÊT À SCANNER</div>
                  </motion.div>
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
                      ANALYSE
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
                La Boucle Quotidienne :
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent"> 8 minutes.</span>
              </h2>
              <p className="text-white/40 text-lg">
                Pas du yoga. <span className="text-white/80">De l'ingénierie corporelle.</span>
              </p>
            </div>
          </ScrollReveal>

          {/* Bento Grid - Mobile-first responsive with parallax stagger */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {/* Large Card - Algorithm - faster parallax */}
            <ParallaxCard delay={0.1} offsetY={30} className="md:col-span-2 md:row-span-2">
              <div className="h-full group relative rounded-2xl border border-white/5 bg-white/[0.02] p-5 md:p-8 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:bg-white/[0.04]">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                  style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,107,74,0.1) 0%, transparent 50%)' }} 
                />
                <div className="relative h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <motion.div 
                      className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Cpu className="w-5 h-5 text-primary" />
                    </motion.div>
                    <span className="font-mono text-xs text-white/30 uppercase tracking-wider">MOTEUR CENTRAL</span>
                  </div>
                  <h3 className="font-sans text-xl md:text-3xl font-bold tracking-tight mb-3 md:mb-4">L'Algorithme Adaptatif</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-4 md:mb-6 break-words whitespace-normal">
                    Le système analyse vos données quotidiennes et ajuste le protocole en temps réel. Plus vous l'utilisez, plus il devient précis.
                  </p>
                  <div className="mt-auto grid grid-cols-3 gap-4 pt-4 md:pt-6 border-t border-white/5">
                    <div>
                      <motion.div 
                        className="text-xl md:text-2xl font-bold text-primary"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                      >3</motion.div>
                      <div className="font-mono text-[10px] text-white/30 uppercase">PHASES</div>
                    </div>
                    <div>
                      <motion.div 
                        className="text-xl md:text-2xl font-bold text-white"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                      >8</motion.div>
                      <div className="font-mono text-[10px] text-white/30 uppercase">MINUTES</div>
                    </div>
                    <div>
                      <motion.div 
                        className="text-xl md:text-2xl font-bold text-emerald-400"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                      >∞</motion.div>
                      <div className="font-mono text-[10px] text-white/30 uppercase">SCANS</div>
                    </div>
                  </div>
                </div>
              </div>
            </ParallaxCard>

            {/* Small Card - Check-in - slower parallax (odd column) */}
            <ParallaxCard delay={0.2} offsetY={60}>
              <div className="h-full group relative rounded-2xl border border-white/5 bg-white/[0.02] p-5 md:p-6 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:bg-white/[0.04]">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" 
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,107,74,0.1) 0%, transparent 60%)' }} 
                />
                <div className="relative">
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Clock className="w-6 h-6 text-primary mb-3 md:mb-4" />
                  </motion.div>
                  <h4 className="font-semibold mb-2 tracking-tight">Bilan 60s</h4>
                  <p className="text-white/40 text-xs leading-relaxed break-words whitespace-normal">Évaluez votre état en moins d'une minute.</p>
                </div>
              </div>
            </ParallaxCard>

            {/* Small Card - NASA - faster parallax */}
            <ParallaxCard delay={0.25} offsetY={40}>
              <div className="h-full group relative rounded-2xl border border-white/5 bg-white/[0.02] p-5 md:p-6 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:bg-white/[0.04]">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" 
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,107,74,0.1) 0%, transparent 60%)' }} 
                />
                <div className="relative">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-6 h-6 text-primary mb-3 md:mb-4" />
                  </motion.div>
                  <h4 className="font-semibold mb-2 tracking-tight">Protocole NASA</h4>
                  <p className="text-white/40 text-xs leading-relaxed break-words whitespace-normal">Basé sur les contre-mesures spatiales.</p>
                </div>
              </div>
            </ParallaxCard>

            {/* Tall Card - History - slower parallax (odd column) */}
            <ParallaxCard delay={0.3} offsetY={70} className="md:row-span-2">
              <div className="h-full group relative rounded-2xl border border-white/5 bg-white/[0.02] p-5 md:p-6 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:bg-white/[0.04]">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" 
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,107,74,0.1) 0%, transparent 50%)' }} 
                />
                <div className="relative h-full flex flex-col">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <BarChart3 className="w-6 h-6 text-primary mb-3 md:mb-4" />
                  </motion.div>
                  <h4 className="font-semibold mb-2 tracking-tight">Suivi Historique</h4>
                  <p className="text-white/40 text-xs leading-relaxed mb-4 break-words whitespace-normal">Visualisez l'évolution de votre score sur 30, 90, 365 jours.</p>
                  {/* Mini chart visualization with animation */}
                  <div className="mt-auto flex items-end gap-1 h-16 md:h-20">
                    {[40, 55, 45, 60, 70, 65, 75, 80, 72, 85].map((h, i) => (
                      <motion.div 
                        key={i}
                        className="flex-1 bg-gradient-to-t from-primary/60 to-primary rounded-sm"
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </ParallaxCard>

            {/* Wide Card - 3 Steps - faster parallax */}
            <ParallaxCard delay={0.35} offsetY={35}>
              <div className="h-full group relative rounded-2xl border border-white/5 bg-white/[0.02] p-5 md:p-6 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:bg-white/[0.04]">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" 
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,107,74,0.1) 0%, transparent 60%)' }} 
                />
                <div className="relative">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Target className="w-6 h-6 text-primary mb-3 md:mb-4" />
                  </motion.div>
                  <h4 className="font-semibold mb-2 tracking-tight">3 Phases</h4>
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono text-white/40">
                    <motion.span 
                      className="px-2 py-1 rounded bg-white/5"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                    >DÉCOMPRESSION</motion.span>
                    <motion.span 
                      className="px-2 py-1 rounded bg-white/5"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    >MOBILISATION</motion.span>
                    <motion.span 
                      className="px-2 py-1 rounded bg-white/5"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    >STABILISATION</motion.span>
                  </div>
                </div>
              </div>
            </ParallaxCard>
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
                  <h3 className="font-sans text-xl font-semibold mb-1">Essentiel</h3>
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
              </motion.div>
            </ScrollReveal>

            {/* NIVO PRO */}
            <ScrollReveal delay={0.2}>
              <motion.div 
                className="relative rounded-2xl border border-primary/30 bg-primary/5 p-8 backdrop-blur-sm overflow-hidden"
                animate={{
                  borderColor: ['rgba(255,107,74,0.3)', 'rgba(255,107,74,0.6)', 'rgba(255,107,74,0.3)'],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Glow effect - animated */}
                <motion.div 
                  className="absolute inset-0" 
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,107,74,0.3) 0%, transparent 60%)' }}
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Badge 7 jours - pulsing */}
                <div className="absolute -top-px left-1/2 -translate-x-1/2">
                  <motion.div 
                    className="px-4 py-1.5 bg-primary text-white font-mono text-xs uppercase tracking-wider rounded-b-lg"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(255,107,74,0.4)',
                        '0 0 40px rgba(255,107,74,0.6)',
                        '0 0 20px rgba(255,107,74,0.4)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Timer className="w-3 h-3 inline mr-1" />
                    7 jours gratuits
                  </motion.div>
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
                      <span>Tout Essentiel</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white/70">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Protocoles Douleur (Sciatique, Cou...)</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white/70">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Historique complet</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white/70">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Mode Concentration</span>
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

      {/* ===== FAQ SECTION ===== */}
      <section className="py-24 md:py-32 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-3xl">
          <ScrollReveal>
            <div className="text-center mb-12 md:mb-16">
              <span className="font-mono text-xs text-white/30 uppercase tracking-[0.2em] mb-4 block">
                // FAQ
              </span>
              <h2 className="font-sans text-3xl md:text-5xl font-bold tracking-tight">
                Questions Fréquentes
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem 
                value="item-1" 
                className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm px-6 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-left text-white/90 hover:text-white hover:no-underline py-5 text-sm md:text-base font-medium">
                  Est-ce que ça remplace mon kiné ?
                </AccordionTrigger>
                <AccordionContent className="text-white/50 text-sm leading-relaxed pb-5">
                  Non. NIVO est un outil de maintenance proactive. En cas de pathologie ou douleur aiguë, consultez un médecin.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem 
                value="item-2" 
                className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm px-6 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-left text-white/90 hover:text-white hover:no-underline py-5 text-sm md:text-base font-medium">
                  J'ai peu de temps, combien ça dure ?
                </AccordionTrigger>
                <AccordionContent className="text-white/50 text-sm leading-relaxed pb-5">
                  Le check-in prend 60 secondes. La routine quotidienne dure 8 minutes. Conçu pour les agendas chargés.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem 
                value="item-3" 
                className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm px-6 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-left text-white/90 hover:text-white hover:no-underline py-5 text-sm md:text-base font-medium">
                  Ai-je besoin de matériel ?
                </AccordionTrigger>
                <AccordionContent className="text-white/50 text-sm leading-relaxed pb-5">
                  Non. Un mur et le sol suffisent. Idéal pour le bureau ou en déplacement.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem 
                value="item-4" 
                className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm px-6 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-left text-white/90 hover:text-white hover:no-underline py-5 text-sm md:text-base font-medium">
                  Puis-je annuler ?
                </AccordionTrigger>
                <AccordionContent className="text-white/50 text-sm leading-relaxed pb-5">
                  Oui, à tout moment depuis votre espace membre.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ScrollReveal>
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
