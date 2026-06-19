import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

import { LineChart, Brain, Radar, Radio, Search, ActivitySquare, Users } from 'lucide-react';
import { RedditLogo, YoutubeLogo } from '@phosphor-icons/react';

function ChartPanel({ data, keyword }) {
  const chartData = {
    labels: data.chartData.labels,
    datasets: [
      {
        fill: true,
        label: 'Search Volume',
        data: data.chartData.searchVolume,
        borderColor: '#c29545',
        backgroundColor: 'rgba(194, 149, 69, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { border: { display: false }, grid: { color: 'rgba(51, 65, 85, 0.3)' } },
      y: { border: { display: false }, grid: { color: 'rgba(51, 65, 85, 0.3)' } },
    },
  };

  return (
    <div className="glass-panel p-4 rounded-xl lg:col-span-2 shadow-2xl relative h-80 flex flex-col">
      <div className="flex justify-between items-center mb-4 border-b border-slate-700/50 pb-2">
          <h3 className="text-sm font-bold text-slate-200 tracking-widest uppercase flex items-center"><LineChart className="text-brandBlue mr-2 w-5 h-5" /> Google Trends (30 Days)</h3>
          <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400">Target: "{keyword}"</span>
      </div>
      <div className="flex-grow w-full relative">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}

function AEOPanel({ data }) {
  return (
    <div className="glass-panel p-4 rounded-xl lg:col-span-1 shadow-2xl flex flex-col">
      <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-4 flex items-center border-b border-slate-700/50 pb-2"><Brain className="text-purple-400 mr-2 w-5 h-5" /> AI Recommendation Matrix</h3>
      <p className="text-xs text-slate-400 mb-4">Probability of AI recommending Ironwood for local queries.</p>
      <div className="space-y-3 flex-grow">
        {data.aeoIntel.llmPerformance.map((llm, idx) => {
           const score = parseInt(llm.recommendationProbability) || 0;
           const color = score > 70 ? "text-brandGreen drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" : "text-brandBlue";
           return (
            <div key={idx} className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50 flex justify-between items-center">
                <p className="text-sm font-bold text-slate-200">{llm.model}</p>
                <p className={`${color} font-black text-lg`}>{llm.recommendationProbability}</p>
            </div>
           );
        })}
      </div>
    </div>
  );
}

function RedditPanel({ data }) {
  return (
    <div className="glass-panel p-4 rounded-xl lg:col-span-2 shadow-lg border border-slate-600 relative overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b border-slate-700/50 pb-2">
            <h3 className="text-sm font-bold text-white tracking-widest uppercase flex items-center"><RedditLogo weight="fill" className="text-brandOrange mr-2 w-5 h-5" /> Reddit Lead Radar (r/Calgary)</h3>
            <div className="flex space-x-2">
                <span className="flex items-center text-[10px] text-brandGreen font-bold"><span className="w-2 h-2 rounded-full bg-brandGreen mr-1 animate-pulse"></span> HOT LEAD</span>
            </div>
        </div>
        <div className="space-y-3 overflow-y-auto max-h-[300px] feed-scroll pr-2">
            {data.socialIntel.redditFeed.map((post, idx) => (
              <a key={idx} href={post.url} target="_blank" rel="noreferrer" className={`block p-3 rounded-lg border hover:bg-slate-700/50 transition ${post.intent === 'HOT LEAD' ? 'border-brandGreen bg-brandGreen/5 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]' : 'border-slate-700 bg-slate-800/30'}`}>
                  <div className="flex justify-between items-center mb-1.5">
                      <div className="text-[10px] text-slate-400 font-mono">u/{post.author} • {post.time}</div>
                      {post.intent === "HOT LEAD" ? 
                        <span className="text-[9px] font-bold bg-brandGreen text-black px-1.5 py-0.5 rounded ml-2 animate-pulse">HOT LEAD</span> : 
                        <span className="text-[9px] text-slate-500 border border-slate-600 px-1.5 py-0.5 rounded ml-2">CHATTER</span>
                      }
                  </div>
                  <p className="text-sm text-slate-200 font-medium">{post.text}</p>
              </a>
            ))}
        </div>
    </div>
  );
}

function PRPanel({ data }) {
  return (
    <div className="glass-panel p-4 rounded-xl lg:col-span-1 shadow-lg border border-slate-600 flex flex-col">
        <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-4 flex items-center border-b border-slate-700/50 pb-2"><Radio className="text-brandBlue mr-2 w-5 h-5" /> Media & Video PR</h3>
        <div className="overflow-y-auto max-h-[300px] feed-scroll pr-2 space-y-4">
            <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center"><YoutubeLogo weight="fill" className="text-red-500 mr-1 w-4 h-4"/> Top Video Content</span>
                <div className="space-y-2">
                  {data.socialIntel.youtubeFeed.map((vid, idx) => (
                    <div key={idx} className="flex items-start space-x-2 bg-slate-800/40 p-2 rounded border border-slate-700/50">
                        <YoutubeLogo weight="fill" className="text-red-500 w-6 h-6 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-slate-200 leading-tight">{vid.title}</p>
                            <p className="text-[9px] text-slate-400 mt-1">{vid.channel} • {vid.views.toLocaleString()} views</p>
                        </div>
                    </div>
                  ))}
                </div>
            </div>
            <div className="pt-2 border-t border-slate-700/50">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 block">Local PR & News XML</span>
                <div className="space-y-2">
                  {data.socialIntel.newsFeed.map((news, idx) => (
                    <div key={idx} className="border-l-2 border-brandBlue pl-2 py-1 mb-2">
                        <p className="text-[11px] font-bold text-slate-300 leading-tight">{news.title}</p>
                        <p className="text-[9px] text-slate-500 mt-0.5">{news.date}</p>
                    </div>
                  ))}
                </div>
            </div>
        </div>
    </div>
  );
}

function MockAnalyticsPanel() {
  return (
    <div className="glass-panel p-4 rounded-xl lg:col-span-2 shadow-lg flex flex-col justify-between">
      <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-4 flex items-center border-b border-slate-700/50 pb-2"><ActivitySquare className="text-brandOrange mr-2 w-5 h-5" /> Web Analytics (GA4 Mock)</h3>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-slate-800/50 p-3 rounded text-center border border-slate-700">
          <p className="text-xs text-slate-400">Monthly Visitors</p>
          <p className="text-xl font-bold text-brandBlue font-mono">1,402</p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded text-center border border-slate-700">
          <p className="text-xs text-slate-400">Bounce Rate</p>
          <p className="text-xl font-bold text-brandGreen font-mono">34.2%</p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded text-center border border-slate-700">
          <p className="text-xs text-slate-400">Avg Session</p>
          <p className="text-xl font-bold text-purple-400 font-mono">2m 14s</p>
        </div>
      </div>
      <p className="text-[10px] text-slate-500 italic text-center">Awaiting Google Analytics Service Account credentials to pull live data.</p>
    </div>
  );
}

function MockSocialPanel() {
  return (
    <div className="glass-panel p-4 rounded-xl lg:col-span-1 shadow-lg flex flex-col justify-between">
      <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-4 flex items-center border-b border-slate-700/50 pb-2"><Users className="text-brandBlue mr-2 w-5 h-5" /> Social Engagement (Mock)</h3>
      <div className="space-y-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-blue-500">Facebook Pages</span>
          <span className="text-sm font-mono">+12.4% Reach</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-blue-700">LinkedIn Business</span>
          <span className="text-sm font-mono">+44 Clicks</span>
        </div>
      </div>
      <p className="text-[10px] text-slate-500 italic text-center mt-auto">Awaiting Facebook/LinkedIn Graph API tokens.</p>
    </div>
  );
}

export default function DashboardGrid({ data, keyword }) {
  return (
    <div className="space-y-4">
      {/* Row 1: Chart and AEO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartPanel data={data} keyword={keyword} />
        <AEOPanel data={data} />
      </div>

      {/* Row 2: Analytics & Social Mock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <MockAnalyticsPanel />
        <MockSocialPanel />
      </div>

      {/* Row 3: Reddit Radar and PR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RedditPanel data={data} />
        <PRPanel data={data} />
      </div>

      {/* Row 4: Competitor Intel & Diagnostic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-panel p-4 rounded-xl col-span-1 shadow-lg">
            <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-4 flex items-center border-b border-slate-700/50 pb-2"><Search className="text-red-400 mr-2 w-5 h-5" /> Local Competitor Intel</h3>
            <div className="space-y-3">
              {data.competitorIntel.map((comp, idx) => (
                <div key={idx} className="bg-slate-800/60 p-3 rounded-lg border border-red-500/20 flex justify-between items-center">
                    <div>
                        <div className="text-sm font-bold text-slate-200 truncate hover:text-red-400 transition cursor-pointer">{comp.domain}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{comp.title}</div>
                    </div>
                    <div className="bg-red-900/40 text-red-400 font-bold text-xs px-2.5 py-1 rounded-md"># {comp.position}</div>
                </div>
              ))}
              {data.competitorIntel.length === 0 && <p className="text-xs text-slate-500 italic">No competitors found for this keyword.</p>}
            </div>
        </div>

        <div className="glass-panel p-4 rounded-xl col-span-1 shadow-lg">
            <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-4 flex items-center border-b border-slate-700/50 pb-2"><ActivitySquare className="text-brandBlue mr-2 w-5 h-5" /> Technical SEO Diagnostics</h3>
            <div className="space-y-6 mt-6">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-300 text-xs uppercase font-bold tracking-wider">Tech SEO Score</span>
                        <span className="font-mono text-brandGreen font-bold">{data.seoIntel.domainAuthority || 0}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-brandGreen h-1.5 rounded-full transition-all duration-1000" style={{width: `${data.seoIntel.domainAuthority || 0}%`}}></div></div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-300 text-xs uppercase font-bold tracking-wider">Performance / Speed</span>
                        <span className="font-mono text-brandBlue font-bold">{data.seoIntel.trustFlow || 0}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-brandBlue h-1.5 rounded-full transition-all duration-1000" style={{width: `${data.seoIntel.trustFlow || 0}%`}}></div></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
