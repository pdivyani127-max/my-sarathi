"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-bg-base font-sora text-white relative overflow-hidden flex flex-col items-center justify-center bg-grid-pattern-blue">
      {/* Orbs */}
      <div className="orb bg-blue-800 w-[400px] h-[400px] -top-[100px] -left-[100px]" />
      <div className="orb bg-red-600 w-[300px] h-[300px] -bottom-[80px] -right-[80px]" />
      <div className="orb bg-cyan-600 w-[200px] h-[200px] top-1/2 left-[60%]" />

      {/* Alert strip */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-600 to-red-700 py-2 px-5 text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2.5 text-white z-50 shadow-lg shadow-red-600/20 border-b border-red-500/30">
        <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse" />
        Emergency Helpline Active — Dial 112 for Immediate Assistance
        <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center py-10 px-6 max-w-2xl w-full flex flex-col items-center mt-8">
        <div className={`inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase text-blue-300 mb-7 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
          National Emergency Response Platform
        </div>

        <h1 className={`font-dm text-[clamp(42px,8vw,72px)] font-normal leading-tight mb-2 text-white tracking-tight transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          SARATHI<br />
          <span className="text-red-500 italic">Saves Lives</span>
        </h1>

        <p className={`text-[15px] text-slate-400 mb-12 font-light tracking-wide transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Because Every Life Matters — Rapid Response. Real Relief.
        </p>

        {/* Stats */}
        <div className={`flex justify-center gap-8 mb-12 flex-wrap transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="text-center">
            <span className="text-2xl font-bold text-white block">29+</span>
            <span className="text-[11px] text-slate-500 uppercase tracking-widest">States Covered</span>
          </div>
          <div className="w-px bg-white/10 hidden sm:block" />
          <div className="text-center">
            <span className="text-2xl font-bold text-white block">24/7</span>
            <span className="text-[11px] text-slate-500 uppercase tracking-widest">Active Support</span>
          </div>
          <div className="w-px bg-white/10 hidden sm:block" />
          <div className="text-center">
            <span className="text-2xl font-bold text-white block">112</span>
            <span className="text-[11px] text-slate-500 uppercase tracking-widest">Emergency Line</span>
          </div>
        </div>

        {/* Buttons */}
        <div className={`flex gap-3 justify-center w-full flex-wrap mb-12 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button className="bg-blue-600 hover:bg-blue-700 text-white border-none py-3.5 px-8 rounded-lg font-sora text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,99,235,0.4)] tracking-wide" onClick={() => router.push("/register")}>
            Register Now
          </button>
          <button className="bg-transparent hover:bg-white/5 text-white border border-white/20 py-3.5 px-8 rounded-lg font-sora text-sm font-semibold cursor-pointer transition-all hover:border-white/40 hover:-translate-y-0.5" onClick={() => router.push("/login")}>
            Login
          </button>
          <button className="bg-gradient-to-br from-red-600 to-red-700 text-white border-none py-3.5 px-7 rounded-lg font-sora text-sm font-bold cursor-pointer transition-all flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(220,38,38,0.5)] tracking-wide" onClick={() => router.push("/emergency")}>
            <span>⚠</span> SOS
          </button>
        </div>

        {/* Feature cards */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="glass-card rounded-xl p-4 text-left transition-all duration-200">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-2.5 bg-blue-600/15">🛡️</div>
            <div className="text-[13px] font-semibold text-slate-200 mb-1">Verified Admins</div>
            <div className="text-[11px] text-slate-500 leading-relaxed">Gov ID & Aadhaar verified officials only</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-left transition-all duration-200">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-2.5 bg-red-600/15">🚨</div>
            <div className="text-[13px] font-semibold text-slate-200 mb-1">Crisis Response</div>
            <div className="text-[11px] text-slate-500 leading-relaxed">Real-time disaster & emergency alerts</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-left transition-all duration-200">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-2.5 bg-emerald-600/15">🌐</div>
            <div className="text-[13px] font-semibold text-slate-200 mb-1">Multi-language</div>
            <div className="text-[11px] text-slate-500 leading-relaxed">Support in all Indian languages</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 text-[11px] text-slate-600 tracking-[0.06em] uppercase text-center w-full">
        Govt. of India Initiative · SARATHI Emergency Platform
      </div>
    </div>
  );
}
