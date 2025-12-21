import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Login = () => {
  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center"
      >
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
          <span className="text-xs font-mono text-primary">AUTH_MODULE :: COMING_SOON</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
          Authentification
        </h1>
        
        <p className="text-white/50 font-mono text-sm mb-8 max-w-md mx-auto">
          Le module d'authentification sera bientôt disponible.<br />
          Retournez à l'accueil pour continuer.
        </p>

        <Link to="/">
          <Button variant="hero" size="lg">
            Retour à l'accueil
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default Login;
