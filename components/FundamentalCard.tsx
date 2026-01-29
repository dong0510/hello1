
import React from 'react';
import { FundamentalData } from '../types';
import { ExternalLink, Info } from 'lucide-react';

interface FundamentalCardProps {
  data: FundamentalData | null;
  loading: boolean;
}

const FundamentalCard: React.FC<FundamentalCardProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 animate-pulse">
        <div className="h-6 w-32 bg-slate-800 rounded"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-16 bg-slate-800 rounded"></div>
          <div className="h-16 bg-slate-800 rounded"></div>
          <div className="h-16 bg-slate-800 rounded"></div>
          <div className="h-16 bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Info className="h-4 w-4 text-blue-400" />
          Fundamentals
        </h3>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">G-Finance Grounded</span>
      </div>

      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
        <div>
          <p className="text-xs text-slate-400 mb-1">PER (Trailing)</p>
          <p className="text-xl font-semibold mono">{data.per || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">PBR</p>
          <p className="text-xl font-semibold mono">{data.pbr || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">EPS</p>
          <p className="text-xl font-semibold mono text-green-400">{data.eps || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Market Cap</p>
          <p className="text-md font-semibold text-slate-300">{data.marketCap || 'N/A'}</p>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-800">
        <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Verification Sources</h4>
        <div className="space-y-2">
          {data.sources.slice(0, 2).map((src, i) => (
            <a 
              key={i} 
              href={src.uri} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span className="truncate max-w-[180px]">{src.title}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FundamentalCard;
