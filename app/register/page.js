"use client";
import { useRouter } from "next/navigation";
import BackButton from "../components/BackButton";
import LanguageSelector from "../components/LanguageSelector";
import { motion } from "framer-motion";

export default function Register() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg-base font-inter flex flex-col md:flex-row relative overflow-hidden">
      
      {/* Top Navigation - Shared */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute top-0 left-0 right-0 flex justify-between items-center py-6 px-8 z-50 pointer-events-none">
        <div className="pointer-events-auto"><BackButton /></div>
        <div className="pointer-events-auto"><LanguageSelector /></div>
      </motion.div>

      {/* LEFT PANEL - Visual Illustration */}
      <div className="hidden md:flex md:w-[45%] lg:w-[50%] relative bg-[#02040a] flex-col justify-end p-12 overflow-hidden border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.5)] z-10">
        {/* Dynamic Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-grid-pattern-blue opacity-[0.08]" />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }} className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%]">
             <div className="absolute w-[600px] h-[600px] bg-semantic-info/20 rounded-full blur-[140px] top-[20%] left-[20%]" />
             <div className="absolute w-[500px] h-[500px] bg-accent-purple/20 rounded-full blur-[120px] bottom-[20%] right-[30%]" />
          </motion.div>
          {/* Subtle Network Nodes Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 mix-blend-screen">
             <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                   <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                      <path fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" d="M25,0 L50,14.4 L50,43.3 L25,57.7 L0,43.3 L0,14.4 Z" />
                   </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hexagons)" />
             </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-transparent to-transparent z-10" />
        </div>

        {/* Text Overlay */}
        <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="relative z-20 max-w-md">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-semantic-safe animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[11px] font-space font-bold uppercase tracking-widest text-slate-300">Secure Protocol</span>
          </div>
          <h2 className="font-space text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 tracking-tight drop-shadow-lg">
            Join the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-semantic-info to-accent-purple">Response Network</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed font-light">
            Empowering citizens and enabling administrators with zero-latency emergency broadcasting and spatial awareness.
          </p>
        </motion.div>
      </div>

      {/* RIGHT PANEL - Form Card */}
      <div className="flex-1 w-full flex items-center justify-center p-6 sm:p-12 relative bg-bg-base z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(225,29,72,0.05)_0%,transparent_50%)] pointer-events-none" />
        
        <motion.div initial={{ y: 40, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.1 }} className="relative z-10 w-full max-w-[480px]">
          
          <div className="text-center mb-10 md:text-left">
            <p className="text-[12px] font-space font-bold tracking-[0.2em] uppercase text-semantic-critical mb-3">Authentication</p>
            <h2 className="font-space text-4xl lg:text-5xl text-white font-bold leading-tight mb-3">Create Account</h2>
            <p className="text-slate-400 font-light">Select your registration profile to continue.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 mb-8">
            {/* USER CARD */}
            <div 
              className="group relative glass-panel rounded-2xl p-6 text-left cursor-pointer transition-all duration-400 hover:-translate-y-2 hover:border-semantic-info/40 overflow-hidden" 
              onClick={() => router.push("/register/user")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-semantic-info/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
              <div className="flex items-start gap-5 relative z-10">
                <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center text-2xl bg-semantic-info/10 border border-semantic-info/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-shadow duration-300">
                  <motion.span whileHover={{ scale: 1.1 }}>👤</motion.span>
                </div>
                <div>
                  <div className="text-xl font-space font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">Citizen Profile</div>
                  <div className="text-[13px] text-slate-400 leading-relaxed mb-4">
                    Access localized emergency services, report incidents securely, and receive real-time critical alerts.
                  </div>
                  <div className="flex items-center gap-2 text-[13px] font-space font-bold text-semantic-info transition-all duration-300 group-hover:gap-3">
                    Register as Citizen <span>→</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ADMIN CARD */}
            <div 
              className="group relative glass-panel rounded-2xl p-6 text-left cursor-pointer transition-all duration-400 hover:-translate-y-2 hover:border-semantic-critical/40 overflow-hidden" 
              onClick={() => router.push("/register/admin")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-semantic-critical/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
              <div className="flex items-start gap-5 relative z-10">
                <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center text-2xl bg-semantic-critical/10 border border-semantic-critical/20 shadow-[0_0_20px_rgba(225,29,72,0.1)] group-hover:shadow-[0_0_30px_rgba(225,29,72,0.3)] transition-shadow duration-300">
                  <motion.span whileHover={{ scale: 1.1 }}>🛡️</motion.span>
                </div>
                <div>
                  <div className="text-xl font-space font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">Admin Portal</div>
                  <div className="text-[13px] text-slate-400 leading-relaxed mb-4">
                    Government officials with valid Gov ID & Aadhaar authentication to manage emergency operations.
                  </div>
                  <div className="flex items-center gap-2 text-[13px] font-space font-bold text-semantic-critical transition-all duration-300 group-hover:gap-3">
                    Register as Admin <span>→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center md:text-left border-t border-white/5 pt-6 mt-4">
            <p className="text-[14px] text-slate-500">
              Already have an account?{" "}
              <span 
                className="text-white font-space font-bold cursor-pointer transition-colors hover:text-semantic-info hover:underline decoration-semantic-info/50 underline-offset-4"
                onClick={() => router.push("/login")}
              >
                Sign in to Dashboard
              </span>
            </p>
          </div>

          {/* Trust Indicator */}
          <div className="mt-12 flex items-center justify-center md:justify-start gap-3 opacity-50 pointer-events-none">
            <span className="text-xl">🔒</span>
            <span className="text-[11px] font-space tracking-widest uppercase font-bold text-white">256-bit Gov-Grade Encryption</span>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
