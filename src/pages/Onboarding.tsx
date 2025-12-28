import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2, Terminal, User, Target, ArrowRight, Lock, CheckCircle2, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Turnstile } from "@marsidev/react-turnstile";

// Google Icon SVG
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const OBJECTIVES = [
  { value: 'acute_pain', label: 'Soulager une douleur immédiate' },
  { value: 'daily_maintenance', label: 'Instaurer une routine quotidienne' },
  { value: 'max_productivity', label: 'Booster ma productivité physique' },
  { value: 'total_disconnect', label: 'Récupération & Détente' },
];

type Step = 'signup' | 'profile' | 'welcome';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  
  // Determine initial step based on auth state
  const [currentStep, setCurrentStep] = useState<Step>('signup');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Step 1: Sign Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Step 2: Profile
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [objective, setObjective] = useState('');
  
  // Step 3: Welcome Modal
  const [showWelcome, setShowWelcome] = useState(false);
  
  // Captcha token
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // Check auth state and set appropriate step
  useEffect(() => {
    if (!authLoading && user) {
      setCurrentStep('profile');
    }
  }, [user, authLoading]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error('Email et mot de passe requis');
      return;
    }

    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          captchaToken: captchaToken || undefined,
        },
      });

      if (error) throw error;

      if (data.user) {
        toast.success('Compte créé avec succès !');
        setCurrentStep('profile');
      }
    } catch (error: any) {
      console.error('SignUp error:', error);
      if (error.message?.includes('already registered')) {
        toast.error('Cet email est déjà utilisé. Essayez de vous connecter.');
      } else {
        toast.error(`Erreur: ${error.message || 'Inscription impossible'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/dashboard' },
    });
    if (error) {
      toast.error(error.message);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error('Session expirée. Veuillez vous reconnecter.');
      setCurrentStep('signup');
      return;
    }

    if (!firstName.trim()) {
      toast.error('Le prénom est requis');
      return;
    }

    if (!objective) {
      toast.error('Veuillez sélectionner un objectif');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: firstName.trim(),
          last_name: lastName.trim() || null,
          objective: objective,
        }, { onConflict: 'id' });

      if (error) throw error;

      // Show welcome modal
      setShowWelcome(true);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(`Erreur: ${error.message || 'Sauvegarde impossible'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToDashboard = () => {
    setShowWelcome(false);
    navigate('/dashboard');
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const stepIndicators = [
    { key: 'signup', label: 'COMPTE', icon: Lock, completed: currentStep !== 'signup' },
    { key: 'profile', label: 'PROFIL', icon: User, completed: showWelcome },
  ];

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden text-foreground flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,107,74,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,74,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-4"
      >
        <div className="rounded-2xl bg-black/80 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
          {/* Header with Step Indicators */}
          <div className="px-8 pt-8 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="w-5 h-5 text-primary" />
              <span className="font-mono text-xs text-primary uppercase tracking-widest">
                Finalisation de votre profil
              </span>
            </div>
            
            {/* Step Progress */}
            <div className="flex items-center gap-2 mb-4">
              {stepIndicators.map((step, index) => (
                <div key={step.key} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                    step.completed 
                      ? 'bg-primary/20 border-primary/40 text-primary' 
                      : currentStep === step.key 
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'bg-white/5 border-white/10 text-foreground/40'
                  }`}>
                    {step.completed ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <step.icon className="w-3 h-3" />
                    )}
                    <span className="font-mono text-[10px] uppercase tracking-wider">
                      {step.label}
                    </span>
                  </div>
                  {index < stepIndicators.length - 1 && (
                    <div className={`w-4 h-px ${step.completed ? 'bg-primary/40' : 'bg-white/10'}`} />
                  )}
                </div>
              ))}
            </div>

            <h1 className="font-heading font-bold text-2xl text-foreground">
              {currentStep === 'signup' ? 'Sécurisez votre espace membre' : 'Personnalisation du programme'}
            </h1>
            <p className="font-mono text-xs text-foreground/40 mt-2">
              {currentStep === 'signup' 
                ? '> Créez vos identifiants de connexion' 
                : '> Adaptez votre programme à vos besoins'}
            </p>
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {currentStep === 'signup' ? (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSignUp}
                className="p-8 space-y-6"
              >
                {/* Google OAuth Button */}
                <Button
                  type="button"
                  onClick={handleGoogleSignUp}
                  className="w-full h-14 bg-white hover:bg-gray-100 text-gray-900 font-medium border border-gray-200"
                >
                  <GoogleIcon />
                  <span className="ml-3">Continuer avec Google</span>
                </Button>

                {/* Separator */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-black/80 px-4 text-foreground/40 font-mono">OU</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-4 h-4 text-foreground/40" />
                  <span className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest">
                    1. Vos identifiants
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="font-mono text-xs text-foreground/60 block mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus:border-primary focus-visible:ring-0 font-mono placeholder:text-foreground/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-mono text-xs text-foreground/60 block mb-2">
                      Mot de passe *
                    </label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus:border-primary focus-visible:ring-0 font-mono placeholder:text-foreground/20"
                      required
                      minLength={6}
                    />
                    <p className="font-mono text-[10px] text-foreground/30 mt-1">
                      Minimum 6 caractères
                    </p>
                  </div>
                </div>

                {/* Turnstile Captcha */}
                <div className="flex justify-center">
                  <Turnstile
                    siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || ""}
                    onSuccess={(token) => setCaptchaToken(token)}
                    onError={() => setCaptchaToken(null)}
                    onExpire={() => setCaptchaToken(null)}
                    options={{ theme: "dark" }}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !captchaToken}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-mono font-bold text-sm shadow-[0_0_30px_rgba(255,107,74,0.4)] transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      CRÉATION EN COURS...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-5 h-5 mr-2" />
                      ACTIVER MON ACCÈS
                    </>
                  )}
                </Button>

                <p className="text-center font-mono text-[10px] text-foreground/30">
                  Déjà un compte ?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-primary hover:underline"
                  >
                    Se connecter
                  </button>
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleProfileSubmit}
                className="p-8 space-y-8"
              >
                {/* Identity Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-4 h-4 text-foreground/40" />
                    <span className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest">
                      2. Vos informations
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="font-mono text-xs text-foreground/60 block mb-2">
                        Prénom *
                      </label>
                      <Input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Entrez votre prénom"
                        className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus:border-primary focus-visible:ring-0 font-mono placeholder:text-foreground/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-mono text-xs text-foreground/60 block mb-2">
                        Nom
                      </label>
                      <Input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Entrez votre nom"
                        className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus:border-primary focus-visible:ring-0 font-mono placeholder:text-foreground/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Objective Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-4 h-4 text-foreground/40" />
                    <span className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest">
                      Quel est votre objectif principal ?
                    </span>
                  </div>
                  
                  <Select value={objective} onValueChange={setObjective}>
                    <SelectTrigger className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus:ring-0 focus:ring-offset-0 font-mono h-12 min-h-[48px]">
                      <SelectValue placeholder="Sélectionnez votre objectif" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a15] border-white/10">
                      {OBJECTIVES.map((obj) => (
                        <SelectItem 
                          key={obj.value} 
                          value={obj.value}
                          className="font-mono text-sm focus:bg-primary/20 focus:text-foreground min-h-[44px] py-3"
                        >
                          {obj.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-mono font-bold text-sm shadow-[0_0_30px_rgba(255,107,74,0.4)] transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      FINALISATION...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-5 h-5 mr-2" />
                      ACCÉDER À MA MÉTHODE
                    </>
                  )}
                </Button>

                <p className="text-center font-mono text-[10px] text-foreground/30">
                  &gt; config.save() // welcome.init()
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Welcome Modal */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="bg-[#0a0a15] border-white/10 text-foreground max-w-md p-0 overflow-hidden" aria-describedby="welcome-description">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent pointer-events-none" />
            
            <div className="p-8 text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="w-20 h-20 mx-auto rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center"
              >
                <Rocket className="w-10 h-10 text-primary" />
              </motion.div>

              <div className="space-y-2">
                <h2 className="font-heading font-bold text-2xl text-foreground">
                  BIENVENUE CHEZ NIVO.
                </h2>
                <p id="welcome-description" className="font-mono text-sm text-foreground/60 leading-relaxed">
                  Félicitations pour votre engagement. Votre programme personnalisé est généré et prêt à l'emploi. Vous pouvez lancer votre première session dès maintenant.
                </p>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="font-mono text-xs text-primary uppercase tracking-wider">
                  Votre programme est prêt
                </p>
              </div>

              <Button
                onClick={handleGoToDashboard}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-mono font-bold text-sm shadow-[0_0_30px_rgba(255,107,74,0.4)] transition-all hover:scale-[1.02]"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                ACCÉDER À MON ESPACE
              </Button>

              <p className="font-mono text-[10px] text-foreground/30">
                &gt; dashboard.init() // ready for launch
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
