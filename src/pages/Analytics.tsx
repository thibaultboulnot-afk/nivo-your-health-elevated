import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAccess } from '@/hooks/useAccess';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { GlassCard, GlassStatCard } from '@/components/ui/GlassCard';
import { NeonChart } from '@/components/NeonChart';
import { UpgradeModal } from '@/components/UpgradeModal';
import { ArrowLeft, Lock, TrendingUp, Activity, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ScoreData {
  date: string;
  score: number;
  displayDate: string;
}

export default function Analytics() {
  const { user } = useAuth();
  const { isPro, isLoading: accessLoading } = useAccess();
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [worstScore, setWorstScore] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchScores = async () => {
      setIsLoading(true);
      
      // Fetch ALL calibration history (not just 30 days)
      const { data, error } = await supabase
        .from('nivo_scores')
        .select('score_date, total_score')
        .eq('user_id', user.id)
        .order('score_date', { ascending: true });

      if (!error && data) {
        const formattedData = data.map(item => ({
          date: item.score_date,
          score: item.total_score,
          displayDate: format(new Date(item.score_date), 'dd MMM', { locale: fr }),
        }));
        
        setScores(formattedData);

        // Calculate stats
        if (formattedData.length > 0) {
          const allScores = formattedData.map(d => d.score);
          const avg = Math.round(allScores.reduce((acc, curr) => acc + curr, 0) / allScores.length);
          setAverageScore(avg);
          setBestScore(Math.max(...allScores));
          setWorstScore(Math.min(...allScores));

          // Calculate trend (compare last 7 days vs previous 7 days)
          if (formattedData.length >= 7) {
            const recent = formattedData.slice(-7);
            const previous = formattedData.slice(-14, -7);
            
            if (previous.length > 0) {
              const recentAvg = recent.reduce((a, b) => a + b.score, 0) / recent.length;
              const previousAvg = previous.reduce((a, b) => a + b.score, 0) / previous.length;
              
              if (recentAvg > previousAvg + 3) setTrend('up');
              else if (recentAvg < previousAvg - 3) setTrend('down');
              else setTrend('stable');
            }
          }
        }
      }
      
      setIsLoading(false);
    };

    fetchScores();
  }, [user]);

  // Show locked state for non-PRO users
  if (!accessLoading && !isPro) {
    return (
      <div className="min-h-screen bg-nivo-bg relative overflow-hidden text-foreground">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-nivo-surface/50 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="container mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              <span className="font-mono text-xs">Retour</span>
            </Link>
          </div>
        </nav>

        <main className="pt-24 pb-12 px-4 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            {/* Lock icon */}
            <div className="mx-auto mb-6 w-24 h-24 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
              <Lock className="w-12 h-12 text-foreground/30" strokeWidth={1.5} />
            </div>

            <h1 className="font-heading text-2xl font-bold text-foreground mb-4">
              Fonctionnalité PRO
            </h1>
            <p className="text-foreground/50 mb-8">
              L'historique et l'analyse de votre progression sont réservés aux abonnés PRO et LIFETIME.
            </p>

            <Button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_30px_rgba(255,107,74,0.4)]"
            >
              <Crown className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Débloquer PRO
            </Button>
          </motion.div>
        </main>

        <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nivo-bg relative overflow-hidden text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-nivo-surface/50 backdrop-blur-xl border-b border-white/[0.06] shadow-deep-glass">
        <div className="container mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            <span className="font-mono text-xs">Retour</span>
          </Link>
          <span className="font-mono text-xs text-primary uppercase tracking-widest">
            Analyse / Historique
          </span>
        </div>
      </nav>

      <main className="pt-20 pb-12 px-4 md:px-6 container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            Évolution du Score
          </h1>
          <p className="font-mono text-xs text-foreground/40">
            Historique complet de vos calibrations
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassStatCard 
              label="MOYENNE" 
              value={averageScore !== null ? `${averageScore}%` : '--'} 
              valueColor="text-emerald-400"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassStatCard 
              label="TENDANCE" 
              value={trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} 
              valueColor={trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-foreground/60'}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassStatCard 
              label="MEILLEUR" 
              value={bestScore !== null ? `${bestScore}%` : '--'} 
              valueColor="text-cyan-400"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassStatCard 
              label="SCANS" 
              value={scores.length} 
              valueColor="text-purple-400"
            />
          </motion.div>
        </div>

        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <span className="font-mono text-xs text-primary uppercase">Score NIVO - Courbe Néon</span>
            </div>

            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <NeonChart 
                data={scores} 
                height={280}
                color="#ff6b4a"
                glowColor="rgba(255, 107, 74, 0.6)"
              />
            )}
          </GlassCard>
        </motion.div>

        {/* Trend Insight */}
        {scores.length > 7 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <GlassCard className="p-5">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  trend === 'up' ? 'bg-emerald-500/20 border border-emerald-500/30' :
                  trend === 'down' ? 'bg-red-500/20 border border-red-500/30' :
                  'bg-foreground/10 border border-foreground/20'
                }`}>
                  <TrendingUp className={`w-5 h-5 ${
                    trend === 'up' ? 'text-emerald-400' :
                    trend === 'down' ? 'text-red-400 rotate-180' :
                    'text-foreground/60'
                  }`} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-mono text-sm font-medium text-foreground mb-1">
                    {trend === 'up' ? 'Progression détectée' :
                     trend === 'down' ? 'Légère régression' :
                     'Score stable'}
                  </p>
                  <p className="font-mono text-xs text-foreground/50">
                    {trend === 'up' ? 'Votre intégrité structurelle s\'améliore sur les 7 derniers jours.' :
                     trend === 'down' ? 'Maintenez vos routines pour inverser la tendance.' :
                     'Continuez vos routines pour maintenir votre niveau.'}
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </main>
    </div>
  );
}
