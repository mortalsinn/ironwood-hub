export default function StatusBadge({ type }) {
  if (type === 'live') {
    return (
      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center cursor-default border border-emerald-200 shrink-0 ml-auto">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
        Live
      </span>
    );
  }
  
  if (type === 'simulated') {
    return (
      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider cursor-default border border-amber-200 shrink-0 ml-auto">
        Simulated
      </span>
    );
  }

  return null;
}
