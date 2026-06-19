import { TrendingUp, MapPin, Clock, ShieldCheck, ShieldAlert, Star, ActivitySquare, Users, LineChart } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

export default function Overview({ data, keyword }) {
  const isSecure = data.threatIntel.status === "SECURE";

  const chartData = {
    labels: data.chartData.labels,
    datasets: [{
      fill: true,
      label: 'Search Volume',
      data: data.chartData.searchVolume,
      borderColor: '#c29545',
      backgroundColor: 'rgba(194, 149, 69, 0.1)',
      tension: 0.4,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { border: { display: false }, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
      y: { border: { display: false }, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
    },
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface-panel p-5 border-l-4 border-l-brandBlue flex justify-between items-center group">
            <div>
                <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1">Brand Velocity</p>
                <h3 className="text-3xl font-black text-text-main tracking-tighter">{data.brandVelocity}</h3>
            </div>
            <TrendingUp className="w-10 h-10 text-brandBlue/20 group-hover:text-brandBlue transition-colors" />
        </div>
        
        <div className="surface-panel p-5 border-l-4 border-l-yellow-400 flex justify-between items-center group">
            <div>
                <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1">Maps Rating</p>
                <div className="flex items-end space-x-2">
                    <h3 className="text-3xl font-bold text-text-main">{data.localIntel.googleBusiness.rating}</h3>
                    <Star className="w-5 h-5 text-yellow-400 mb-1 fill-yellow-400" />
                </div>
                <p className="text-[11px] text-text-muted mt-1 font-medium">{data.localIntel.googleBusiness.totalReviews} Reviews</p>
            </div>
            <MapPin className="w-10 h-10 text-yellow-400/20 group-hover:text-yellow-400 transition-colors" />
        </div>

        <div className="surface-panel p-5 border-l-4 border-l-purple-500 flex justify-between items-center group">
            <div>
                <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1">Domain Maturity</p>
                <h3 className="text-lg font-bold text-text-main leading-tight mt-1">{data.threatIntel.domainMaturity}</h3>
            </div>
            <Clock className="w-10 h-10 text-purple-500/20 group-hover:text-purple-500 transition-colors" />
        </div>

        <div className="surface-panel p-5 border-l-4 border-l-brandGreen flex justify-between items-center group">
            <div>
                <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1">SSL Threat Intel</p>
                <h3 className={`text-xl font-bold mt-1 flex items-center ${isSecure ? 'text-brandGreen' : 'text-brandOrange'}`}>
                    {isSecure ? <ShieldCheck className="w-5 h-5 mr-1.5" /> : <ShieldAlert className="w-5 h-5 mr-1.5" />}
                    {data.threatIntel.status}
                </h3>
            </div>
            <div className="text-right">
                <p className="text-2xl font-black text-text-main">{data.threatIntel.sslDaysRemaining}</p>
                <p className="text-[10px] text-text-muted uppercase font-bold">Days Left</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Google Trends */}
        <div className="surface-panel p-6 lg:col-span-2 flex flex-col h-96">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-widest flex items-center">
                <LineChart className="text-brandBlue mr-2 w-5 h-5" /> Search Interest (30 Days)
              </h3>
              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium border border-border">Keyword: {keyword}</span>
          </div>
          <div className="flex-grow w-full relative">
            <Line options={options} data={chartData} />
          </div>
        </div>

        {/* Mocks */}
        <div className="flex flex-col space-y-6 lg:col-span-1">
          {/* GA4 Mock */}
          <div className="surface-panel p-6 flex-1 flex flex-col justify-between">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-widest mb-4 flex items-center">
              <ActivitySquare className="text-brandOrange mr-2 w-5 h-5" /> Web Analytics (GA4)
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-border">
                <p className="text-[11px] font-bold text-text-muted uppercase">Monthly Visitors</p>
                <p className="text-xl font-black text-text-main mt-1">1,402</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-border">
                <p className="text-[11px] font-bold text-text-muted uppercase">Bounce Rate</p>
                <p className="text-xl font-black text-text-main mt-1">34.2%</p>
              </div>
            </div>
            <p className="text-xs text-text-muted bg-slate-50 p-2 rounded border border-border text-center">Connect Google Service Account for live data.</p>
          </div>

          {/* Social Mock */}
          <div className="surface-panel p-6 flex-1 flex flex-col justify-between">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-widest mb-4 flex items-center">
              <Users className="text-blue-600 mr-2 w-5 h-5" /> Social Engagement
            </h3>
            <div className="space-y-4 mb-4">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-border">
                <span className="text-sm font-semibold text-blue-600">Facebook Pages</span>
                <span className="text-sm font-bold text-text-main">+12.4% Reach</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-border">
                <span className="text-sm font-semibold text-blue-700">LinkedIn</span>
                <span className="text-sm font-bold text-text-main">+44 Clicks</span>
              </div>
            </div>
            <p className="text-xs text-text-muted bg-slate-50 p-2 rounded border border-border text-center">Connect Graph APIs for live metrics.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
