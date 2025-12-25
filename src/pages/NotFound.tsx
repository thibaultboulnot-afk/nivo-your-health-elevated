import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Terminal, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();
  const [glitchText, setGlitchText] = useState("404");

  useEffect(() => {
    console.error("Erreur 404 : Route inexistante :", location.pathname);
  }, [location.pathname]);

  // Glitch effect
  useEffect(() => {
    const glitchChars = "!@#$%^&*()_+-=[]{}|;:',.<>?/\\~`";
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const glitched = "404".split("").map((char, i) => 
          Math.random() > 0.5 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
        ).join("");
        setGlitchText(glitched);
        setTimeout(() => setGlitchText("404"), 100);
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Effects */}
      <div className="aurora absolute inset-0 pointer-events-none opacity-20" />
      <div className="grid-background absolute inset-0 pointer-events-none opacity-10" />
      
      {/* Scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,107,74,0.1) 2px,
            rgba(255,107,74,0.1) 4px
          )`,
        }}
      />

      <motion.div 
        className="text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Terminal Icon */}
        <motion.div 
          className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6"
          animate={{ 
            boxShadow: [
              "0 0 20px rgba(255,107,74,0.2)",
              "0 0 40px rgba(255,107,74,0.4)",
              "0 0 20px rgba(255,107,74,0.2)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Terminal className="h-8 w-8 text-primary" />
        </motion.div>

        {/* Error Code with Glitch Effect */}
        <div className="relative mb-4">
          <h1 className="font-mono text-7xl md:text-9xl font-bold text-foreground tracking-tighter">
            <span className="text-primary">{glitchText}</span>
          </h1>
          {/* Glitch layers */}
          <h1 
            className="absolute inset-0 font-mono text-7xl md:text-9xl font-bold text-cyan-500/30 tracking-tighter"
            style={{ transform: "translate(-2px, 1px)", clipPath: "inset(10% 0 80% 0)" }}
            aria-hidden
          >
            <span>{glitchText}</span>
          </h1>
          <h1 
            className="absolute inset-0 font-mono text-7xl md:text-9xl font-bold text-red-500/30 tracking-tighter"
            style={{ transform: "translate(2px, -1px)", clipPath: "inset(70% 0 10% 0)" }}
            aria-hidden
          >
            <span>{glitchText}</span>
          </h1>
        </div>

        {/* Message */}
        <div className="bg-black/60 border border-primary/20 rounded-lg p-4 mb-6 max-w-md mx-auto">
          <p className="font-mono text-sm text-primary mb-2">
            &gt; SYSTEM ERROR: 404
          </p>
          <p className="font-mono text-xs text-foreground/50">
            Vous êtes sorti de la zone de couverture.
            <br />
            Retournez au centre de contrôle.
          </p>
        </div>

        {/* Terminal Path */}
        <p className="font-mono text-[10px] text-foreground/30 mb-6">
          [ERROR] Route introuvable: <span className="text-primary/60">{location.pathname}</span>
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono font-semibold shadow-[0_0_20px_rgba(255,107,74,0.4)] min-h-[48px]">
              <Terminal className="h-4 w-4 mr-2" />
              Retour au Dashboard
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="border-white/20 text-foreground/70 hover:text-foreground hover:bg-white/10 font-mono min-h-[48px]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Page précédente
          </Button>
        </div>

        {/* System Info */}
        <motion.div 
          className="mt-12 font-mono text-[10px] text-foreground/20"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          NIVO_OS v2.1.0 :: SIGNAL_LOST
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
