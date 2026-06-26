import { Target, RefreshCw, TerminalSquare } from 'lucide-react';

export default function TopBar({ keyword, setKeyword, refresh, loading }) {
  return (
    <header className="glass-panel border-x-0 border-t-0 rounded-none xl:rounded-bl-2xl px-4 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center sticky top-0 z-40 gap-4 sm:gap-0">
      <div className="flex items-center w-full sm:w-auto">
        <div className="flex items-center space-x-2 mr-6 border-r border-white/10 pr-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandGreen opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brandGreen"></span>
            </span>
            <span className="text-[10px] text-brandGreen font-bold tracking-widest uppercase">SYS_ONLINE</span>
        </div>
        <div className="text-sm text-slate-400 flex items-center flex-wrap">
          <TerminalSquare className="w-4 h-4 mr-2 shrink-0 text-brandBlue" />
          <span className="font-mono text-xs text-brandBlue truncate max-w-[150px] sm:max-w-none">ironwoodstairs.com</span>
        </div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
        <select 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="bg-slate-800/80 text-brandBlue font-mono text-sm px-3 py-2 rounded-lg border border-brandBlue/30 outline-none cursor-pointer hover:border-brandBlue/70 focus:border-brandBlue transition shrink-0"
        >
          <option value="custom stairs calgary">"custom stairs calgary"</option>
          <option value="glass railings calgary">"glass railings calgary"</option>
          <option value="ironwood stairs">"ironwood stairs"</option>
        </select>

        <button 
          onClick={refresh} 
          disabled={loading}
          className="bg-brandBlue/10 hover:bg-brandBlue/20 border border-brandBlue/50 text-brandBlue px-4 py-2 rounded-lg transition-all flex items-center text-sm font-bold disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> 
          <span className="hidden sm:inline font-mono uppercase tracking-wider">{loading ? 'Syncing...' : 'Sync Intel'}</span>
          <span className="sm:hidden font-mono uppercase">{loading ? '...' : 'Sync'}</span>
        </button>
      </div>
    </header>
  );
}
