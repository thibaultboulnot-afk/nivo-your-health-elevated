import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Flame, Building2, Timer, Activity, Eye } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { SpineHologram } from '@/components/SpineHologram';
import { useLifetimeSpots } from '@/hooks/useLifetimeSpots';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Scroll reveal with fade
const ScrollReveal = ({ 
  children, 
  delay = 0,
}: { 
  children: React.ReactNode; 
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

// Infinite Marquee Component
const InfiniteMarquee = ({ 
  children, 
  direction = 'left',
  speed = 40
}: { 
  children: React.ReactNode; 
  direction?: 'left' | 'right';
  speed?: number;
}) => {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex gap-4"
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
  <div className="flex-shrink-0 w-64 h-40 rounded-2xl overflow-hidden relative group cursor-pointer">
    <div className={`absolute inset-0 ${gradient}`} />
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
    <div className="absolute inset-[1px] rounded-2xl border border-white/10" />
    
    <div className="relative h-full p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2.5 h-2.5 rounded-full ${accent}`} />
        <div className="h-1.5 w-12 rounded-full bg-white/20" />
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="h-2 w-full rounded bg-white/10" />
        <div className="h-2 w-3/4 rounded bg-white/10" />
        <div className="flex gap-2 mt-3">
          <div className="h-6 w-16 rounded-lg bg-white/5 border border-white/10" />
          <div className={`h-6 w-16 rounded-lg ${accent} opacity-50`} />
        </div>
      </div>
      
      <div className="mt-auto">
        <span className="font-data text-[9px] uppercase tracking-[0.15em] text-white/40">{name}</span>
      </div>
    </div>
    
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-white/5 to-transparent" />
  </div>
);

// Bento Card component
const BentoCard = ({ 
  icon: Icon, 
  title, 
  description,
  accent = "primary",
  className = ""
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  accent?: "primary" | "destructive" | "emerald";
  className?: string;
}) => {
  const accentColors = {
    primary: "text-primary bg-primary/10 border-primary/20 shadow-[0_0_20px_rgba(46,92,255,0.2)]",
    destructive: "text-red-400 bg-red-500/10 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]",
  };

  return (
    <GlassCard className={`p-6 h-full ${className}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${accentColors[accent]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-heading text-lg font-semibold mb-2 text-foreground">{title}</h3>
      <p className="font-body text-sm text-foreground/50 leading-relaxed">{description}</p>
    </GlassCard>
  );
};

export default function Landing() {
  const { spotsRemaining, loading } = useLifetimeSpots();
  const displaySpots = loading ? 93 : (spotsRemaining ?? 93);

  const themeCards = [
    { name: "Dark Mode", gradient: "bg-gradient-to-br from-slate-900 to-slate-950", accent: "bg-blue-500" },
    { name: "Focus Mode", gradient: "bg-gradient-to-br from-emerald-950 to-slate-950", accent: "bg-emerald-500" },
    { name: "Midnight Blue", gradient: "bg-gradient-to-br from-blue-950 to-indigo-950", accent: "bg-indigo-400" },
    { name: "Obsidian", gradient: "bg-gradient-to-br from-zinc-900 to-neutral-950", accent: "bg-zinc-400" },
    { name: "Deep Ocean", gradient: "bg-gradient-to-br from-cyan-950 to-slate-950", accent: "bg-cyan-400" },
    { name: "Noir", gradient: "bg-gradient-to-br from-neutral-900 to-black", accent: "bg-white" },
  ];

  const faqItems = [
    {
      question: "Ai-je besoin de matériel ?",
      answer: "Non. NIVO utilise la webcam de votre ordinateur pour scanner votre posture. Aucun capteur externe requis."
    },
    {
      question: "Combien de temps ça prend ?",
      answer: "Le protocole de maintenance dure 8 minutes par jour. Il est conçu pour s'insérer entre deux réunions."
    },
    {
      question: "Est-ce que ça remplace un médecin ?",
      answer: "NIVO est un outil de maintenance préventive et d'optimisation. Pour les pathologies aiguës ou douleurs intenses, consultez un spécialiste."
    },
    {
      question: "Mes données vidéos sont-elles enregistrées ?",
      answer: "Jamais. L'analyse biométrique se fait en local ou via un flux sécurisé instantané. Aucune image de vous n'est stockée sur nos serveurs."
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground selection:bg-primary selection:text-primary-foreground">
      
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-background/70 backdrop-blur-2xl border-b border-white/[0.04]" />
        <div className="relative max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(46,92,255,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]">
              <span className="font-heading text-white font-bold text-sm">N</span>
            </div>
            <span className="font-heading text-lg font-semibold tracking-tight">NIVO</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-foreground/50 hover:text-foreground hover:bg-white/[0.03] text-sm font-medium h-9">
                Connexion
              </Button>
            </Link>
            <Link to="/onboarding">
              <Button className="bg-white text-background hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.2)] text-sm px-4 font-semibold rounded-lg h-9">
                Commencer
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== SECTION 1: HERO - Centered with SpineHologram ===== */}
      <section className="min-h-screen pt-24 pb-12 flex items-center justify-center relative">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
          <div className="flex flex-col items-center text-center">
            {/* Title */}
            <ScrollReveal>
              <motion.h1 
                className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                NIVO
              </motion.h1>
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
              <p className="font-data text-sm md:text-base text-foreground/40 uppercase tracking-[0.3em] mb-12">
                Système d'Alignement Biologique
              </p>
            </ScrollReveal>

            {/* SpineHologram - XXL Central */}
            <ScrollReveal delay={0.2}>
              <motion.div 
                className="relative w-48 h-[400px] md:w-64 md:h-[500px] mb-12"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Outer glow ring */}
                <div className="absolute inset-0 -m-8 bg-primary/5 blur-3xl rounded-full" />
                <SpineHologram integrity={75} isCalibrated={true} className="w-full h-full" />
              </motion.div>
            </ScrollReveal>

            {/* CTA */}
            <ScrollReveal delay={0.3}>
              <Link to="/onboarding">
                <Button 
                  size="lg" 
                  className="relative overflow-hidden bg-white text-background hover:bg-white/95 h-14 px-8 text-base rounded-xl font-semibold transition-all shadow-[0_0_50px_rgba(255,255,255,0.15),inset_0_1px_0_rgba(255,255,255,0.4)] hover:shadow-[0_0_70px_rgba(255,255,255,0.25)] group"
                >
                  <span className="relative z-10 flex items-center">
                    Lancer le Diagnostic
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: LA VÉRITÉ PHYSIQUE - Bento Grid 3 Cards ===== */}
      <section className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-4">
              La Vérité Physique
            </h2>
            <p className="font-data text-sm text-foreground/40 text-center mb-12 uppercase tracking-wider">
              Données biomécaniques
            </p>
          </ScrollReveal>

          {/* Bento Grid - 3 Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <ScrollReveal delay={0.1}>
              <BentoCard 
                icon={Activity}
                title="La Gravité"
                description="Compression continue de 9.81 m/s². Votre colonne se tasse de 1cm chaque jour."
                accent="destructive"
              />
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <BentoCard 
                icon={Timer}
                title="Le Temps"
                description="2 200 heures statiques par an. L'immobilité est le poison."
                accent="primary"
              />
            </ScrollReveal>
            
            <ScrollReveal delay={0.3}>
              <BentoCard 
                icon={Eye}
                title="Correction Optique"
                description="Analyse biométrique par webcam en temps réel. Zéro matériel requis."
                accent="emerald"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: PERSONNALISATION - Marquee ===== */}
      <section className="py-24 relative z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <ScrollReveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-4">
              Intégrez NIVO à votre Espace de Travail
            </h2>
            <p className="font-data text-sm text-foreground/40 text-center uppercase tracking-wider">
              Thèmes & Personnalisation
            </p>
          </ScrollReveal>
        </div>

        <div className="space-y-4">
          <InfiniteMarquee direction="left" speed={50}>
            {themeCards.map((theme, i) => (
              <ThemeCard key={i} {...theme} />
            ))}
          </InfiniteMarquee>
          <InfiniteMarquee direction="right" speed={45}>
            {themeCards.slice().reverse().map((theme, i) => (
              <ThemeCard key={i} {...theme} />
            ))}
          </InfiniteMarquee>
        </div>
      </section>

      {/* ===== SECTION 4: FAQ - Accordion ===== */}
      <section className="py-24 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-4">
              Protocole & Données
            </h2>
            <p className="font-data text-sm text-foreground/40 text-center mb-12 uppercase tracking-wider">
              Questions fréquentes
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <GlassCard className="p-2">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border-white/[0.06] px-4"
                  >
                    <AccordionTrigger className="text-left font-heading text-base font-medium text-foreground/90 hover:text-foreground hover:no-underline py-5">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-foreground/50 text-sm leading-relaxed pb-5">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== SECTION 5: CLOSING - Founder + Corporate ===== */}
      <section className="py-24 relative z-10 bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-[#0a0a0a] pointer-events-none" style={{ height: '80px', top: '-80px' }} />
        
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <p className="font-data text-xs text-foreground/30 text-center uppercase tracking-[0.3em] mb-4">
              Accès Limité
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-16">
              Rejoignez l'élite digitale.
            </h2>
          </ScrollReveal>

          {/* Founder Card */}
          <ScrollReveal delay={0.1}>
            <GlassCard premium className="p-8 md:p-10 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="font-data text-[10px] uppercase tracking-wider text-amber-400/80">Launch Edition</span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold mb-2">Accès Founder</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-data text-4xl font-bold text-foreground">149€</span>
                    <span className="font-data text-sm text-foreground/40">paiement unique</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/50">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="font-data text-sm">
                      <span className="text-foreground font-semibold">{displaySpots}</span> places restantes
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/checkout?plan=lifetime">
                    <Button 
                      size="lg"
                      className="w-full sm:w-auto bg-white text-background hover:bg-white/90 h-12 px-6 font-semibold rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.3)]"
                    >
                      <Flame className="mr-2 h-4 w-4" />
                      Sécuriser ma licence
                    </Button>
                  </Link>
                  
                  <Link to="/contact">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="w-full sm:w-auto border-white/10 hover:bg-white/[0.03] h-12 px-6 font-medium rounded-xl"
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      Contact Entreprise
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 border-t border-white/[0.04] bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/80 flex items-center justify-center">
                <span className="font-heading text-white font-bold text-xs">N</span>
              </div>
              <span className="font-heading text-sm font-medium text-foreground/60">NIVO</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm font-body text-foreground/40">
              <Link to="/cgv" className="hover:text-foreground/60 transition-colors">CGV</Link>
              <Link to="/confidentialite" className="hover:text-foreground/60 transition-colors">Confidentialité</Link>
              <Link to="/mentions-legales" className="hover:text-foreground/60 transition-colors">Mentions Légales</Link>
            </div>
            
            <span className="font-data text-xs text-foreground/30">
              © 2025 NIVO Systems
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
