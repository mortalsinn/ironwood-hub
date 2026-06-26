import { TrendingUp, MapPin, Clock, ShieldCheck, ShieldAlert, Star } from 'lucide-react';

export default function KPICards({ data }) {
  const isSecure = data.threatIntel.status === "SECURE";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Velocity */}
        <div className="glass-panel p-4 rounded-xl border-t border-t-cyberCyan flex justify-between items-center group cursor-default hover:bg-slate-800/80 transition shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]">
            <div>
                <p className="text-cyberCyan/70 text-[10px] font-bold uppercase tracking-widest">Brand Velocity</p>
                <h3 className="text-3xl font-black text-white mt-1 font-mono tracking-tighter text-shadow-glow">{data.brandVelocity}</h3>
            </div>
            <TrendingUp className="w-10 h-10 text-cyberCyan/30 group-hover:text-cyberCyan group-hover:animate-pulse transition" />
        </div>
        
        {/* Google Maps */}
        <div className="glass-panel p-4 rounded-xl border-t border-t-yellow-400 flex justify-between items-center group hover:bg-slate-800/80 transition shadow-[0_0_15px_rgba(250,204,21,0.15)] hover:shadow-[0_0_25px_rgba(250,204,21,0.3)]">
            <div>
                <p className="text-yellow-400/70 text-[10px] font-bold uppercase tracking-widest">Google Maps Intel</p>
                <div className="flex items-end space-x-2 mt-1">
                    <h3 className="text-3xl font-bold text-white font-mono">{data.localIntel.googleBusiness.rating}</h3>
                    <Star className="w-5 h-5 text-yellow-400 mb-1 fill-yellow-400 group-hover:animate-spin-slow" />
                </div>
                <p className="text-[10px] text-yellow-400/50 mt-1 font-mono">{data.localIntel.googleBusiness.totalReviews} Reviews</p>
            </div>
            <MapPin className="w-10 h-10 text-yellow-400/30 group-hover:text-yellow-400 transition" />
        </div>

        {/* Domain Age */}
        <div className="glass-panel p-4 rounded-xl border-t border-t-cyberPurple hover:bg-slate-800/80 transition flex justify-between items-center group shadow-[0_0_15px_rgba(139,92,246,0.15)] hover:shadow-[0_0_25px_rgba(139,92,246,0.3)]">
            <div>
                <p className="text-cyberPurple/70 text-[10px] font-bold uppercase tracking-widest">Domain Maturity</p>
                <h3 className="text-xl font-bold text-white leading-tight mt-2 font-mono">{data.threatIntel.domainMaturity}</h3>
            </div>
            <Clock className="w-10 h-10 text-cyberPurple/30 group-hover:text-cyberPurple transition" />
        </div>

        {/* SSL */}
        <div className="glass-panel p-4 rounded-xl border-t border-t-brandGreen flex justify-between items-center hover:bg-slate-800/80 transition group shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]">
            <div>
                <p className="text-brandGreen/70 text-[10px] font-bold uppercase tracking-widest">SSL Threat Intel</p>
                <h3 className={`text-2xl font-bold mt-2 flex items-center font-mono ${isSecure ? 'text-brandGreen text-shadow-glow' : 'text-red-500 animate-pulse'}`}>
                    {isSecure ? <ShieldCheck className="w-6 h-6 mr-2" /> : <ShieldAlert className="w-6 h-6 mr-2" />}
                    {data.threatIntel.status}
                </h3>
            </div>
            <div className="text-right">
                <p className="text-2xl font-mono text-white group-hover:text-brandGreen transition">{data.threatIntel.sslDaysRemaining}</p>
                <p className="text-[10px] text-brandGreen/50 font-mono">Days Left</p>
            </div>
        </div>
    </div>
  );
}
