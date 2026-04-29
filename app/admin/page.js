"use client";
import useTranslation from "../utils/useTranslation";
import { validStates } from "../utils/states";
import { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import LanguageSelector from "../components/LanguageSelector";
import { db } from "../lib/firebase";
import { ref, set, onValue, remove } from "firebase/database";
import { getUsers } from "../lib/firebaseHelpers";
import { motion, AnimatePresence } from "framer-motion";
import { SkeletonCard } from "../components/Skeleton";
import { TiltCard, SpatialLayer } from "../components/TiltCard";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const disasterOptions = [
  { value: "fire",       label: "🔥 Fire",       color: "#ef4444" },
  { value: "flood",      label: "🌊 Flood",      color: "#3b82f6" },
  { value: "earthquake", label: "🏚️ Earthquake", color: "#f97316" },
  { value: "gasleak",    label: "☁️ Gas Leak",   color: "#22c55e" },
  { value: "chemical",   label: "⚗️ Chemical",   color: "#a855f7" },
  { value: "cyclone",    label: "🌀 Cyclone",    color: "#6366f1" },
  { value: "tsunami",    label: "🌏 Tsunami",    color: "#06b6d4" },
  { value: "heatwave",   label: "☀️ Heatwave",   color: "#eab308" },
  { value: "coldwave",   label: "❄️ Coldwave",   color: "#93c5fd" },
  { value: "landslide",  label: "⛰️ Landslide",  color: "#d97706" },
  { value: "custom",     label: "✏️ Other...",   color: "#6b7280" },
];

const profileLabel = {
  elderly: "👴 Elderly",
  physically_disabled: "♿ Disabled",
  blind: "👁️ Blind",
  deaf: "👂 Deaf",
};

export default function Admin() {
  const { t } = useTranslation();
  const [affectedState, setAffectedState] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [showUsers, setShowUsers] = useState(false);
  const [customType, setCustomType] = useState("");
  const [alertActive, setAlertActive] = useState(false);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoadingUsers(true);
        const allUsers = await getUsers();
        setUsers(allUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setIsLoadingUsers(false);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    const alertRef = ref(db, "activeAlert");
    const unsubscribe = onValue(alertRef, (snapshot) => {
      if (snapshot.exists()) {
        setAlertActive(true);
        setShowUsers(true);
      } else {
        setAlertActive(false);
        setShowUsers(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg, toastType = "success") => {
    setToast({ msg, type: toastType });
    setTimeout(() => setToast(null), 3500);
  };

  const sendAlert = async () => {
    if (!type || !message || !affectedState) {
      showToast("Please fill all fields including state.", "error");
      return;
    }
    const finalType = type === "custom" ? customType : type;
    setSending(true);
    try {
      await set(ref(db, "activeAlert"), {
        type: finalType,
        message,
        state: affectedState,
        timestamp: new Date().toISOString(),
      });
      setAlertActive(true);
      setShowUsers(true);
      showToast("🚨 Alert sent successfully!", "success");
    } catch (err) {
      showToast("Failed to send alert. Try again.", "error");
      console.error(err);
    }
    setSending(false);
  };

  const stopAlert = async () => {
    try {
      await remove(ref(db, "activeAlert"));
      setAlertActive(false);
      setShowUsers(false);
      setType("");
      setMessage("");
      setAffectedState("");
      setCustomType("");
      showToast("🛑 Alert stopped.", "info");
    } catch (err) {
      showToast("Failed to stop alert.", "error");
      console.error(err);
    }
  };

  const emergencyUsers = users.filter(u =>
    ["elderly", "physically_disabled", "blind", "deaf"].includes(u.profile)
  );

  return (
    <div className="min-h-screen bg-bg-base font-sora text-text-primary pb-24 relative overflow-x-hidden">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
        <div className="radial-glow glow-red -top-[150px] -right-[150px]" />
        <div className="radial-glow glow-blue -bottom-[200px] -left-[100px]" />
      </motion.div>

      {/* Top bar */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="sticky top-0 z-50 flex items-center justify-between py-4 px-6 glass-panel rounded-none">
        <div className="text-xl font-bold tracking-tight">SARA<span className="text-semantic-critical">THI</span></div>
        <div className="flex items-center gap-4">
          <span className="font-bold text-[10px] py-1.5 px-3 rounded-full bg-semantic-critical/20 text-semantic-critical tracking-widest uppercase hidden md:inline-block">Command Center</span>
          <LanguageSelector />
          <BackButton redirectTo="/" />
        </div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="w-full max-w-[800px] mx-auto px-4 py-8 relative z-10 preserve-3d">
        
        {/* Header */}
        <motion.div variants={item} className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Alert <span className="text-semantic-critical">Console</span></h1>
          <p className="text-[14px] text-text-secondary font-medium">Broadcast emergency alerts using the advanced spatial dashboard.</p>
        </motion.div>

        {/* Active alert banner */}
        <AnimatePresence>
          {alertActive && (
            <TiltCard multiplier={5} className="mb-8">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} className="elevated-card bg-[var(--color-semantic-critical)] overflow-hidden border border-red-500 rounded-[32px] p-6 relative group shadow-[0_20px_40px_-5px_rgba(220,38,38,0.5)]">
                <div className="absolute inset-0 bg-black/10 transition-opacity opacity-0 group-hover:opacity-100" />
                <SpatialLayer depth={40} className="flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-4">
                  <div className="flex items-start gap-4 text-white hover:translate-none">
                    <div className="w-4 h-4 mt-1 rounded-full bg-white shadow-[0_0_15px_#ffffff,0_0_30px_#ffffff] animate-pulse" />
                    <div>
                      <div className="text-xl font-bold tracking-wide drop-shadow-xl">🚨 Active Spatial Broadcast </div>
                      <div className="text-[13px] font-medium opacity-90 mt-1">Global grid transmitting...</div>
                    </div>
                  </div>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="py-3 px-8 rounded-2xl bg-black/40 border border-white/20 text-white text-sm font-bold cursor-pointer transition-colors hover:bg-black/60 shadow-2xl backdrop-blur-md" onClick={stopAlert}>Terminate Broadcast</motion.button>
                </SpatialLayer>
              </motion.div>
            </TiltCard>
          )}
        </AnimatePresence>

        {/* Bento Grid layout for configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full preserve-3d">
          
          {/* Disaster Target */}
          <TiltCard multiplier={5} className="md:col-span-2 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]">
            <motion.div variants={item} className="glass-panel w-full h-full rounded-[32px] p-8 border border-white/10 group">
              <SpatialLayer depth={20} className="flex items-center gap-3 text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-6 after:content-[''] after:flex-1 after:h-px after:bg-white/10">Disaster Class</SpatialLayer>
              <SpatialLayer depth={40} className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-3">
                {disasterOptions.map((d) => (
                  <motion.button
                    key={d.value}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    className={`py-3.5 rounded-2xl text-[12px] font-bold cursor-pointer text-center transition-all duration-300 shadow-md ${type === d.value ? 'text-white' : 'bg-white/5 border border-white/10 text-text-muted hover:bg-white/10 hover:text-white hover:border-white/20'}`}
                    style={type === d.value ? { border: `1px solid ${d.color}`, backgroundColor: `color-mix(in srgb, ${d.color} 25%, transparent)`, boxShadow: `0 10px 20px -5px color-mix(in srgb, ${d.color} 40%, transparent)` } : {}}
                    onClick={() => setType(d.value)}
                  >
                    {d.label}
                  </motion.button>
                ))}
              </SpatialLayer>

              <AnimatePresence>
                {type === "custom" && (
                  <SpatialLayer depth={50}>
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-5">
                      <input
                        className="w-full bg-black/40 border border-white/20 rounded-[20px] py-4 px-5 text-sm font-medium text-white outline-none transition-all placeholder:text-white/30 focus:border-white/50 focus:bg-white/10 shadow-inner"
                        placeholder="Specify threat type..."
                        value={customType}
                        onChange={(e) => setCustomType(e.target.value)}
                      />
                    </motion.div>
                  </SpatialLayer>
                )}
              </AnimatePresence>
            </motion.div>
          </TiltCard>

          {/* Location Target */}
          <TiltCard multiplier={5} className="md:col-span-1 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]">
            <motion.div variants={item} className="glass-panel w-full h-full rounded-[32px] p-8 flex flex-col justify-between border border-white/10 group">
              <SpatialLayer depth={20} className="flex items-center gap-3 text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-6 after:content-[''] after:flex-1 after:h-px after:bg-white/10">Region</SpatialLayer>
              <SpatialLayer depth={50}>
                <select
                  className="w-full bg-black/40 border border-white/20 rounded-[20px] py-4 px-5 mb-5 text-[15px] font-bold text-white outline-none transition-all focus:border-semantic-info/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.3)] shadow-inner"
                  value={affectedState}
                  onChange={(e) => setAffectedState(e.target.value)}
                >
                  <option value="" disabled className="bg-slate-900 text-slate-400">{t.selectState || "Select Scope..."}</option>
                  {validStates.map((state) => (
                    <option key={state} value={state} className="bg-slate-900 text-white py-2">{state}</option>
                  ))}
                </select>
              </SpatialLayer>
              
              <SpatialLayer depth={30} className="flex-1 flex flex-col items-center justify-center p-6 bg-black/20 rounded-[24px] border border-white/5 backdrop-blur-md">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2 tracking-widest">Audience Scope</span>
                <span className="text-[16px] font-extrabold text-center text-text-primary drop-shadow-md">{affectedState ? affectedState : "Pending"}</span>
              </SpatialLayer>
            </motion.div>
          </TiltCard>

          {/* Transmission Payload */}
          <motion.div variants={item} className="glass-panel rounded-3xl p-6 md:col-span-3">
            <div className="flex items-center gap-3 text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-4 after:content-[''] after:flex-1 after:h-px after:bg-white/10">Transmission Payload</div>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-sm font-medium text-white outline-none transition-all placeholder:text-white/30 focus:border-semantic-critical/50 focus:shadow-[0_0_15px_rgba(239,68,68,0.15)] focus:bg-white/10 resize-y min-h-[120px] leading-relaxed"
              placeholder="Detail the emergency protocol and immediate actions requested from citizens..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted"><div className="w-1.5 h-1.5 rounded-full bg-semantic-critical" /> Encrypted Broadcast</div>
              <div className="text-[11px] font-bold text-text-muted">{message.length} / 200 chars</div>
            </div>
          </motion.div>

        </div>

        {/* Send button */}
        <motion.button 
          variants={item}
          whileHover={{ scale: alertActive || sending ? 1 : 1.02 }} 
          whileTap={{ scale: alertActive || sending ? 1 : 0.98 }}
          className="w-full py-5 border-none rounded-2xl bg-semantic-critical text-white text-base font-bold cursor-pointer shadow-[0_4px_30px_rgba(239,68,68,0.3)] transition-colors hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3" 
          onClick={sendAlert} 
          disabled={sending || alertActive}
        >
          {sending ? <><span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Broadcasting...</> : alertActive ? "Broadcast Active" : "🚨 Transmit Emergency Alert"}
        </motion.button>

        {/* Vulnerable users */}
        <AnimatePresence>
          {showUsers && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mt-12">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-xl font-bold">Vulnerable Sub-targets</h2>
                  <p className="text-[13px] text-text-secondary mt-1">Users marked with medical priority within radius.</p>
                </div>
                <div className="font-jetbrains text-[12px] font-bold py-1.5 px-3 rounded-full bg-semantic-critical/20 text-semantic-critical border border-semantic-critical/30">{isLoadingUsers ? "..." : emergencyUsers.length} MATCHES</div>
              </div>

              {isLoadingUsers ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              ) : emergencyUsers.length === 0 ? (
                <div className="glass-panel border-dashed rounded-2xl py-8 text-center text-sm font-medium text-text-muted">No high-priority profiles identified in active range.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {emergencyUsers.map((u, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.02, y: -4 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                      className="elevated-card rounded-2xl p-5 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 left-0 bottom-0 w-1 bg-semantic-critical opacity-80" />
                      <div className="flex justify-between items-start mb-4 pl-2">
                        <div className="text-base font-bold text-text-primary">{u.name || "Unknown"}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest py-1.5 px-2.5 rounded-lg bg-white/10 text-white">
                          {profileLabel[u.profile] || u.profile}
                        </div>
                      </div>

                      <div className="pl-2 space-y-2 mb-4">
                        <div className="flex items-center gap-3 text-sm font-medium text-text-secondary">
                          <span className="opacity-50">📞</span> {u.phone || "No signal"}
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium text-text-secondary">
                          <span className="opacity-50">👥</span> {u.emergency1 ? `${u.emergency1}${u.emergency2 ? `, ${u.emergency2}` : ""}` : "No contact linked"}
                        </div>
                        {u.location && (
                          <div className="flex items-center gap-3 text-xs font-jetbrains font-bold text-text-muted">
                            <span className="opacity-50 text-sm">📍</span> {u.location.lat?.toFixed(4)}, {u.location.lng?.toFixed(4)}
                          </div>
                        )}
                      </div>

                      {u.location && (
                        <div className="mt-4 border border-white/10 rounded-xl overflow-hidden relative group bg-black/20">
                          <iframe
                            width="100%"
                            height="150"
                            frameBorder="0"
                            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(110%) sepia(20%) opacity(0.8)' }}
                            src={`https://maps.google.com/maps?q=${u.location.lat},${u.location.lng}&z=14&output=embed`}
                            allowFullScreen
                            title="Location Map"
                            className="pointer-events-none transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                          <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
                            <a
                              href={`https://www.google.com/maps?q=${u.location.lat},${u.location.lng}`}
                              target="_blank"
                              rel="noreferrer"
                              className="pointer-events-auto py-2 px-5 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white shadow-2xl transition-all hover:bg-semantic-info/90 hover:border-semantic-info hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:-translate-y-0.5 flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-semantic-critical shadow-[0_0_8px_#ef4444] animate-pulse" />
                              Open Live Map
                            </a>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 20, x: "-50%" }} className={`fixed bottom-10 left-1/2 py-3.5 px-6 rounded-full text-sm font-bold z-[100] backdrop-blur-xl shadow-2xl min-w-max ${toast.type === "success" ? "glass-panel text-semantic-safe border-semantic-safe/30" : toast.type === "error" ? "glass-panel text-semantic-critical border-semantic-critical/30" : "glass-panel text-white border-white/30"}`}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
