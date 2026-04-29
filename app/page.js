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
    <div className="min-h-screen bg-bg-base font-inter text-white relative overflow-hidden flex flex-col items-center justify-center perspective-1000">
      {/* Premium 3D Background Plane */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: mounted ? 1 : 0 }} transition={{ duration: 2 }} className="absolute inset-0 pointer-events-none z-0 preserve-3d">
        <div className="absolute inset-0 bg-grid-pattern-blue opacity-[0.15] mix-blend-screen" style={{ transform: 'translateZ(-200px) scale(1.3)' }} />
        
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 180, repeat: Infinity, ease: "linear" }} className="absolute inset-0">
           <div className="absolute w-[900px] h-[900px] bg-semantic-info/10 rounded-full blur-[150px] -top-[200px] -left-[200px]" style={{ transform: 'translateZ(-300px)' }} />
           <div className="absolute w-[1000px] h-[1000px] bg-semantic-critical/10 rounded-full blur-[160px] bottom-[-200px] right-[-100px]" style={{ transform: 'translateZ(-150px)' }} />
           <div className="absolute w-[800px] h-[800px] bg-accent-purple/10 rounded-full blur-[180px] top-[30%] left-[50%] -translate-x-1/2" style={{ transform: 'translateZ(-400px)' }} />
        </motion.div>
        
        {/* Shadow vignette layer */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#030712_85%)] z-10" />
      </motion.div>

      {/* Animated Alert strip - Top Z Axis */}
      <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.2 }} className="fixed top-0 left-0 right-0 bg-gradient-to-r from-semantic-critical/80 via-[#9f1239]/80 to-semantic-critical/80 backdrop-blur-[40px] py-3.5 px-6 font-space font-bold tracking-[0.3em] uppercase flex items-center justify-center gap-4 text-white z-[100] border-b border-white/10 shadow-[0_10px_40px_rgba(225,29,72,0.3)]">
        <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_12px_#ffffff,0_0_24px_#e11d48] animate-pulse" />
        <span className="text-[14px] md:text-[16px] [text-shadow:0_2px_0_#7f1d1d,0_4px_0_#450a0a,0_6px_10px_rgba(0,0,0,0.8)] drop-shadow-md">Alert Console</span>
        <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_12px_#ffffff,0_0_24px_#e11d48] animate-pulse" />
      </motion.div>

      {/* Main content - Middle Z Axis */}
      <motion.div variants={container} initial="hidden" animate={mounted ? "show" : "hidden"} className="relative z-10 w-full max-w-6xl px-6 pt-32 pb-16 mx-auto flex flex-col items-center preserve-3d">
        
        <SpatialLayer depth={20} className="mb-10">
           <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full text-[11px] font-space font-bold tracking-[0.25em] uppercase text-slate-300 shadow-inner backdrop-blur-2xl">
             <div className="w-1.5 h-1.5 bg-semantic-info rounded-full shadow-[0_0_10px_#06b6d4] animate-pulse" />
             Gov-Tech Crisis Response
           </div>
        </SpatialLayer>

        <SpatialLayer depth={60} className="mb-6 w-full text-center">
           <h1 className="font-space font-extrabold leading-[1.05] tracking-tighter flex flex-col items-center">
             <span className="text-[clamp(44px,9vw,96px)] text-white uppercase tracking-tight [text-shadow:0_3px_0_#94a3b8,0_6px_0_#64748b,0_9px_0_#475569,0_15px_20px_rgba(0,0,0,0.8)] drop-shadow-2xl mb-1 pb-2">
               PROJECT SARATHI
             </span>
             <span className="text-[clamp(16px,3vw,28px)] text-transparent bg-clip-text bg-gradient-to-r from-semantic-critical to-red-400 font-inter font-black uppercase tracking-[0.2em] drop-shadow-[0_0_30px_rgba(225,29,72,0.8)] mt-2">
               Saves Lives, Because Every Life Matters
             </span>
           </h1>
        </SpatialLayer>

        <SpatialLayer depth={10} className="mb-14">
           <p className="text-[16px] md:text-[19px] text-slate-400 font-medium tracking-wide text-center max-w-2xl leading-relaxed">
             A highly secure, low-latency spatial framework engineered for instantaneous national emergency response.
           </p>
        </SpatialLayer>

        {/* Spatial Action Buttons */}
        <SpatialLayer depth={40} className="flex gap-6 justify-center w-full flex-wrap mb-24">
          <TiltCard multiplier={10}>
             <button className="relative overflow-hidden bg-gradient-to-r from-semantic-info to-blue-600 text-white border border-cyan-400/50 py-4 px-12 rounded-full text-[14px] font-space font-bold uppercase tracking-[0.15em] cursor-pointer shadow-[0_10px_30px_rgba(6,182,212,0.4),inset_0_1px_2px_rgba(255,255,255,0.5)] transition-all duration-300 hover:shadow-[0_15px_50px_rgba(6,182,212,0.7)] group hover:-translate-y-1" onClick={() => router.push("/register")}>
               <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.3))] pointer-events-none" />
               <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
               <SpatialLayer depth={20} className="inline-block group-active:scale-95 transition-transform relative z-10">REGISTER DEVICE</SpatialLayer>
             </button>
          </TiltCard>
          <TiltCard multiplier={10}>
             <button className="relative overflow-hidden bg-white/5 backdrop-blur-[40px] text-slate-300 border border-white/20 py-4 px-12 rounded-full text-[14px] font-space font-bold uppercase tracking-[0.15em] cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all duration-300 hover:bg-white/10 hover:border-white/40 hover:text-white hover:shadow-[0_15px_40px_rgba(255,255,255,0.15)] group hover:-translate-y-1" onClick={() => router.push("/login")}>
               <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
               <SpatialLayer depth={20} className="inline-block group-active:scale-95 transition-transform relative z-10">ACCESS PORTAL</SpatialLayer>
             </button>
          </TiltCard>
        </SpatialLayer>

        {/* Premium 3D Cinematic Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 w-full preserve-3d z-20">
          
          <TiltCard className="md:col-span-4" multiplier={8}>
            <div className="w-full h-full glass-panel rounded-[32px] p-10 relative overflow-hidden group">
               <div className="absolute -top-32 -right-32 w-80 h-80 bg-semantic-critical/20 rounded-full blur-[80px] transition-transform group-hover:scale-110 group-hover:bg-semantic-critical/30 duration-1000" />
               <SpatialLayer depth={30} className="w-16 h-16 rounded-[20px] flex items-center justify-center text-[28px] mb-8 bg-black/40 border border-white/10 shadow-2xl backdrop-blur-xl">
                 <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>🚨</motion.div>
               </SpatialLayer>
               <SpatialLayer depth={50} className="font-space text-[28px] md:text-[36px] font-bold text-white mb-4 tracking-tight drop-shadow-xl">Crisis Response Network</SpatialLayer>
               <SpatialLayer depth={20} className="text-[16px] text-slate-400 leading-relaxed font-medium max-w-md">Real-time localized disaster alerts pushed directly through encrypted WebSockets with zero-latency synchronization globally.</SpatialLayer>
            </div>
          </TiltCard>

          <div className="md:col-span-2 flex flex-col gap-6 preserve-3d">
             <TiltCard className="flex-1" multiplier={12}>
               <div className="w-full h-full glass-panel rounded-[32px] p-8 text-center flex flex-col justify-center items-center group relative overflow-hidden text-white">
                  <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-semantic-info/20 rounded-full blur-[60px] group-hover:scale-110 transition-transform duration-700" />
                  <SpatialLayer depth={40} className="font-space text-[56px] font-black tracking-tighter drop-shadow-2xl">29+</SpatialLayer>
                  <SpatialLayer depth={20} className="text-[12px] text-slate-400 uppercase tracking-[0.3em] font-bold mt-2">States Covered</SpatialLayer>
               </div>
             </TiltCard>
             <TiltCard className="flex-1" multiplier={12}>
               <div className="w-full h-full glass-panel rounded-[32px] p-8 text-center flex flex-col justify-center items-center group relative overflow-hidden text-white">
                  <div className="absolute -top-20 -left-20 w-48 h-48 bg-semantic-warning/20 rounded-full blur-[60px] group-hover:scale-110 transition-transform duration-700" />
                  <SpatialLayer depth={40} className="font-space text-[56px] font-black tracking-tighter drop-shadow-2xl">24/7</SpatialLayer>
                  <SpatialLayer depth={20} className="text-[12px] text-slate-400 uppercase tracking-[0.3em] font-bold mt-2">Active Uptime</SpatialLayer>
               </div>
             </TiltCard>
          </div>

          <TiltCard className="md:col-span-3" multiplier={8}>
            <div className="w-full h-full glass-panel rounded-[32px] p-10 relative overflow-hidden text-white group">
               <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-semantic-safe/20 rounded-full blur-[60px] transition-transform group-hover:scale-125 duration-1000" />
               <SpatialLayer depth={30} className="w-16 h-16 rounded-[20px] flex items-center justify-center text-[28px] mb-8 bg-black/40 border border-white/10 shadow-2xl backdrop-blur-xl">
                 <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}>🛡️</motion.div>
               </SpatialLayer>
               <SpatialLayer depth={50} className="font-space text-[24px] md:text-[30px] font-bold mb-3 tracking-tight drop-shadow-xl">Verified Protocol</SpatialLayer>
               <SpatialLayer depth={20} className="text-[16px] text-slate-400 leading-relaxed font-medium">End-to-end cryptographic Gov ID verification ensuring broadcasts are strictly authenticated and official.</SpatialLayer>
            </div>
          </TiltCard>

          <TiltCard className="md:col-span-3 h-full" multiplier={6}>
            <div className="w-full h-full bg-gradient-to-br from-[#1c050a] to-semantic-critical/20 rounded-[32px] p-10 flex flex-col justify-center overflow-hidden shadow-[0_40px_80px_-15px_rgba(225,29,72,0.25)] border border-semantic-critical/30 cursor-pointer group hover:border-semantic-critical/50 transition-colors" onClick={() => router.push("/emergency")}>
               <SpatialLayer depth={60} className="flex justify-between items-center w-full">
                 <div className="flex-1">
                    <div className="font-space text-[30px] font-bold text-white mb-2 tracking-tight group-hover:text-red-300 transition-colors">Immediate Assistance</div>
                    <div className="text-[16px] text-white/60 font-medium max-w-[220px]">Bypass local restrictions and launch the secure SOS terminal.</div>
                 </div>
                 <div className="w-24 h-24 rounded-[24px] shrink-0 bg-semantic-critical shadow-[0_15px_40px_rgba(225,29,72,0.6),inset_0_2px_4px_rgba(255,255,255,0.4)] flex items-center justify-center text-white font-bold group-hover:scale-110 group-hover:shadow-[0_20px_50px_rgba(225,29,72,0.8),inset_0_2px_4px_rgba(255,255,255,0.6)] transition-all duration-500">
                    <span className="text-4xl drop-shadow-xl">🚨</span>
                 </div>
               </SpatialLayer>
            </div>
          </TiltCard>
        </div>

      </motion.div>

      <SpatialLayer depth={0} className="absolute bottom-8 text-[11px] text-slate-500 font-bold tracking-[0.3em] uppercase text-center w-full z-10 pointer-events-none">
        Govt. of India Initiative · SARATHI V3
      </SpatialLayer>
    </div>
  );
}
