import { useState } from 'react';
import { LayoutDashboard, Users, MapPin, Activity, Settings, Menu, X } from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'lead_radar', label: 'Lead Radar', icon: Users },
    { id: 'local_pr', label: 'Local & PR', icon: MapPin },
    { id: 'diagnostics', label: 'SEO Diagnostics', icon: Activity },
  ];

  return (
    <aside className="w-full xl:w-64 bg-surface border-b xl:border-b-0 xl:border-r border-border xl:h-screen flex flex-col xl:sticky xl:top-0 shrink-0 z-50">
      <div className="p-4 xl:p-6 border-b border-border flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-brandBlue flex items-center justify-center text-white font-bold text-xl">I</div>
          <h1 className="text-lg font-bold text-text-main tracking-tight">Ironwood SEO</h1>
        </div>
        <button className="xl:hidden text-text-main p-1" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      
      <div className={`${isOpen ? 'block' : 'hidden'} xl:flex flex-col flex-grow p-4 space-y-1`}>
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 ml-2 hidden xl:block">Dashboard</p>
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
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-brandBlue/10 text-brandBlue' : 'text-text-muted hover:bg-slate-50 hover:text-text-main'}`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </button>
          )
        })}
        <div className="mt-auto pt-4 border-t border-border xl:block hidden">
          <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:bg-slate-50 hover:text-text-main transition-colors">
            <Settings className="w-5 h-5 shrink-0" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
