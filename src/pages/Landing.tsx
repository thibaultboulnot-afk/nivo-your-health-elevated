import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  ArrowRight, Check, Lock, Shield, Zap, Eye, Volume2, 
  Cpu, FileCode, Flame, Trophy, Sparkles, AlertTriangle,
  Briefcase, Activity, Microscope, Github, Skull
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import HeroDeviceMockup from '@/components/HeroDeviceMockup';

// Scroll reveal animation wrapper
const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      style={{ willChange: 'opacity, transform' }}
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
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const
    }
  }
};

// Static orb component
const StaticOrb = ({ 
  className, 
  color,
  isMobile
}: {
  className: string;
  color: string;
  isMobile: boolean;
}) => (
  <div
    className={`${className} ${isMobile ? '' : 'animate-pulse-slow'}`}
    style={{ 
      background: color,
      willChange: isMobile ? 'auto' : 'opacity'
    }}
  />
);

export default function Landing() {
  const isMobile = useIsMobile();
  const [isAnnual, setIsAnnual] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"]
  });

  const textY = useTransform(heroScrollProgress, [0, 1], isMobile ? [0, 0] : [0, 60]);

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
      
      {/* ===== STATIC LIGHT ORBS ===== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <StaticOrb
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[100px]"
          color="radial-gradient(circle, rgba(255,107,74,0.12) 0%, transparent 70%)"
          isMobile={isMobile}
        />
        <StaticOrb
          className="absolute top-1/3 -right-60 w-[500px] h-[500px] rounded-full blur-[100px]"
          color="radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)"
          isMobile={isMobile}
        />
        <StaticOrb
          className="absolute -bottom-60 left-1/3 w-[600px] h-[400px] rounded-full blur-[100px]"
          color="radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)"
          isMobile={isMobile}
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

      {/* ===== BLOC 1: HERO & PRIVACY ===== */}
      <section className="pt-32 md:pt-44 pb-12 md:pb-20 px-4 md:px-6 relative z-10" ref={heroRef}>
        <div className="container mx-auto text-center max-w-5xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={isMobile ? {} : { y: textY }}
          >
            {/* System Badge */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-black/60">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="font-mono text-xs text-emerald-400 uppercase tracking-wider">
                  SYSTEM V1.0 // ONLINE
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={itemVariants}
              className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[0.95] tracking-tighter"
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
              className="text-base md:text-lg text-muted-foreground font-normal mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Optimisez votre machine. <span className="text-white/80 font-medium">8 minutes par jour</span> pour effacer 
              <br className="hidden md:block" />
              la dette technique de la sédentarité.
            </motion.p>

            {/* CTA */}
            <motion.div variants={itemVariants} className="mb-8">
              <Link to="/onboarding">
                <Button 
                  size="lg" 
                  className="relative overflow-hidden bg-primary hover:bg-primary/90 text-white h-14 px-8 text-lg rounded-full font-semibold transition-all shadow-[0_0_40px_rgba(255,107,74,0.4)]"
                >
                  <span className="relative z-10 flex items-center">
                    Lancer le Scan Gratuit (30s)
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </Button>
              </Link>
            </motion.div>

            {/* PRIVACY TRUST BADGES - CRITICAL */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-white/50"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-sm">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono">Inférence Locale (On-Device)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-sm">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono">Zéro Image Stockée</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-sm">
                <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono">Open Source Engine</span>
              </div>
            </motion.div>
            
            {/* GitHub Link */}
            <motion.a 
              variants={itemVariants}
              href="https://github.com/nicofratini/nivo-engine"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-xs text-white/30 hover:text-white/50 transition-colors font-mono"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Voir le code source sur GitHub (Audit)</span>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ===== DEVICE MOCKUP ===== */}
      <section className="py-12 md:py-20 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <HeroDeviceMockup />
        </div>
      </section>

      {/* ===== BLOC 2: ARCHITECTURE DU SYSTÈME ===== */}
      <section className="py-24 md:py-32 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="font-mono text-xs text-white/30 uppercase tracking-[0.2em] mb-4 block">
                // ARCHITECTURE
              </span>
              <h2 className="font-sans text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Comment fonctionne le
                <br />
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  moteur NIVO ?
                </span>
              </h2>
            </div>
          </ScrollReveal>

          {/* 3 Connected Glass Cards */}
          <div className="relative">
            {/* Connection Lines (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-[16%] right-[16%] h-px bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
            
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {/* Card 1 - Acquisition */}
              <ScrollReveal delay={0.1}>
                <div className="nivo-glass group relative rounded-2xl p-8 transition-all duration-500 hover:border-primary/30">
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                    style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,107,74,0.15) 0%, transparent 60%)' }} 
                  />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(255,107,74,0.3)] transition-shadow">
                      <Eye className="w-6 h-6 text-primary" />
                    </div>
                    <div className="font-mono text-xs text-primary/60 uppercase tracking-wider mb-2">01 // ACQUISITION</div>
                    <h3 className="font-sans text-xl font-semibold mb-3">Scan Biométrique</h3>
                    <p className="text-white/40 text-sm leading-relaxed">
                      Analyse de <span className="text-white/70 font-medium">35 points</span> en temps réel via votre webcam. Précision clinique.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Card 2 - Traitement Local */}
              <ScrollReveal delay={0.2}>
                <div className="nivo-glass group relative rounded-2xl p-8 transition-all duration-500 hover:border-primary/30">
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                    style={{ background: 'radial-gradient(circle at 50% 0%, rgba(34,197,94,0.15) 0%, transparent 60%)' }} 
                  />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-shadow">
                      <Cpu className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="font-mono text-xs text-emerald-400/60 uppercase tracking-wider mb-2">02 // TRAITEMENT LOCAL</div>
                    <h3 className="font-sans text-xl font-semibold mb-3">Modèle Pré-Entraîné</h3>
                    <p className="text-white/40 text-sm leading-relaxed">
                      Exécuté localement via TensorFlow.js. <span className="text-emerald-400/80 font-medium">Aucune donnée ne quitte votre navigateur.</span>
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Card 3 - Output Audio */}
              <ScrollReveal delay={0.3}>
                <div className="nivo-glass group relative rounded-2xl p-8 transition-all duration-500 hover:border-primary/30">
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                    style={{ background: 'radial-gradient(circle at 50% 0%, rgba(139,92,246,0.15) 0%, transparent 60%)' }} 
                  />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-shadow">
                      <Volume2 className="w-6 h-6 text-violet-400" />
                    </div>
                    <div className="font-mono text-xs text-violet-400/60 uppercase tracking-wider mb-2">03 // OUTPUT</div>
                    <h3 className="font-sans text-xl font-semibold mb-3">Protocole Audio</h3>
                    <p className="text-white/40 text-sm leading-relaxed">
                      Guidance vocale générée. <span className="text-white/70 font-medium">Fermez les yeux, exécutez.</span>
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Console Output */}
          <ScrollReveal delay={0.4}>
            <div className="mt-12 rounded-xl border border-white/5 bg-[#0a0a0a] p-4 font-mono text-xs max-w-2xl mx-auto">
              <div className="text-white/30 mb-2">$ nivo --architecture</div>
              <div className="text-emerald-400">&gt; PRIVACY_MODE: LOCAL_ONLY</div>
              <div className="text-violet-400">&gt; DATA_TRANSFER: NONE</div>
              <div className="text-primary">&gt; STATUS: SECURE ✓</div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== BLOC 3: GAMIFICATION ===== */}
      <section className="py-24 md:py-32 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="font-mono text-xs text-white/30 uppercase tracking-[0.2em] mb-4 block">
                // BIO-HACKING
              </span>
              <h2 className="font-sans text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Transformez votre dos en
                <br />
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  Arbre de Compétences.
                </span>
              </h2>
              <p className="text-white/40 text-lg max-w-2xl mx-auto">
                Chaque session vous rapporte de l'XP. Débloquez des visualisations exclusives. 
                <span className="text-white/70"> Dominez le leaderboard.</span>
              </p>
            </div>
          </ScrollReveal>

          {/* Skins Grid - 3 Vertical Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Skin 1 - Standard */}
            <ScrollReveal delay={0.1}>
              <div className="vitrine-glass group relative rounded-2xl p-6 text-center transition-all duration-500 hover:border-emerald-500/30">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                  style={{ background: 'radial-gradient(circle at 50% 50%, rgba(34,197,94,0.1) 0%, transparent 70%)' }} 
                />
                <div className="relative">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Skull className="w-12 h-12 text-emerald-400" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Standard</h4>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                    <Check className="w-3 h-3" />
                    Débloqué
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Skin 2 - Cyber-Samurai */}
            <ScrollReveal delay={0.2}>
              <div className="vitrine-glass group relative rounded-2xl p-6 text-center transition-all duration-500 hover:border-red-500/30">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                  style={{ background: 'radial-gradient(circle at 50% 50%, rgba(239,68,68,0.1) 0%, transparent 70%)' }} 
                />
                <div className="relative">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center relative overflow-hidden">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <Skull className="w-12 h-12 text-red-400 relative z-10" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Cyber-Samurai</h4>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-mono">
                    <Lock className="w-3 h-3" />
                    Niveau 10
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Skin 3 - Golden God */}
            <ScrollReveal delay={0.3}>
              <div className="vitrine-glass group relative rounded-2xl p-6 text-center transition-all duration-500 hover:border-amber-500/30 overflow-hidden">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                  style={{ background: 'radial-gradient(circle at 50% 50%, rgba(245,158,11,0.1) 0%, transparent 70%)' }} 
                />
                <div className="relative">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center relative overflow-hidden">
                    <motion.div 
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(135deg, transparent 0%, rgba(245,158,11,0.3) 50%, transparent 100%)' }}
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <Skull className="w-12 h-12 text-amber-400 relative z-10" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Golden God</h4>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
                    <Trophy className="w-3 h-3" />
                    Top 100
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* View Gallery Button */}
          <ScrollReveal delay={0.4}>
            <div className="text-center">
              <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono text-sm">
                Voir la galerie complète
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </ScrollReveal>

          {/* Features List */}
          <div className="grid md:grid-cols-2 gap-6 mt-16 max-w-3xl mx-auto">
            <ScrollReveal delay={0.1}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">+100 XP par Session</h4>
                  <p className="text-white/40 text-sm">Chaque routine audio complétée.</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <Flame className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Streak = Multiplicateur</h4>
                  <p className="text-white/40 text-sm">Plus vous enchaînez, plus vous gagnez.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== BLOC 4: SCIENCE & SÉCURITÉ ===== */}
      <section className="py-24 md:py-32 px-4 md:px-6 relative z-10 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] mb-6">
                <Shield className="w-4 h-4 text-white/60" />
                <span className="font-mono text-xs text-white/60 uppercase tracking-wider">Maintenance Responsable</span>
              </div>
              <h2 className="font-sans text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Une pratique
                <span className="text-white/60"> responsable.</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            <ScrollReveal delay={0.1}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <span className="font-mono text-xs text-white/40 uppercase">Biomécanique</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  Basé sur les principes de <span className="text-white/90">biomécanique</span> et de <span className="text-white/90">décompression vertébrale</span>. Protocoles McGill et McKenzie.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Volume2 className="w-5 h-5 text-violet-400" />
                  <span className="font-mono text-xs text-white/40 uppercase">Audio Précis</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  <span className="text-white/90">Guidance Audio Précise</span> : Conçu pour être fait les yeux fermés, en toute sécurité. Pas d'écran.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Medical Disclaimer - CRITIQUE */}
          <ScrollReveal delay={0.3}>
            <div className="mt-8 p-5 rounded-xl border border-amber-500/30 bg-amber-500/5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-200 mb-2">Pratique de Maintenance</h4>
                  <p className="text-amber-200/70 text-sm leading-relaxed">
                    NIVO est un outil de <span className="text-amber-200">bien-être</span>. Il ne remplace pas un professionnel de santé.
                  </p>
                  <p className="text-amber-200/50 text-xs mt-2 font-mono">
                    ⚠️ Ne pas utiliser en cas de : Hernie aiguë, sciatique sévère ou douleur intense.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== BLOC 5: PRICING COMPARATIF ===== */}
      <section className="py-24 md:py-32 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="font-mono text-xs text-white/30 uppercase tracking-[0.2em] mb-4 block">
                // PRICING
              </span>
              <h2 className="font-sans text-3xl md:text-5xl font-bold tracking-tight">
                Investissez dans votre
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent"> structure.</span>
              </h2>
            </div>
          </ScrollReveal>

          {/* Billing Toggle */}
          <ScrollReveal delay={0.1}>
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`font-mono text-sm transition-colors ${!isAnnual ? 'text-white' : 'text-white/40'}`}>
                Mensuel
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-emerald-500"
              />
              <span className={`font-mono text-sm transition-colors ${isAnnual ? 'text-white' : 'text-white/40'}`}>
                Annuel
              </span>
              {isAnnual && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                  -20%
                </span>
              )}
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* FREE */}
            <ScrollReveal delay={0.1}>
              <div className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm h-full">
                <div className="mb-6">
                  <span className="font-mono text-xs text-white/40 uppercase tracking-wider">L'ESSAI</span>
                  <h3 className="font-sans text-2xl font-bold mt-1">Gratuit</h3>
                </div>
                
                <div className="mb-8">
                  <span className="text-4xl font-bold">0€</span>
                  <span className="text-white/40">/mois</span>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-sm text-white/70">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Scan Illimité</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/70">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Séance du Jour (Reset 24h)</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/70">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Score NIVO basique</span>
                  </li>
                </ul>

                <Link to="/onboarding" className="block">
                  <Button variant="outline" className="w-full h-12 border-white/10 bg-white/5 hover:bg-white/10 text-white">
                    Commencer gratuitement
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            {/* PRO */}
            <ScrollReveal delay={0.2}>
              <motion.div 
                className="relative rounded-2xl border border-primary/30 bg-primary/5 p-8 backdrop-blur-sm overflow-hidden h-full"
                animate={{
                  borderColor: ['rgba(255,107,74,0.3)', 'rgba(255,107,74,0.6)', 'rgba(255,107,74,0.3)'],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div 
                  className="absolute inset-0" 
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,107,74,0.3) 0%, transparent 60%)' }}
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Badge - Contextual */}
                <div className="absolute -top-px left-1/2 -translate-x-1/2">
                  {isAnnual ? (
                    <motion.div 
                      className="px-4 py-1.5 bg-emerald-500 text-white font-mono text-xs uppercase tracking-wider rounded-b-lg"
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(34,197,94,0.4)',
                          '0 0 40px rgba(34,197,94,0.6)',
                          '0 0 20px rgba(34,197,94,0.4)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      2 Mois Offerts
                    </motion.div>
                  ) : (
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
                      Offre Pionnier
                    </motion.div>
                  )}
                </div>

                <div className="relative">
                  <div className="mb-6 pt-4">
                    <span className="font-mono text-xs text-primary/80 uppercase tracking-wider">NIVO PRO</span>
                    <h3 className="font-sans text-2xl font-bold mt-1">Pro</h3>
                  </div>
                  
                  {/* Scarcity Badge (Monthly only) */}
                  {!isAnnual && (
                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03]">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                      <span className="font-mono text-[10px] text-white/50">82/100 places prises</span>
                    </div>
                  )}
                  
                  {/* Dynamic Pricing */}
                  <div className="mb-8">
                    {isAnnual ? (
                      <>
                        <span className="text-4xl font-bold">99€</span>
                        <span className="text-white/40"> / an</span>
                        <div className="text-sm text-white/50 font-mono mt-1">
                          soit <span className="text-emerald-400">8.25€/mois</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-4xl font-bold">9.90€</span>
                        <span className="text-white/40"> / mois</span>
                      </>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white/90">30+ Skins Exclusifs</span>
                        <span className="block text-xs text-white/40 mt-0.5">Visualisations uniques</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white/90">Historique Illimité</span>
                        <span className="block text-xs text-white/40 mt-0.5">Export CSV pour les analystes</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white/90">Mode Focus Audio</span>
                        <span className="block text-xs text-white/40 mt-0.5">Sessions optimisées pour le travail</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white/90">Protocoles Douleur</span>
                        <span className="block text-xs text-white/40 mt-0.5">Sciatique, Cou, Lombaires...</span>
                      </div>
                    </li>
                  </ul>

                  <Link to="/onboarding" className="block">
                    <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(255,107,74,0.4)]">
                      Essayer 7 jours gratuit
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== BLOC 6: FAQ RAPIDE ===== */}
      <section className="py-24 md:py-32 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-3xl">
          <ScrollReveal>
            <div className="text-center mb-12 md:mb-16">
              <span className="font-mono text-xs text-white/30 uppercase tracking-[0.2em] mb-4 block">
                // FAQ
              </span>
              <h2 className="font-sans text-3xl md:text-4xl font-bold tracking-tight">
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
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span>Puis-je le faire au bureau ?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-white/50 text-sm leading-relaxed pb-5">
                  <strong className="text-white/70">Oui.</strong> Mouvements discrets, sans transpiration. Idéal entre deux réunions.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem 
                value="item-2" 
                className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm px-6 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-left text-white/90 hover:text-white hover:no-underline py-5 text-sm md:text-base font-medium">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-primary" />
                    <span>Est-ce risqué ?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-white/50 text-sm leading-relaxed pb-5">
                  <strong className="text-white/70">Non.</strong> Les mouvements sont doux et progressifs. Guidés par audio, ils sont conçus pour être exécutés en toute sécurité.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem 
                value="item-3" 
                className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm px-6 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-left text-white/90 hover:text-white hover:no-underline py-5 text-sm md:text-base font-medium">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-primary" />
                    <span>Mes données sont-elles privées ?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-white/50 text-sm leading-relaxed pb-5">
                  <strong className="text-white/70">100% locales.</strong> L'analyse webcam se fait dans votre navigateur. Aucune image n'est stockée ou envoyée sur un serveur.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem 
                value="item-4" 
                className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm px-6 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-left text-white/90 hover:text-white hover:no-underline py-5 text-sm md:text-base font-medium">
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-primary" />
                    <span>Puis-je annuler mon abonnement ?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-white/50 text-sm leading-relaxed pb-5">
                  <strong className="text-white/70">Oui.</strong> À tout moment depuis votre espace membre. Sans engagement.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 px-4 md:px-6 border-t border-white/5 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(255,107,74,0.3)]">
                <span className="font-sans text-white font-bold text-lg">N</span>
              </div>
              <span className="font-sans text-lg font-semibold tracking-tight">NIVO</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-white/30">
              <Link to="/cgv" className="hover:text-white/60 transition-colors font-mono text-xs">CGV</Link>
              <Link to="/confidentialite" className="hover:text-white/60 transition-colors font-mono text-xs">Confidentialité</Link>
              <Link to="/mentions-legales" className="hover:text-white/60 transition-colors font-mono text-xs">Mentions légales</Link>
            </div>

            <p className="text-xs text-white/20 font-mono">
              © {new Date().getFullYear()} NIVO
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
