import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Overview from './pages/Overview';
import LeadRadar from './pages/LeadRadar';
import LocalPR from './pages/LocalPR';
import Diagnostics from './pages/Diagnostics';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('custom stairs calgary');
  const [currentPage, setCurrentPage] = useState('overview');

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.DEV 
        ? `http://localhost:3000/api/dashboard?keyword=${encodeURIComponent(keyword)}` 
        : `/api/dashboard?keyword=${encodeURIComponent(keyword)}`;
      const res = await axios.get(apiUrl);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [keyword]);

  const renderPage = () => {
    if (!data) return null;
    switch(currentPage) {
      case 'overview': return <Overview data={data} keyword={keyword} />;
      case 'lead_radar': return <LeadRadar data={data} />;
      case 'local_pr': return <LocalPR data={data} keyword={keyword} />;
      case 'diagnostics': return <Diagnostics data={data} />;
      default: return <Overview data={data} keyword={keyword} />;
    }
  };

  return (
    <div className="flex flex-col xl:flex-row min-h-screen w-full overflow-x-hidden">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar keyword={keyword} setKeyword={setKeyword} refresh={fetchData} loading={loading} />
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto relative z-10">
          {loading && !data ? (
            <div className="flex flex-col justify-center items-center py-32">
              <div className="relative flex justify-center items-center mb-4">
                <div className="absolute animate-ping w-24 h-24 rounded-full border-2 border-brandBlue opacity-20"></div>
                <div className="absolute animate-pulse w-16 h-16 rounded-full border-2 border-brandGreen opacity-40"></div>
                <div className="w-8 h-8 border-4 border-brandBlue border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="font-mono text-brandBlue font-bold tracking-widest text-sm mt-4 animate-pulse">ESTABLISHING UPLINK...</p>
            </div>
          ) : data ? (
            <div className="animate-in fade-in duration-1000">
              {/* Global Ticker */}
              <div className="glass-panel p-2 flex items-center overflow-hidden mb-6 border-l-4 border-l-brandOrange shadow-sm">
                  <span className="text-brandOrange font-bold text-[10px] tracking-widest px-3 border-r border-slate-200 mr-3 whitespace-nowrap uppercase flex items-center">
                    <span className="w-1.5 h-1.5 bg-brandOrange rounded-full mr-2 animate-pulse"></span>
                    Live Intercept
                    <span className="ml-2 text-[8px] px-1.5 py-0.5 rounded border border-amber-500/30 text-amber-700 bg-amber-500/10 font-mono hidden sm:inline-block">SIMULATED</span>
                  </span>
                  <div className="w-full overflow-hidden relative">
                      <div className="whitespace-nowrap text-xs font-mono text-slate-600 animate-[marquee_40s_linear_infinite]">
                        {data.socialIntel.liveStream.map((log, i) => (
                          <span key={i} className="mx-6 hover:text-slate-900 transition-colors cursor-default">
                            <span className="text-brandOrange font-bold">[{log.source}]</span> {log.text}
                          </span>
                        )).reduce((acc, curr) => [acc, ...Array(5).fill(curr)], [])}
                      </div>
                  </div>
              </div>
              
              {renderPage()}
            </div>
          ) : (
            <div className="glass-panel border-red-500/50 bg-red-950/20 text-red-400 p-6 rounded-xl flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin-slow mb-4"></div>
              <p className="font-mono text-xl font-bold tracking-widest mb-2 text-shadow-glow">CONNECTION SEVERED</p>
              <p className="font-mono text-sm opacity-80">Unable to establish uplink to backend intelligence server.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
