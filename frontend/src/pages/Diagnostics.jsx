import { ActivitySquare, BrainCircuit, CheckCircle2 } from 'lucide-react';
import Tooltip from '../components/Tooltip';
import StatusBadge from '../components/StatusBadge';

export default function Diagnostics({ data }) {
  const seoScore = parseInt(data.seoIntel.domainAuthority) || 0;
  const speedScore = parseInt(data.seoIntel.trustFlow) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-main tracking-tight">SEO Diagnostics</h2>
        <p className="text-sm text-text-muted mt-1">Deep technical site audits and Artificial Intelligence recommendation probability.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Technical SEO Score */}
        <div className="surface-panel">
          <div className="bg-slate-50 border-b border-border p-5">
            <Tooltip text="Measures the structural strength of your website and inbound link profile. Domain Authority and Trust Flow are scored out of 100 and determine your ability to rank on Google.">
              <div className="flex justify-between items-center w-full">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-widest flex items-center cursor-help">
                  <ActivitySquare className="text-brandBlue w-5 h-5 mr-2" /> 
                  Backlink & Authority Audit
                </h3>
                <StatusBadge type="real" />
              </div>
            </Tooltip>
          </div>
          <div className="p-6 space-y-8">
            <div>
                <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-sm font-bold text-text-main block">Domain Authority</span>
                      <span className="text-xs text-text-muted">Overall backlink strength and authority.</span>
                    </div>
                    <span className="text-3xl font-black text-brandGreen">{seoScore}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-brandGreen h-2.5 rounded-full transition-all duration-1000" style={{width: `${seoScore}%`}}></div>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-sm font-bold text-text-main block">Trust Flow</span>
                      <span className="text-xs text-text-muted">Quality and relevance of inbound links.</span>
                    </div>
                    <span className="text-3xl font-black text-brandBlue">{speedScore}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-brandBlue h-2.5 rounded-full transition-all duration-1000" style={{width: `${speedScore}%`}}></div>
                </div>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-start space-x-3">
              <CheckCircle2 className="text-green-600 w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-green-800">Site is fully indexed</p>
                <p className="text-xs text-green-700 mt-1">No critical robots.txt or sitemap.xml issues detected during the last scan.</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Matrix */}
        <div className="surface-panel flex flex-col">
          <div className="bg-slate-50 border-b border-border p-5">
            <Tooltip text="Answer Engine Optimization (AEO). The dashboard queries AI models daily to see if they recommend your brand for queries like 'custom stairs calgary'. A high score means the AI recommends you.">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-widest flex items-center cursor-help">
                <BrainCircuit className="text-purple-600 w-5 h-5 mr-2" /> 
                AEO Recommendation Matrix
                <StatusBadge type="live" />
              </h3>
            </Tooltip>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <p className="text-sm text-text-muted mb-6">Live tracking of generative AI systems. If a user asks ChatGPT 'who builds custom stairs in Calgary?', this is the probability it recommends Ironwood Stair & Rail.</p>
            
            <div className="space-y-4 flex-1">
              {data.aeoIntel.llmPerformance.map((llm, idx) => {
                const scoreStr = llm.recommendationProbability;
                const scoreNum = parseInt(scoreStr) || 0;
                const isHigh = scoreNum >= 80;
                const isMedium = scoreNum >= 50 && scoreNum < 80;
                
                let textColor = 'text-slate-600';
                let bgColor = 'bg-slate-100';
                if (isHigh) { textColor = 'text-green-700'; bgColor = 'bg-green-100'; }
                else if (isMedium) { textColor = 'text-yellow-700'; bgColor = 'bg-yellow-100'; }

                return (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-border bg-white shadow-sm hover:shadow transition-shadow">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-lg ${bgColor}`}>
                        <BrainCircuit className={`w-5 h-5 ${textColor}`} />
                      </div>
                      <span className="font-bold text-text-main">{llm.model}</span>
                    </div>
                    <span className={`text-2xl font-black ${textColor}`}>{scoreStr}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
