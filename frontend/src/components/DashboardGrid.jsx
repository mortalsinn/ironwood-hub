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
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.15)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { border: { display: false }, grid: { color: 'rgba(0, 0, 0, 0.05)' }, ticks: { color: '#64748b', font: { family: 'monospace' } } },
      y: { border: { display: false }, grid: { color: 'rgba(0, 0, 0, 0.05)' }, ticks: { color: '#64748b', font: { family: 'monospace' } } },
    },
  };

  return (
    <div className="glass-panel p-4 lg:col-span-2 h-80 flex flex-col group border-t-2 border-t-brandBlue transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
          <h3 className="text-sm font-bold text-slate-900 tracking-widest uppercase flex items-center">
            <LineChart className="text-brandBlue mr-2 w-5 h-5" /> Global Search Trends
            <span className="ml-3 text-[8px] px-1.5 py-0.5 rounded border border-green-500/30 text-green-700 bg-green-500/10 font-mono">REAL</span>
          </h3>
          <span className="text-[10px] bg-brandBlue/10 border border-brandBlue/30 text-brandBlue px-2 py-1 rounded font-mono uppercase tracking-widest">Target: "{keyword}"</span>
      </div>
      <div className="flex-grow w-full relative">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}

function AEOPanel({ data }) {
  return (
    <div className="glass-panel p-4 lg:col-span-1 flex flex-col group border-t-2 border-t-purple-500 transition-all hover:shadow-md">
      <h3 className="text-sm font-bold text-slate-900 tracking-widest uppercase mb-4 flex items-center border-b border-slate-200 pb-2">
        <Brain className="text-purple-500 mr-2 w-5 h-5" /> AI Engine Matrix
        <span className="ml-auto text-[8px] px-1.5 py-0.5 rounded border border-green-500/30 text-green-700 bg-green-500/10 font-mono">REAL</span>
      </h3>
      <p className="text-[10px] font-mono text-slate-500 mb-4 uppercase tracking-widest">Probability of AI recommendation.</p>
      <div className="space-y-3 flex-grow">
        {data.aeoIntel.llmPerformance.map((llm, idx) => {
           const score = parseInt(llm.recommendationProbability) || 0;
           const color = score > 70 ? "text-brandGreen" : "text-brandBlue";
           const barColor = score > 70 ? "bg-brandGreen" : "bg-brandBlue";
           return (
            <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col hover:bg-slate-100 transition">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-mono font-bold text-slate-700 tracking-wider">{llm.model}</p>
                    <p className={`${color} font-black text-sm font-mono`}>{llm.recommendationProbability}</p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
                    <div className={`${barColor} h-1 rounded-full`} style={{width: llm.recommendationProbability}}></div>
                </div>
            </div>
           );
        })}
      </div>
    </div>
  );
}

function RedditPanel({ data }) {
  return (
    <div className="glass-panel p-4 lg:col-span-2 border-t-2 border-t-brandOrange relative overflow-hidden flex flex-col group hover:shadow-md">
        <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-widest uppercase flex items-center">
              <Radar className="text-brandOrange mr-2 w-5 h-5" /> Lead Radar
              <span className="ml-3 text-[8px] px-1.5 py-0.5 rounded border border-amber-500/30 text-amber-700 bg-amber-500/10 font-mono">SIMULATED</span>
            </h3>
            <div className="flex space-x-2">
                <span className="flex items-center text-[10px] text-brandGreen font-bold font-mono tracking-widest uppercase"><span className="w-2 h-2 rounded-full bg-brandGreen mr-1 animate-pulse"></span> Live Intercept</span>
            </div>
        </div>
        <div className="space-y-3 overflow-y-auto max-h-[300px] feed-scroll pr-2">
            {data.socialIntel.redditFeed.map((post, idx) => (
              <a key={idx} href={post.url} target="_blank" rel="noreferrer" className={`block p-3 rounded-lg border hover:bg-slate-100 transition ${post.intent === 'HOT LEAD' ? 'border-brandGreen/50 bg-brandGreen/5' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex justify-between items-center mb-1.5">
                      <div className="text-[10px] text-brandBlue font-mono tracking-widest">USR: {post.author} // {post.time}</div>
                      {post.intent === "HOT LEAD" ? 
                        <span className="text-[9px] font-bold font-mono bg-brandGreen/20 text-brandGreen px-1.5 py-0.5 rounded ml-2 border border-brandGreen/30">HOT LEAD</span> : 
                        <span className="text-[9px] text-slate-500 font-mono border border-slate-300 px-1.5 py-0.5 rounded ml-2 uppercase">Chatter</span>
                      }
                  </div>
                  <p className="text-sm text-slate-800 font-medium">{post.text}</p>
              </a>
            ))}
        </div>
    </div>
  );
}

function PRPanel({ data }) {
  return (
    <div className="glass-panel p-4 lg:col-span-1 flex flex-col group border-t-2 border-t-red-500 hover:shadow-md">
        <h3 className="text-sm font-bold text-slate-900 tracking-widest uppercase mb-4 flex items-center border-b border-slate-200 pb-2">
          <Radio className="text-red-500 mr-2 w-5 h-5" /> Network Scraper
          <span className="ml-auto text-[8px] px-1.5 py-0.5 rounded border border-green-500/30 text-green-700 bg-green-500/10 font-mono">REAL</span>
        </h3>
        <div className="overflow-y-auto max-h-[300px] feed-scroll pr-2 space-y-4">
            <div>
                <span className="text-[10px] text-slate-500 font-bold font-mono uppercase tracking-widest mb-2 flex items-center"><YoutubeLogo weight="fill" className="text-red-500 mr-1 w-4 h-4"/> Video Nodes</span>
                <div className="space-y-2">
                  {data.socialIntel.youtubeFeed.map((vid, idx) => (
                    <div key={idx} className="flex items-start space-x-2 bg-slate-50 p-2 rounded border border-slate-200 hover:border-red-500/30 transition">
                        <YoutubeLogo weight="fill" className="text-red-500 w-6 h-6 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-slate-900 leading-tight">{vid.title}</p>
                            <p className="text-[9px] text-slate-500 mt-1 font-mono">{vid.channel} // {vid.views.toLocaleString()} VIEWS</p>
                        </div>
                    </div>
                  ))}
                </div>
            </div>
            <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold font-mono uppercase tracking-widest mb-2 block">News XML Feed</span>
                <div className="space-y-2">
                  {data.socialIntel.newsFeed.map((news, idx) => (
                    <div key={idx} className="border-l-2 border-brandBlue pl-2 py-1 mb-2 hover:bg-slate-50 transition px-2 rounded-r">
                        <p className="text-[11px] font-bold text-slate-800 leading-tight">{news.title}</p>
                        <p className="text-[9px] text-slate-500 font-mono mt-0.5">{news.date}</p>
                    </div>
                  ))}
                </div>
            </div>
        </div>
    </div>
  );
}

function MockAnalyticsPanel({ data }) {
  const analytics = data.webAnalytics || {};
  return (
    <div className="glass-panel p-4 lg:col-span-2 flex flex-col justify-between group border-t-2 border-t-brandGreen hover:shadow-md">
      <h3 className="text-sm font-bold text-slate-900 tracking-widest uppercase mb-4 flex items-center border-b border-slate-200 pb-2">
        <ActivitySquare className="text-brandGreen mr-2 w-5 h-5" /> Web Analytics (GA4)
        <span className="ml-auto text-[8px] px-1.5 py-0.5 rounded border border-green-500/30 text-green-700 bg-green-500/10 font-mono">REAL</span>
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <div className="bg-slate-50 p-3 rounded text-center border border-slate-200 hover:border-brandGreen/30 transition">
          <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1">Sessions</p>
          <p className="text-xl font-black text-slate-900 font-mono">{analytics.sessions || "0"}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded text-center border border-slate-200 hover:border-brandGreen/30 transition">
          <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1">Page Views</p>
          <p className="text-xl font-black text-slate-900 font-mono">{analytics.pageViews || "0"}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded text-center border border-slate-200 hover:border-brandOrange/30 transition">
          <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1">Form Submits</p>
          <p className="text-xl font-black text-brandOrange font-mono">{analytics.formSubmits || "0"}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded text-center border border-slate-200 hover:border-brandBlue/30 transition">
          <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1">Avg Engagement</p>
          <p className="text-xl font-black text-brandBlue font-mono">{analytics.avgEngagement || "0"}</p>
        </div>
      </div>
    </div>
  );
}

function MockSocialPanel({ data }) {
  const social = data.socialMetrics || {};
  return (
    <div className="glass-panel p-4 lg:col-span-1 flex flex-col justify-between group border-t-2 border-t-brandBlue hover:shadow-md">
      <h3 className="text-sm font-bold text-slate-900 tracking-widest uppercase mb-4 flex items-center border-b border-slate-200 pb-2">
        <Users className="text-brandBlue mr-2 w-5 h-5" /> Social Engagement
        <span className="ml-auto text-[8px] px-1.5 py-0.5 rounded border border-amber-500/30 text-amber-700 bg-amber-500/10 font-mono">SIMULATED</span>
      </h3>
      <div className="space-y-4 mb-4 mt-2">
        <div>
            <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-slate-700 tracking-wider">LinkedIn Grid</span>
            <span className="text-[10px] font-mono text-brandBlue bg-brandBlue/10 px-1.5 py-0.5 rounded border border-brandBlue/30">{social.linkedin?.impressions || 0} IMPR</span>
            </div>
            <div className="w-full bg-slate-200 h-1 rounded-full"><div className="bg-brandBlue h-1 rounded-full" style={{width: '85%'}}></div></div>
        </div>
        <div>
            <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-slate-700 tracking-wider">Facebook Views</span>
            <span className="text-[10px] font-mono text-brandBlue bg-brandBlue/10 px-1.5 py-0.5 rounded border border-brandBlue/30">{social.facebook?.views || 0} VIEWS</span>
            </div>
            <div className="w-full bg-slate-200 h-1 rounded-full"><div className="bg-brandBlue h-1 rounded-full" style={{width: '65%'}}></div></div>
        </div>
      </div>
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
        <MockAnalyticsPanel data={data} />
        <MockSocialPanel data={data} />
      </div>

      {/* Row 3: Reddit Radar and PR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RedditPanel data={data} />
        <PRPanel data={data} />
      </div>

      {/* Row 4: Competitor Intel & Diagnostic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-panel p-4 col-span-1 border-t-2 border-t-red-500 group hover:shadow-md">
            <h3 className="text-sm font-bold text-slate-900 tracking-widest uppercase mb-4 flex items-center border-b border-slate-200 pb-2">
              <Search className="text-red-500 mr-2 w-5 h-5" /> Target Acquisition (Competitors)
              <span className="ml-auto text-[8px] px-1.5 py-0.5 rounded border border-green-500/30 text-green-700 bg-green-500/10 font-mono">REAL</span>
            </h3>
            <div className="space-y-3">
              {data.competitorIntel.map((comp, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-center hover:bg-slate-100 transition">
                    <div>
                        <div className="text-sm font-bold text-slate-900 truncate hover:text-red-500 transition cursor-pointer font-mono">{comp.domain}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wide">{comp.title}</div>
                    </div>
                    <div className="bg-red-50 text-red-500 font-bold font-mono text-xs px-2.5 py-1 rounded-md border border-red-200">RANK {comp.position}</div>
                </div>
              ))}
              {data.competitorIntel.length === 0 && <p className="text-xs text-slate-500 italic font-mono">No targets found in sector.</p>}
            </div>
        </div>

        <div className="glass-panel p-4 col-span-1 border-t-2 border-t-brandBlue group hover:shadow-md">
            <h3 className="text-sm font-bold text-slate-900 tracking-widest uppercase mb-4 flex items-center border-b border-slate-200 pb-2">
              <ActivitySquare className="text-brandBlue mr-2 w-5 h-5" /> System Diagnostics
              <span className="ml-auto text-[8px] px-1.5 py-0.5 rounded border border-amber-500/30 text-amber-700 bg-amber-500/10 font-mono">SIMULATED</span>
            </h3>
            <div className="space-y-8 mt-8 px-2">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-brandGreen text-[10px] uppercase font-bold tracking-widest font-mono">Tech SEO Score</span>
                        <span className="font-mono text-slate-900 font-black text-lg">{data.seoIntel.domainAuthority || 0}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2"><div className="bg-brandGreen h-2 rounded-full transition-all duration-1000" style={{width: `${data.seoIntel.domainAuthority || 0}%`}}></div></div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-brandBlue text-[10px] uppercase font-bold tracking-widest font-mono">Network Speed</span>
                        <span className="font-mono text-slate-900 font-black text-lg">{data.seoIntel.trustFlow || 0}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2"><div className="bg-brandBlue h-2 rounded-full transition-all duration-1000" style={{width: `${data.seoIntel.trustFlow || 0}%`}}></div></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
