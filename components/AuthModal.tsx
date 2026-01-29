
import React from 'react';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  const handleSimulateLogin = () => {
    onSuccess({
      id: 'google-123',
      name: 'Alpha Trader',
      email: 'trader@quantvista.io',
      picture: 'https://picsum.photos/seed/trader/100/100'
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
            <span className="text-3xl font-bold text-white">Q</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome to QuantVista</h2>
          <p className="text-slate-400 text-sm mt-2">Sign in to sync your watchlists and insights</p>
        </div>

        <button 
          onClick={handleSimulateLogin}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 py-3 rounded-xl font-semibold transition-all shadow-lg active:scale-95"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5" />
          Continue with Google
        </button>

        <p className="text-[10px] text-center text-slate-500 mt-6 px-4">
          By continuing, you agree to our Terms of Service and Privacy Policy. This is a secure MVP environment.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
