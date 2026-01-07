import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Flame } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { GlassCard } from '@/components/ui/GlassCard';
import { useLifetimeSpots } from '@/hooks/useLifetimeSpots';

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
      x: direction === 'left' ? -60 : direction === 'right' ? 60 : 0,
      y: direction === 'up' ? 40 : 0
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
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default function Landing() {
  const isMobile = useIsMobile();
  const { spotsRemaining, loading } = useLifetimeSpots();
  const displaySpots = loading ? 93 : (spotsRemaining ?? 93);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground selection:bg-primary selection:text-primary-foreground">
      
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(46,92,255,0.4)]">
              <span className="font-heading text-white font-bold text-lg">N</span>
            </div>
            <span className="font-heading text-xl font-semibold tracking-tight">NIVO</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-foreground/60 hover:text-foreground hover:bg-white/5 text-sm font-data">
                Connexion
              </Button>
            </Link>
            <Link to="/onboarding">
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(46,92,255,0.4)] text-sm px-4 font-medium">
                Commencer
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== BLOC 1: HERO ===== */}
      <section className="min-h-[90vh] pt-32 md:pt-40 pb-12 md:pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left: Text Content */}
            <ScrollReveal direction="left">
              <div className="max-w-xl">
                <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[0.95] tracking-tight">
                  Optimisez votre
                  <br />
                  <span className="text-primary">
                    architecture corporelle.
                  </span>
                </h1>

                <p className="text-base md:text-lg text-foreground/60 font-body mb-10 leading-relaxed max-w-md">
                  Le premier OS de santé pour les professionnels du digital. Corrigez votre posture et supprimez le mal de dos en <span className="text-foreground font-medium font-data">8 minutes</span> par jour.
                </p>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                  <Link to="/onboarding">
                    <Button 
                      size="xl" 
                      className="relative overflow-hidden bg-primary hover:bg-primary/90 text-white h-14 px-8 text-lg rounded-xl font-semibold transition-all shadow-[0_0_40px_rgba(46,92,255,0.5)] hover:shadow-[0_0_60px_rgba(46,92,255,0.6)]"
                    >
                      <span className="relative z-10 flex items-center">
                        Lancer le Diagnostic Gratuit
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </span>
                    </Button>
                  </Link>
                </div>
                
                {/* Secondary Link */}
                <a 
                  href="#founder" 
                  className="inline-flex items-center text-sm text-foreground/40 hover:text-foreground/60 transition-colors font-data"
                >
                  Voir l'offre Founder (Limité) →
                </a>
              </div>
            </ScrollReveal>

            {/* Right: Dashboard Visual - Off-screen effect */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative lg:-mr-20 xl:-mr-32">
                {/* Dashboard mockup with off-screen effect */}
                <div className="relative">
                  <GlassCard className="p-6 md:p-8 overflow-hidden" glowing>
                    {/* Fake Dashboard UI */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="font-data text-primary text-sm">78</span>
                          </div>
                          <div>
                            <div className="font-heading text-sm font-semibold">Score NIVO</div>
                            <div className="font-data text-xs text-foreground/40">Aujourd'hui</div>
                          </div>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                          <span className="font-data text-xs text-emerald-400">+12 pts</span>
                        </div>
                      </div>
                      
                      {/* Chart placeholder */}
                      <div className="h-32 rounded-xl bg-white/[0.02] border border-white/5 flex items-end justify-around px-4 pb-4">
                        {[40, 55, 45, 65, 70, 78, 82].map((h, i) => (
                          <motion.div 
                            key={i}
                            className="w-6 rounded-t bg-gradient-to-t from-primary/60 to-primary"
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                          />
                        ))}
                      </div>
                      
                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Streak', value: '14j' },
                          { label: 'Sessions', value: '42' },
                          { label: 'XP', value: '2.4k' }
                        ].map((stat, i) => (
                          <div key={i} className="text-center p-3 rounded-lg bg-white/[0.02] border border-white/5">
                            <div className="font-data text-lg font-bold text-foreground">{stat.value}</div>
                            <div className="font-data text-[10px] text-foreground/40 uppercase tracking-wider">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                  
                  {/* Glow effect behind */}
                  <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full -z-10 opacity-50" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== BLOC 2: LE PROBLÈME (Visuel Gauche / Texte Droite) ===== */}
      <section className="min-h-[80vh] py-24 md:py-32 relative z-10 flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Visual */}
            <ScrollReveal direction="left">
              <div className="relative">
                {/* Spine Wireframe Visual */}
                <div className="relative aspect-square max-w-md mx-auto lg:mx-0">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Wireframe spine representation */}
                    <svg viewBox="0 0 200 300" className="w-full h-full max-w-[280px]">
                      {/* Spine vertebrae - wireframe style with red alert tint */}
                      {[...Array(24)].map((_, i) => (
                        <g key={i}>
                          <motion.rect
                            x={70 + Math.sin(i * 0.3) * 8}
                            y={20 + i * 11}
                            width={60 - Math.abs(i - 12) * 2}
                            height={8}
                            rx={2}
                            fill="none"
                            stroke="rgba(239, 68, 68, 0.4)"
                            strokeWidth={1}
                            initial={{ opacity: 0, pathLength: 0 }}
                            animate={{ opacity: 1, pathLength: 1 }}
                            transition={{ delay: i * 0.05, duration: 0.5 }}
                          />
                          {/* Warning indicators on some vertebrae */}
                          {[5, 12, 18].includes(i) && (
                            <motion.circle
                              cx={140 + Math.sin(i * 0.3) * 8}
                              cy={24 + i * 11}
                              r={4}
                              fill="rgba(239, 68, 68, 0.6)"
                              initial={{ scale: 0 }}
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ delay: 1 + i * 0.1, duration: 2, repeat: Infinity }}
                            />
                          )}
                        </g>
                      ))}
                    </svg>
                  </div>
                  {/* Red glow */}
                  <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full" />
                </div>
              </div>
            </ScrollReveal>

            {/* Right: Text */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="max-w-lg lg:ml-auto">
                <span className="font-data text-xs text-red-400/80 uppercase tracking-[0.2em] mb-4 block">
                  // DIAGNOSTIC
                </span>
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                  La sédentarité est un
                  <br />
                  <span className="text-red-400">bug système.</span>
                </h2>
                <p className="text-foreground/60 text-base md:text-lg leading-relaxed">
                  <span className="font-data text-foreground/80">2 200 heures</span> assis par an créent une dette technique sur votre colonne vertébrale. Ce n'est pas de la fatigue, c'est une <span className="text-foreground/80 font-medium">défaillance structurelle</span> qui impacte votre focus.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== BLOC 3: LA SOLUTION (Texte Gauche / Visuel Droite) ===== */}
      <section className="min-h-[80vh] py-24 md:py-32 relative z-10 flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <ScrollReveal direction="left">
              <div className="max-w-lg">
                <span className="font-data text-xs text-primary/80 uppercase tracking-[0.2em] mb-4 block">
                  // SOLUTION
                </span>
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                  Recalibration
                  <br />
                  <span className="text-primary">Biométrique.</span>
                </h2>
                <p className="text-foreground/60 text-base md:text-lg leading-relaxed">
                  Notre algorithme analyse votre posture via webcam et génère un protocole de maintenance quotidien. Pas de sport inutile, juste de <span className="text-foreground/80 font-medium">l'ingénierie de précision</span>.
                </p>
              </div>
            </ScrollReveal>

            {/* Right: Visual - Data chart going up */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative lg:-mr-12">
                <GlassCard className="p-6 md:p-8" glowing>
                  {/* Ascending chart visualization */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-data text-xs text-foreground/40 uppercase tracking-wider">Évolution Score NIVO</span>
                      <span className="font-data text-sm text-primary">+34%</span>
                    </div>
                    
                    {/* Chart with upward trend */}
                    <div className="h-40 relative">
                      <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                        {/* Grid lines */}
                        {[0, 40, 80, 120, 160].map((y) => (
                          <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.05)" />
                        ))}
                        
                        {/* Ascending curve */}
                        <motion.path
                          d="M 0 140 Q 50 130, 100 120 T 200 90 T 300 50 T 400 20"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth={3}
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, ease: "easeOut" }}
                        />
                        
                        {/* Gradient fill under curve */}
                        <motion.path
                          d="M 0 140 Q 50 130, 100 120 T 200 90 T 300 50 T 400 20 L 400 160 L 0 160 Z"
                          fill="url(#fillGradient)"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1, duration: 1 }}
                        />
                        
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(46,92,255,0.5)" />
                            <stop offset="100%" stopColor="rgba(46,92,255,1)" />
                          </linearGradient>
                          <linearGradient id="fillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(46,92,255,0.2)" />
                            <stop offset="100%" stopColor="rgba(46,92,255,0)" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    
                    {/* Data points */}
                    <div className="flex justify-between text-center">
                      {['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'].map((week, i) => (
                        <div key={week} className="flex-1">
                          <div className="font-data text-[10px] text-foreground/30">{week}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
                
                {/* Blue glow */}
                <div className="absolute -inset-4 bg-primary/15 blur-3xl rounded-full -z-10" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== BLOC 4: OFFRE FOUNDER (Centré) ===== */}
      <section id="founder" className="min-h-[80vh] py-24 md:py-32 relative z-10 flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 w-full">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <GlassCard premium className="p-8 md:p-12 lg:p-16">
                <span className="font-data text-xs text-primary/80 uppercase tracking-[0.2em] mb-6 block">
                  // OFFRE LIMITÉE
                </span>
                
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                  Devenez Membre
                  <br />
                  <span className="text-primary">Fondateur.</span>
                </h2>
                
                <p className="text-foreground/60 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
                  Accédez à la licence NIVO à vie pour le prix d'une chaise de bureau.
                </p>
                
                {/* Price */}
                <div className="mb-8">
                  <span className="font-data text-5xl md:text-6xl font-bold text-foreground">149€</span>
                  <span className="text-foreground/40 text-sm ml-2">Paiement unique</span>
                </div>
                
                {/* Counter */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-8">
                  <Flame className="w-4 h-4 text-red-400" />
                  <span className="font-data text-sm text-red-400">
                    <span className="font-bold">{displaySpots}</span> places restantes avant passage à l'abonnement mensuel
                  </span>
                </div>
                
                {/* CTA */}
                <div>
                  <Link to="/checkout?plan=lifetime">
                    <Button 
                      size="xl"
                      className="bg-primary hover:bg-primary/90 text-white h-14 px-10 text-lg rounded-xl font-semibold shadow-[0_0_40px_rgba(46,92,255,0.5)] hover:shadow-[0_0_60px_rgba(46,92,255,0.6)]"
                    >
                      Sécuriser ma licence à vie
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 px-6 md:px-12 lg:px-20 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <span className="font-heading text-white font-bold text-sm">N</span>
              </div>
              <span className="font-heading text-sm font-semibold">NIVO</span>
              <span className="text-foreground/30 text-xs font-data ml-2">© 2025</span>
            </div>
            
            <div className="flex items-center gap-6 text-xs text-foreground/40 font-data">
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
