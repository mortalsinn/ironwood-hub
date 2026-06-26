import { useState } from 'react';
import { LayoutDashboard, Users, MapPin, Activity, Settings, Menu, X, Hexagon, Share2 } from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'lead_radar', label: 'Lead Radar', icon: Users },
    { id: 'local_pr', label: 'Local & PR', icon: MapPin },
    { id: 'social_engagement', label: 'Social Engagement', icon: Share2 },
    { id: 'diagnostics', label: 'SEO Diagnostics', icon: Activity },
  ];

  return (
    <aside className="w-full xl:w-64 glass-panel border-y-0 border-l-0 rounded-none xl:rounded-r-2xl xl:h-screen flex flex-col xl:sticky xl:top-0 shrink-0 z-50">
      <div className="p-4 xl:p-6 border-b border-slate-200 flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brandGold/10 rounded-full blur-3xl"></div>
        <div className="flex items-center space-x-3 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-brandGold/20 border border-brandGold/50 flex items-center justify-center text-brandGold shadow-sm">
            <Hexagon className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-widest uppercase">Ironwood<span className="text-brandGold">SEO</span></h1>
        </div>
        <button className="xl:hidden text-slate-500 p-1 relative z-10" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      
      <div className={`${isOpen ? 'block' : 'hidden'} xl:flex flex-col flex-grow p-4 space-y-2`}>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-2 hidden xl:block">Command Module</p>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden ${isActive ? 'text-slate-900 bg-brandGold/10 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brandGold"></div>}
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-brandGold' : ''}`} />
              <span className="tracking-wide">{item.label}</span>
            </button>
          )
        })}
        <div className="mt-auto pt-4 border-t border-slate-200 xl:block hidden">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Settings className="w-5 h-5 shrink-0" />
            <span className="tracking-wide">Settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
