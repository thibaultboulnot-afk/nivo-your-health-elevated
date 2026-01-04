import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAccess } from '@/hooks/useAccess';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { UpgradeModal } from '@/components/UpgradeModal';
import { ArrowLeft, Lock, TrendingUp, Calendar, Activity, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ScoreData {
  date: string;
  score: number;
  displayDate: string;
}

export default function Analytics() {
  const { user } = useAuth();
  const { isPro, isLoading: accessLoading } = useAccess();
  const navigate = useNavigate();
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    if (!user) return;

    const fetchScores = async () => {
      setIsLoading(true);
      
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('nivo_scores')
        .select('score_date, total_score')
        .eq('user_id', user.id)
        .gte('score_date', thirtyDaysAgo)
        .order('score_date', { ascending: true });

      if (!error && data) {
        const formattedData = data.map(item => ({
          date: item.score_date,
          score: item.total_score,
          displayDate: format(new Date(item.score_date), 'dd MMM', { locale: fr }),
        }));
        
        setScores(formattedData);

        // Calculate average
        if (formattedData.length > 0) {
          const avg = Math.round(formattedData.reduce((acc, curr) => acc + curr.score, 0) / formattedData.length);
          setAverageScore(avg);

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
      <div className="min-h-screen bg-[#050510] relative overflow-hidden text-foreground">
        {/* Background */}
        <div className="aurora absolute inset-0 pointer-events-none opacity-30" />
        <div className="grid-background absolute inset-0 pointer-events-none opacity-10" />

        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/70 backdrop-blur-2xl border-b border-white/5">
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
            <div className="mx-auto mb-6 w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
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
    <div className="min-h-screen bg-[#050510] relative overflow-hidden text-foreground">
      {/* Background */}
      <div className="aurora absolute inset-0 pointer-events-none opacity-30" />
      <div className="grid-background absolute inset-0 pointer-events-none opacity-10" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/70 backdrop-blur-2xl border-b border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
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
            30 derniers jours de calibration
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-950/70 backdrop-blur-2xl border border-white/5 rounded-xl p-4 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]"
          >
            <span className="font-mono text-[10px] text-foreground/40 block mb-1">MOYENNE</span>
            <span className="font-mono text-2xl font-bold text-emerald-400">
              {averageScore ?? '--'}%
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-950/70 backdrop-blur-2xl border border-white/5 rounded-xl p-4 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]"
          >
            <span className="font-mono text-[10px] text-foreground/40 block mb-1">TENDANCE</span>
            <span className={`font-mono text-2xl font-bold ${
              trend === 'up' ? 'text-emerald-400' : 
              trend === 'down' ? 'text-red-400' : 'text-foreground/60'
            }`}>
              {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-950/70 backdrop-blur-2xl border border-white/5 rounded-xl p-4 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]"
          >
            <span className="font-mono text-[10px] text-foreground/40 block mb-1">SCANS</span>
            <span className="font-mono text-2xl font-bold text-cyan-400">
              {scores.length}
            </span>
          </motion.div>
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-950/70 backdrop-blur-2xl border border-white/5 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]"
        >
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-4 h-4 text-primary" strokeWidth={1.5} />
            <span className="font-mono text-xs text-primary uppercase">Score NIVO</span>
          </div>

          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : scores.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <p className="font-mono text-sm text-foreground/40">
                Aucune donnée de calibration disponible
              </p>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scores}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="displayDate" 
                    stroke="rgba(255,255,255,0.3)"
                    fontSize={10}
                    fontFamily="monospace"
                    tick={{ fill: 'rgba(255,255,255,0.4)' }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    stroke="rgba(255,255,255,0.3)"
                    fontSize={10}
                    fontFamily="monospace"
                    tick={{ fill: 'rgba(255,255,255,0.4)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(10, 10, 18, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                    }}
                    labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#scoreGradient)"
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
                    activeDot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: '#fff', r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
