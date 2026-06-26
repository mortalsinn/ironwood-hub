import React from 'react';
import { Share2, Users, Building2, Briefcase, Network, Globe, Camera, AlertTriangle, TrendingUp } from 'lucide-react';
import Tooltip from '../components/Tooltip';

export default function SocialEngagement({ data }) {
  if (!data || !data.socialDeepDive) return null;
  const deepDive = data.socialDeepDive;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
            <Share2 className="mr-3 text-brandBlue w-6 h-6" /> Social Engagement Deep-Dive
          </h2>
          <p className="text-sm text-slate-500 mt-1">Granular B2B demographics and Meta algorithmic performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* LinkedIn B2B Network Growth */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <Network className="w-5 h-5 text-blue-600 mr-2" /> LinkedIn B2B Network
            </h3>
            <span className="text-[10px] font-mono text-blue-700 bg-blue-100 px-2 py-1 rounded border border-blue-200">REAL-TIME ACQUISITION</span>
          </div>

          {/* Competitor Comparison */}
          <div className="mb-8">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Competitor Growth Comparison</h4>
            <div className="space-y-4">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-slate-700">Ironwood Stair & Rail</span>
                  <span className="text-xs font-mono text-blue-600">+{deepDive.linkedin.growth.ironwood.newFollowers} Followers</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">{deepDive.linkedin.growth.ironwood.posts} Posts Published</p>
              </div>

              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-slate-700">Artistic Stairs Ltd.</span>
                  <span className="text-xs font-mono text-slate-500">+{deepDive.linkedin.growth.competitor.newFollowers} Followers</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-2 rounded-full" style={{ width: `${(deepDive.linkedin.growth.competitor.newFollowers / deepDive.linkedin.growth.ironwood.newFollowers) * 100}%` }}></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">{deepDive.linkedin.growth.competitor.posts} Posts Published</p>
              </div>
            </div>
          </div>

          {/* Demographics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center">
                <Building2 className="w-3 h-3 mr-1" /> Top Industries
              </h4>
              <div className="space-y-3">
                {deepDive.linkedin.demographics.industry.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-xs text-slate-700">{item.name}</span>
                    <span className="text-xs font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center">
                <Briefcase className="w-3 h-3 mr-1" /> Audience Seniority
              </h4>
              <div className="space-y-3">
                {deepDive.linkedin.demographics.seniority.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-xs text-slate-700">{item.name}</span>
                    <span className="text-xs font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Meta Algorithmic Discovery Engine */}
        <div className="glass-panel p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <Globe className="w-5 h-5 text-blue-500 mr-2" /> Meta Discovery Engine
            </h3>
            <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-2 py-1 rounded border border-purple-200">ALGORITHMIC REACH</span>
          </div>

          {/* Brand Performance */}
          <div className="space-y-5 flex-grow">
            {deepDive.meta.algorithmicReach.map((brand, idx) => (
              <div key={idx} className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{brand.brand}</h4>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center mt-0.5">
                      <TrendingUp className="w-3 h-3 text-green-500 mr-1" /> {brand.growth} Views
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-mono font-bold text-blue-600">{brand.views}</div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest">Total Views</div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    <span>Follower Reach</span>
                    <span className="text-blue-600">Non-Follower Discovery ({brand.reach}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                    <div className="bg-slate-400 h-2" style={{ width: `${100 - brand.reach}%` }}></div>
                    <div className="bg-blue-500 h-2" style={{ width: `${brand.reach}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Format Efficiency */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <Camera className="w-5 h-5 text-pink-600 mr-2" /> Format Efficiency
            </h3>
          </div>
          
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Instagram Engagement by Format</h4>
            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden flex shadow-inner">
              {deepDive.meta.instagramEfficiency.map((format, idx) => (
                <div 
                  key={idx} 
                  className={`h-4 ${idx === 0 ? 'bg-pink-500' : idx === 1 ? 'bg-pink-400' : 'bg-pink-300'} flex items-center justify-center`}
                  style={{ width: `${format.percentage}%` }}
                >
                  {format.percentage > 10 && <span className="text-[8px] font-bold text-white px-1">{format.percentage}%</span>}
                </div>
              ))}
            </div>
            <div className="flex mt-3 justify-center space-x-6">
              {deepDive.meta.instagramEfficiency.map((format, idx) => (
                <div key={idx} className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${idx === 0 ? 'bg-pink-500' : idx === 1 ? 'bg-pink-400' : 'bg-pink-300'}`}></div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{format.format}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
            <h4 className="text-xs font-bold text-amber-800 uppercase tracking-widest flex items-center mb-2">
              <AlertTriangle className="w-4 h-4 mr-2" /> Format Inefficiency Detected
            </h4>
            <p className="text-sm text-amber-900 mb-2 leading-relaxed">
              {deepDive.meta.warnings.storyInefficiency}
            </p>
            <p className="text-sm font-bold text-amber-900">
              Recommendation: {deepDive.meta.warnings.reelsRecommendation}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
