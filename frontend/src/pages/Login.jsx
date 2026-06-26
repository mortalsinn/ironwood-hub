import React, { useState } from 'react';
import axios from 'axios';
import { Hexagon, Lock, ChevronRight } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = import.meta.env.DEV ? 'http://localhost:3000/api/auth' : '/api/auth';
      const res = await axios.post(apiUrl, { password });
      
      if (res.data.success) {
        localStorage.setItem('dashboard_token', res.data.token);
        onLoginSuccess();
      }
    } catch (err) {
      setError('Invalid password. Access denied.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brandGold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-brandBlue/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md p-8 glass-panel border border-slate-200 rounded-2xl shadow-xl relative z-10 m-4">
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="w-16 h-16 rounded-xl bg-brandGold/20 border border-brandGold/50 flex items-center justify-center text-brandGold shadow-md mb-6">
            <Hexagon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-widest uppercase">Ironwood<span className="text-brandGold">SEO</span></h1>
          <p className="text-xs text-slate-500 tracking-widest uppercase mt-2 font-mono">Secure Uplink Required</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Access Code"
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brandGold focus:border-brandGold transition-colors font-mono tracking-widest text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="text-xs text-red-500 font-mono tracking-wide text-center bg-red-50 p-2 rounded border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold tracking-widest uppercase text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Initiate Connection
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
