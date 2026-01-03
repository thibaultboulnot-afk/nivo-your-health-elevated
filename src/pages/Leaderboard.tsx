import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Flame, Crown, Medal, Award, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface LeaderboardEntry {
  id: string;
  first_name: string | null;
  weekly_xp: number;
  level: number;
  bio_rank: string | null;
}

const REWARDS_LEGEND = [
  { icon: Crown, label: 'Top 1', tokens: 5, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { icon: Medal, label: 'Top 10', tokens: 3, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  { icon: Award, label: 'Top 100', tokens: 1, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
];

function getTimeUntilReset(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  nextMonday.setHours(0, 0, 0, 0);
  
  const diff = nextMonday.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days === 0) {
    return `${hours}h restantes`;
  }
  return `${days}j ${hours}h restantes`;
}

export default function Leaderboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userEntry, setUserEntry] = useState<LeaderboardEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(getTimeUntilReset());

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, weekly_xp, level, bio_rank')
        .order('weekly_xp', { ascending: false })
        .limit(100);

      if (!error && data) {
        setLeaderboard(data);
        
        if (user) {
          const rank = data.findIndex(entry => entry.id === user.id);
          if (rank !== -1) {
            setUserRank(rank + 1);
            setUserEntry(data[rank]);
          }
        }
      }
      setIsLoading(false);
    };

    fetchLeaderboard();

    // Update countdown
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilReset());
    }, 60000);

    return () => clearInterval(interval);
  }, [user]);

  const getRankStyle = (rank: number) => {
    if (rank === 1) return { border: 'border-yellow-500/50', bg: 'bg-yellow-500/10', glow: 'shadow-yellow-500/20' };
    if (rank <= 10) return { border: 'border-orange-500/30', bg: 'bg-orange-500/5', glow: 'shadow-orange-500/10' };
    if (rank <= 100) return { border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', glow: '' };
    return { border: 'border-white/10', bg: '', glow: '' };
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="font-mono text-sm text-foreground/50">#{rank}</span>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="font-mono text-emerald-400 animate-pulse">CHARGEMENT CLASSEMENT...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="text-foreground/60 hover:text-foreground"
          >
            ← Retour
          </Button>
          <h1 className="font-heading text-xl font-bold text-emerald-400">ARÈNE MONDIALE</h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Cycle Timer */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="nivo-glass-intense rounded-xl p-6 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <span className="font-mono text-sm uppercase tracking-wider text-foreground/60">
              CYCLE HEBDOMADAIRE
            </span>
          </div>
          <div className="font-heading text-3xl font-bold text-emerald-400">
            {timeLeft}
          </div>
          <p className="font-mono text-xs text-foreground/40 mt-2">
            Reset chaque Lundi 00:00 UTC
          </p>
        </motion.div>

        {/* Rewards Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4"
        >
          {REWARDS_LEGEND.map((reward, i) => (
            <div 
              key={reward.label}
              className={`nivo-glass rounded-xl p-4 text-center ${reward.bg}`}
            >
              <reward.icon className={`w-8 h-8 mx-auto mb-2 ${reward.color}`} />
              <div className="font-mono text-xs text-foreground/60 mb-1">{reward.label}</div>
              <div className={`font-heading text-lg font-bold ${reward.color}`}>
                +{reward.tokens} <Zap className="w-4 h-4 inline" />
              </div>
              <div className="font-mono text-[10px] text-foreground/40">Jetons Apex</div>
            </div>
          ))}
        </motion.div>

        {/* User Position (if not in top 100) */}
        {user && userRank && userRank > 3 && userEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="nivo-glass-intense rounded-xl p-4 border border-emerald-500/30"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="font-mono font-bold text-emerald-400">#{userRank}</span>
              </div>
              <div className="flex-1">
                <div className="font-heading font-bold">Votre Position</div>
                <div className="font-mono text-sm text-foreground/60">
                  {userEntry.weekly_xp.toLocaleString()} XP cette semaine
                </div>
              </div>
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
          </motion.div>
        )}

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-emerald-400" />
            <h2 className="font-heading text-lg font-bold">CLASSEMENT TOP 100</h2>
          </div>

          {leaderboard.length === 0 ? (
            <div className="nivo-glass rounded-xl p-8 text-center">
              <div className="font-mono text-foreground/40">Aucun participant cette semaine</div>
            </div>
          ) : (
            leaderboard.map((entry, index) => {
              const rank = index + 1;
              const style = getRankStyle(rank);
              const isCurrentUser = user?.id === entry.id;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * Math.min(index, 10) }}
                  className={`
                    nivo-glass rounded-xl p-4 flex items-center gap-4 transition-all
                    ${style.border} ${style.bg} ${style.glow}
                    ${isCurrentUser ? 'ring-2 ring-emerald-500/50' : ''}
                    hover:border-white/20
                  `}
                >
                  {/* Rank */}
                  <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                    {getRankIcon(rank)}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-heading font-bold truncate ${isCurrentUser ? 'text-emerald-400' : ''}`}>
                        {entry.first_name || 'Opérateur Anonyme'}
                      </span>
                      {isCurrentUser && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                          VOUS
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-xs text-foreground/50">
                      Niv. {entry.level} • {entry.bio_rank || 'initiate'}
                    </div>
                  </div>

                  {/* Weekly XP */}
                  <div className="text-right">
                    <div className="font-heading text-xl font-bold text-emerald-400">
                      {entry.weekly_xp.toLocaleString()}
                    </div>
                    <div className="font-mono text-[10px] text-foreground/40 uppercase">
                      XP Hebdo
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Bottom Info */}
        <div className="text-center font-mono text-xs text-foreground/30 py-8">
          Les jetons Apex sont distribués au reset du cycle.
          <br />
          Forgez votre armure Apex dans l'Armurerie.
        </div>
      </div>
    </div>
  );
}
