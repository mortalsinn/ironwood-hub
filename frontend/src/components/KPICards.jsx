import { TrendingUp, MapPin, Clock, ShieldCheck, ShieldAlert, Star } from 'lucide-react';

export default function KPICards({ data }) {
  const isSecure = data.threatIntel.status === "SECURE";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Velocity */}
        <div className="glass-panel p-4 rounded-xl border-t-2 border-t-brandBlue flex justify-between items-center group cursor-default hover:bg-slate-50 transition shadow-sm hover:shadow-md">
            <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Brand Velocity</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1 font-mono tracking-tighter">{data.brandVelocity}</h3>
            </div>
            <TrendingUp className="w-10 h-10 text-brandBlue/30 group-hover:text-brandBlue transition" />
        </div>
        
        {/* Google Maps */}
        <div className="glass-panel p-4 rounded-xl border-t-2 border-t-brandGold flex justify-between items-center group hover:bg-slate-50 transition shadow-sm hover:shadow-md">
            <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Google Maps Intel</p>
                <div className="flex items-end space-x-2 mt-1">
                    <h3 className="text-3xl font-bold text-slate-900 font-mono">{data.localIntel.googleBusiness.rating}</h3>
                    <Star className="w-5 h-5 text-brandGold mb-1 fill-brandGold" />
                </div>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">{data.localIntel.googleBusiness.totalReviews} Reviews</p>
            </div>
            <MapPin className="w-10 h-10 text-brandGold/30 group-hover:text-brandGold transition" />
        </div>

        {/* Domain Age */}
        <div className="glass-panel p-4 rounded-xl border-t-2 border-t-purple-500 hover:bg-slate-50 transition flex justify-between items-center group shadow-sm hover:shadow-md">
            <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Domain Maturity</p>
                <h3 className="text-xl font-bold text-slate-900 leading-tight mt-2 font-mono">{data.threatIntel.domainMaturity}</h3>
            </div>
            <Clock className="w-10 h-10 text-purple-500/30 group-hover:text-purple-500 transition" />
        </div>

        {/* SSL */}
        <div className="glass-panel p-4 rounded-xl border-t-2 border-t-brandGreen flex justify-between items-center hover:bg-slate-50 transition group shadow-sm hover:shadow-md">
            <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">SSL Threat Intel</p>
                <h3 className={`text-2xl font-bold mt-2 flex items-center font-mono ${isSecure ? 'text-brandGreen' : 'text-red-500'}`}>
                    {isSecure ? <ShieldCheck className="w-6 h-6 mr-2" /> : <ShieldAlert className="w-6 h-6 mr-2" />}
                    {data.threatIntel.status}
                </h3>
            </div>
            <div className="text-right">
                <p className="text-2xl font-mono text-slate-900">{data.threatIntel.sslDaysRemaining}</p>
                <p className="text-[10px] text-slate-500 font-mono">Days Left</p>
            </div>
        </div>
    </div>
  );
}
