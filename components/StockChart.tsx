
import React, { useMemo } from 'react';
import { CandleData, TechnicalAnalysis } from '../types';

interface StockChartProps {
  data: CandleData[];
  analysis: TechnicalAnalysis | null;
  symbol: string;
}

const StockChart: React.FC<StockChartProps> = ({ data, analysis, symbol }) => {
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 50, bottom: 30, left: 50 };
  
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const chartScale = useMemo(() => {
    if (!data.length) return null;
    const minVal = Math.min(...data.map(d => d.low));
    const maxVal = Math.max(...data.map(d => d.high));
    const padding = (maxVal - minVal) * 0.1;
    
    return {
      min: minVal - padding,
      max: maxVal + padding,
      range: (maxVal + padding) - (minVal - padding)
    };
  }, [data]);

  if (!chartScale || !data.length) return <div className="animate-pulse bg-slate-800 rounded-xl h-[400px]"></div>;

  const getY = (price: number) => innerHeight - ((price - chartScale.min) / chartScale.range) * innerHeight;
  const candleWidth = innerWidth / data.length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span className="text-slate-400">NASDAQ:</span> {symbol}
          <span className="text-xs font-normal bg-slate-800 px-2 py-1 rounded">1D</span>
        </h3>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-green-500"></div> Support</div>
          <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-red-500"></div> Resistance</div>
        </div>
      </div>
      
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="select-none">
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
            const y = p * innerHeight;
            const price = chartScale.max - p * chartScale.range;
            return (
              <React.Fragment key={i}>
                <line x1={0} y1={y} x2={innerWidth} y2={y} stroke="#1e293b" strokeDasharray="4 4" />
                <text x={innerWidth + 5} y={y + 4} fill="#64748b" fontSize="10">{price.toFixed(1)}</text>
              </React.Fragment>
            );
          })}

          {/* Technical Lines: Support */}
          {analysis?.support.map((lvl, i) => (
            <line 
              key={`sup-${i}`}
              x1={0} y1={getY(lvl)} x2={innerWidth} y2={getY(lvl)} 
              stroke="#22c55e" strokeWidth="1" strokeDasharray="4 2"
              className="opacity-60"
            />
          ))}

          {/* Technical Lines: Resistance */}
          {analysis?.resistance.map((lvl, i) => (
            <line 
              key={`res-${i}`}
              x1={0} y1={getY(lvl)} x2={innerWidth} y2={getY(lvl)} 
              stroke="#ef4444" strokeWidth="1" strokeDasharray="4 2"
              className="opacity-60"
            />
          ))}

          {/* Candlesticks */}
          {data.map((d, i) => {
            const x = i * candleWidth;
            const isBullish = d.close >= d.open;
            const bodyY = getY(Math.max(d.open, d.close));
            const bodyHeight = Math.abs(getY(d.open) - getY(d.close)) || 1;
            const wickX = x + candleWidth / 2;

            return (
              <g key={i} className="hover:opacity-80 transition-opacity">
                {/* Wick */}
                <line 
                  x1={wickX} y1={getY(d.high)} 
                  x2={wickX} y2={getY(d.low)} 
                  stroke={isBullish ? '#22c55e' : '#ef4444'} 
                  strokeWidth="1"
                />
                {/* Body */}
                <rect 
                  x={x + 1} y={bodyY} 
                  width={candleWidth - 2} height={bodyHeight} 
                  fill={isBullish ? '#22c55e' : '#ef4444'} 
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default StockChart;
