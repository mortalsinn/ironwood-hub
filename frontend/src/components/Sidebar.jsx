import { LayoutDashboard, Users, MapPin, Activity, Settings } from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'lead_radar', label: 'Lead Radar', icon: Users },
    { id: 'local_pr', label: 'Local & PR', icon: MapPin },
    { id: 'diagnostics', label: 'SEO Diagnostics', icon: Activity },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-border h-screen flex flex-col sticky top-0 shrink-0">
      <div className="p-6 border-b border-border flex items-center space-x-3">
        <div className="w-8 h-8 rounded bg-brandBlue flex items-center justify-center text-white font-bold text-xl">I</div>
        <h1 className="text-lg font-bold text-text-main tracking-tight">Ironwood SEO</h1>
      </div>
      
      <div className="p-4 flex-grow space-y-1">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 ml-2">Dashboard</p>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-brandBlue/10 text-brandBlue' : 'text-text-muted hover:bg-slate-50 hover:text-text-main'}`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>

      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:bg-slate-50 hover:text-text-main transition-colors">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
