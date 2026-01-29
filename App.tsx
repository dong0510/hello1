
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import StockChart from './components/StockChart';
import FundamentalCard from './components/FundamentalCard';
import AiAnalysis from './components/AiAnalysis';
import AuthModal from './components/AuthModal';
import { StockData, CandleData, FundamentalData, TechnicalAnalysis, User } from './types';
import { generateMockCandles, POPULAR_TICKERS } from './constants';
import { fetchStockInsights } from './services/geminiService';
import { AlertCircle, Clock } from 'lucide-react';

const App: React.FC = () => {
  const [selectedTicker, setSelectedTicker] = useState('NVDA');
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [fundamentals, setFundamentals] = useState<FundamentalData | null>(null);
  const [analysis, setAnalysis] = useState<TechnicalAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const loadStockData = useCallback(async (symbol: string) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Generate local candle data (visuals)
      const mockData = generateMockCandles(60, symbol === 'NVDA' ? 120 : 180);
      setCandles(mockData);

      // 2. Fetch AI Insights (Grounding)
      const insights = await fetchStockInsights(symbol);
      setFundamentals(insights.fundamentals);
      setAnalysis(insights.analysis);
      
    } catch (err) {
      console.error(err);
      setError("Failed to retrieve analysis for " + symbol + ". Make sure the API key is valid.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStockData(selectedTicker);
  }, [selectedTicker, loadStockData]);

  const handleSearch = (symbol: string) => {
    setSelectedTicker(symbol);
  };

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setIsAuthOpen(false);
  };

  return (
    <Layout>
      <Navbar 
        user={user} 
        onLogin={() => setIsAuthOpen(true)} 
        onLogout={() => setUser(null)}
        onSearch={handleSearch}
      />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 text-red-300 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chart Area */}
          <div className="lg:col-span-8 space-y-8">
            <StockChart data={candles} analysis={analysis} symbol={selectedTicker} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AiAnalysis analysis={analysis} loading={loading} />
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-400" />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {POPULAR_TICKERS.map(ticker => (
                    <button 
                      key={ticker}
                      onClick={() => setSelectedTicker(ticker)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                        selectedTicker === ticker 
                        ? 'bg-blue-600/10 border-blue-500/50 text-blue-400' 
                        : 'bg-slate-800/30 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <span className="font-bold">{ticker}</span>
                      <span className="text-[10px] text-slate-500 uppercase">Nasdaq</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <FundamentalCard data={fundamentals} loading={loading} />
              
              <div className="mt-8 p-6 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl text-white shadow-xl">
                <h4 className="font-bold text-lg mb-2">MVP Notice</h4>
                <p className="text-sm text-blue-100 leading-relaxed">
                  You are viewing real-time insights powered by Gemini 3 Flash. Charts are currently using high-fidelity simulated 1D candles for performance.
                </p>
                <button 
                  className="mt-4 w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold backdrop-blur-sm transition-colors"
                  onClick={() => window.open('https://www.google.com/finance/quote/' + selectedTicker + ':NASDAQ')}
                >
                  View on Google Finance
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center">
        <p className="text-slate-500 text-xs">
          © {new Date().getFullYear()} QuantVista Financial Analytics MVP. For educational purposes only.
        </p>
      </footer>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onSuccess={handleLoginSuccess} 
      />
    </Layout>
  );
};

export default App;
