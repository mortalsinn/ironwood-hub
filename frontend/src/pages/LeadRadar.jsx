import { RedditLogo } from '@phosphor-icons/react';
import StatusBadge from '../components/StatusBadge';

export default function LeadRadar({ data }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-text-main tracking-tight">Lead Radar</h2>
          <p className="text-sm text-text-muted mt-1">Real-time forum and social mentions across Calgary.</p>
        </div>
        <div className="flex items-center space-x-3 text-xs font-semibold">
          <span className="flex items-center text-brandGreen bg-brandGreen/10 px-2 py-1 rounded-md border border-brandGreen/20">
            <span className="w-2 h-2 rounded-full bg-brandGreen mr-1.5 animate-pulse"></span> HOT LEAD
          </span>
          <span className="flex items-center text-text-muted bg-slate-100 px-2 py-1 rounded-md border border-border">
            CHATTER
          </span>
        </div>
      </div>

      <div className="surface-panel overflow-hidden">
        <div className="bg-slate-50 border-b border-border p-4">
          <h3 className="text-sm font-bold text-text-main uppercase tracking-widest flex items-center">
            <RedditLogo weight="fill" className="text-[#ff4500] w-6 h-6 mr-2" /> 
            r/Calgary Activity Feed
                <StatusBadge type="live" />
          </h3>
        </div>
        <div className="divide-y divide-border">
          {data.socialIntel.redditFeed.map((post, idx) => {
            const isHot = post.intent === 'HOT LEAD';
            return (
              <a 
                key={idx} 
                href={post.url} 
                target="_blank" 
                rel="noreferrer" 
                className={`block p-5 hover:bg-slate-50 transition-colors ${isHot ? 'bg-brandGreen/5' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs font-medium text-text-muted flex items-center">
                    <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded mr-2">u/{post.author}</span>
                    {post.time}
                  </div>
                  {isHot && (
                    <span className="text-[10px] font-bold bg-brandGreen text-white px-2 py-0.5 rounded shadow-sm">
                      HOT LEAD
                    </span>
                  )}
                </div>
                <p className={`text-base leading-relaxed ${isHot ? 'text-text-main font-semibold' : 'text-slate-600'}`}>
                  {post.text}
                </p>
              </a>
            );
          })}
          {data.socialIntel.redditFeed.length === 0 && (
            <div className="p-8 text-center text-text-muted">No recent activity found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
