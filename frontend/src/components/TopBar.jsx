import { Target, RefreshCw } from 'lucide-react';

export default function TopBar({ keyword, setKeyword, refresh, loading }) {
  return (
    <header className="bg-surface border-b border-border px-8 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="text-sm text-text-muted flex items-center">
          <Target className="w-4 h-4 mr-2" />
          Target Domain: <span className="ml-2 font-mono text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded border border-border">ironwoodstairs.com</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <select 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="bg-slate-50 text-text-main text-sm px-3 py-2 rounded-lg border border-border outline-none cursor-pointer hover:border-brandBlue/50 focus:border-brandBlue transition"
        >
          <option value="custom stairs calgary">"custom stairs calgary"</option>
          <option value="glass railings calgary">"glass railings calgary"</option>
          <option value="ironwood stairs">"ironwood stairs"</option>
        </select>

        <button 
          onClick={refresh} 
          disabled={loading}
          className="bg-brandBlue hover:bg-brandBlue/90 text-white px-4 py-2 rounded-lg transition flex items-center text-sm font-semibold shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> 
          {loading ? 'Syncing...' : 'Sync Intel'}
        </button>
      </div>
    </header>
  );
}
