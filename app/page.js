"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TiltCard, SpatialLayer } from "./components/TiltCard";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, z: -100, y: 30 },
  show: { opacity: 1, z: 0, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
};

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-bg-base font-sora text-white relative overflow-hidden flex flex-col items-center justify-center perspective-1000">
      {/* 3D Deep Background Plane */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: mounted ? 1 : 0 }} transition={{ duration: 2 }} className="absolute inset-0 pointer-events-none z-0 preserve-3d">
        <div className="absolute inset-0 bg-grid-pattern-blue opacity-20 mix-blend-screen" style={{ transform: 'translateZ(-200px) scale(1.3)' }} />
        
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }} className="absolute inset-0">
           <div className="absolute w-[800px] h-[800px] bg-semantic-info/20 rounded-full blur-[140px] -top-[200px] -left-[200px]" style={{ transform: 'translateZ(-300px)' }} />
           <div className="absolute w-[900px] h-[900px] bg-semantic-critical/15 rounded-full blur-[150px] bottom-[-200px] right-[-100px]" style={{ transform: 'translateZ(-150px)' }} />
           <div className="absolute w-[600px] h-[600px] bg-[#8b5cf6]/10 rounded-full blur-[160px] top-[40%] left-[50%] -translate-x-1/2" style={{ transform: 'translateZ(-400px)' }} />
        </motion.div>
        
        {/* Shadow vignette layer */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#020617_80%)] z-10" />
      </motion.div>

      {/* Alert strip - Top Z Axis */}
      <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.2 }} className="fixed top-0 left-0 right-0 bg-gradient-to-r from-red-600/60 via-red-700/60 to-red-600/60 backdrop-blur-[40px] py-3 px-6 text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase flex items-center justify-center gap-3 text-white z-[100] border-b border-red-500/20 shadow-[0_10px_40px_rgba(220,38,38,0.2)]">
        <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_12px_#ffffff,0_0_24px_#ef4444]" />
        National Emergency Command 
        <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_12px_#ffffff,0_0_24px_#ef4444]" />
      </motion.div>

      {/* Main content - Middle Z Axis */}
      <motion.div variants={container} initial="hidden" animate={mounted ? "show" : "hidden"} className="relative z-10 w-full max-w-6xl px-6 pt-32 pb-16 mx-auto flex flex-col items-center preserve-3d">
        
        <SpatialLayer depth={20} className="mb-10">
           <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full text-[10px] font-bold tracking-[0.25em] uppercase text-text-secondary shadow-inner backdrop-blur-2xl">
             <div className="w-1.5 h-1.5 bg-semantic-info rounded-full shadow-[0_0_10px_#3b82f6] animate-pulse" />
             Gov-Tech Crisis Response
           </div>
        </SpatialLayer>

        <SpatialLayer depth={60} className="mb-6 w-full text-center">
           <h1 className="font-extrabold text-[clamp(44px,10vw,96px)] leading-[1.05] tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 drop-shadow-2xl">
             SARATHI<br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-semantic-critical to-[#881337] italic pr-3 drop-shadow-[0_0_40px_rgba(220,38,38,0.5)]">Saves Lives</span>
           </h1>
        </SpatialLayer>

        <SpatialLayer depth={10} className="mb-14">
           <p className="text-[15px] md:text-[18px] text-text-secondary font-medium tracking-wide text-center max-w-2xl leading-relaxed">
             Because Every Life Matters — A highly secure, low-latency spatial framework engineered for instantaneous national emergency response.
           </p>
        </SpatialLayer>

        {/* Spatial Action Buttons */}
        <SpatialLayer depth={40} className="flex gap-5 justify-center w-full flex-wrap mb-20">
          <TiltCard multiplier={10}>
             <button className="bg-semantic-info text-white border border-transparent py-4 px-10 rounded-full text-[14px] md:text-[15px] font-bold cursor-pointer shadow-[0_15px_40px_rgba(59,130,246,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)] transition-all hover:bg-blue-400 group" onClick={() => router.push("/register")}>
               <SpatialLayer depth={20} className="inline-block group-active:scale-95 transition-transform">Register Device</SpatialLayer>
             </button>
          </TiltCard>
          <TiltCard multiplier={10}>
             <button className="bg-white/5 backdrop-blur-[60px] text-white border border-white/20 py-4 px-10 rounded-full text-[14px] md:text-[15px] font-bold cursor-pointer shadow-[0_15px_40px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.05)] transition-colors hover:bg-white/10 hover:border-white/30 group" onClick={() => router.push("/login")}>
               <SpatialLayer depth={20} className="inline-block group-active:scale-95 transition-transform">Access Portal</SpatialLayer>
             </button>
          </TiltCard>
        </SpatialLayer>

        {/* 3D Cinematic Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 w-full preserve-3d z-20">
          
          <TiltCard className="md:col-span-4" multiplier={8}>
            <div className="w-full h-full glass-panel rounded-[40px] p-10 relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border border-white/10">
               <div className="absolute -top-32 -right-32 w-80 h-80 bg-semantic-critical/20 rounded-full blur-[80px] transition-transform group-hover:scale-110 group-hover:bg-semantic-critical/30 duration-1000" />
               <SpatialLayer depth={30} className="w-16 h-16 rounded-[24px] flex items-center justify-center text-[28px] mb-8 bg-black/40 border border-white/10 shadow-2xl backdrop-blur-xl">🚨</SpatialLayer>
               <SpatialLayer depth={50} className="text-[28px] md:text-[36px] font-bold text-white mb-4 tracking-tight drop-shadow-xl">Crisis Response Network</SpatialLayer>
               <SpatialLayer depth={20} className="text-[15px] text-text-secondary leading-relaxed font-medium max-w-md">Real-time localized disaster alerts pushed directly through encrypted WebSockets with zero-latency synchronization globally.</SpatialLayer>
            </div>
          </TiltCard>

          <div className="md:col-span-2 flex flex-col gap-6 preserve-3d">
             <TiltCard className="flex-1" multiplier={12}>
               <div className="w-full h-full glass-panel rounded-[40px] p-8 text-center flex flex-col justify-center items-center group relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border border-white/10 text-white">
                  <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-semantic-info/20 rounded-full blur-[60px]" />
                  <SpatialLayer depth={40} className="text-[52px] font-black tracking-tighter drop-shadow-2xl">29+</SpatialLayer>
                  <SpatialLayer depth={20} className="text-[11px] text-text-secondary uppercase tracking-[0.3em] font-bold mt-2">States Covered</SpatialLayer>
               </div>
             </TiltCard>
             <TiltCard className="flex-1" multiplier={12}>
               <div className="w-full h-full glass-panel rounded-[40px] p-8 text-center flex flex-col justify-center items-center group relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border border-white/10 text-white">
                  <div className="absolute -top-20 -left-20 w-48 h-48 bg-semantic-warning/20 rounded-full blur-[60px]" />
                  <SpatialLayer depth={40} className="text-[52px] font-black tracking-tighter drop-shadow-2xl">24/7</SpatialLayer>
                  <SpatialLayer depth={20} className="text-[11px] text-text-secondary uppercase tracking-[0.3em] font-bold mt-2">Active Uptime</SpatialLayer>
               </div>
             </TiltCard>
          </div>

          <TiltCard className="md:col-span-3" multiplier={8}>
            <div className="w-full h-full glass-panel rounded-[40px] p-10 relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border border-white/10 text-white group">
               <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-semantic-safe/20 rounded-full blur-[60px] transition-transform group-hover:scale-125 duration-1000" />
               <SpatialLayer depth={30} className="w-16 h-16 rounded-[24px] flex items-center justify-center text-[28px] mb-8 bg-black/40 border border-white/10 shadow-2xl backdrop-blur-xl">🛡️</SpatialLayer>
               <SpatialLayer depth={50} className="text-[24px] md:text-[28px] font-bold mb-3 tracking-tight drop-shadow-xl">Verified Protocol</SpatialLayer>
               <SpatialLayer depth={20} className="text-[15px] text-text-secondary leading-relaxed font-medium">End-to-end cryptographic Gov ID verification ensuring broadcasts are strictly authenticated and official.</SpatialLayer>
            </div>
          </TiltCard>

          <TiltCard className="md:col-span-3 h-full" multiplier={6}>
            <div className="w-full h-full bg-gradient-to-br from-[#180205] to-semantic-critical/20 rounded-[40px] p-10 flex flex-col justify-center overflow-hidden shadow-[0_40px_80px_-15px_rgba(220,38,38,0.3)] border border-semantic-critical/30 cursor-pointer group" onClick={() => router.push("/emergency")}>
               <SpatialLayer depth={60} className="flex justify-between items-center w-full">
                 <div className="flex-1">
                    <div className="text-[28px] font-bold text-white mb-2 tracking-tight group-hover:text-red-300 transition-colors">Immediate Assistance</div>
                    <div className="text-[15px] text-white/50 font-medium max-w-[200px]">Bypass local restrictions and launch the secure SOS terminal.</div>
                 </div>
                 <div className="w-20 h-20 rounded-[24px] shrink-0 bg-red-600 shadow-[0_15px_40px_rgba(220,38,38,0.6),inset_0_2px_4px_rgba(255,255,255,0.4)] flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-500">
                    <span className="text-3xl drop-shadow-xl">🚨</span>
                 </div>
               </SpatialLayer>
            </div>
          </TiltCard>
        </div>

      </motion.div>

      <SpatialLayer depth={0} className="absolute bottom-8 text-[10px] text-text-muted font-bold tracking-[0.3em] uppercase text-center w-full z-10 pointer-events-none">
        Govt. of India Initiative · SARATHI V3
      </SpatialLayer>
    </div>
  );
}
