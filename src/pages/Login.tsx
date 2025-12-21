import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Fingerprint, Lock, ShieldCheck, Terminal, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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

    // TODO: Intégrer Supabase auth ici
    // const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    // Simulation de l'authentification
    await runBootSequence(true);
    
    setIsLoading(false);
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
                    ACCÈS_SYSTÈME <span className="text-primary">//</span> NIVO_OS
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span className="font-mono text-xs text-emerald-500/80">Connexion sécurisée chiffrée</span>
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Email Input */}
                      <div className="space-y-2">
                        <label className="font-mono text-xs text-white/50 flex items-center gap-2">
                          <Terminal className="w-3 h-3" />
                          IDENTIFIANT_USR &gt;
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="utilisateur@nivo.system"
                          className="w-full bg-transparent border-0 border-b border-white/20 focus:border-primary px-0 py-3 font-mono text-white placeholder:text-white/20 outline-none transition-colors"
                        />
                      </div>

                      {/* Password Input */}
                      <div className="space-y-2">
                        <label className="font-mono text-xs text-white/50 flex items-center gap-2">
                          <Lock className="w-3 h-3" />
                          CLÉ_SÉCURITÉ &gt;
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-transparent border-0 border-b border-white/20 focus:border-primary px-0 py-3 font-mono text-white placeholder:text-white/20 outline-none transition-colors"
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

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary/90 text-black font-mono font-bold py-6 text-sm tracking-wider shimmer-btn"
                      >
                        {isLoading ? (
                          <motion.span
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            INITIALISATION...
                          </motion.span>
                        ) : (
                          "INITIALISER LA SESSION"
                        )}
                      </Button>
                    </form>

                    {/* Links Section */}
                    <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                      {/* Forgot Password */}
                      <Link 
                        to="#" 
                        className="block font-mono text-xs text-white/40 hover:text-primary transition-colors"
                      >
                        &gt; réinitialiser_identifiants --force
                      </Link>

                      {/* Checkout CTA */}
                      <Link 
                        to="/checkout" 
                        className="group flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-white/10 hover:border-primary/50 bg-white/[0.02] hover:bg-primary/5 transition-all"
                      >
                        <span className="font-mono text-xs text-white/60 group-hover:text-primary transition-colors">
                          [ DÉPLOYER UNE NOUVELLE LICENCE ]
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
                    <p className="font-mono text-white/40 text-sm mt-2">Redirection vers le cockpit...</p>
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
