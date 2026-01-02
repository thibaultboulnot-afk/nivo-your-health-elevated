/**
 * useRankSystem - Bio Rank Hook
 * French military-style ranks based on subscription tenure
 */

import { useMemo } from 'react';
import { BIO_RANKS, getBioRank, type BioRank } from '@/lib/gamificationRegistry';

interface RankSystemResult {
  currentRank: BioRank;
  nextRank: BioRank | null;
  monthsToNextRank: number;
  currentMonths: number;
  progressToNextRank: number; // 0-1
  allRanks: BioRank[];
}

export function useRankSystem(subscriptionStartDate: string | null): RankSystemResult {
  return useMemo(() => {
    const currentRank = getBioRank(subscriptionStartDate);
    
    // Calculate current months
    let currentMonths = 0;
    if (subscriptionStartDate) {
      const startDate = new Date(subscriptionStartDate);
      const now = new Date();
      currentMonths = (now.getFullYear() - startDate.getFullYear()) * 12 + 
                      (now.getMonth() - startDate.getMonth());
    }
    
    // Find next rank
    const currentRankIndex = BIO_RANKS.findIndex(r => r.id === currentRank.id);
    const nextRank = currentRankIndex < BIO_RANKS.length - 1 
      ? BIO_RANKS[currentRankIndex + 1] 
      : null;
    
    // Calculate months to next rank
    const monthsToNextRank = nextRank 
      ? Math.max(0, nextRank.monthsRequired - currentMonths)
      : 0;
    
    // Calculate progress to next rank (0-1)
    let progressToNextRank = 0;
    if (nextRank && currentRank) {
      const rangeStart = currentRank.monthsRequired;
      const rangeEnd = nextRank.monthsRequired;
      const range = rangeEnd - rangeStart;
      if (range > 0) {
        progressToNextRank = Math.min(1, (currentMonths - rangeStart) / range);
      }
    } else if (!nextRank) {
      // Already at max rank
      progressToNextRank = 1;
    }
    
    return {
      currentRank,
      nextRank,
      monthsToNextRank,
      currentMonths,
      progressToNextRank,
      allRanks: BIO_RANKS,
    };
  }, [subscriptionStartDate]);
}

// Component helper for displaying rank badge
export function getRankBadgeProps(rank: BioRank) {
  return {
    className: `inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider border ${rank.badgeClass}`,
    label: rank.name,
  };
}
