import { Target, RefreshCw, TerminalSquare, Calendar } from 'lucide-react';

export default function TopBar({ keyword, setKeyword, startDate, setStartDate, endDate, setEndDate, refresh, loading }) {
  return (
    <header className="glass-panel border-x-0 border-t-0 rounded-none xl:rounded-bl-2xl px-4 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center sticky top-0 z-40 gap-4 sm:gap-0">
      <div className="flex items-center w-full sm:w-auto">
        <div className="flex items-center space-x-2 mr-6 border-r border-slate-200 pr-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandGreen opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brandGreen"></span>
            </span>
            <span className="text-[10px] text-brandGreen font-bold tracking-widest uppercase">SYS_ONLINE</span>
        </div>
        <div className="text-sm text-slate-500 flex items-center flex-wrap">
          <TerminalSquare className="w-4 h-4 mr-2 shrink-0 text-brandBlue" />
          <span className="font-mono text-xs text-brandBlue truncate max-w-[150px] sm:max-w-none">ironwoodstairs.com | v2.1 (Ultra Light)</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto pb-1 sm:pb-0">
        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus-within:border-brandBlue transition-colors shrink-0">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-transparent text-slate-700 text-xs sm:text-sm outline-none cursor-pointer font-mono"
            placeholder="Start"
          />
          <span className="text-slate-300">-</span>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-transparent text-slate-700 text-xs sm:text-sm outline-none cursor-pointer font-mono"
            placeholder="End"
          />
        </div>

        <select 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="bg-slate-50 text-slate-800 font-mono text-sm px-3 py-2 rounded-lg border border-slate-200 outline-none cursor-pointer hover:border-brandBlue/50 focus:border-brandBlue transition shrink-0"
        >
          <option value="custom stairs calgary">"custom stairs calgary"</option>
          <option value="glass railings calgary">"glass railings calgary"</option>
          <option value="ironwood stairs">"ironwood stairs"</option>
          <option value="stair contractor calgary">"stair contractor calgary"</option>
          <option value="staircase renovation calgary">"staircase renovation calgary"</option>
          <option value="custom woodwork calgary">"custom woodwork calgary"</option>
        </select>

        <button 
          onClick={refresh} 
          disabled={loading}
          className="bg-brandBlue/10 hover:bg-brandBlue/20 border border-brandBlue/30 text-brandBlue px-4 py-2 rounded-lg transition-all flex items-center text-sm font-bold disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> 
          <span className="hidden sm:inline font-mono uppercase tracking-wider">{loading ? 'Syncing...' : 'Sync Intel'}</span>
          <span className="sm:hidden font-mono uppercase">{loading ? '...' : 'Sync'}</span>
        </button>
      </div>
    </header>
  );
}
