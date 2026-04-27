"use client";
import { useRouter } from "next/navigation";
import BackButton from "../components/BackButton";
import LanguageSelector from "../components/LanguageSelector";
import { motion } from "framer-motion";

export default function Register() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg-base font-sora flex items-center justify-center p-6 relative overflow-hidden bg-grid-pattern-blue">
      <div className="orb bg-blue-800 w-[350px] h-[350px] -top-[100px] -left-[100px]" />
      <div className="orb bg-red-600 w-[250px] h-[250px] -bottom-[80px] -right-[80px]" />

      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed top-0 left-0 right-0 flex justify-between items-center py-4 px-6 z-50 border-b border-white/5 bg-[#050810]/60 backdrop-blur-[60px]">
        <BackButton />
        <LanguageSelector />
      </motion.div>

      <motion.div initial={{ y: 40, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: "spring", damping: 24, stiffness: 300, delay: 0.1 }} className="relative z-10 w-full max-w-[480px] text-center mt-12">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-slate-400 mb-3">Create your account</p>
        <h2 className="font-dm text-[38px] text-white leading-tight mb-2">Join Sarathi</h2>
        <p className="text-sm font-light text-slate-400 mb-10">Select the type of account to register</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* USER CARD */}
          <div 
            className="group relative bg-white/5 border border-white/10 rounded-2xl p-7 text-left cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-[0_12px_40px_rgba(37,99,235,0.15)] overflow-hidden" 
            onClick={() => router.push("/register/user")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
            <div className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 bg-blue-600/15 border border-blue-600/20">
              👤
            </div>
            <div className="relative z-10 text-lg font-bold text-white mb-1.5">Citizen</div>
            <div className="relative z-10 text-xs text-slate-400 leading-relaxed mb-5">
              Register as a citizen to access emergency services, report incidents, and get real-time alerts.
            </div>
            <div className="relative z-10 flex items-center gap-1.5 text-xs font-semibold text-blue-400 transition-all duration-200 group-hover:gap-2.5">
              Register as User <span>→</span>
            </div>
          </div>

          {/* ADMIN CARD */}
          <div 
            className="group relative bg-white/5 border border-white/10 rounded-2xl p-7 text-left cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-[0_12px_40px_rgba(220,38,38,0.15)] overflow-hidden" 
            onClick={() => router.push("/register/admin")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
            <div className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 bg-red-600/15 border border-red-600/20">
              🛡️
            </div>
            <div className="relative z-10 text-lg font-bold text-white mb-1.5">Admin</div>
            <div className="relative z-10 text-xs text-slate-400 leading-relaxed mb-5">
              Government officials with valid Gov ID & Aadhaar can register to manage emergency operations.
            </div>
            <div className="relative z-10 flex items-center gap-1.5 text-xs font-semibold text-red-400 transition-all duration-200 group-hover:gap-2.5">
              Register as Admin <span>→</span>
            </div>
          </div>
        </div>

        <p className="text-[13px] text-slate-500 mt-2">
          Already have an account?{" "}
          <span 
            className="text-blue-400 font-semibold cursor-pointer transition-colors hover:text-blue-300"
            onClick={() => router.push("/login")}
          >
            Login here
          </span>
        </p>
      </motion.div>
    </div>
  );
}
