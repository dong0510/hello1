
import React from 'react';
import { TechnicalAnalysis } from '../types';
import { Brain, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface AiAnalysisProps {
  analysis: TechnicalAnalysis | null;
  loading: boolean;
}

const AiAnalysis: React.FC<AiAnalysisProps> = ({ analysis, loading }) => {
  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-slate-800 rounded"></div>
        <div className="h-24 bg-slate-800 rounded"></div>
      </div>
    );
  }

  if (!analysis) return null;

  const TrendIcon = {
    Bullish: <ArrowUpRight className="h-5 w-5 text-green-400" />,
    Bearish: <ArrowDownRight className="h-5 w-5 text-red-400" />,
    Neutral: <Minus className="h-5 w-5 text-slate-400" />
  }[analysis.trend];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Brain className="h-24 w-24 text-blue-500" />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Brain className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold">AI Technical Verdict</h3>
          <div className="flex items-center gap-1.5 mt-1">
            {TrendIcon}
            <span className={`text-sm font-semibold ${
              analysis.trend === 'Bullish' ? 'text-green-400' : 
              analysis.trend === 'Bearish' ? 'text-red-400' : 'text-slate-400'
            }`}>
              {analysis.trend} Sentiment
            </span>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-4 text-sm text-slate-300 leading-relaxed border border-slate-700/50">
        {analysis.summary}
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {analysis.support.map((val, i) => (
          <span key={`s-${i}`} className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded text-[10px] font-medium whitespace-nowrap">
            SUP @ {val}
          </span>
        ))}
        {analysis.resistance.map((val, i) => (
          <span key={`r-${i}`} className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-[10px] font-medium whitespace-nowrap">
            RES @ {val}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AiAnalysis;
