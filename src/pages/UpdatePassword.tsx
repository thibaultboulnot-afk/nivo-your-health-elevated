import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Vérifie que l'utilisateur a accès via le lien de récupération
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsReady(true);
      } else {
        // Écoute le changement d'état d'auth (le token du lien)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'PASSWORD_RECOVERY' || session) {
            setIsReady(true);
          }
        });
        return () => subscription.unsubscribe();
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError("Le mot de passe est requis");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setError(updateError.message);
      toast.error("Erreur", { description: updateError.message });
    } else {
      toast.success("Mot de passe mis à jour", {
        description: "Vous allez être redirigé vers le tableau de bord.",
      });
      setTimeout(() => navigate("/dashboard"), 1500);
    }

    setIsLoading(false);
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="font-mono text-white/50"
        >
          Vérification du lien...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center relative overflow-hidden px-4">
      {/* Aurora Background */}
      <div className="aurora absolute inset-0 pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="grid-background absolute inset-0 pointer-events-none opacity-30" />

      <div className="w-full max-w-lg relative z-10">
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
                  <Lock className="w-5 h-5 text-primary" />
                </motion.div>
                <div>
                  <h1 className="font-mono text-sm font-semibold text-white">
                    NOUVEAU <span className="text-primary">//</span> MOT DE PASSE
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span className="font-mono text-xs text-emerald-500/80">Mise à jour sécurisée</span>
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* New Password Input */}
                  <div className="space-y-2">
                    <label className="font-mono text-xs text-white/50 flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      NOUVEAU_MOT_DE_PASSE &gt;
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-transparent border-0 border-b border-white/20 focus:border-primary px-0 py-3 font-mono text-white placeholder:text-white/20 outline-none transition-colors"
                    />
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-2">
                    <label className="font-mono text-xs text-white/50 flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      CONFIRMER &gt;
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                        MISE À JOUR...
                      </motion.span>
                    ) : (
                      "CONFIRMER ET ACCÉDER"
                    )}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center font-mono text-xs text-white/20 mt-8">
          &gt; NIVO_OS v2.0.4 | Réinitialisation Sécurisée
        </p>
      </div>
    </div>
  );
};

export default UpdatePassword;
