import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Fingerprint, Lock, ShieldCheck, Terminal, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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

type BootPhase = 'form' | 'booting' | 'success' | 'error';

const bootSequence = [
  "Vérification des identifiants...",
  "Décryptage du token d'accès...",
  "Validation du certificat utilisateur...",
  "Initialisation de la session sécurisée...",
  "Accès Autorisé ✓",
];

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phase, setPhase] = useState<BootPhase>('form');
  const [bootLine, setBootLine] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const runBootSequence = async (success: boolean) => {
    setPhase('booting');
    setBootLine(0);

    for (let i = 0; i < bootSequence.length - 1; i++) {
      await new Promise(resolve => setTimeout(resolve, 350));
      setBootLine(i + 1);
    }

    if (success) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setPhase('success');
      await new Promise(resolve => setTimeout(resolve, 800));
      navigate('/dashboard');
    } else {
      setPhase('error');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPhase('form');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validation basique
    if (!email || !password) {
      setError("Tous les champs sont requis");
      setIsLoading(false);
      return;
    }

    // Authentification Supabase avec captcha
    const { error: authError } = await supabase.auth.signInWithPassword({ 
      email, 
      password,
      options: { captchaToken: captchaToken || undefined }
    });
    
    if (authError) {
      setError(authError.message === 'Invalid login credentials' 
        ? 'Identifiants invalides' 
        : authError.message);
      toast.error('Échec de la connexion', {
        description: 'Vérifiez vos identifiants et réessayez.'
      });
      await runBootSequence(false);
      setIsLoading(false);
      return;
    }
    
    await runBootSequence(true);
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/dashboard' },
    });
    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center relative overflow-hidden px-4">
      {/* Aurora Background */}
      <div className="aurora absolute inset-0 pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="grid-background absolute inset-0 pointer-events-none opacity-30" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Back Navigation - Terminal Style */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-white/40 hover:text-primary mb-8 transition-colors font-mono text-sm group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>&lt;-- cd /accueil</span>
        </Link>

        {/* Terminal Window */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur-xl opacity-50" />
          
          {/* Terminal Container */}
          <div className="relative bg-[#0a0a12] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center"
                  animate={{ 
                    boxShadow: ['0 0 0 0 rgba(255, 107, 74, 0)', '0 0 20px 5px rgba(255, 107, 74, 0.3)', '0 0 0 0 rgba(255, 107, 74, 0)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Fingerprint className="w-5 h-5 text-primary" />
                </motion.div>
                <div>
                  <h1 className="font-mono text-sm font-semibold text-white">
                    ACCÈS MEMBRE <span className="text-primary">//</span> NIVO
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span className="font-mono text-xs text-emerald-500/80">Retrouvez votre progression et vos protocoles</span>
                  </div>
                </div>
              </div>
              
              {/* Window Controls */}
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                {/* FORM STATE */}
                {phase === 'form' && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                      {/* Google OAuth Button */}
                      <Button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-6 min-h-[56px] border border-gray-200"
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
                          <span className="bg-[#0a0a12] px-4 text-white/40 font-mono">OU</span>
                        </div>
                      </div>
                      {/* Email Input */}
                      <div className="space-y-2">
                        <label className="font-mono text-xs text-white/50 flex items-center gap-2">
                          <Terminal className="w-3 h-3" />
                          IDENTIFIANT &gt;
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="utilisateur@nivo.system"
                          className="w-full bg-transparent border-0 border-b border-white/20 focus:border-primary px-0 py-4 font-mono text-white placeholder:text-white/20 outline-none transition-colors"
                        />
                      </div>

                      {/* Password Input */}
                      <div className="space-y-2">
                        <label className="font-mono text-xs text-white/50 flex items-center gap-2">
                          <Lock className="w-3 h-3" />
                          MOT DE PASSE &gt;
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-transparent border-0 border-b border-white/20 focus:border-primary px-0 py-4 font-mono text-white placeholder:text-white/20 outline-none transition-colors"
                        />
                      </div>

                      {/* Error Message */}
                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-destructive font-mono text-sm p-3 bg-destructive/10 rounded-lg border border-destructive/20"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>ERREUR: {error}</span>
                        </motion.div>
                      )}

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

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isLoading || !captchaToken}
                        className="w-full bg-primary hover:bg-primary/90 text-black font-mono font-bold py-6 min-h-[56px] text-sm tracking-wider shimmer-btn"
                      >
                        {isLoading ? (
                          <motion.span
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            CONNEXION...
                          </motion.span>
                        ) : (
                          "SE CONNECTER"
                        )}
                      </Button>
                    </form>

                    {/* Links Section */}
                    <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                      {/* Forgot Password */}
                      <Link 
                        to="/forgot-password" 
                        className="block font-mono text-xs text-white/40 hover:text-primary transition-colors"
                      >
                        &gt; Mot de passe oublié ?
                      </Link>

                      {/* Checkout CTA */}
                      <Link 
                        to="/checkout" 
                        className="group flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-white/10 hover:border-primary/50 bg-white/[0.02] hover:bg-primary/5 transition-all"
                      >
                        <span className="font-mono text-xs text-white/60 group-hover:text-primary transition-colors">
                          [ CRÉER UN COMPTE ]
                        </span>
                      </Link>
                    </div>
                  </motion.div>
                )}

                {/* BOOTING STATE */}
                {phase === 'booting' && (
                  <motion.div
                    key="booting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-8 space-y-3"
                  >
                    <div className="font-mono text-sm text-white/30 mb-4">
                      &gt; auth.init()
                    </div>
                    {bootSequence.map((line, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ 
                          opacity: index <= bootLine ? 1 : 0.2,
                          x: index <= bootLine ? 0 : -10
                        }}
                        transition={{ duration: 0.3 }}
                        className={`font-mono text-sm flex items-center gap-2 ${
                          index < bootLine 
                            ? 'text-emerald-500' 
                            : index === bootLine 
                              ? 'text-primary' 
                              : 'text-white/20'
                        }`}
                      >
                        <span className="text-white/30">[{index + 1}/5]</span>
                        {line}
                        {index === bootLine && (
                          <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="ml-1"
                          >
                            _
                          </motion.span>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* SUCCESS STATE */}
                {phase === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 15 }}
                      className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4"
                    >
                      <ShieldCheck className="w-8 h-8 text-emerald-500" />
                    </motion.div>
                    <p className="font-mono text-emerald-500 text-lg">ACCÈS AUTORISÉ</p>
                    <p className="font-mono text-white/40 text-sm mt-2">Redirection vers votre espace...</p>
                  </motion.div>
                )}

                {/* ERROR STATE */}
                {phase === 'error' && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 15 }}
                      className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4"
                    >
                      <AlertCircle className="w-8 h-8 text-destructive" />
                    </motion.div>
                    <p className="font-mono text-destructive text-lg">ACCÈS REFUSÉ</p>
                    <p className="font-mono text-white/40 text-sm mt-2">Identifiants invalides</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center font-mono text-xs text-white/20 mt-8">
          &gt; NIVO_OS v2.0.4 | Protocole d'Authentification Sécurisé
        </p>
      </div>
    </div>
  );
};

export default Login;
