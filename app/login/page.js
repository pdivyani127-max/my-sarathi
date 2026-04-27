"use client";
import { useLanguage } from "../context/LanguageContext";
import useTranslation from "../utils/useTranslation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "../components/BackButton";
import LanguageSelector from "../components/LanguageSelector";
import { findUser, findAdmin } from "../lib/firebaseHelpers";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { t } = useTranslation(lang);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem("savedUsername");
    const wasRemembered = localStorage.getItem("rememberMe") === "true";
    if (savedUsername && wasRemembered) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const getRoleType = () => {
    if (username.startsWith("_A")) return "admin";
    if (username.startsWith("_U")) return "user";
    return "unknown";
  };

  const handleLogin = async () => {
    setError("");
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setIsLoading(true);
    try {
      if (rememberMe) {
        localStorage.setItem("savedUsername", username);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("savedUsername");
        localStorage.removeItem("rememberMe");
      }

      const foundUser = await findUser(username, password);
      if (foundUser) {
        localStorage.setItem("role", "user");
        localStorage.setItem("loggedInUsername", username);
        router.push("/user");
        return;
      }

      const foundAdmin = await findAdmin(username, password);
      if (foundAdmin) {
        localStorage.setItem("role", "admin");
        localStorage.setItem("loggedInUsername", username);
        router.push("/admin");
        return;
      }

      setError(t.invalidCredentials || "❌ Invalid username or password.");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const roleType = getRoleType();

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center font-sora relative overflow-hidden bg-grid-pattern">
      <div className="orb bg-red-600 w-[500px] h-[500px] -top-[150px] -right-[100px]" />
      <div className="orb bg-blue-900 w-[400px] h-[400px] -bottom-[100px] -left-[100px]" />

      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed top-0 left-0 right-0 flex justify-between items-center py-4 px-6 z-50 border-b border-white/5 bg-[#050810]/60 backdrop-blur-[60px]">
        <div className="font-bold text-lg text-white tracking-widest">SARA<span className="text-red-500">THI</span></div>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <BackButton redirectTo="/" />
        </div>
      </motion.div>

      <motion.div initial={{ y: 40, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: "spring", damping: 24, stiffness: 300, delay: 0.1 }} className="relative z-10 w-full max-w-[440px] glass-panel rounded-[32px] py-11 px-10 shadow-[0_0_80px_rgba(220,38,38,0.1),0_24px_80px_rgba(0,0,0,0.6)]">
        <div className="flex justify-center mb-7">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600/20 to-red-600/5 border border-red-600/30 rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_24px_rgba(220,38,38,0.2)]">🛡️</div>
        </div>

        <h1 className="text-center text-2xl font-bold text-white tracking-wide mb-1.5">{t.login || "Secure Login"}</h1>
        <p className="text-center text-[13px] text-white/40 mb-9">Because Every Life Matters</p>

        <div className={`flex items-center gap-2 py-2 px-3.5 rounded-lg text-xs font-jetbrains mb-5 transition-all duration-300 ${roleType === "admin" ? "bg-red-600/10 border border-red-500/30 text-red-400" : roleType === "user" ? "bg-blue-500/10 border border-blue-500/30 text-blue-400" : "bg-white/5 border border-white/10 text-white/30"}`}>
          <div className={`w-1.5 h-1.5 rounded-full bg-current ${roleType === "admin" ? "animate-pulse" : ""}`} />
          {roleType === "admin" && "🛡️ Admin Access — Government Portal"}
          {roleType === "user" && "👤 Citizen Login"}
          {roleType === "unknown" && "Enter your username to continue"}
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-2">{t.username || "Username"}</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">👤</span>
            <input
              className={`w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pr-3.5 pl-11 text-sm font-sora text-white outline-none transition-all placeholder:text-white/20 focus:bg-white/10 ${roleType === "admin" ? "focus:border-red-500/50 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]" : roleType === "user" ? "focus:border-blue-500/50 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]" : "focus:border-white/30"}`}
              placeholder={t.username || "e.g. _U12345 or _A67890"}
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-2">{t.password || "Password"}</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              className={`w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pr-3.5 pl-11 text-sm font-sora text-white outline-none transition-all placeholder:text-white/20 focus:bg-white/10 ${roleType === "admin" ? "focus:border-red-500/50 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]" : roleType === "user" ? "focus:border-blue-500/50 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]" : "focus:border-white/30"}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                let value = e.target.value;
                if (username.startsWith("_U")) value = value.replace(/\D/g, "");
                setPassword(value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              autoComplete="new-password"
            />
            <button className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-base opacity-50 hover:opacity-100 transition-opacity p-0" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <p className={`mt-1.5 text-[11px] pl-1 font-jetbrains ${roleType === "admin" ? "text-red-400" : roleType === "user" ? "text-blue-400" : "text-white/30"}`}>
            {roleType === "admin" && "Admin: letters, numbers & symbols allowed"}
            {roleType === "user" && "User: numbers only"}
            {roleType === "unknown" && "Enter username first to see password rules"}
          </p>
        </div>

        <div className="flex items-center mb-5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 accent-red-600 cursor-pointer"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="text-xs text-white/40">Remember my username</span>
          </label>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2 bg-red-600/10 border border-red-600/30 rounded-xl py-2.5 px-3.5 text-[13px] text-red-400 mb-4">
              <span>⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 border-none rounded-xl text-[15px] font-bold font-sora cursor-pointer mt-2 transition-colors duration-150 tracking-wide outline-none ${roleType === "user" ? "bg-semantic-info text-white shadow-[0_4px_20px_rgba(59,130,246,0.35)]" : "bg-semantic-critical text-white shadow-[0_4px_20px_rgba(239,68,68,0.35)]"} disabled:opacity-60 disabled:cursor-not-allowed`}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin align-middle mr-2" />Verifying...</> : t.login || "Access Secure Terminal"}
        </motion.button>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <div className="text-[10px] uppercase tracking-widest text-text-muted">Unregistered?</div>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="text-center text-[13px] text-white/40">
          <a href="/register" className="text-white hover:text-red-400 no-underline font-bold transition-colors hover:underline">Request Access</a>
        </div>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 bg-semantic-critical/90 py-3 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-white z-50 backdrop-blur-md">
        <span className="animate-[blink_1.4s_infinite]">🚨</span> Emergency Helpline: <strong>112</strong>
      </div>
    </div>
  );
}