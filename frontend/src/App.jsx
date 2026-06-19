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
    <div className="flex flex-col xl:flex-row min-h-screen w-full bg-bg">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar keyword={keyword} setKeyword={setKeyword} refresh={fetchData} loading={loading} />
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {loading && !data ? (
            <div className="flex flex-col justify-center items-center py-32">
              <div className="relative flex justify-center items-center mb-4">
                <div className="absolute animate-ping w-16 h-16 rounded-full border-2 border-brandBlue opacity-20"></div>
                <div className="w-8 h-8 border-4 border-brandBlue border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="font-medium text-text-muted text-sm mt-2">Loading Intelligence...</p>
            </div>
          ) : data ? (
            <div className="animate-in fade-in duration-500">
              {/* Global Ticker moved to Overview or kept here as a toast-like feature. Let's place it at the top of the main area. */}
              <div className="bg-brandDark text-white rounded-lg p-2 flex items-center overflow-hidden shadow-sm mb-6">
                  <span className="bg-brandBlue text-white font-bold text-xs px-2 py-1 rounded mr-3 whitespace-nowrap uppercase">Live Feed</span>
                  <div className="w-full overflow-hidden relative">
                      <div className="whitespace-nowrap text-xs font-mono animate-[marquee_30s_linear_infinite]">
                        {data.socialIntel.liveStream.map((log, i) => (
                          <span key={i} className="mx-4 text-slate-300">[{log.source}] {log.text}</span>
                        )).reduce((acc, curr) => [acc, ...Array(5).fill(curr)], [])}
                      </div>
                  </div>
              </div>
              
              {renderPage()}
            </div>
          ) : (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
              <p className="font-bold">Connection Error</p>
              <p className="text-sm">Unable to connect to the backend server. Make sure it is running.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
