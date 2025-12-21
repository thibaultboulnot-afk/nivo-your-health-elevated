import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, ChevronRight, Map, Brain, Zap, Activity, Check, Lock, Eye, Shield, Cpu, X } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// --- CONFIGURATION DU CONTENU DYNAMIQUE ---
const PROGRAM_DETAILS = {
  RAPID_PATCH: {
    title: "Rapid Patch Protocol",
    duration: "14 Jours",
    phases: [
      { name: "SEMAINE 1", label: "SOULAGER", active: true, desc: "Décompression d'urgence & baisse de l'inflammation." },
      { name: "SEMAINE 2", label: "MOBILISER", active: true, desc: "Récupération des amplitudes articulaires clés." },
      { name: "SEMAINE 3", label: "RENFORCER", active: false, desc: "Non inclus : Stabilisation durable." },
      { name: "SEMAINE 4", label: "PERFORMER", active: false, desc: "Non inclus : Optimisation neurale." }
    ],
    features: ["Décompression Lombaire", "Protocole Tech-Neck", "Audio-Guide Basique"],
    price: "49€",
    color: "slate"
  },
  SYSTEM_REBOOT: {
    title: "System Reboot Protocol",
    duration: "21 Jours",
    phases: [
      { name: "SEMAINE 1", label: "SOULAGER", active: true, desc: "Décompression & Reset du système nerveux." },
      { name: "SEMAINE 2", label: "ALIGNER", active: true, desc: "Reprogrammation de la posture neutre." },
      { name: "SEMAINE 3", label: "RENFORCER", active: true, desc: "Verrouillage musculaire de la nouvelle posture." },
      { name: "SEMAINE 4", label: "PERFORMER", active: false, desc: "Non inclus : Optimisation avancée." }
    ],
    features: ["Tout le Rapid Patch", "Reprogrammation Neurale", "Neuroplasticité", "Scientific Rationale"],
    price: "99€",
    color: "#ff6b4a"
  },
  ARCHITECT_MODE: {
    title: "Architect Mode Protocol",
    duration: "30 Jours",
    phases: [
      { name: "SEMAINE 1", label: "SOULAGER", active: true, desc: "Décompression & Reset complet." },
      { name: "SEMAINE 2", label: "ALIGNER", active: true, desc: "Correction structurelle profonde." },
      { name: "SEMAINE 3", label: "RENFORCER", active: true, desc: "Construction de l'armure posturale." },
      { name: "SEMAINE 4+", label: "PERFORMER", active: true, desc: "Focus Visuel, Vestibulaire & Deep Work." }
    ],
    features: ["Programme Complet (30j)", "Protocoles Vision (Focus)", "Routine Deep Work", "Support Prioritaire"],
    price: "149€",
    color: "white"
  }
};

// Spotlight component for mouse tracking
const SpotlightCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    divRef.current.style.setProperty('--mouse-x', `${x}%`);
    divRef.current.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`spotlight ${className}`}
    >
      {children}
    </div>
  );
};

export default function Landing() {
  const navigate = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState<'RAPID_PATCH' | 'SYSTEM_REBOOT' | 'ARCHITECT_MODE'>('SYSTEM_REBOOT');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const details = PROGRAM_DETAILS[selectedProgram];

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll animations for Hero Dashboard
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"]
  });

  // Dashboard 3D transform based on scroll (15deg -> 0deg, y: 40 -> 0, opacity: 0.6 -> 1)
  const dashboardRotateX = useTransform(heroScrollProgress, [0, 0.4], [15, 0]);
  const dashboardY = useTransform(heroScrollProgress, [0, 0.4], [40, 0]);
  const dashboardOpacity = useTransform(heroScrollProgress, [0, 0.4], [0.6, 1]);
  const smoothRotateX = useSpring(dashboardRotateX, { stiffness: 100, damping: 30 });
  const smoothY = useSpring(dashboardY, { stiffness: 100, damping: 30 });

  // Parallax for problem section
  const problemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: problemScrollProgress } = useScroll({
    target: problemRef,
    offset: ["start end", "end start"]
  });
  const parallaxY = useTransform(problemScrollProgress, [0, 1], [-30, 30]);

  // Text reveal for manifeste section
  const manifesteRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: manifesteScrollProgress } = useScroll({
    target: manifesteRef,
    offset: ["start 0.8", "end 0.4"]
  });

  const handleSelectProgram = (program: 'RAPID_PATCH' | 'SYSTEM_REBOOT' | 'ARCHITECT_MODE') => {
    if (program !== selectedProgram) {
      setIsTransitioning(true);
      setTimeout(() => {
        setSelectedProgram(program);
        setIsTransitioning(false);
      }, 150);
    }
  };

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#030307] relative overflow-hidden text-white selection:bg-primary selection:text-primary-foreground">
      {/* Aurora Background Effect */}
      <div className="aurora absolute inset-0 pointer-events-none opacity-40" />
      
      {/* Grid Background */}
      <div className="grid-background absolute inset-0 pointer-events-none opacity-20" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-radioactive">
              <span className="font-sans text-primary-foreground font-bold text-lg">N</span>
            </div>
            <span className="font-sans text-xl font-bold tracking-tight">NIVO</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-white/50 hover:text-white font-mono text-xs transition-all duration-500 ease-apple">
                Connexion Système
              </Button>
            </Link>
            <Link to="/diagnostic">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium glow-primary-sm transition-all duration-500 ease-apple">
                Lancer le Scan
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION - Staggered Animations with Framer Motion */}
      <section className="pt-32 pb-24 px-6 relative z-10">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/80">
                Protocole Clinique Validé
              </span>
            </motion.div>

            {/* Title - Word by word animation */}
            <motion.h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-[1.1]">
              <motion.span variants={itemVariants} className="inline-block">La </motion.span>
              <motion.span variants={itemVariants} className="inline-block italic text-white/40">Maintenance </motion.span>
              <motion.span variants={itemVariants} className="inline-block italic text-white/40">Système</motion.span>
              <br />
              <motion.span 
                variants={itemVariants} 
                className="inline-block bg-gradient-to-r from-white via-white/80 to-white/50 bg-clip-text text-transparent"
              >
                pour le Corps Humain.
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-white/50 font-light mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Pour les entrepreneurs et créateurs qui passent leur vie assis.<br />
              <span className="text-white/30">Basé sur les standards cliniques de décompression (Méthodes McKenzie & McGill).</span>
            </motion.p>

            {/* CTA - With Shimmer Effect */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/diagnostic">
                <Button size="lg" className="shimmer-btn bg-primary hover:bg-primary/90 text-primary-foreground glow-primary h-14 min-h-[48px] px-8 text-lg rounded-full font-medium transition-all duration-500 ease-apple hover:scale-105">
                  Lancer le Scan Corporel
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="border-white/10 text-white/80 hover:text-white hover:bg-white/5 h-14 min-h-[48px] px-8 rounded-full transition-all duration-500 ease-apple btn-outline-glow">
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Connexion Système
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. PRODUCT SHOWCASE - 3D Floating Dashboard with Scroll Animation */}
      <section className="py-20 px-6 relative z-10" ref={heroRef}>
        <div className="container mx-auto max-w-6xl">
          {/* Section Label */}
          <div className="text-center mb-12">
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 block mb-3">Aperçu de l'Interface</span>
            <p className="text-white/30 text-sm">Découvrez votre futur espace de travail</p>
          </div>

          {/* Floating App Window Container */}
          <motion.div 
            className="relative"
            style={{ 
              perspective: '2000px',
              opacity: isMobile ? 1 : dashboardOpacity 
            }}
          >
            {/* MASSIVE Orange/Red Glow Effect Behind Dashboard - Radioactive Shadow */}
            <div className="absolute inset-0 -z-10">
              {/* Primary massive glow */}
              <div 
                className="absolute inset-x-0 top-1/4 h-[500px] blur-[120px] rounded-full" 
                style={{
                  background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255, 107, 74, 0.3) 0%, rgba(255, 107, 74, 0.1) 40%, transparent 70%)'
                }}
              />
              {/* Secondary ambient glow */}
              <div 
                className="absolute inset-x-10 top-20 h-[400px] blur-[100px] rounded-full"
                style={{
                  background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(255, 140, 100, 0.2) 0%, transparent 60%)'
                }}
              />
              {/* Bottom reflection glow */}
              <div 
                className="absolute inset-x-20 bottom-0 h-[200px]"
                style={{
                  background: 'radial-gradient(ellipse 100% 100% at 50% 100%, rgba(255, 107, 74, 0.12) 0%, transparent 70%)'
                }}
              />
            </div>
            
            {/* The Main Window - With 3D Transform Animation */}
            <motion.div 
              className="relative rounded-[24px] border border-white/[0.06] bg-[#0A0A12] overflow-hidden glass-border"
              style={{
                rotateX: isMobile ? 0 : smoothRotateX,
                y: isMobile ? 0 : smoothY,
                transformStyle: 'preserve-3d',
                boxShadow: `
                  0 80px 160px -40px rgba(0,0,0,0.9), 
                  0 40px 80px -30px rgba(255,107,74,0.12), 
                  0 0 120px -20px rgba(255,107,74,0.15)
                `
              }}
            >
              {/* Glass Reflection Effect - Diagonal gradient on top */}
              <div 
                className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none z-20 rounded-t-[24px] overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 20%, transparent 50%)'
                }}
              />
              {/* Inner glass border highlight */}
              <div 
                className="absolute inset-0 pointer-events-none z-20 rounded-[24px]"
                style={{
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 0 1px rgba(255,255,255,0.05)'
                }}
              />
              
              {/* Window Structure: Sidebar + Main */}
              <div className="flex">
                {/* Sidebar Navigation */}
                <div className="w-16 md:w-20 bg-white/[0.02] border-r border-white/[0.04] flex flex-col items-center py-6 gap-6">
                  {/* Logo */}
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]">
                    <span className="text-[#030307] font-bold text-lg">N</span>
                  </div>
                  
                  {/* Nav Icons */}
                  <div className="flex flex-col gap-4 mt-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-transparent flex items-center justify-center text-white/30 hover:text-white transition-colors duration-500 ease-apple">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-transparent flex items-center justify-center text-white/30 hover:text-white transition-colors duration-500 ease-apple">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-transparent flex items-center justify-center text-white/30 hover:text-white transition-colors duration-500 ease-apple">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                  {/* Header Bar */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04] bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                      </div>
                      <div className="h-4 w-px bg-white/10 ml-2" />
                      <span className="font-mono text-[11px] text-white/40 uppercase tracking-wider">Session 01 · Architect Mode</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Notification Bell */}
                      <div className="relative">
                        <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></span>
                      </div>
                      {/* User Avatar */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-[10px] font-bold text-white">
                          JD
                        </div>
                        <span className="text-sm text-white/40 hidden md:block">John Doe</span>
                      </div>
                      {/* Status */}
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                        </span>
                        <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider">Online</span>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-6 md:p-8">
                    {/* Day Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1">Jour 12 · Phase 2</p>
                        <h2 className="text-2xl md:text-3xl font-light text-white">Décompression Vertébrale</h2>
                      </div>
                      <div className="hidden md:flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] text-white/50">
                          [ ARCHITECT_MODE :: ACTIVE ]
                        </span>
                      </div>
                    </div>

                    {/* Rich Audio Player */}
                    <div className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.05] backdrop-blur-xl mb-6">
                      {/* Inner glow */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/[0.01] to-transparent pointer-events-none" />
                      
                      <div className="relative z-10">
                        {/* Track Info */}
                        <div className="flex items-center gap-5 mb-8">
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
                            <Brain className="w-10 h-10 text-white/80" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </div>
                          <div className="flex-1">
                            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1">Protocole Actif</p>
                            <h3 className="text-xl md:text-2xl font-light text-white mb-1">Décompression Lombaire</h3>
                            <p className="text-sm text-white/40">Module Focus · Anti-Fragilité</p>
                          </div>
                        </div>

                        {/* Detailed Waveform */}
                        <div className="relative h-24 mb-6 flex items-end justify-center gap-[2px] px-2">
                          {[...Array(80)].map((_, i) => {
                            const baseHeight = 20 + Math.sin(i * 0.15) * 25 + Math.cos(i * 0.08) * 15;
                            const played = i < 32;
                            return (
                              <div
                                key={i}
                                className={`w-[3px] md:w-1 rounded-full transition-all duration-300 ${
                                  played 
                                    ? 'bg-gradient-to-t from-white/60 to-white' 
                                    : 'bg-gradient-to-t from-white/10 to-white/30'
                                }`}
                                style={{
                                  height: `${baseHeight + Math.random() * 15}%`,
                                  opacity: played ? 1 : 0.4
                                }}
                              />
                            );
                          })}
                          {/* Playhead */}
                          <div className="absolute left-[40%] top-0 bottom-0 flex flex-col items-center">
                            <div className="w-0.5 flex-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.6)]" />
                            <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] -mt-1" />
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full w-[40%] bg-gradient-to-r from-white/60 to-white rounded-full" />
                          </div>
                        </div>

                        {/* Time + Controls */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-white/40">04:48</span>
                          
                          <div className="flex items-center gap-6">
                            <button className="w-8 h-8 text-white/40 hover:text-white transition-colors duration-500 ease-apple">
                              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                            </button>
                            <button className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-[0_0_40px_-5px_rgba(255,255,255,0.4)] hover:scale-105 transition-transform duration-500 ease-apple">
                              <svg className="w-7 h-7 text-[#030307] ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                            </button>
                            <button className="w-8 h-8 text-white/40 hover:text-white transition-colors duration-500 ease-apple">
                              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                            </button>
                          </div>
                          
                          <span className="font-mono text-xs text-white/40">12:00</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm">
                        <p className="font-mono text-[9px] text-white/30 uppercase tracking-wider mb-2">Pression Discale</p>
                        <p className="text-2xl font-light text-emerald-400 font-mono">-15%</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm">
                        <p className="font-mono text-[9px] text-white/30 uppercase tracking-wider mb-2">Durée</p>
                        <p className="text-2xl font-light text-white"><span className="font-mono">12</span> <span className="text-sm font-normal text-white/40">min</span></p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm">
                        <p className="font-mono text-[9px] text-white/30 uppercase tracking-wider mb-2">Streak</p>
                        <p className="text-2xl font-light text-white"><span className="font-mono">12</span> <span className="text-sm font-normal text-white/40">jours</span></p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm">
                        <p className="font-mono text-[9px] text-white/30 uppercase tracking-wider mb-2">Focus Score</p>
                        <p className="text-2xl font-light text-white"><span className="font-mono">94</span><span className="text-sm font-normal text-white/40">%</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. PROBLEM SECTION - Latence Matérielle with Parallax */}
      <section className="py-24 px-6 relative z-10" ref={problemRef}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-red-500 font-mono text-xs tracking-widest uppercase mb-4 block">⚠ Alerte Système</span>
            <h2 className="font-display text-4xl md:text-5xl text-white font-bold">
              Latence Matérielle
            </h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto">
              Les signaux d'alerte que votre corps envoie quand votre productivité est menacée.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-red-500/30 transition-all duration-500 ease-apple overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] opacity-50"></div>
              
              {/* Hover Data Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-950/95 via-red-900/90 to-black/95 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-apple z-20 backdrop-blur-sm">
                <span className="font-mono text-[10px] text-red-400 uppercase tracking-widest mb-2">Donnée Clinique</span>
                <span className="text-5xl md:text-6xl font-bold text-red-500 mb-2 font-mono">-20%</span>
                <span className="text-lg text-white font-medium">Oxygénation Cérébrale</span>
                <span className="text-xs text-red-400/70 mt-4 font-mono">Source: J Neurosci 2019</span>
              </div>
              
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center group-hover:scale-110 group-hover:border-red-500/40 transition-all duration-500 ease-apple">
                    <Brain className="w-7 h-7 text-red-500" />
                  </div>
                </div>
                <h3 className="text-2xl text-white font-medium mb-3">Baisse de Focus</h3>
                <p className="text-white/40 leading-relaxed">
                  La mauvaise posture réduit l'oxygénation du cerveau de <span className="text-red-400 font-medium">20%</span>. Votre capacité de décision et créativité chutent.
                </p>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <span className="text-xs text-red-400 font-mono">Impact: -2h de Deep Work/jour</span>
                </div>
              </div>
            </div>

            {/* Card 2 - With Parallax */}
            <motion.div 
              className="group relative p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-orange-500/30 transition-all duration-500 ease-apple overflow-hidden"
              style={{ y: isMobile ? 0 : parallaxY }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] opacity-50"></div>
              
              {/* Hover Data Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-950/95 via-orange-900/90 to-black/95 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-apple z-20 backdrop-blur-sm">
                <span className="font-mono text-[10px] text-orange-400 uppercase tracking-widest mb-2">Donnée Clinique</span>
                <span className="text-5xl md:text-6xl font-bold text-orange-500 mb-2 font-mono">+90%</span>
                <span className="text-lg text-white font-medium">Risque Diabète Type 2</span>
                <span className="text-xs text-orange-400/70 mt-4 font-mono">Source: Ann Intern Med 2015</span>
              </div>
              
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:scale-110 group-hover:border-orange-500/40 transition-all duration-500 ease-apple">
                    <Activity className="w-7 h-7 text-orange-500" />
                  </div>
                </div>
                <h3 className="text-2xl text-white font-medium mb-3">Ralentissement Métabolique</h3>
                <p className="text-white/40 leading-relaxed">
                  L'immobilité prolongée désactive les enzymes responsables de votre énergie. <span className="text-orange-400 font-medium">Fatigue chronique</span> garantie.
                </p>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <span className="text-xs text-orange-400 font-mono">Impact: Crashes énergétiques à 15h</span>
                </div>
              </div>
            </motion.div>

            {/* Card 3 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-yellow-500/30 transition-all duration-500 ease-apple overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] opacity-50"></div>
              
              {/* Hover Data Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-950/95 via-yellow-900/90 to-black/95 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-apple z-20 backdrop-blur-sm">
                <span className="font-mono text-[10px] text-yellow-400 uppercase tracking-widest mb-2">Donnée Clinique</span>
                <span className="text-5xl md:text-6xl font-bold text-yellow-500 mb-2 font-mono">+300%</span>
                <span className="text-lg text-white font-medium">Pression Discale</span>
                <span className="text-xs text-yellow-400/70 mt-4 font-mono">Source: Spine Journal 2021</span>
              </div>
              
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center group-hover:scale-110 group-hover:border-yellow-500/40 transition-all duration-500 ease-apple">
                    <Zap className="w-7 h-7 text-yellow-500" />
                  </div>
                </div>
                <h3 className="text-2xl text-white font-medium mb-3">Usure Silencieuse</h3>
                <p className="text-white/40 leading-relaxed">
                  La tension statique continue épuise vos muscles posturaux. Quand la douleur arrive, <span className="text-yellow-400 font-medium">c'est déjà trop tard</span>.
                </p>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <span className="text-xs text-yellow-400 font-mono">Impact: Arrêt de travail forcé</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ARCHITECTURE SECTION - Bento Grid with Border Beam */}
      <section className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block">Fondations Scientifiques</span>
            <h2 className="font-display text-4xl md:text-5xl text-white font-bold">
              Architecture du Protocole
            </h2>
            <p className="text-white/40 mt-4 max-w-2xl mx-auto">
              Basé sur les protocoles cliniques les plus éprouvés au monde.
            </p>
          </div>

          {/* Bento Grid Container with Circuit Lines */}
          <div className="relative">
            {/* Circuit Lines SVG - Pulsing connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block" style={{ overflow: 'visible' }}>
              <line 
                x1="33%" y1="50%" x2="50%" y2="50%" 
                stroke="url(#pulse-gradient-1)" 
                strokeWidth="1" 
                strokeDasharray="8 4"
                className="animate-pulse"
              />
              <line 
                x1="50%" y1="50%" x2="67%" y2="50%" 
                stroke="url(#pulse-gradient-2)" 
                strokeWidth="1" 
                strokeDasharray="8 4"
                className="animate-pulse"
                style={{ animationDelay: '0.5s' }}
              />
              <circle cx="33%" cy="50%" r="3" fill="#ff6b4a" className="animate-pulse" />
              <circle cx="67%" cy="50%" r="3" fill="#a855f7" className="animate-pulse" style={{ animationDelay: '1s' }} />
              
              <defs>
                <linearGradient id="pulse-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff6b4a" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="pulse-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Bento Grid - Asymmetric Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 relative z-10">
              {/* Card 1 - McKenzie with Border Beam */}
              <div className="md:col-span-5 border-beam group relative p-8 rounded-3xl bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent border border-primary/15 hover:border-primary/40 transition-all duration-500 ease-apple overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,107,74,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,74,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50"></div>
                <div className="relative z-10">
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/40 transition-all duration-500 ease-apple">
                      <Cpu className="w-8 h-8 text-primary animate-[spin_20s_linear_infinite]" />
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-primary uppercase tracking-widest mb-3 block">Moteur Mécanique</span>
                  <h3 className="text-2xl text-white font-bold mb-3">Méthode McKenzie</h3>
                  <p className="text-white/40 leading-relaxed text-sm">
                    Le standard mondial pour la décompression vertébrale. Utilisé dans <span className="text-primary font-mono">+80%</span> des cliniques de rééducation du dos.
                  </p>
                  <div className="mt-6 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Check className="w-3 h-3 text-primary" />
                      <span>Centralisation Discale</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Card 2 - McGill with Border Beam */}
              <div className="md:col-span-4 border-beam group relative p-8 rounded-3xl bg-gradient-to-br from-cyan-500/5 via-cyan-500/[0.02] to-transparent border border-cyan-500/15 hover:border-cyan-500/40 transition-all duration-500 ease-apple overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50"></div>
                <div className="relative z-10">
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-500/40 transition-all duration-500 ease-apple">
                      <Shield className="w-8 h-8 text-cyan-400 animate-pulse" />
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest mb-3 block">Bouclier Core</span>
                  <h3 className="text-2xl text-white font-bold mb-3">Méthode McGill</h3>
                  <p className="text-white/40 leading-relaxed text-sm">
                    Le "Big 3" : Renforcement isométrique du Core. Zéro charge compressive.
                  </p>
                  <div className="mt-6 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Check className="w-3 h-3 text-cyan-400" />
                      <span>Stabilisation Lombaire</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Card 3 - Neuro with Border Beam */}
              <div className="md:col-span-3 border-beam group relative p-8 rounded-3xl bg-gradient-to-br from-purple-500/5 via-purple-500/[0.02] to-transparent border border-purple-500/15 hover:border-purple-500/40 transition-all duration-500 ease-apple overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50"></div>
                <div className="relative z-10">
                  <div className="mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 group-hover:border-purple-500/40 transition-all duration-500 ease-apple">
                      <Brain className="w-7 h-7 text-purple-400" />
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-purple-400 uppercase tracking-widest mb-3 block">Processeur</span>
                  <h3 className="text-xl text-white font-bold mb-3">Neuro-Physio</h3>
                  <p className="text-white/40 leading-relaxed text-sm">
                    Neuroplasticité posturale.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION with Spotlight Effect */}
      <section className="py-24 px-6 relative z-10 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block">Choisissez votre Protocole</span>
            <h2 className="font-display text-4xl md:text-5xl text-white font-bold">
              Architecture des Programmes
            </h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto">
              Cliquez sur une carte pour révéler l'architecture du programme.
            </p>
          </div>

          {/* PRICING CARDS with Spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-0">
            {/* CARD 1: RAPID PATCH */}
            <SpotlightCard 
              className={`group flex flex-col p-6 rounded-t-3xl md:rounded-3xl md:rounded-b-none border transition-all duration-500 ease-apple relative ${selectedProgram === 'RAPID_PATCH' ? 'bg-[#0a0a12] border-white/30 border-b-0 md:border-b shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)]' : 'bg-[#0a0a12] border-white/5 hover:border-white/15'}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono uppercase tracking-wider text-white/50">Urgence & Douleur</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-1">Rapid Patch</h3>
              <p className="text-xs text-white/40 mb-2 font-mono">14 Jours</p>
              <p className="text-3xl font-bold text-white mb-2 font-mono">49€</p>
              <p className="text-xs text-white/40 mb-4">Paiement unique</p>
              <p className="text-sm text-white/40 mb-6 leading-relaxed">Éteindre l'inflammation et stopper la douleur en 2 semaines.</p>
              <div className="space-y-2 mb-6 flex-grow">
                {PROGRAM_DETAILS.RAPID_PATCH.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white/60"><Check className="w-3 h-3 text-primary" /> {f}</div>
                ))}
              </div>
              <div className="flex flex-col gap-2 mt-auto">
                <Link to="/checkout?plan=RAPID_PATCH" className="w-full">
                  <Button className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-all duration-500 ease-apple">
                    Commencer ce programme
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSelectProgram('RAPID_PATCH')}
                  className={`w-full text-white/40 hover:text-white hover:bg-white/5 text-xs transition-all duration-500 ease-apple ${selectedProgram === 'RAPID_PATCH' ? 'text-primary' : ''}`}
                >
                  <Eye className="mr-2 w-4 h-4" />
                  Explorer l'architecture
                </Button>
              </div>
              {selectedProgram === 'RAPID_PATCH' && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-white/30 hidden md:block"></div>
              )}
            </SpotlightCard>

            {/* CARD 2: SYSTEM REBOOT */}
            <SpotlightCard 
              className={`group flex flex-col p-6 rounded-t-3xl md:rounded-3xl md:rounded-b-none border transition-all duration-500 ease-apple relative transform md:-translate-y-4 ${selectedProgram === 'SYSTEM_REBOOT' ? 'bg-[#0a0a12] border-primary border-b-0 md:border-b shadow-[0_0_60px_-10px_rgba(255,107,74,0.3)]' : 'bg-[#0a0a12] border-white/5 hover:border-primary/40'}`}
            >
              {/* Recommended Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 rounded-full bg-primary text-[10px] font-bold text-primary-foreground uppercase tracking-wider shadow-radioactive">
                  Recommandé
                </span>
              </div>
              <div className="flex items-center gap-2 mb-3 mt-2">
                <span className="px-2 py-0.5 rounded bg-primary/15 text-[10px] font-mono uppercase tracking-wider text-primary">Réalignement</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-1">System Reboot</h3>
              <p className="text-xs text-white/40 mb-2 font-mono">21 Jours</p>
              <p className="text-3xl font-bold text-white mb-2 font-mono">99€</p>
              <p className="text-xs text-white/40 mb-4">Paiement unique</p>
              <p className="text-sm text-white/40 mb-6 leading-relaxed">Le protocole complet pour reprogrammer votre posture durablement.</p>
              <div className="space-y-2 mb-6 flex-grow">
                {PROGRAM_DETAILS.SYSTEM_REBOOT.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white/60"><Check className="w-3 h-3 text-primary" /> {f}</div>
                ))}
              </div>
              <div className="flex flex-col gap-2 mt-auto">
                <Link to="/checkout?plan=SYSTEM_REBOOT" className="w-full">
                  <Button className="shimmer-btn w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium glow-primary-sm transition-all duration-500 ease-apple">
                    Commencer ce programme
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSelectProgram('SYSTEM_REBOOT')}
                  className={`w-full text-white/40 hover:text-white hover:bg-white/5 text-xs transition-all duration-500 ease-apple ${selectedProgram === 'SYSTEM_REBOOT' ? 'text-primary' : ''}`}
                >
                  <Eye className="mr-2 w-4 h-4" />
                  Explorer l'architecture
                </Button>
              </div>
              {selectedProgram === 'SYSTEM_REBOOT' && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-primary hidden md:block"></div>
              )}
            </SpotlightCard>

            {/* CARD 3: ARCHITECT MODE */}
            <SpotlightCard 
              className={`group flex flex-col p-6 rounded-t-3xl md:rounded-3xl md:rounded-b-none border transition-all duration-500 ease-apple relative ${selectedProgram === 'ARCHITECT_MODE' ? 'bg-[#0a0a12] border-white/40 border-b-0 md:border-b shadow-[0_0_40px_-10px_rgba(148,163,184,0.2)]' : 'bg-[#0a0a12] border-white/5 hover:border-white/30'}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono uppercase tracking-wider text-white/70">Performance & Pro</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-1">Architect Mode</h3>
              <p className="text-xs text-white/40 mb-2 font-mono">30 Jours</p>
              <p className="text-3xl font-bold text-white mb-2 font-mono">149€</p>
              <p className="text-xs text-white/40 mb-4">Paiement unique</p>
              <p className="text-sm text-white/40 mb-6 leading-relaxed">Devenez Anti-Fragile. Pour ceux qui veulent optimiser leur focus.</p>
              <div className="space-y-2 mb-6 flex-grow">
                {PROGRAM_DETAILS.ARCHITECT_MODE.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white/60"><Check className="w-3 h-3 text-primary" /> {f}</div>
                ))}
              </div>
              <div className="flex flex-col gap-2 mt-auto">
                <Link to="/checkout?plan=ARCHITECT_MODE" className="w-full">
                  <Button className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all duration-500 ease-apple">
                    Commencer ce programme
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSelectProgram('ARCHITECT_MODE')}
                  className={`w-full text-white/40 hover:text-white hover:bg-white/5 text-xs transition-all duration-500 ease-apple ${selectedProgram === 'ARCHITECT_MODE' ? 'text-white/70' : ''}`}
                >
                  <Eye className="mr-2 w-4 h-4" />
                  Explorer l'architecture
                </Button>
              </div>
              {selectedProgram === 'ARCHITECT_MODE' && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-white/40 hidden md:block"></div>
              )}
            </SpotlightCard>
          </div>

          {/* DYNAMIC ROADMAP DISPLAY */}
          <div className={`bg-[#0a0a12] rounded-b-3xl md:rounded-3xl md:rounded-t-none border border-white/5 border-t-0 md:border-t p-8 md:p-12 relative overflow-hidden transition-all duration-500 ease-apple ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
            
            <div className={`absolute top-0 left-0 right-0 h-1 transition-colors duration-500 ease-apple ${
              selectedProgram === 'RAPID_PATCH' ? 'bg-white/30' :
              selectedProgram === 'SYSTEM_REBOOT' ? 'bg-primary' :
              'bg-white/40'
            }`}></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Map className={`w-5 h-5 ${selectedProgram === 'SYSTEM_REBOOT' ? 'text-primary' : 'text-white'}`} />
                    <span className="font-mono text-xs text-white/40 uppercase tracking-widest">Architecture du Programme</span>
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl text-white font-bold">{details.title}</h3>
                  <p className="text-sm text-white/40 mt-2">
                    {selectedProgram === 'RAPID_PATCH' && 'Focus : Soulagement Urgent & Décompression'}
                    {selectedProgram === 'SYSTEM_REBOOT' && 'Focus : Réalignement & Habitude'}
                    {selectedProgram === 'ARCHITECT_MODE' && 'Focus : Anti-Fragilité & Performance Cognitive'}
                  </p>
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-sm text-white/40">Durée totale</p>
                  <p className="text-2xl font-mono font-bold text-white">{details.duration}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {details.phases.map((phase, idx) => (
                  <div key={idx} className={`relative flex flex-col gap-3 p-4 rounded-xl border transition-all duration-500 ease-apple ${phase.active ? 'bg-white/[0.03] border-white/10' : 'bg-black/40 border-white/5 opacity-50 grayscale'}`}>
                    {!phase.active && (
                      <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/60 rounded-xl">
                        <div className="flex flex-col items-center gap-1">
                          <Lock className="w-5 h-5 text-white/40" />
                          <span className="text-[10px] text-white/40 font-mono">NON INCLUS</span>
                        </div>
                      </div>
                    )}
                    <span className={`text-[10px] font-mono tracking-widest uppercase ${phase.active ? 'text-primary' : 'text-white/30'}`}>{phase.name}</span>
                    <div className={`h-1 w-full rounded-full ${phase.active ? (selectedProgram === 'SYSTEM_REBOOT' ? 'bg-primary' : selectedProgram === 'ARCHITECT_MODE' ? 'bg-white/40' : 'bg-white') : 'bg-white/10'}`}></div>
                    <h4 className={`text-lg font-bold ${phase.active ? 'text-white' : 'text-white/40'}`}>{phase.label}</h4>
                    <p className="text-xs text-white/40 leading-relaxed">{phase.desc}</p>
                  </div>
                ))}
              </div>

              {selectedProgram === 'RAPID_PATCH' && (
                <div className="mb-8 p-4 rounded-xl border border-primary/15 bg-primary/5 flex items-center justify-between">
                  <p className="text-sm text-white/60">
                    <span className="text-primary font-medium">Débloquez tout le parcours</span> — Passez au System Reboot pour un réalignement complet.
                  </p>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSelectProgram('SYSTEM_REBOOT')}
                    className="text-primary hover:text-primary hover:bg-primary/10 text-xs transition-all duration-500 ease-apple"
                  >
                    Voir System Reboot →
                  </Button>
                </div>
              )}

              {selectedProgram === 'SYSTEM_REBOOT' && (
                <div className="mb-8 p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <p className="text-sm text-white/60">
                    <span className="text-white/80 font-medium">Ajoutez la phase Performance</span> — Passez à Architect Mode pour les protocoles Focus & Deep Work.
                  </p>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSelectProgram('ARCHITECT_MODE')}
                    className="text-white/70 hover:text-white hover:bg-white/5 text-xs transition-all duration-500 ease-apple"
                  >
                    Voir Architect Mode →
                  </Button>
                </div>
              )}

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
                <div className="flex flex-wrap gap-2">
                  {details.features.map((feat, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 font-mono flex items-center gap-2">
                      <Check className="w-3 h-3 text-primary" /> {feat}
                    </span>
                  ))}
                </div>
                <Link to={`/checkout?plan=${selectedProgram}`}>
                  <Button size="lg" className={`h-14 px-8 rounded-full font-bold text-lg transition-all duration-500 ease-apple ${
                    selectedProgram === 'SYSTEM_REBOOT' 
                      ? 'shimmer-btn bg-primary hover:bg-primary/90 text-primary-foreground glow-primary' 
                      : selectedProgram === 'ARCHITECT_MODE'
                      ? 'bg-white/10 hover:bg-white/15 text-white border border-white/20'
                      : 'bg-white text-[#030307] hover:bg-white/90'
                  }`}>
                    Commencer — <span className="font-mono">{details.price}</span>
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BENCHMARK SECTION with Spotlight */}
      <section className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-white/40 font-mono text-xs tracking-widest uppercase mb-4 block">Analyse Comparative</span>
            <h2 className="font-display text-3xl md:text-4xl text-white font-bold max-w-3xl mx-auto leading-tight">
              Pourquoi le modèle classique échoue pour les pros du digital
            </h2>
          </div>

          {/* Ultra-Clean Comparison Table with Spotlight */}
          <SpotlightCard className="rounded-2xl border border-white/5 overflow-hidden backdrop-blur-sm">
            {/* Header */}
            <div className="grid grid-cols-3">
              <div className="p-6 border-r border-white/5 bg-transparent"></div>
              <div className="p-6 border-r border-white/5 text-center bg-transparent">
                <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider">Médecine Classique</span>
                <p className="text-white/40 text-xs mt-1">Réactif</p>
              </div>
              <div className="p-6 text-center bg-white/[0.02] relative">
                {/* Top Spotlight Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-gradient-to-b from-emerald-500/15 to-transparent blur-2xl pointer-events-none"></div>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"></div>
                <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider relative z-10">NIVO System Patch</span>
                <p className="text-emerald-400/80 text-xs mt-1 font-medium relative z-10">Proactif</p>
              </div>
            </div>

            {/* Table Rows */}
            {[
              { label: "Approche", old: "Réparer la casse", new: "Maintenance quotidienne" },
              { label: "Lieu", old: "Cabinet (+30min trajet)", new: "Chez vous (0 trajet)" },
              { label: "Durée", old: "1h x 10 séances", new: "15 min/jour" },
              { label: "Délai", old: "Attente de 3 semaines", new: "Accès immédiat" },
              { label: "Coût", old: "300-800€ / cycle", new: "99€ une fois" },
              { label: "Résultat", old: "Dépendance au praticien", new: "Autonomie & Anti-fragilité durables" },
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-3 border-t border-white/5">
                <div className="p-5 border-r border-white/5">
                  <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider">{row.label}</span>
                </div>
                <div className="p-5 border-r border-white/5 flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    <X className="w-3 h-3 text-white/30" />
                  </div>
                  <span className="text-white/40 text-sm">{row.old}</span>
                </div>
                <div className="p-5 bg-white/[0.02] flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-white text-sm font-medium">{row.new}</span>
                </div>
              </div>
            ))}
          </SpotlightCard>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <span className="text-white/40 font-mono text-xs tracking-widest uppercase mb-4 block">Questions Fréquentes</span>
            <h2 className="font-display text-3xl md:text-4xl text-white font-bold">
              Transparence Totale
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-0" className="border border-white/5 rounded-2xl bg-[#0a0a12] px-6 data-[state=open]:border-primary/20 transition-all duration-500 ease-apple">
              <AccordionTrigger className="text-white hover:text-primary hover:no-underline py-5 text-left transition-all duration-500 ease-apple">
                Est-ce dangereux si j'ai une hernie discale ?
              </AccordionTrigger>
              <AccordionContent className="text-white/50 pb-5">
                <span className="text-primary font-medium">Non, au contraire.</span> Le protocole est basé sur la méthode McKenzie, utilisée mondialement par les kinésithérapeutes pour traiter les hernies. Les mouvements de décompression aident à centraliser le disque. Cependant, si vous êtes en phase aiguë (douleur intense depuis moins de 72h), consultez d'abord un professionnel.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-1" className="border border-white/5 rounded-2xl bg-[#0a0a12] px-6 data-[state=open]:border-primary/20 transition-all duration-500 ease-apple">
              <AccordionTrigger className="text-white hover:text-primary hover:no-underline py-5 text-left transition-all duration-500 ease-apple">
                Quelle différence avec les vidéos YouTube gratuites ?
              </AccordionTrigger>
              <AccordionContent className="text-white/50 pb-5">
                <span className="text-primary font-medium">Structure et progression.</span> YouTube vous donne des exercices isolés. NIVO vous donne un protocole séquencé sur 21 jours avec une logique de progression (décompression → mobilisation → renforcement → neuroplasticité). C'est la différence entre avoir des ingrédients et avoir une recette.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border border-white/5 rounded-2xl bg-[#0a0a12] px-6 data-[state=open]:border-primary/20 transition-all duration-500 ease-apple">
              <AccordionTrigger className="text-white hover:text-primary hover:no-underline py-5 text-left transition-all duration-500 ease-apple">
                Combien de temps par jour ?
              </AccordionTrigger>
              <AccordionContent className="text-white/50 pb-5">
                <span className="text-primary font-medium font-mono">15 minutes.</span> Conçu pour s'intégrer dans votre flux de travail : entre deux meetings, pendant une pause café, ou juste avant de commencer votre journée. La régularité compte plus que la durée.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border border-white/5 rounded-2xl bg-[#0a0a12] px-6 data-[state=open]:border-primary/20 transition-all duration-500 ease-apple">
              <AccordionTrigger className="text-white hover:text-primary hover:no-underline py-5 text-left transition-all duration-500 ease-apple">
                Y a-t-il une garantie ?
              </AccordionTrigger>
              <AccordionContent className="text-white/50 pb-5">
                <span className="text-primary font-medium">Oui, 30 jours satisfait ou remboursé.</span> Si vous suivez le protocole pendant 21 jours et ne voyez aucune amélioration, nous vous remboursons intégralement. Aucune question posée.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border border-white/5 rounded-2xl bg-[#0a0a12] px-6 data-[state=open]:border-primary/20 transition-all duration-500 ease-apple">
              <AccordionTrigger className="text-white hover:text-primary hover:no-underline py-5 text-left transition-all duration-500 ease-apple">
                Besoin de matériel spécifique ?
              </AccordionTrigger>
              <AccordionContent className="text-white/50 pb-5">
                <span className="text-primary font-medium">Non.</span> Tous les exercices se font au poids du corps. Vous pouvez les faire dans votre chambre, à côté de votre bureau, ou même en déplacement dans une chambre d'hôtel.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* 8. MANIFESTE SECTION - Text Reveal on Scroll */}
      <section className="py-24 px-6 relative z-10" ref={manifesteRef}>
        <div className="container mx-auto max-w-4xl">
          <div className="relative p-12 md:p-16 rounded-3xl bg-gradient-to-b from-primary/8 to-transparent border border-primary/15 overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,107,74,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,74,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-50"></div>
            
            {/* Glow Effect - Radioactive */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/15 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="relative z-10 text-center">
              <span className="font-mono text-[10px] text-primary uppercase tracking-widest mb-6 block">Le Manifeste</span>
              
              {/* Text Reveal Animation */}
              <h2 className="font-display text-3xl md:text-5xl text-white font-bold mb-6 leading-tight">
                <motion.span 
                  style={{ opacity: useTransform(manifesteScrollProgress, [0, 0.3], [0.2, 1]) }}
                >
                  Votre business scale.
                </motion.span>
                <br />
                <motion.span 
                  className="text-white/40"
                  style={{ opacity: useTransform(manifesteScrollProgress, [0.2, 0.5], [0.2, 1]) }}
                >
                  Ne laissez pas votre corps devenir le goulot d'étranglement.
                </motion.span>
              </h2>
              
              <motion.p 
                className="text-lg text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed"
                style={{ opacity: useTransform(manifesteScrollProgress, [0.3, 0.6], [0.2, 1]) }}
              >
                Vous investissez dans les meilleurs outils, formations et stratégies pour faire croître votre activité. 
                Mais votre actif le plus précieux, c'est votre capacité à rester assis, concentré et productif sur la durée.
                <br /><br />
                <span className="text-white font-medium">NIVO est l'assurance-vie de votre productivité.</span>
              </motion.p>
              
              <motion.div
                style={{ opacity: useTransform(manifesteScrollProgress, [0.5, 0.8], [0.2, 1]) }}
              >
                <Link to="/diagnostic">
                  <Button size="lg" className="shimmer-btn bg-primary hover:bg-primary/90 text-primary-foreground glow-primary h-16 px-12 text-lg rounded-full font-bold transition-all duration-500 ease-apple hover:scale-105">
                    Sécuriser mon Actif Principal
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
              </motion.div>
              
              <p className="text-xs text-white/30 mt-6 font-mono">
                30 jours satisfait ou remboursé • Paiement unique • Accès à vie
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/5 bg-[#030307] relative z-10">
        <div className="container mx-auto text-center">
          <p className="font-mono text-xs text-white/30">
            &copy; {new Date().getFullYear()} NIVO • System Patch for Builders
          </p>
        </div>
      </footer>
    </div>
  );
}
