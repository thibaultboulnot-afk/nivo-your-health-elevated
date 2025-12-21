import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("Erreur 404 : Route inexistante :", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Effects */}
      <div className="aurora absolute inset-0 pointer-events-none opacity-30" />
      <div className="grid-background absolute inset-0 pointer-events-none opacity-10" />

      <div className="text-center relative z-10">
        {/* Error Icon */}
        <div className="w-20 h-20 rounded-2xl bg-[#ff6b4a]/20 border border-[#ff6b4a]/30 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-[#ff6b4a]" />
        </div>

        {/* Error Code */}
        <h1 className="font-mono text-8xl font-bold text-white mb-4">
          4<span className="text-[#ff6b4a]">0</span>4
        </h1>

        {/* Message */}
        <p className="font-mono text-sm text-white/50 mb-2">
          &gt; ERREUR :: Page non trouvée
        </p>
        <p className="text-white/30 font-mono text-xs mb-8">
          La route "{location.pathname}" n'existe pas dans le système.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button className="bg-[#ff6b4a] hover:bg-[#ff8a6a] text-black font-mono font-semibold shadow-[0_0_20px_rgba(255,107,74,0.4)]">
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 font-mono"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Page précédente
          </Button>
        </div>

        {/* System Info */}
        <div className="mt-12 font-mono text-[10px] text-white/20">
          NIVO_OS v2.0.4 :: ERROR_HANDLER
        </div>
      </div>
    </div>
  );
};

export default NotFound;
