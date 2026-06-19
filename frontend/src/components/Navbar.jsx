import { Activity, Target, RefreshCw } from 'lucide-react';

export default function Navbar({ keyword, setKeyword, refresh }) {
  return (
    <nav className="bg-cardBg border-b border-slate-700 p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-[100rem] mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <Activity className="text-brandGreen w-8 h-8" />
                <h1 className="text-xl font-bold tracking-wider text-white">IRONWOOD <span className="text-slate-400 font-light">COMMAND CENTER</span></h1>
            </div>
            <div className="flex items-center space-x-4">
                <select 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="bg-slate-800 text-brandBlue text-xs px-3 py-2 rounded font-mono border border-slate-600 outline-none cursor-pointer hover:border-brandBlue/50 transition hidden sm:block"
                >
                  <option value="custom stairs calgary">"custom stairs calgary"</option>
                  <option value="glass railings calgary">"glass railings calgary"</option>
                  <option value="ironwood stairs">"ironwood stairs"</option>
                </select>
                
                <div className="text-xs text-slate-400 hidden lg:flex items-center">
                  <Target className="w-4 h-4 mr-1"/> Target: <span className="text-white font-mono bg-slate-800 px-2 py-1 rounded border border-slate-600 ml-1">ironwoodstairs.com</span>
                </div>

                <button onClick={refresh} className="bg-brandBlue/10 hover:bg-brandBlue/20 text-brandBlue border border-brandBlue/30 px-4 py-2 rounded-md transition flex items-center text-sm font-semibold shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                    <RefreshCw className="w-4 h-4 mr-2" /> Sync Intel
                </button>
            </div>
        </div>
    </nav>
  );
}
