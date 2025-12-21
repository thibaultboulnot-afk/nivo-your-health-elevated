import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, Lock, Shield, ArrowLeft, Terminal, Download, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ProgramTier = 'RAPID_PATCH' | 'SYSTEM_REBOOT' | 'ARCHITECT_MODE';

// Données des programmes pour la page checkout
const CHECKOUT_PROGRAMS: Record<ProgramTier, {
  name: string;
  price: number;
  duration: string;
  tag: string;
  promise: string;
  features: string[];
}> = {
  RAPID_PATCH: {
    name: 'NIVO RAPID PATCH',
    price: 49,
    duration: '14 Jours',
    tag: 'URGENCE & DOULEUR',
    promise: 'Éteindre l\'inflammation et stopper la douleur en 2 semaines.',
    features: [
      'module_décompression_lombaire',
      'protocole_tech_neck',
      'guide_audio_basique',
      'sessions_vidéo_hd[14]',
      'accès_à_vie: true'
    ]
  },
  SYSTEM_REBOOT: {
    name: 'NIVO SYSTEM REBOOT',
    price: 99,
    duration: '21 Jours',
    tag: 'RECOMMANDÉ • STANDARD',
    promise: 'La correction complète. Réalignez votre posture par défaut.',
    features: [
      'inclut: RAPID_PATCH.*',
      'module_reprogrammation_neuro',
      'intégration_neuroplasticité',
      'accès_justification_scientifique',
      'sessions_vidéo_hd[21]',
      'mises_à_jour: automatiques',
      'accès_à_vie: true'
    ]
  },
  ARCHITECT_MODE: {
    name: 'NIVO ARCHITECT MODE',
    price: 149,
    duration: '30 Jours',
    tag: 'PERFORMANCE & PRO',
    promise: 'Devenez Anti-Fragile. Pour ceux qui veulent optimiser leur focus.',
    features: [
      'inclut: SYSTEM_REBOOT.*',
      'protocole_vision_vestibulaire',
      'routine_deep_work',
      'support_prioritaire: true',
      'sessions_vidéo_hd[30]',
      'bonus_micro_exercices',
      'accès_à_vie: true'
    ]
  }
};

type PaymentState = 'IDLE' | 'PROCESSING' | 'SUCCESS';

const processingSteps = [
  'Authentification...',
  'Sécurisation du canal...',
  'Validation des données...',
  'Transfert en cours...',
  'Succès !',
];

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const planParam = searchParams.get('plan') as ProgramTier | null;
  
  // Fallback to SYSTEM_REBOOT if no plan or invalid plan
  const selectedPlan: ProgramTier = planParam && CHECKOUT_PROGRAMS[planParam] 
    ? planParam 
    : 'SYSTEM_REBOOT';
  
  const program = CHECKOUT_PROGRAMS[selectedPlan];

  const [paymentState, setPaymentState] = useState<PaymentState>('IDLE');
  const [processingStep, setProcessingStep] = useState(0);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (paymentState === 'PROCESSING') {
      const interval = setInterval(() => {
        setProcessingStep((prev) => {
          if (prev >= processingSteps.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setPaymentState('SUCCESS');
              // Redirect to Lemon Squeezy after success animation
              setTimeout(() => {
                window.open('https://lemonsqueezy.com', '_blank');
              }, 1500);
            }, 500);
            return prev;
          }
          return prev + 1;
        });
      }, 600);

      return () => clearInterval(interval);
    }
  }, [paymentState]);

  const handlePayment = () => {
    setProcessingStep(0);
    setPaymentState('PROCESSING');
  };

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden text-foreground">
      {/* Background Effects */}
      <div className="aurora absolute inset-0 pointer-events-none opacity-30" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,107,74,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,74,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_-3px_hsl(var(--primary))]">
              <span className="font-body font-bold text-lg text-background">N</span>
            </div>
            <span className="font-body text-xl font-bold tracking-tight">NIVO</span>
          </Link>
          
          <Link to="/diagnostic" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-sm hidden sm:block">Retour</span>
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 min-h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          {paymentState === 'IDLE' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-5xl"
            >
              {/* Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
                  <Terminal className="w-4 h-4 text-primary" />
                  <span className="font-mono text-sm text-primary">PASSERELLE DE PAIEMENT SÉCURISÉE</span>
                </div>

                <h1 className="font-heading font-medium text-3xl md:text-4xl tracking-tight mb-2">
                  Initialisation du protocole
                </h1>
                <p className="text-muted-foreground font-mono text-sm">
                  {'>'} autorisation_requise: true
                </p>
              </div>

              {/* Terminal Window */}
              <div className="rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
                {/* Terminal Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 font-mono text-xs text-muted-foreground">nivo_passerelle_paiement.sh</span>
                </div>

                <div className="grid md:grid-cols-2">
                  {/* Left Column - Package Authorization */}
                  <div className="p-8 border-r border-white/5">
                    <div className="flex items-center gap-2 mb-6">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="font-mono text-xs text-primary uppercase tracking-widest">
                        Autorisation du Package
                      </span>
                    </div>

                    {/* Package Card - Holographic */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-white/5 to-transparent border border-primary/20 relative overflow-hidden mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                      
                      <div className="relative z-10">
                        {/* Blinking Package Name */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className="font-mono text-primary text-sm animate-pulse">▶</span>
                          <span className="font-mono text-lg text-foreground">
                            {program.name}
                          </span>
                        </div>

                        <span className="inline-block px-2 py-1 rounded text-[10px] font-mono bg-primary/20 border border-primary/30 text-primary mb-4">
                          {program.tag}
                        </span>

                        {/* Features as code */}
                        <div className="font-mono text-xs space-y-1.5 mb-6">
                          {program.features.map((feature, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-center gap-2 text-slate-400"
                            >
                              <Check className="w-3 h-3 text-green-500" />
                              <span>{feature}... <span className="text-green-500">[CHARGÉ]</span></span>
                            </motion.div>
                          ))}
                        </div>

                        {/* Price - Critical Data */}
                        <div className="pt-4 border-t border-white/10">
                          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                            TOTAL_TRANSFERT
                          </span>
                          <span className="font-heading font-medium text-4xl tracking-tight text-primary">
                            {program.price}€
                          </span>
                          <span className="font-mono text-xs text-muted-foreground ml-2">
                            // paiement unique
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                      <Lock className="w-4 h-4 text-green-500" />
                      <div className="font-mono text-xs">
                        <span className="text-green-500">SSL_CHIFFRÉ</span>
                        <span className="text-muted-foreground"> • 256-bit</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Transaction Protocol */}
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-6">
                      <Download className="w-4 h-4 text-primary" />
                      <span className="font-mono text-xs text-primary uppercase tracking-widest">
                        Protocole de Transaction Sécurisé
                      </span>
                    </div>

                    <p className="font-mono text-xs text-muted-foreground mb-6">
                      {'>'} initialisation du protocole de transfert...
                    </p>

                    {/* Console-style Inputs */}
                    <div className="space-y-5">
                      {/* Email */}
                      <div>
                        <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">
                          EMAIL_USR {'>'}
                        </label>
                        <input 
                          type="email" 
                          placeholder="votre@email.com"
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full h-12 px-4 bg-transparent border-b-2 font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all ${
                            focusedField === 'email' 
                              ? 'border-primary shadow-[0_2px_10px_-3px_hsl(var(--primary))]' 
                              : 'border-white/20'
                          }`}
                        />
                      </div>
                      
                      {/* Name */}
                      <div>
                        <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">
                          TITULAIRE_CARTE ::
                        </label>
                        <input 
                          type="text" 
                          placeholder="NOM COMPLET"
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full h-12 px-4 bg-transparent border-b-2 font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all uppercase ${
                            focusedField === 'name' 
                              ? 'border-primary shadow-[0_2px_10px_-3px_hsl(var(--primary))]' 
                              : 'border-white/20'
                          }`}
                        />
                      </div>

                      {/* Card Number */}
                      <div>
                        <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">
                          DONNÉES_CARTE ::
                        </label>
                        <input 
                          type="text" 
                          placeholder="4242 4242 4242 4242"
                          onFocus={() => setFocusedField('card')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full h-12 px-4 bg-transparent border-b-2 font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all tracking-widest ${
                            focusedField === 'card' 
                              ? 'border-primary shadow-[0_2px_10px_-3px_hsl(var(--primary))]' 
                              : 'border-white/20'
                          }`}
                        />
                      </div>

                      {/* Expiry & CVC */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">
                            DATE_EXP ::
                          </label>
                          <input 
                            type="text" 
                            placeholder="MM/AA"
                            onFocus={() => setFocusedField('exp')}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full h-12 px-4 bg-transparent border-b-2 font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all ${
                              focusedField === 'exp' 
                                ? 'border-primary shadow-[0_2px_10px_-3px_hsl(var(--primary))]' 
                                : 'border-white/20'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">
                            CODE_SEC ::
                          </label>
                          <input 
                            type="text" 
                            placeholder="•••"
                            onFocus={() => setFocusedField('cvc')}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full h-12 px-4 bg-transparent border-b-2 font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all ${
                              focusedField === 'cvc' 
                                ? 'border-primary shadow-[0_2px_10px_-3px_hsl(var(--primary))]' 
                                : 'border-white/20'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Separator */}
                    <div className="border-t border-white/10 my-6" />

                    {/* Total */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-sm text-muted-foreground">TOTAL_TRANSACTION</span>
                      <span className="font-heading font-medium text-2xl tracking-tight text-foreground">{program.price}€</span>
                    </div>

                    {/* CTA Button */}
                    <Button
                      onClick={handlePayment}
                      className="w-full h-14 bg-primary hover:bg-primary/90 text-background font-mono font-medium text-sm shadow-radioactive transition-all hover:scale-[1.02] animate-pulse"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      INITIALISER LE TÉLÉCHARGEMENT
                    </Button>

                    <p className="text-center font-mono text-[10px] text-muted-foreground mt-4">
                      {'>'} transfert_sécurisé: confirmé
                    </p>
                  </div>
                </div>
              </div>

              {/* Already have access */}
              <div className="text-center mt-8">
                <Link to="/login">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-mono text-sm">
                    {'>'} J'ai déjà une licence → Connexion Système
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Processing State */}
          {paymentState === 'PROCESSING' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center max-w-md w-full"
            >
              <div className="mb-8">
                <Loader2 className="w-16 h-16 text-primary mx-auto mb-6 animate-spin" />
                <h2 className="font-heading font-medium text-2xl tracking-tight mb-2">
                  Transaction en cours
                </h2>
                <p className="font-mono text-sm text-muted-foreground">
                  Ne fermez pas cette fenêtre
                </p>
              </div>

              <div className="p-6 rounded-xl bg-black/60 border border-white/10 font-mono text-sm text-left">
                {processingSteps.slice(0, processingStep + 1).map((step, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`mb-2 ${index === processingStep ? 'text-primary animate-pulse' : 'text-green-500'}`}
                  >
                    {index < processingStep ? '✓' : '>'} {step}
                  </motion.p>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-6 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-primary/60"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((processingStep + 1) / processingSteps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}

          {/* Success State */}
          {paymentState === 'SUCCESS' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-md w-full"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 mx-auto mb-6 flex items-center justify-center"
              >
                <Check className="w-12 h-12 text-green-500" />
              </motion.div>

              <h2 className="font-heading font-medium text-3xl tracking-tight mb-2 text-green-500">
                INSTALLATION RÉUSSIE
              </h2>
              <p className="font-mono text-sm text-muted-foreground mb-6">
                {'>'} package_téléchargé: true<br />
                {'>'} redirection_vers_portail_accès...
              </p>

              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                <p className="font-mono text-xs text-green-400">
                  Vous allez être redirigé vers votre espace d'accès...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
