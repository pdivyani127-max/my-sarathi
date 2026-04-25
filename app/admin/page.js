// "use client";
// import useTranslation from "../utils/useTranslation";
// import { validStates } from "../utils/states";
// import { useState, useEffect } from "react";
// import BackButton from "../components/BackButton";
// import LanguageSelector from "../components/LanguageSelector";

// export default function Admin() {
//   const { t } = useTranslation();
//   const [affectedState, setAffectedState] = useState("");
//   const [type, setType] = useState("");
//   const [message, setMessage] = useState("");
//   const [users, setUsers] = useState([]);
//   const [showUsers, setShowUsers] = useState(false);
// const [customType, setCustomType] = useState("");

//   useEffect(() => {
//   const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
//   setUsers(storedUsers);
// }, []);

// const sendAlert = () => {
//   if (!type || !message || !affectedState) {
//     alert("Fill all fields including state");
//     return;
//   }

//   const finalType = type === "custom" ? customType : type;

// localStorage.setItem(
//   "alert",
//   JSON.stringify({ type: finalType, message })
// );

//   setShowUsers(true);

//   alert("Alert Sent!");
// };

// const stopAlert = () => {
//   // ❌ Remove alert
//   localStorage.removeItem("alert");

//   // 🔄 Reset UI
//   setShowUsers(false);
//   setType("");
//   setMessage("");
//   setAffectedState("");

//   alert("🛑 Alert Stopped");
// };

// const emergencyUsers = users.filter(
//   (u) =>
//     u.profile === "elderly" ||
//     u.profile === "physically_disabled" ||
//     u.profile === "blind" ||
//     u.profile === "deaf"
// );
  
     
//   return (
//     <div className="p-10">
//         <BackButton redirectTo="/" />
//         <LanguageSelector />
        

//       <>
//       {/* 🔥 Heading */}
//       <h1 className="text-2xl mb-6">{t.sendAlert}</h1>

//       {/* 🔥 Disaster Type */}
     
// <select
//   value={type}
//   onChange={(e) => setType(e.target.value)}
//   className="border p-2 mb-2 block w-full bg-white text-black"
// >
//   <option value="" disabled hidden>Select Disaster</option>

//   <option value="fire">Fire</option>
//   <option value="flood">Flood</option>
//   <option value="earthquake">Earthquake</option>
//   <option value="gasleak">Gas Leak</option>
//   <option value="chemical">Chemical</option>
//   <option value="cyclone">Cyclone</option>
//   <option value="tsunami">Tsunami</option>
//   <option value="heatwave">Heatwave</option>
//   <option value="coldwave">Coldwave</option>
//   <option value="landslide">Landslide</option>

//   <option value="custom">Other (Type manually)</option>
// </select>
      
// {/* ✅ Show input ONLY if custom selected */}
// {type === "custom" && (
//   <input
//     placeholder="Enter disaster type"
//     value={customType}
//     onChange={(e) => setCustomType(e.target.value)}
//     className="border p-2 mb-4 w-full"
//   />
// )}

//       {/* 🔥 Message */}
      
//       <input
//   value={message}   // ✅ ADD
//   placeholder={t.message}
//   className="border p-2 mb-4 block w-full"
//   onChange={(e) => setMessage(e.target.value)}
// />

//       {/* 🔥 State Dropdown */}
//       <select
//         className="border p-2 mb-4 block w-full bg-white text-black"
//         value={affectedState}
//         onChange={(e) => setAffectedState(e.target.value)}
//       >
//         <option value="" disabled>
//           {t.selectState}
//         </option>

//         {validStates.map((state) => (
//           <option key={state} value={state}>
//             {state}
//           </option>
//         ))}
//       </select>

//       {/* 🔥 Button */}
//       <button
//         onClick={sendAlert}
//         className="bg-red-500 text-white px-6 py-2"
//       >
//         {t.sendAlert}
//       </button>
//     </>

//     <button
//   onClick={stopAlert}
//   className="bg-gray-700 text-white px-6 py-2 mt-3"
// >
//   Stop Alert
// </button>

//       {showUsers && (
//   <>
//     <h3 className="mt-6 font-bold">🚨 Vulnerable Users</h3>

//     {emergencyUsers.length === 0 && (
//       <p>No vulnerable users found</p>
//     )}

//     {emergencyUsers.map((u, index) => (
      
//       <div
//   key={index}
//   className="bg-white border-l-4 border-red-500 p-4 mt-3 rounded-lg shadow"
// >
//   <h3 className="font-bold text-lg text-black">
//     {u.name || "Unknown User"}
//   </h3>

//   <p className="text-sm text-gray-600">
//     {u.profile}
//   </p>

//   <p className="text-sm text-black mt-1">
//     📞 {u.phone || "Not available"}
//   </p>

//   <p className="text-sm text-gray-700">
//     🚨 {u.emergencyContact || "Not available"}
//   </p>

//   {u.location && (
//     <>
//       <p className="text-xs text-gray-500 mt-2">
//         📍 {u.location.lat}, {u.location.lng}
//       </p>

//       <a
//         href={`https://www.google.com/maps?q=${u.location.lat},${u.location.lng}`}
//         target="_blank"
//         className="text-blue-500 underline text-sm"
//       >
//         View on Map
//       </a>
//     </>
//   )}
// </div> 

//     ))}
//   </>
// )}

//     </div>
//   );
// }

"use client";
import useTranslation from "../utils/useTranslation";
import { validStates } from "../utils/states";
import { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import LanguageSelector from "../components/LanguageSelector";

const disasterOptions = [
  { value: "fire",       label: "🔥 Fire",       color: "#ef4444" },
  { value: "flood",      label: "🌊 Flood",      color: "#3b82f6" },
  { value: "earthquake", label: "🏚️ Earthquake", color: "#f97316" },
  { value: "gasleak",    label: "☁️ Gas Leak",   color: "#22c55e" },
  { value: "chemical",   label: "⚗️ Chemical",   color: "#a855f7" },
  { value: "cyclone",    label: "🌀 Cyclone",    color: "#6366f1" },
  { value: "tsunami",    label: "🌏 Tsunami",    color: "#06b6d4" },
  { value: "heatwave",   label: "☀️ Heatwave",  color: "#eab308" },
  { value: "coldwave",   label: "❄️ Coldwave",   color: "#93c5fd" },
  { value: "landslide",  label: "⛰️ Landslide", color: "#d97706" },
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
  const [showUsers, setShowUsers] = useState(false);
  const [customType, setCustomType] = useState("");
  const [alertActive, setAlertActive] = useState(false);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
    const existing = localStorage.getItem("alert");
    if (existing) { setAlertActive(true); setShowUsers(true); }
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
    await new Promise(r => setTimeout(r, 800));
    localStorage.setItem("alert", JSON.stringify({ type: finalType, message }));
    setAlertActive(true);
    setShowUsers(true);
    setSending(false);
    showToast("🚨 Alert sent successfully!", "success");
  };

  const stopAlert = () => {
    localStorage.removeItem("alert");
    setAlertActive(false);
    setShowUsers(false);
    setType("");
    setMessage("");
    setAffectedState("");
    setCustomType("");
    showToast("🛑 Alert stopped.", "info");
  };

  const emergencyUsers = users.filter(u =>
    ["elderly", "physically_disabled", "blind", "deaf"].includes(u.profile)
  );

  const selectedMeta = disasterOptions.find(d => d.value === type);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .admin-root {
          min-height: 100vh;
          background: #050810;
          font-family: 'Sora', sans-serif;
          color: #fff;
          position: relative;
          overflow-x: hidden;
          padding-bottom: 80px;
        }
        .admin-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(220,38,38,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220,38,38,0.06) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }
        .orb1 {
          position: fixed; top: -180px; right: -120px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(220,38,38,0.25), transparent 70%);
          filter: blur(80px); pointer-events: none;
        }
        .orb2 {
          position: fixed; bottom: -150px; left: -100px;
          width: 450px; height: 450px; border-radius: 50%;
          background: radial-gradient(circle, rgba(30,58,138,0.3), transparent 70%);
          filter: blur(80px); pointer-events: none;
        }

        /* Top bar */
        .top-bar {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px;
          background: rgba(5,8,16,0.75);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .brand { font-size: 18px; font-weight: 800; letter-spacing: 1px; }
        .brand span { color: #ef4444; }
        .admin-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; padding: 4px 12px; border-radius: 20px;
          background: rgba(220,38,38,0.15); color: #f87171;
          border: 1px solid rgba(220,38,38,0.3); letter-spacing: 1px;
        }
        .top-right { display: flex; align-items: center; gap: 10px; }

        /* Content */
        .content { max-width: 560px; margin: 0 auto; padding: 28px 16px; }

        /* Page title */
        .page-header {
          margin-bottom: 28px;
          animation: fadeUp 0.5s ease both;
        }
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        .page-title { font-size: 26px; font-weight: 800; }
        .page-title span { color: #ef4444; }
        .page-sub { font-size: 13px; color: rgba(255,255,255,0.35); margin-top: 4px; }

        /* Active alert banner */
        .active-banner {
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.35);
          border-radius: 14px; padding: 14px 18px; margin-bottom: 24px;
          animation: fadeUp 0.5s 0.05s ease both;
        }
        .active-left { display: flex; align-items: center; gap: 10px; }
        .pulse-dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: #ef4444; box-shadow: 0 0 8px #ef4444;
          animation: blink 0.8s infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .active-text { font-size: 14px; font-weight: 600; color: #f87171; }
        .active-sub { font-size: 11px; color: rgba(248,113,113,0.6); margin-top: 2px; }

        .btn-stop {
          padding: 8px 18px; border-radius: 8px;
          background: rgba(220,38,38,0.2); border: 1px solid rgba(220,38,38,0.4);
          color: #f87171; font-size: 13px; font-weight: 600;
          font-family: 'Sora', sans-serif; cursor: pointer;
          transition: background 0.2s;
        }
        .btn-stop:hover { background: rgba(220,38,38,0.35); color: #fff; }

        /* Card */
        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px; padding: 24px;
          margin-bottom: 20px;
          animation: fadeUp 0.5s ease both;
        }
        .card-title {
          font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.5);
          text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
        }
        .card-title-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }

        /* Disaster type grid */
        .disaster-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
          margin-bottom: 4px;
        }
        .disaster-btn {
          padding: 10px 6px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.6);
          font-size: 11px; font-weight: 500; font-family: 'Sora', sans-serif;
          cursor: pointer; text-align: center;
          transition: all 0.18s;
        }
        .disaster-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }
        .disaster-btn.selected {
          border-color: var(--sel-color, #ef4444);
          background: color-mix(in srgb, var(--sel-color, #ef4444) 15%, transparent);
          color: #fff; font-weight: 600;
          box-shadow: 0 0 12px color-mix(in srgb, var(--sel-color, #ef4444) 30%, transparent);
        }

        /* Custom input */
        .custom-input-wrap { margin-top: 10px; }

        /* Input */
        .input-label {
          display: block; font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.4); text-transform: uppercase;
          letter-spacing: 1px; margin-bottom: 8px;
        }
        .sarathi-input, .sarathi-select, .sarathi-textarea {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
          padding: 12px 14px; font-size: 14px;
          font-family: 'Sora', sans-serif; color: #fff; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .sarathi-input::placeholder, .sarathi-textarea::placeholder { color: rgba(255,255,255,0.2); }
        .sarathi-input:focus, .sarathi-select:focus, .sarathi-textarea:focus {
          border-color: rgba(220,38,38,0.5);
          box-shadow: 0 0 0 3px rgba(220,38,38,0.08);
          background: rgba(255,255,255,0.06);
        }
        .sarathi-select option { background: #1a1a2e; color: #fff; }
        .sarathi-textarea { resize: vertical; min-height: 90px; line-height: 1.5; }

        /* Char counter */
        .char-count { text-align: right; font-size: 11px; color: rgba(255,255,255,0.25); margin-top: 5px; font-family: 'JetBrains Mono', monospace; }

        /* Preview tag */
        .preview-tag {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 10px; padding: 6px 12px; border-radius: 8px;
          font-size: 12px; font-weight: 600; border: 1px solid;
        }

        /* Send button */
        .btn-send {
          width: 100%; padding: 15px; border: none; border-radius: 12px;
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: #fff; font-size: 16px; font-weight: 700;
          font-family: 'Sora', sans-serif; cursor: pointer;
          box-shadow: 0 4px 20px rgba(220,38,38,0.35);
          transition: transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.5px; margin-top: 4px;
        }
        .btn-send:hover:not(:disabled) {
          transform: translateY(-2px); box-shadow: 0 8px 28px rgba(220,38,38,0.5);
        }
        .btn-send:active:not(:disabled) { transform: scale(0.98); }
        .btn-send:disabled { opacity: 0.6; cursor: not-allowed; }
        .spinner {
          display: inline-block; width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.7s linear infinite;
          vertical-align: middle; margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Users section */
        .users-section { animation: fadeUp 0.5s ease both; }
        .users-title {
          font-size: 16px; font-weight: 700; margin-bottom: 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .users-count {
          font-size: 11px; padding: 3px 10px; border-radius: 20px;
          background: rgba(220,38,38,0.15); color: #f87171;
          border: 1px solid rgba(220,38,38,0.3);
          font-family: 'JetBrains Mono', monospace;
        }
        .empty-msg {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 20px; text-align: center;
          color: rgba(255,255,255,0.3); font-size: 14px;
        }

        .user-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-left: 3px solid #ef4444;
          border-radius: 14px; padding: 18px 18px;
          margin-bottom: 12px;
          animation: fadeUp 0.4s ease both;
          transition: border-color 0.2s;
        }
        .user-card:hover { border-color: rgba(220,38,38,0.5); }
        .user-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
        .user-name { font-size: 16px; font-weight: 700; }
        .user-profile-badge {
          font-size: 11px; padding: 4px 10px; border-radius: 8px;
          background: rgba(220,38,38,0.12); color: #f87171;
          border: 1px solid rgba(220,38,38,0.25); font-weight: 600;
        }

        .user-info-row {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: rgba(255,255,255,0.6); margin-bottom: 7px;
        }
        .user-info-icon { font-size: 14px; }

        .map-link {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 10px; padding: 8px 14px; border-radius: 8px;
          background: rgba(59,130,246,0.12); border: 1px solid rgba(59,130,246,0.25);
          color: #60a5fa; font-size: 12px; font-weight: 600; text-decoration: none;
          transition: background 0.2s;
        }
        .map-link:hover { background: rgba(59,130,246,0.22); color: #93c5fd; }

        .coords {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 6px;
        }

        /* Toast */
        .toast {
          position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
          padding: 12px 22px; border-radius: 12px;
          font-size: 14px; font-weight: 600; z-index: 100;
          backdrop-filter: blur(12px); white-space: nowrap;
          animation: toastIn 0.3s ease;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        .toast.success { background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); color: #4ade80; }
        .toast.error   { background: rgba(220,38,38,0.15); border: 1px solid rgba(220,38,38,0.3); color: #f87171; }
        .toast.info    { background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); color: #a5b4fc; }

        /* SOS strip */
        .sos-strip {
          position: fixed; bottom: 0; left: 0; right: 0;
          background: rgba(220,38,38,0.9); padding: 10px;
          text-align: center; font-size: 13px; font-weight: 600; color: #fff;
          letter-spacing: 0.5px; z-index: 50; backdrop-filter: blur(8px);
        }
      `}</style>

      <div className="admin-root">
        <div className="orb1" /><div className="orb2" />

        {/* Top bar */}
        <div className="top-bar">
          <div className="brand">SARA<span>THI</span></div>
          <div className="top-right">
            <span className="admin-badge">ADMIN</span>
            <LanguageSelector />
            <BackButton redirectTo="/" />
          </div>
        </div>

        <div className="content">
          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">Alert <span>Control</span></h1>
            <p className="page-sub">Send emergency alerts to all users in real-time</p>
          </div>

          {/* Active alert banner */}
          {alertActive && (
            <div className="active-banner">
              <div className="active-left">
                <div className="pulse-dot" />
                <div>
                  <div className="active-text">🚨 Alert is Live</div>
                  <div className="active-sub">Users are receiving this alert now</div>
                </div>
              </div>
              <button className="btn-stop" onClick={stopAlert}>Stop Alert</button>
            </div>
          )}

          {/* Disaster type card */}
          <div className="card" style={{ animationDelay: "0.05s" }}>
            <div className="card-title">
              Disaster Type <div className="card-title-line" />
            </div>
            <div className="disaster-grid">
              {disasterOptions.map((d) => (
                <button
                  key={d.value}
                  className={`disaster-btn${type === d.value ? " selected" : ""}`}
                  style={{ "--sel-color": d.color }}
                  onClick={() => setType(d.value)}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Custom type input */}
            {type === "custom" && (
              <div className="custom-input-wrap">
                <label className="input-label" style={{ marginTop: 12 }}>Custom Disaster Type</label>
                <input
                  className="sarathi-input"
                  placeholder="e.g. Building Collapse"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                />
              </div>
            )}

            {/* Preview */}
            {type && type !== "custom" && (
              <div
                className="preview-tag"
                style={{
                  background: `color-mix(in srgb, ${selectedMeta?.color} 12%, transparent)`,
                  borderColor: `color-mix(in srgb, ${selectedMeta?.color} 30%, transparent)`,
                  color: selectedMeta?.color,
                }}
              >
                {selectedMeta?.label} selected
              </div>
            )}
          </div>

          {/* Message card */}
          <div className="card" style={{ animationDelay: "0.1s" }}>
            <div className="card-title">Alert Message <div className="card-title-line" /></div>
            <label className="input-label">Message to broadcast</label>
            <textarea
              className="sarathi-textarea"
              placeholder="e.g. A fire has broken out near MG Road. Evacuate immediately and move to the nearest shelter."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="char-count">{message.length} / 200</div>
          </div>

          {/* State card */}
          <div className="card" style={{ animationDelay: "0.15s" }}>
            <div className="card-title">Affected Region <div className="card-title-line" /></div>
            <label className="input-label">Select State</label>
            <select
              className="sarathi-select"
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
          <button className="btn-send" onClick={sendAlert} disabled={sending}>
            {sending ? <><span className="spinner" />Sending Alert...</> : "🚨 Send Emergency Alert"}
          </button>

          {/* Vulnerable users */}
          {showUsers && (
            <div className="users-section" style={{ marginTop: 36 }}>
              <div className="users-title">
                Vulnerable Users
                <span className="users-count">{emergencyUsers.length} found</span>
              </div>

              {emergencyUsers.length === 0 ? (
                <div className="empty-msg">No vulnerable users registered in the system.</div>
              ) : (
                emergencyUsers.map((u, i) => (
                  <div key={i} className="user-card" style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className="user-card-top">
                      <div className="user-name">{u.name || "Unknown User"}</div>
                      <div className="user-profile-badge">
                        {profileLabel[u.profile] || u.profile}
                      </div>
                    </div>

                    <div className="user-info-row">
                      <span className="user-info-icon">📞</span>
                      <span>{u.phone || "Phone not available"}</span>
                    </div>
                    <div className="user-info-row">
                      <span className="user-info-icon">🚨</span>
                      <span>{u.emergencyContact || "Emergency contact not set"}</span>
                    </div>

                    {u.location && (
                      <>
                        <div className="coords">
                          📍 {u.location.lat?.toFixed(5)}, {u.location.lng?.toFixed(5)}
                        </div>
                        <a
                          href={`https://www.google.com/maps?q=${u.location.lat},${u.location.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="map-link"
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
        <div className="sos-strip">
          🚨 Emergency Helpline: <strong>112</strong> &nbsp;|&nbsp; Available 24×7
        </div>

        {/* Toast */}
        {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
      </div>
    </>
  );
}
