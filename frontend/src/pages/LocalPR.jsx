import { Search, Radio, Newspaper } from 'lucide-react';
import { YoutubeLogo } from '@phosphor-icons/react';
import Tooltip from '../components/Tooltip';

export default function LocalPR({ data, keyword }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-main tracking-tight">Local & PR</h2>
        <p className="text-sm text-text-muted mt-1">Competitor rankings, YouTube visibility, and local news tracking.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Competitor Intel */}
        <div className="surface-panel flex flex-col h-[500px]">
          <div className="bg-slate-50 border-b border-border p-5 flex justify-between items-center">
            <Tooltip text="Live Google Search ranking positions of competing websites for your target keyword. For example, a rank of #2 means they are the 2nd result on Google. Ironwood's SEO strategy aims to push these competitors down and take their spot.">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-widest flex items-center cursor-help">
                <Search className="text-brandBlue w-5 h-5 mr-2" /> 
                Local Competitor Matrix
              </h3>
            </Tooltip>
            <span className="text-xs bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full font-medium">Rankings for: {keyword}</span>
          </div>
          <div className="p-5 flex-1 overflow-y-auto space-y-3">
            {data.competitorIntel.map((comp, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border border-border flex justify-between items-center hover:shadow-md transition-shadow group">
                <div>
                  <div className="text-sm font-bold text-text-main group-hover:text-brandBlue transition-colors cursor-pointer">{comp.domain}</div>
                  <div className="text-xs text-text-muted mt-1 truncate max-w-[250px]">{comp.title}</div>
                </div>
                <div className="bg-slate-100 text-slate-700 font-black text-sm px-3 py-1.5 rounded-lg border border-border">
                  #{comp.position}
                </div>
              </div>
            ))}
            {data.competitorIntel.length === 0 && (
              <div className="text-center text-text-muted p-8">No competitors found.</div>
            )}
          </div>
        </div>

        {/* PR & Media */}
        <div className="surface-panel flex flex-col h-[500px]">
          <div className="bg-slate-50 border-b border-border p-5">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-widest flex items-center">
              <Radio className="text-brandOrange w-5 h-5 mr-2" /> 
              Media & PR Radar
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* YouTube */}
            <div>
              <h4 className="text-xs font-bold text-text-muted uppercase flex items-center mb-3">
                <YoutubeLogo weight="fill" className="text-red-600 w-5 h-5 mr-1.5" /> 
                Top Video Content
              </h4>
              <div className="space-y-3">
                {data.socialIntel.youtubeFeed.map((vid, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg border border-border">
                    <div className="bg-red-100 p-2 rounded-md shrink-0">
                      <YoutubeLogo weight="fill" className="text-red-600 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-main leading-tight">{vid.title}</p>
                      <p className="text-xs text-text-muted mt-1">{vid.channel} &bull; {vid.views.toLocaleString()} views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-border" />

            {/* News */}
            <div>
              <h4 className="text-xs font-bold text-text-muted uppercase flex items-center mb-3">
                <Newspaper className="text-blue-600 w-4 h-4 mr-1.5" /> 
                Local News & Press
              </h4>
              <div className="space-y-4">
                {data.socialIntel.newsFeed.map((news, idx) => (
                  <div key={idx} className="border-l-4 border-brandBlue pl-4 py-1">
                    <p className="text-sm font-semibold text-text-main leading-snug">{news.title}</p>
                    <p className="text-xs text-text-muted mt-1.5">{news.date}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
