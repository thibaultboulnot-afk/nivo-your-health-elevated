import { useMemo } from 'react';

interface NeonChartProps {
  data: { date: string; score: number }[];
  height?: number;
  color?: string;
  glowColor?: string;
}

export function NeonChart({ 
  data, 
  height = 200, 
  color = "#ff6b4a",
  glowColor = "rgba(255, 107, 74, 0.6)"
}: NeonChartProps) {
  const { pathD, areaD, points } = useMemo(() => {
    if (data.length === 0) return { pathD: '', areaD: '', points: [] };

    const width = 100; // Use percentage
    const padding = 5;
    const chartHeight = height - padding * 2;
    
    const maxScore = Math.max(...data.map(d => d.score), 100);
    const minScore = Math.min(...data.map(d => d.score), 0);
    const range = maxScore - minScore || 1;

    const pts = data.map((d, i) => {
      const x = padding + (i / (data.length - 1 || 1)) * (width - padding * 2);
      const y = padding + chartHeight - ((d.score - minScore) / range) * chartHeight;
      return { x, y, score: d.score, date: d.date };
    });

    // Create smooth curve path
    let pathD = '';
    let areaD = '';
    
    if (pts.length > 0) {
      pathD = `M ${pts[0].x} ${pts[0].y}`;
      areaD = `M ${pts[0].x} ${height - padding}`;
      areaD += ` L ${pts[0].x} ${pts[0].y}`;
      
      for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1];
        const curr = pts[i];
        const cpX = (prev.x + curr.x) / 2;
        pathD += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
        areaD += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
      }
      
      areaD += ` L ${pts[pts.length - 1].x} ${height - padding}`;
      areaD += ' Z';
    }

    return { pathD, areaD, points: pts };
  }, [data, height]);

  if (data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center text-foreground/30 font-mono text-sm"
        style={{ height }}
      >
        Aucune donnée disponible
      </div>
    );
  }

  return (
    <svg 
      viewBox={`0 0 100 ${height}`} 
      preserveAspectRatio="none"
      className="w-full"
      style={{ height }}
    >
      <defs>
        {/* Gradient fill */}
        <linearGradient id="neonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        
        {/* Glow filter */}
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Area fill */}
      <path
        d={areaD}
        fill="url(#neonGradient)"
        className="transition-all duration-500"
      />
      
      {/* Main line with glow */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#neonGlow)"
        className="transition-all duration-500"
        style={{
          filter: `drop-shadow(0 0 6px ${glowColor})`,
        }}
      />
      
      {/* Data points */}
      {points.map((point, i) => (
        <g key={i}>
          {/* Glow circle */}
          <circle
            cx={point.x}
            cy={point.y}
            r="1.5"
            fill={color}
            style={{
              filter: `drop-shadow(0 0 4px ${glowColor})`,
            }}
          />
          {/* Center dot */}
          <circle
            cx={point.x}
            cy={point.y}
            r="0.8"
            fill="white"
          />
        </g>
      ))}
    </svg>
  );
}
