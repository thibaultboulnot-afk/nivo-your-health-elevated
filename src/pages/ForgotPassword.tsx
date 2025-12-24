import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Terminal, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Veuillez entrer votre email");
      return;
    }

    setIsLoading(true);

    const redirectUrl = `${window.location.origin}/update-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      toast.error("Erreur", { description: error.message });
    } else {
      setEmailSent(true);
      toast.success("Email envoyé", {
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe.",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center relative overflow-hidden px-4">
      {/* Aurora Background */}
      <div className="aurora absolute inset-0 pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="grid-background absolute inset-0 pointer-events-none opacity-30" />

      <div className="w-full max-w-lg relative z-10">
        {/* Back Navigation */}
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-white/40 hover:text-primary mb-8 transition-colors font-mono text-sm group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>&lt;-- cd /login</span>
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
                  <Mail className="w-5 h-5 text-primary" />
                </motion.div>
                <div>
                  <h1 className="font-mono text-sm font-semibold text-white">
                    RÉCUPÉRATION <span className="text-primary">//</span> ACCÈS
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span className="font-mono text-xs text-emerald-500/80">Protocole sécurisé</span>
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
              {emailSent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4"
                  >
                    <Mail className="w-8 h-8 text-emerald-500" />
                  </motion.div>
                  <p className="font-mono text-emerald-500 text-lg">EMAIL ENVOYÉ</p>
                  <p className="font-mono text-white/40 text-sm mt-2">
                    Vérifiez votre boîte mail pour continuer.
                  </p>
                  <Link 
                    to="/login"
                    className="inline-block mt-6 font-mono text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    &gt; Revenir à la connexion
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                    {/* Email Input */}
                    <div className="space-y-2">
                      <label className="font-mono text-xs text-white/50 flex items-center gap-2">
                        <Terminal className="w-3 h-3" />
                        VOTRE EMAIL &gt;
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="utilisateur@nivo.system"
                        className="w-full bg-transparent border-0 border-b border-white/20 focus:border-primary px-0 py-4 font-mono text-white placeholder:text-white/20 outline-none transition-colors"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary hover:bg-primary/90 text-black font-mono font-bold py-6 min-h-[56px] text-sm tracking-wider shimmer-btn"
                    >
                      {isLoading ? (
                        <motion.span
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          ENVOI EN COURS...
                        </motion.span>
                      ) : (
                        <>
                          <span className="hidden sm:inline">RECEVOIR LE LIEN</span>
                          <span className="sm:hidden">ENVOYER</span>
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Links Section */}
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <Link 
                      to="/login" 
                      className="block font-mono text-xs text-white/40 hover:text-primary transition-colors"
                    >
                      &gt; Revenir à la connexion
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center font-mono text-xs text-white/20 mt-8">
          &gt; NIVO_OS v2.0.4 | Récupération d'Accès
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
