import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check, Zap, TrendingDown, AlertTriangle, Activity, Brain, Timer, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.7,
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

  const dashboardRotateX = useTransform(heroScrollProgress, [0, 0.5], [12, 0]);
  const dashboardY = useTransform(heroScrollProgress, [0, 0.5], [60, 0]);
  const dashboardOpacity = useTransform(heroScrollProgress, [0, 0.4], [0.5, 1]);
  const smoothRotateX = useSpring(dashboardRotateX, { stiffness: 100, damping: 30 });
  const smoothY = useSpring(dashboardY, { stiffness: 100, damping: 30 });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,#0a0a0a,#030307)] pointer-events-none" />
      <div className="aurora absolute inset-0 pointer-events-none opacity-30" />
      <div className="grid-background absolute inset-0 pointer-events-none opacity-10" />

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-glow-primary">
              <span className="font-sans text-primary-foreground font-bold text-lg">N</span>
            </div>
            <span className="font-sans text-xl font-semibold tracking-tight text-foreground">NIVO</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-sm">
                Connexion
              </Button>
            </Link>
            <Link to="/onboarding">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-primary text-sm px-4">
                Commencer
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== 1. HERO SECTION ===== */}
      <section className="pt-28 md:pt-40 pb-16 md:pb-24 px-4 md:px-6 relative z-10">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <Badge variant="outline" className="px-4 py-1.5 text-xs font-mono uppercase tracking-wider border-white/10 bg-white/5 text-foreground/70">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                Protocole McKenzie & McGill
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={itemVariants}
              className="font-sans text-4xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-[1.1] tracking-tight"
            >
              L'OS de votre{' '}
              <span className="text-gradient-primary">colonne vertébrale.</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground font-normal mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Quantifiez votre santé dorsale. Optimisez votre posture. Une boucle de maintenance quotidienne de 8 minutes basée sur la data.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/onboarding">
                <Button size="lg" className="shimmer-btn bg-primary hover:bg-primary/90 text-primary-foreground shadow-radioactive h-14 px-8 text-lg rounded-full font-semibold transition-all duration-500 hover:scale-105">
                  Lancer mon Scan (Gratuit)
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="h-14 px-8 rounded-full border-white/10 hover:bg-white/5 hover:border-white/20">
                  Connexion
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== DASHBOARD MOCKUP ===== */}
      <section className="hidden md:block py-16 px-6 relative z-10" ref={heroRef}>
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
                className="absolute inset-x-0 top-1/4 h-[400px] blur-[100px] rounded-full" 
                style={{
                  background: 'radial-gradient(ellipse 70% 50% at 50% 50%, hsl(var(--primary) / 0.25) 0%, transparent 70%)'
                }}
              />
            </div>
            
            {/* Dashboard Window */}
            <motion.div 
              className="relative rounded-2xl border border-white/10 bg-card overflow-hidden"
              style={{
                rotateX: smoothRotateX,
                y: smoothY,
                transformStyle: 'preserve-3d',
                boxShadow: '0 60px 120px -30px rgba(0,0,0,0.8), 0 0 80px -20px hsl(var(--primary) / 0.15)'
              }}
            >
              {/* Window Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-muted-foreground font-mono">app.nivo.health</span>
                </div>
              </div>
              
              {/* Dashboard Content */}
              <div className="p-6 md:p-10 flex items-center justify-center min-h-[300px]">
                <div className="flex flex-col items-center gap-6">
                  {/* NIVO Score Circle */}
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                      <circle 
                        cx="50" cy="50" r="42" fill="none" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth="6" 
                        strokeLinecap="round"
                        strokeDasharray={`${72 * 2.64} ${100 * 2.64}`}
                        className="drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-semibold text-foreground">72</span>
                      <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">NIVO SCORE</span>
                    </div>
                  </div>
                  
                  {/* Stats Row */}
                  <div className="flex gap-8 text-center">
                    <div>
                      <div className="text-2xl font-semibold text-foreground">J-5</div>
                      <div className="text-xs text-muted-foreground">Streak</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-emerald-400">-18%</div>
                      <div className="text-xs text-muted-foreground">Douleur</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-foreground">8 min</div>
                      <div className="text-xs text-muted-foreground">Daily Loop</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== 2. PROBLÉMATIQUE SECTION ===== */}
      <section className="py-20 md:py-32 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.span variants={itemVariants} className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 block">
              Le Problème
            </motion.span>
            <motion.h2 variants={itemVariants} className="font-sans text-3xl md:text-5xl font-semibold mb-6 tracking-tight">
              La Sédentarité est une{' '}
              <span className="text-primary">Dette Technique.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-6"
          >
            {/* Card 1 - Compression */}
            <motion.div variants={cardVariants} className="glass-card p-8 text-center group hover:border-primary/30 transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <TrendingDown className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-sans text-xl font-semibold mb-3">Compression</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Vos disques intervertébraux s'écrasent après 4h assis. Pression constante, usure silencieuse.
              </p>
            </motion.div>

            {/* Card 2 - Atrophie */}
            <motion.div variants={cardVariants} className="glass-card p-8 text-center group hover:border-primary/30 transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-sans text-xl font-semibold mb-3">Atrophie</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Vos muscles stabilisateurs s'éteignent progressivement. Moins de support, plus de vulnérabilité.
              </p>
            </motion.div>

            {/* Card 3 - Douleur */}
            <motion.div variants={cardVariants} className="glass-card p-8 text-center group hover:border-primary/30 transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <AlertTriangle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-sans text-xl font-semibold mb-3">Douleur</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Le signal d'alarme du système. Quand ça fait mal, c'est que la dette est déjà accumulée.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== 3. SOLUTION - LE MOTEUR NIVO ===== */}
      <section className="py-20 md:py-32 px-4 md:px-6 relative z-10 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              {/* Text Content */}
              <div>
                <motion.span variants={itemVariants} className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 block">
                  Le Moteur
                </motion.span>
                <motion.h2 variants={itemVariants} className="font-sans text-3xl md:text-4xl font-semibold mb-6 tracking-tight">
                  Le NIVO Score :{' '}
                  <span className="text-primary">votre métrique de référence.</span>
                </motion.h2>
                <motion.p variants={itemVariants} className="text-muted-foreground mb-8 leading-relaxed">
                  Un algorithme propriétaire qui combine trois dimensions : votre ressenti subjectif (douleur, fatigue), votre mobilité fonctionnelle, et votre charge de travail quotidienne.
                </motion.p>
                
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <span className="font-medium">45% Index Subjectif</span>
                      <span className="text-muted-foreground text-sm block">Douleur & fatigue auto-évaluées</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <span className="font-medium">30% Index Fonctionnel</span>
                      <span className="text-muted-foreground text-sm block">Tests de mobilité & stabilité</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <span className="font-medium">25% Index de Charge</span>
                      <span className="text-muted-foreground text-sm block">Heures assis & stress quotidien</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Visual - Score Gauge */}
              <motion.div variants={cardVariants} className="relative">
                <div className="glass-card p-8 md:p-10">
                  <div className="relative w-48 h-48 mx-auto mb-6">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                      <circle 
                        cx="50" cy="50" r="42" fill="none" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth="8" 
                        strokeLinecap="round"
                        strokeDasharray={`${85 * 2.64} ${100 * 2.64}`}
                        className="drop-shadow-[0_0_12px_hsl(var(--primary)/0.5)]"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-semibold text-foreground">85</span>
                      <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider mt-1">Score</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-2">
                      <Activity className="w-3 h-3 mr-1" />
                      Système Optimisé
                    </Badge>
                    <p className="text-xs text-muted-foreground">Score calculé en temps réel</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== 4. PRODUIT - DAILY LOOP ===== */}
      <section className="py-20 md:py-32 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <div className="text-center mb-16">
              <motion.span variants={itemVariants} className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 block">
                Le Protocole
              </motion.span>
              <motion.h2 variants={itemVariants} className="font-sans text-3xl md:text-5xl font-semibold mb-6 tracking-tight">
                La Daily Loop :{' '}
                <span className="text-primary">8 minutes, chaque jour.</span>
              </motion.h2>
              <motion.p variants={itemVariants} className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Pas du yoga. De l'ingénierie corporelle.
              </motion.p>
            </div>

            {/* 3 Steps */}
            <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-6 mb-12">
              <motion.div variants={cardVariants} className="glass-card p-8 text-center border-l-2 border-l-primary">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <span className="text-primary font-mono font-bold text-lg">01</span>
                </div>
                <h3 className="font-sans text-lg font-semibold mb-2">Decompress</h3>
                <p className="text-muted-foreground text-sm">
                  Libérez la pression accumulée sur vos disques. Protocole McKenzie adapté.
                </p>
              </motion.div>

              <motion.div variants={cardVariants} className="glass-card p-8 text-center border-l-2 border-l-primary">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <span className="text-primary font-mono font-bold text-lg">02</span>
                </div>
                <h3 className="font-sans text-lg font-semibold mb-2">Mobilize</h3>
                <p className="text-muted-foreground text-sm">
                  Récupérez vos amplitudes articulaires. Mouvements de précision ciblés.
                </p>
              </motion.div>

              <motion.div variants={cardVariants} className="glass-card p-8 text-center border-l-2 border-l-primary">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <span className="text-primary font-mono font-bold text-lg">03</span>
                </div>
                <h3 className="font-sans text-lg font-semibold mb-2">Stabilize</h3>
                <p className="text-muted-foreground text-sm">
                  Activez vos stabilisateurs profonds. McGill Big 3 pour une armure musculaire.
                </p>
              </motion.div>
            </motion.div>

            {/* Scientific Sources */}
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                <Brain className="w-4 h-4" />
                <span>Protocole McGill</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                <Activity className="w-4 h-4" />
                <span>Méthode McKenzie</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                <Sparkles className="w-4 h-4" />
                <span>NASA Countermeasures</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== 5. PRICING ===== */}
      <section className="py-20 md:py-32 px-4 md:px-6 relative z-10 bg-white/[0.02]">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <div className="text-center mb-16">
              <motion.span variants={itemVariants} className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 block">
                Pricing
              </motion.span>
              <motion.h2 variants={itemVariants} className="font-sans text-3xl md:text-5xl font-semibold mb-6 tracking-tight">
                Choisissez votre niveau.
              </motion.h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Starter - Free */}
              <motion.div variants={cardVariants} className="glass-card p-8 relative">
                <div className="mb-6">
                  <h3 className="font-sans text-xl font-semibold mb-1">Starter</h3>
                  <p className="text-muted-foreground text-sm">Pour surveiller vos signes vitaux.</p>
                </div>
                
                <div className="mb-8">
                  <span className="text-4xl font-semibold">Gratuit</span>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Scan illimité</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Score du jour</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Routine de maintenance</span>
                  </li>
                </ul>

                <Link to="/onboarding" className="block">
                  <Button variant="outline" className="w-full h-12 border-white/10 hover:bg-white/5">
                    Commencer gratuitement
                  </Button>
                </Link>
              </motion.div>

              {/* NIVO PRO */}
              <motion.div variants={cardVariants} className="glass-card p-8 relative border-primary/30 bg-primary/5">
                {/* Badge 7 jours */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground shadow-glow-primary">
                    <Timer className="w-3 h-3 mr-1" />
                    7 jours d'essai offerts
                  </Badge>
                </div>

                <div className="mb-6 pt-2">
                  <h3 className="font-sans text-xl font-semibold mb-1">NIVO PRO</h3>
                  <p className="text-muted-foreground text-sm">Pour optimiser la machine.</p>
                </div>
                
                <div className="mb-8">
                  <span className="text-4xl font-semibold">9.90€</span>
                  <span className="text-muted-foreground">/mois</span>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Tout Starter</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Protocoles Douleur (Sciatique, Cou...)</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Historique Data</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Mode Focus</span>
                  </li>
                </ul>

                <Link to="/onboarding" className="block">
                  <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-primary">
                    Essayer 7 jours gratuit
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== 6. FOOTER ===== */}
      <footer className="py-12 px-4 md:px-6 border-t border-white/5">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-sans text-primary-foreground font-bold text-lg">N</span>
              </div>
              <span className="font-sans text-lg font-semibold tracking-tight text-foreground">NIVO</span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/cgv" className="hover:text-foreground transition-colors">CGV</Link>
              <Link to="/confidentialite" className="hover:text-foreground transition-colors">Confidentialité</Link>
              <Link to="/mentions-legales" className="hover:text-foreground transition-colors">Mentions légales</Link>
            </div>

            {/* Copyright */}
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} NIVO. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
