"use client";
import useTranslation from "../utils/useTranslation";
import { validStates } from "../utils/states";
import { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import LanguageSelector from "../components/LanguageSelector";
import { db } from "../lib/firebase";
import { ref, set, onValue, remove } from "firebase/database";
import { getUsers } from "../lib/firebaseHelpers";

const disasterOptions = [
  { value: "fire",       label: "🔥 Fire",       color: "#ef4444", bgClass: "bg-red-500", borderClass: "border-red-500" },
  { value: "flood",      label: "🌊 Flood",      color: "#3b82f6", bgClass: "bg-blue-500", borderClass: "border-blue-500" },
  { value: "earthquake", label: "🏚️ Earthquake", color: "#f97316", bgClass: "bg-orange-500", borderClass: "border-orange-500" },
  { value: "gasleak",    label: "☁️ Gas Leak",   color: "#22c55e", bgClass: "bg-emerald-500", borderClass: "border-emerald-500" },
  { value: "chemical",   label: "⚗️ Chemical",   color: "#a855f7", bgClass: "bg-purple-500", borderClass: "border-purple-500" },
  { value: "cyclone",    label: "🌀 Cyclone",    color: "#6366f1", bgClass: "bg-indigo-500", borderClass: "border-indigo-500" },
  { value: "tsunami",    label: "🌏 Tsunami",    color: "#06b6d4", bgClass: "bg-cyan-500", borderClass: "border-cyan-500" },
  { value: "heatwave",   label: "☀️ Heatwave",  color: "#eab308", bgClass: "bg-yellow-500", borderClass: "border-yellow-500" },
  { value: "coldwave",   label: "❄️ Coldwave",   color: "#93c5fd", bgClass: "bg-blue-300", borderClass: "border-blue-300" },
  { value: "landslide",  label: "⛰️ Landslide", color: "#d97706", bgClass: "bg-amber-600", borderClass: "border-amber-600" },
  { value: "custom",     label: "✏️ Other...",   color: "#6b7280", bgClass: "bg-gray-500", borderClass: "border-gray-500" },
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
  const [showUsers, setShowUsers] = useState(false);
  const [customType, setCustomType] = useState("");
  const [alertActive, setAlertActive] = useState(false);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const allUsers = await getUsers();
        setUsers(allUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
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

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
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

  const selectedMeta = disasterOptions.find(d => d.value === type);

  return (
    <div className="min-h-screen bg-bg-base font-sora text-white pb-20 relative overflow-x-hidden bg-grid-pattern">
      <div className="orb bg-red-600/30 w-[500px] h-[500px] -top-[180px] -right-[120px]" />
      <div className="orb bg-blue-900/40 w-[450px] h-[450px] -bottom-[150px] -left-[100px]" />

      {/* Top bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between py-3.5 px-5 bg-bg-base/75 backdrop-blur-md border-b border-white/5">
        <div className="text-lg font-extrabold tracking-wide">SARA<span className="text-red-500">THI</span></div>
        <div className="flex items-center gap-2.5">
          <span className="font-jetbrains text-[10px] py-1 px-3 rounded-full bg-red-600/15 text-red-400 border border-red-500/30 tracking-wide">ADMIN</span>
          <LanguageSelector />
          <BackButton redirectTo="/" />
        </div>
      </div>

      <div className="w-full max-w-[560px] mx-auto px-4 py-7 relative z-10">
        {/* Header */}
        <div className="mb-7 animate-fade-up">
          <h1 className="text-2xl font-extrabold">Alert <span className="text-red-500">Control</span></h1>
          <p className="text-[13px] text-white/35 mt-1">Send emergency alerts to all users in real-time</p>
        </div>

        {/* Active alert banner */}
        {alertActive && (
          <div className="flex items-center justify-between bg-red-600/10 border border-red-500/35 rounded-2xl py-3.5 px-4 mb-6 animate-[fadeUp_0.5s_0.05s_ease_both]">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-[blink_0.8s_infinite]" />
              <div>
                <div className="text-sm font-semibold text-red-400">🚨 Alert is Live</div>
                <div className="text-[11px] text-red-400/60 mt-0.5">Users are receiving this alert now</div>
              </div>
            </div>
            <button className="py-2 px-4 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 text-[13px] font-semibold cursor-pointer transition-colors hover:bg-red-600/35 hover:text-white" onClick={stopAlert}>Stop Alert</button>
          </div>
        )}

        {/* Disaster type card */}
        <div className="glass-card rounded-[18px] p-6 mb-5 animate-[fadeUp_0.5s_0.05s_ease_both]">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-white/50 uppercase tracking-[1.5px] mb-4 after:content-[''] after:flex-1 after:h-px after:bg-white/5">
            Disaster Type 
          </div>
          <div className="grid grid-cols-3 gap-2 mb-1">
            {disasterOptions.map((d) => (
              <button
                key={d.value}
                className={`py-2.5 px-1.5 rounded-xl border text-[11px] font-medium font-sora cursor-pointer text-center transition-all duration-200 ${type === d.value ? `bg-[color-mix(in_srgb,${d.color}_15%,transparent)] border-[color-mix(in_srgb,${d.color}_100%,transparent)] text-white font-semibold shadow-[0_0_12px_color-mix(in_srgb,${d.color}_30%,transparent)]` : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'}`}
                style={type === d.value ? { border: `1px solid ${d.color}`, backgroundColor: `color-mix(in srgb, ${d.color} 15%, transparent)`, boxShadow: `0 0 12px color-mix(in srgb, ${d.color} 30%, transparent)` } : {}}
                onClick={() => setType(d.value)}
              >
                {d.label}
              </button>
            ))}
          </div>

          {type === "custom" && (
            <div className="mt-3">
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wide mb-2 mt-3">Custom Disaster Type</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3.5 text-sm font-sora text-white outline-none transition-all placeholder:text-white/20 focus:border-red-500/50 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)] focus:bg-white/10"
                placeholder="e.g. Building Collapse"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
              />
            </div>
          )}

          {type && type !== "custom" && selectedMeta && (
            <div
              className="inline-flex items-center gap-1.5 mt-3 py-1.5 px-3 rounded-lg text-xs font-semibold border"
              style={{
                backgroundColor: `color-mix(in srgb, ${selectedMeta.color} 12%, transparent)`,
                borderColor: `color-mix(in srgb, ${selectedMeta.color} 30%, transparent)`,
                color: selectedMeta.color,
              }}
            >
              {selectedMeta.label} selected
            </div>
          )}
        </div>

        {/* Message card */}
        <div className="glass-card rounded-[18px] p-6 mb-5 animate-[fadeUp_0.5s_0.1s_ease_both]">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-white/50 uppercase tracking-[1.5px] mb-4 after:content-[''] after:flex-1 after:h-px after:bg-white/5">
              Alert Message 
          </div>
          <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wide mb-2">Message to broadcast</label>
          <textarea
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3.5 text-sm font-sora text-white outline-none transition-all placeholder:text-white/20 focus:border-red-500/50 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)] focus:bg-white/10 resize-y min-h-[90px] leading-relaxed"
            placeholder="e.g. A fire has broken out near MG Road. Evacuate immediately and move to the nearest shelter."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="text-right text-[11px] text-white/25 mt-1 font-jetbrains">{message.length} / 200</div>
        </div>

        {/* State card */}
        <div className="glass-card rounded-[18px] p-6 mb-5 animate-[fadeUp_0.5s_0.15s_ease_both]">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-white/50 uppercase tracking-[1.5px] mb-4 after:content-[''] after:flex-1 after:h-px after:bg-white/5">
              Affected Region 
          </div>
          <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wide mb-2">Select State</label>
          <select
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3.5 text-sm font-sora text-white outline-none transition-all focus:border-red-500/50 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)] focus:bg-white/10 [&>option]:bg-slate-900"
            value={affectedState}
            onChange={(e) => setAffectedState(e.target.value)}
          >
            <option value="" disabled>{t.selectState || "Select state..."}</option>
            {validStates.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        {/* Send button */}
        <button className="w-full py-4 border-none rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white text-base font-bold font-sora cursor-pointer shadow-[0_4px_20px_rgba(220,38,38,0.35)] transition-all duration-150 tracking-wide mt-1 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(220,38,38,0.5)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_20px_rgba(220,38,38,0.35)] animate-[fadeUp_0.5s_0.2s_ease_both]" onClick={sendAlert} disabled={sending}>
          {sending ? <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin align-middle mr-2" />Sending Alert...</> : "🚨 Send Emergency Alert"}
        </button>

        {/* Vulnerable users */}
        {showUsers && (
          <div className="mt-9 animate-fade-up">
            <div className="flex items-center gap-2.5 text-base font-bold mb-4">
              Vulnerable Users
              <span className="font-jetbrains text-[11px] py-[3px] px-2.5 rounded-full bg-red-600/15 text-red-400 border border-red-500/30">{emergencyUsers.length} found</span>
            </div>

            {emergencyUsers.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl py-5 px-5 text-center text-sm text-white/30">No vulnerable users registered in the system.</div>
            ) : (
              emergencyUsers.map((u, i) => (
                <div key={i} className="bg-white/5 border border-white/10 border-l-[3px] border-l-red-500 rounded-xl py-[18px] px-4 mb-3 animate-fade-up transition-colors hover:border-red-500/50" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-base font-bold">{u.name || "Unknown User"}</div>
                    <div className="text-[11px] py-1 px-2.5 rounded-lg bg-red-600/10 text-red-400 border border-red-500/25 font-semibold">
                      {profileLabel[u.profile] || u.profile}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[13px] text-white/60 mb-1.5">
                    <span className="text-sm">📞</span>
                    <span>{u.phone || "Phone not available"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-white/60 mb-1.5">
                    <span className="text-sm">🚨</span>
                    <span>{u.emergencyContact || "Emergency contact not set"}</span>
                  </div>

                  {u.location && (
                    <>
                      <div className="font-jetbrains text-[11px] text-white/30 mt-1.5">
                        📍 {u.location.lat?.toFixed(5)}, {u.location.lng?.toFixed(5)}
                      </div>
                      <a
                        href={`https://www.google.com/maps?q=${u.location.lat},${u.location.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2.5 py-2 px-3.5 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold no-underline transition-colors hover:bg-blue-500/20 hover:text-blue-300"
                      >
                        🗺️ View on Google Maps
                      </a>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* SOS strip */}
      <div className="fixed bottom-0 left-0 right-0 bg-red-600/90 py-2.5 px-2.5 text-center text-[13px] font-semibold text-white tracking-wide z-50 backdrop-blur-md">
        <span className="animate-[blink_1.4s_infinite]">🚨</span> Emergency Helpline: <strong>112</strong> &nbsp;|&nbsp; Available 24×7
      </div>

      {toast && (
        <div className={`fixed bottom-14 left-1/2 -translate-x-1/2 py-3 px-5 rounded-xl text-sm font-semibold z-[100] backdrop-blur-xl whitespace-nowrap shadow-[0_8px_24px_rgba(0,0,0,0.3)] min-w-max animate-[toastIn_0.3s_ease] ${toast.type === "success" ? "bg-green-500/15 border border-green-500/30 text-green-400" : toast.type === "error" ? "bg-red-500/15 border border-red-500/30 text-red-400" : "bg-indigo-500/15 border border-indigo-500/30 text-indigo-300"}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
