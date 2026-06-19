import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import KPICards from './components/KPICards';
import DashboardGrid from './components/DashboardGrid';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('custom stairs calgary');

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

  return (
    <>
      <Navbar keyword={keyword} setKeyword={setKeyword} refresh={fetchData} />
      
      <main className="flex-grow max-w-[100rem] mx-auto w-full p-2 sm:p-4 space-y-4 pt-6">
        
        {/* Live Ticker */}
        {data && (
          <div className="bg-black border border-slate-700 rounded-lg p-2 flex items-center overflow-hidden shadow-lg">
              <span className="bg-brandBlue text-black font-bold text-xs px-2 py-1 rounded mr-3 whitespace-nowrap uppercase">Live Stream</span>
              <div className="w-full overflow-hidden relative">
                  <div className="whitespace-nowrap text-sm text-brandBlue font-mono animate-[marquee_20s_linear_infinite]">
                    {data.socialIntel.liveStream.map((log, i) => (
                      <span key={i}>[{log.source}] {log.text} &bull; &bull; &bull; </span>
                    )).reduce((acc, curr) => [acc, curr, acc, curr, acc, curr, acc, curr, acc, curr], [])}
                  </div>
              </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 fade-in">
            <div className="relative flex justify-center items-center mb-4">
              <div className="absolute animate-ping w-24 h-24 rounded-full border-2 border-brandBlue opacity-20"></div>
              <svg className="w-16 h-16 text-brandBlue animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <p className="font-mono text-brandBlue tracking-widest text-sm uppercase mt-2">Syncing with Command Center...</p>
          </div>
        ) : data ? (
          <div className="fade-in space-y-4">
            <KPICards data={data} />
            <DashboardGrid data={data} keyword={keyword} />
          </div>
        ) : (
          <div className="text-red-500 text-center py-20">Error loading data. Is the backend running?</div>
        )}

      </main>
    </>
  );
}

export default App;
