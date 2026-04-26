

"use client";
import { disasterConfig } from "../data/disasterConfig";
import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../context/LanguageContext";
import { db } from "../lib/firebase";
import { ref, onValue } from "firebase/database";

const translations = {
  en: {
    title: "Project Sarathi",
    guide: "Guide Me",
    waiting: "All Clear — No Active Alerts",
    disasterLibrary: "Disaster Safety Library",
    browseTitle: "Browse Safety Guides",
    browseSubtitle: "Tap any disaster to view safety tips",
    safetySteps: "Safety Steps",
    safetyTips: "Safety Tips",
    backToList: "← Back to Library",
    dismiss: "Dismiss Alert",
    enableSound: "Enable Sound 🔊",
    viewAlert: "View Active Alert",
    noAlert: "No Active Alert",
  },
  hi: {
    title: "परियोजना सारथी",
    guide: "मदद करें",
    waiting: "सब सुरक्षित — कोई अलर्ट नहीं",
    disasterLibrary: "आपदा सुरक्षा पुस्तकालय",
    browseTitle: "सुरक्षा गाइड देखें",
    browseSubtitle: "सुरक्षा सुझाव देखने के लिए टैप करें",
    safetySteps: "सुरक्षा कदम",
    safetyTips: "सुरक्षा सुझाव",
    backToList: "← वापस जाएं",
    dismiss: "अलर्ट बंद करें",
    enableSound: "ध्वनि चालू करें 🔊",
    viewAlert: "अलर्ट देखें",
    noAlert: "कोई अलर्ट नहीं",
  },
  mr: {
    title: "प्रोजेक्ट सारथी",
    guide: "मदत करा",
    waiting: "सर्व सुरक्षित — कोणताही अलर्ट नाही",
    disasterLibrary: "आपत्ती सुरक्षा ग्रंथालय",
    browseTitle: "सुरक्षा मार्गदर्शिका",
    browseSubtitle: "सुरक्षा सूचना पाहण्यासाठी टॅप करा",
    safetySteps: "सुरक्षा पावले",
    safetyTips: "सुरक्षा टिप्स",
    backToList: "← मागे जा",
    dismiss: "अलर्ट बंद करा",
    enableSound: "आवाज चालू करा 🔊",
    viewAlert: "अलर्ट पहा",
    noAlert: "कोणताही अलर्ट नाही",
  },
};

const disasterMeta = {
  FIRE:       { emoji: "🔥", color: "#ef4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.3)"   },
  FLOOD:      { emoji: "🌊", color: "#3b82f6", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.3)"  },
  CYCLONE:    { emoji: "🌀", color: "#6366f1", bg: "rgba(99,102,241,0.12)",  border: "rgba(99,102,241,0.3)"  },
  TSUNAMI:    { emoji: "🌏", color: "#06b6d4", bg: "rgba(6,182,212,0.12)",   border: "rgba(6,182,212,0.3)"   },
  EARTHQUAKE: { emoji: "🏚️", color: "#f97316", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.3)"  },
  HEATWAVE:   { emoji: "☀️", color: "#eab308", bg: "rgba(234,179,8,0.12)",   border: "rgba(234,179,8,0.3)"   },
  COLDWAVE:   { emoji: "❄️", color: "#93c5fd", bg: "rgba(147,197,253,0.12)", border: "rgba(147,197,253,0.3)" },
  LANDSLIDE:  { emoji: "⛰️", color: "#d97706", bg: "rgba(217,119,6,0.12)",  border: "rgba(217,119,6,0.3)"   },
  GAS:        { emoji: "☁️", color: "#22c55e", bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.3)"   },
};

const disasters = ["FIRE","FLOOD","CYCLONE","TSUNAMI","EARTHQUAKE","HEATWAVE","COLDWAVE","LANDSLIDE","GAS"];

export default function Home() {
  const [showAlertPage, setShowAlertPage] = useState(false);
  const [alert, setAlert] = useState(null);
  const { lang, setLang } = useLanguage();
  const [showGuidePage, setShowGuidePage] = useState(false);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [alertPulse, setAlertPulse] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Web Audio siren — no mp3 file needed
  const playSiren = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const playBeep = (startTime, freq1, freq2, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq1, startTime);
        osc.frequency.linearRampToValueAtTime(freq2, startTime + duration / 2);
        osc.frequency.linearRampToValueAtTime(freq1, startTime + duration);
        gain.gain.setValueAtTime(0.4, startTime);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      // 3 wail cycles
      for (let i = 0; i < 3; i++) {
        playBeep(ctx.currentTime + i * 0.8, 440, 880, 0.7);
      }
    } catch (e) {
      // Audio not supported — silent fail
    }
  };

  // ── Listen for alert from Firebase (was: localStorage + window storage event) ──
  useEffect(() => {
    setMounted(true);
    const alertRef = ref(db, "activeAlert");
    const unsubscribe = onValue(alertRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setAlert(data);
        setDismissed(false);   // new alert from admin → show it again
        setShowAlertPage(true);
      } else {
        // Admin stopped the alert
        setAlert(null);
        setShowAlertPage(false);
        setDismissed(false);
      }
    });
    return () => unsubscribe();
  }, []);



  // Alert pulse interval
  useEffect(() => {
    if (!alert) return;
    const id = setInterval(() => setAlertPulse(p => !p), 800);
    return () => clearInterval(id);
  }, [alert]);

  useEffect(() => {
    if (!alert || !showAlertPage || dismissed) return;

    const removeEmojis = (text) =>
      text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "");

    const speak = (text) => {
      return new Promise((resolve) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(removeEmojis(text));
        utterance.lang = lang === "hi" ? "hi-IN" : lang === "mr" ? "mr-IN" : "en-US";
        utterance.onend = resolve;
        utterance.onerror = resolve; // still continue on error
        window.speechSynthesis.speak(utterance);
      });
    };

    let stopped = false;

    // Alternating loop: siren → voice → siren → voice ...
    const loop = async () => {
      while (!stopped) {
        // 1. Play siren
        playSiren();
        await new Promise(r => setTimeout(r, 2500)); // wait for siren to finish
        if (stopped) break;

        // 2. Speak the alert
        const text = showGuidePage
          ? disasterMessage
          : `${type.toUpperCase()} alert. ${adminMessage}`;
        await speak(text);
        if (stopped) break;

        // 3. Short pause before repeating
        await new Promise(r => setTimeout(r, 2000));
      }
    };

    loop();

    return () => {
      stopped = true;
      window.speechSynthesis.cancel();
    };
  }, [alert, showAlertPage, showGuidePage, lang, dismissed]);

  const t = translations[lang] || translations.en;
  const type = alert?.type?.trim().toLowerCase() || "default";
  const config = disasterConfig[type] || disasterConfig.default;
  const title = config.title?.[lang] || config.title?.en;
  const steps = config.steps?.[lang] || config.steps?.en || ["Stay safe"];
  const color = config.color;
  const adminMessage = alert?.message || "";
  const disasterMessage = config.message?.[lang] || config.message?.en || "";

  const selectedConfig = disasterConfig[selectedDisaster?.toLowerCase()] || disasterConfig.default;
  const selectedTips = selectedConfig.tips?.[lang] || selectedConfig.tips?.en || [];
  const selectedMeta = disasterMeta[selectedDisaster] || { emoji: "⚠️", color: "#6b7280", bg: "rgba(107,114,128,0.12)", border: "rgba(107,114,128,0.3)" };

  const speakGuide = () => {
    const textToSpeak = showGuidePage
      ? disasterMessage
      : `${title || type.toUpperCase()}. ${adminMessage || ""}`;
    const speech = new SpeechSynthesisUtterance(textToSpeak);
    speech.lang = { hi:"hi-IN", mr:"mr-IN", bn:"bn-IN", ta:"ta-IN", te:"te-IN", kn:"kn-IN", ml:"ml-IN", gu:"gu-IN", pa:"pa-IN", or:"or-IN" }[lang] || "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  // ─── ALERT OVERLAY ───────────────────────────────────────────────
  if (alert && showAlertPage && !dismissed) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=JetBrains+Mono:wght@500&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          .alert-root {
            min-height: 100vh;
            background: ${color || "#dc2626"};
            font-family: 'Sora', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
          }
          .alert-root::before {
            content: '';
            position: fixed; inset: 0;
            background: repeating-linear-gradient(
              45deg,
              rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 20px,
              transparent 20px, transparent 40px
            );
            pointer-events: none;
          }
          .alert-flash {
            position: fixed; inset: 0;
            background: rgba(255,255,255,0.06);
            animation: flash 1s ease-in-out infinite;
            pointer-events: none;
          }
          @keyframes flash { 0%,100%{opacity:0} 50%{opacity:1} }

          .alert-top {
            position: fixed; top: 0; left: 0; right: 0;
            display: flex; justify-content: space-between; align-items: center;
            padding: 14px 20px;
            background: rgba(0,0,0,0.2);
            backdrop-filter: blur(8px);
            z-index: 10;
          }
          .alert-badge {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px; font-weight: 500;
            background: rgba(0,0,0,0.3); color: rgba(255,255,255,0.8);
            padding: 5px 12px; border-radius: 20px; letter-spacing: 1px;
          }

          .alert-body { z-index: 2; display: flex; flex-direction: column; align-items: center; padding: 100px 20px 80px; width: 100%; max-width: 480px; }

          .alert-icon { font-size: 72px; margin-bottom: 16px; animation: iconPulse 0.8s ease-in-out infinite alternate; }
          @keyframes iconPulse { from{transform:scale(1)} to{transform:scale(1.1)} }

          .alert-type {
            font-size: 52px; font-weight: 800; color: #fff;
            letter-spacing: 3px; text-shadow: 0 4px 20px rgba(0,0,0,0.3);
            margin-bottom: 8px; text-align: center;
          }
          .alert-sub {
            font-size: 13px; color: rgba(255,255,255,0.6);
            letter-spacing: 2px; text-transform: uppercase; margin-bottom: 28px;
          }

          .alert-message-box {
            width: 100%;
            background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.2);
            border-radius: 16px; padding: 18px 22px; text-align: center;
            font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 24px;
            backdrop-filter: blur(8px);
          }

          .alert-actions { display: flex; flex-direction: column; gap: 12px; width: 100%; }

          .btn-guide {
            width: 100%; padding: 16px; background: #fff; color: #000;
            border: none; border-radius: 12px; font-size: 16px; font-weight: 700;
            font-family: 'Sora', sans-serif; cursor: pointer;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            animation: guidePulse 1.5s ease-in-out infinite; transition: transform 0.15s;
          }
          .btn-guide:hover { transform: scale(1.02); }
          @keyframes guidePulse { 0%,100%{box-shadow:0 8px 24px rgba(0,0,0,0.2)} 50%{box-shadow:0 8px 40px rgba(0,0,0,0.4)} }

          .btn-dismiss {
            width: 100%; padding: 13px; background: rgba(0,0,0,0.3);
            color: rgba(255,255,255,0.7); border: 1px solid rgba(0,0,0,0.2);
            border-radius: 12px; font-size: 14px; font-weight: 500;
            font-family: 'Sora', sans-serif; cursor: pointer; transition: background 0.2s;
          }
          .btn-dismiss:hover { background: rgba(0,0,0,0.5); color: #fff; }

          .guide-msg {
            width: 100%; background: rgba(0,0,0,0.2);
            border: 1px solid rgba(255,255,255,0.15); border-radius: 16px;
            padding: 18px 22px; font-size: 15px; font-weight: 500; color: #fff;
            margin-bottom: 24px; line-height: 1.6; backdrop-filter: blur(8px);
          }
          .steps-title { font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 14px; align-self: flex-start; }
          .steps-list { display: flex; flex-direction: column; gap: 10px; width: 100%; margin-bottom: 20px; }
          .step-item {
            display: flex; align-items: center; gap: 12px;
            background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px; padding: 14px 16px; color: #fff; font-size: 14px;
            animation: stepIn 0.4s ease both;
          }
          @keyframes stepIn { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:none} }
          .step-num {
            min-width: 28px; height: 28px; background: rgba(255,255,255,0.2);
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            font-size: 12px; font-weight: 700;
          }
          .btn-back-guide {
            padding: 12px 28px; background: rgba(255,255,255,0.15); color: #fff;
            border: 1px solid rgba(255,255,255,0.3); border-radius: 10px;
            font-size: 14px; font-weight: 600; font-family: 'Sora', sans-serif; cursor: pointer;
          }
        `}</style>
        <div className="alert-root">
          <div className="alert-flash" />
          <div className="alert-top">
            <div className="alert-badge">🚨 EMERGENCY ALERT ACTIVE</div>
            <LanguageSelector />
          </div>

          <div className="alert-body">
            {!showGuidePage ? (
              <>
                <div className="alert-icon">
                  {disasterMeta[type.toUpperCase()]?.emoji || "⚠️"}
                </div>
                <div className="alert-type">{title || type.toUpperCase()}</div>
                <div className="alert-sub">Emergency Alert — Sarathi</div>
                <div className="alert-message-box">{adminMessage}</div>
                <div className="alert-actions">
                  <button className="btn-guide" onClick={() => { setShowGuidePage(true); speakGuide(); }}>
                    🛟 {t.guide}
                  </button>
                  {/* Dismiss: only hides locally, does NOT remove from Firebase */}
                  <button className="btn-dismiss" onClick={() => {
                    setDismissed(true);
                    setShowAlertPage(false);
                  }}>
                    {t.dismiss}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="guide-msg">{disasterMessage}</div>
                <div className="steps-title">🛟 {t.safetySteps}</div>
                <div className="steps-list">
                  {steps.slice(0, 3).map((step, i) => (
                    <div key={i} className="step-item" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className="step-num">{i + 1}</div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
                <button className="btn-back-guide" onClick={() => setShowGuidePage(false)}>← Back</button>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  // ─── NORMAL PAGE ─────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .user-root {
          min-height: 100vh; background: #050810;
          font-family: 'Sora', sans-serif; color: #fff;
          position: relative; overflow-x: hidden; padding-bottom: 60px;
        }
        .user-root::before {
          content: ''; position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(220,38,38,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220,38,38,0.06) 1px, transparent 1px);
          background-size: 48px 48px; pointer-events: none;
        }
        .orb1 {
          position: fixed; top: -180px; right: -120px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(220,38,38,0.3), transparent 70%);
          filter: blur(80px); pointer-events: none;
        }
        .orb2 {
          position: fixed; bottom: -150px; left: -100px;
          width: 450px; height: 450px; border-radius: 50%;
          background: radial-gradient(circle, rgba(30,58,138,0.35), transparent 70%);
          filter: blur(80px); pointer-events: none;
        }

        .top-bar {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px; background: rgba(5,8,16,0.7);
          backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .brand { font-size: 18px; font-weight: 800; letter-spacing: 1px; }
        .brand span { color: #ef4444; }
        .top-right { display: flex; align-items: center; gap: 10px; }

        .content { max-width: 500px; margin: 0 auto; padding: 24px 16px; }

        .hero { text-align: center; margin-bottom: 32px; animation: fadeUp 0.6s ease both; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        .hero-shield {
          width: 72px; height: 72px; margin: 0 auto 16px;
          background: linear-gradient(135deg, rgba(220,38,38,0.2), rgba(220,38,38,0.05));
          border: 1px solid rgba(220,38,38,0.25); border-radius: 20px;
          display: flex; align-items: center; justify-content: center; font-size: 32px;
          box-shadow: 0 0 32px rgba(220,38,38,0.15);
        }
        .hero-title { font-size: 28px; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 4px; }
        .hero-title span { color: #ef4444; }
        .hero-sub { font-size: 13px; color: rgba(255,255,255,0.4); }

        .status-card {
          border-radius: 16px; padding: 16px 20px;
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px; animation: fadeUp 0.6s 0.1s ease both;
          cursor: pointer; transition: transform 0.15s;
        }
        .status-card:hover { transform: scale(1.01); }
        .status-safe { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); }
        .status-alert { background: rgba(220,38,38,0.12); border: 1px solid rgba(220,38,38,0.35); box-shadow: 0 0 20px rgba(220,38,38,0.12); }
        .status-left { display: flex; align-items: center; gap: 12px; }
        .status-dot { width: 10px; height: 10px; border-radius: 50%; }
        .status-dot.safe { background: #22c55e; box-shadow: 0 0 8px #22c55e; }
        .status-dot.alert-dot { background: #ef4444; box-shadow: 0 0 8px #ef4444; animation: alertPulse 0.8s infinite; }
        @keyframes alertPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .status-text { font-size: 14px; font-weight: 500; }
        .status-text.safe { color: #4ade80; }
        .status-text.alert-text { color: #f87171; }
        .status-badge { font-family: 'JetBrains Mono', monospace; font-size: 10px; padding: 4px 10px; border-radius: 20px; font-weight: 500; }
        .status-badge.safe-badge { background: rgba(34,197,94,0.15); color: #4ade80; }
        .status-badge.alert-badge-pill { background: rgba(220,38,38,0.2); color: #f87171; }

        .section-head { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; animation: fadeUp 0.6s 0.2s ease both; }
        .section-head-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .section-head-text { font-size: 11px; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 1.5px; white-space: nowrap; }

        .disaster-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; animation: fadeUp 0.6s 0.25s ease both; }
        .disaster-card {
          border-radius: 14px; padding: 16px 10px;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
          cursor: pointer; border: 1px solid; transition: transform 0.2s, box-shadow 0.2s; text-align: center;
        }
        .disaster-card:hover { transform: translateY(-3px); }
        .disaster-card-emoji { font-size: 28px; }
        .disaster-card-label { font-size: 11px; font-weight: 600; letter-spacing: 0.5px; }

        .tips-panel { animation: fadeUp 0.4s ease both; }
        .tips-back-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 10px 16px; color: rgba(255,255,255,0.7);
          font-size: 13px; font-weight: 500; font-family: 'Sora', sans-serif;
          cursor: pointer; margin-bottom: 20px; transition: background 0.2s;
        }
        .tips-back-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .tips-header { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
        .tips-icon-box { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 26px; border: 1px solid; }
        .tips-title { font-size: 22px; font-weight: 800; }
        .tips-subtitle { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 2px; }
        .tips-list { display: flex; flex-direction: column; gap: 10px; }
        .tip-item {
          display: flex; align-items: flex-start; gap: 12px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 14px 16px; animation: stepIn 0.4s ease both;
        }
        @keyframes stepIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:none} }
        .tip-num {
          min-width: 26px; height: 26px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; font-family: 'JetBrains Mono', monospace; flex-shrink: 0;
        }
        .tip-text { font-size: 13px; color: rgba(255,255,255,0.8); line-height: 1.5; }

        .sos-strip {
          position: fixed; bottom: 0; left: 0; right: 0;
          background: rgba(220,38,38,0.9); padding: 10px; text-align: center;
          font-size: 13px; font-weight: 600; color: #fff;
          letter-spacing: 0.5px; z-index: 50; backdrop-filter: blur(8px);
        }
      `}</style>

      <div className="user-root">
        <div className="orb1" />
        <div className="orb2" />

        <div className="top-bar">
          <div className="brand">SARA<span>THI</span></div>
          <div className="top-right">
            <LanguageSelector />
            <BackButton disabled={!!selectedDisaster} />
          </div>
        </div>

        <div className="content">
          <div className="hero">
            <div className="hero-shield">🛡️</div>
            <h1 className="hero-title">{t.title.split(" ")[0]} <span>{t.title.split(" ")[1] || ""}</span></h1>
            <p className="hero-sub">Because Every Life Matters</p>
          </div>

          {/* Status card — clicking shows alert overlay again even if dismissed */}
          <div
            className={`status-card ${alert ? "status-alert" : "status-safe"}`}
            onClick={() => alert && setShowAlertPage(true) && setDismissed(false)}
          >
            <div className="status-left">
              <div className={`status-dot ${alert ? "alert-dot" : "safe"}`} />
              <span className={`status-text ${alert ? "alert-text" : "safe"}`}>
                {alert ? `🚨 ${t.viewAlert}` : `✅ ${t.waiting}`}
              </span>
            </div>
            <span className={`status-badge ${alert ? "alert-badge-pill" : "safe-badge"}`}>
              {alert ? "LIVE" : "CLEAR"}
            </span>
          </div>

          {!selectedDisaster ? (
            <>
              <div className="section-head">
                <div className="section-head-text">{t.browseTitle}</div>
                <div className="section-head-line" />
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>
                {t.browseSubtitle}
              </p>
              <div className="disaster-grid">
                {disasters.map((d, i) => {
                  const meta = disasterMeta[d];
                  return (
                    <div
                      key={i}
                      className="disaster-card"
                      style={{ background: meta.bg, borderColor: meta.border, color: meta.color, animationDelay: `${i * 0.05}s` }}
                      onClick={() => setSelectedDisaster(d)}
                    >
                      <div className="disaster-card-emoji">{meta.emoji}</div>
                      <div className="disaster-card-label">{d}</div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="tips-panel">
              <button className="tips-back-btn" onClick={() => setSelectedDisaster(null)}>
                {t.backToList}
              </button>
              <div className="tips-header">
                <div className="tips-icon-box" style={{ background: selectedMeta.bg, borderColor: selectedMeta.border, color: selectedMeta.color }}>
                  {selectedMeta.emoji}
                </div>
                <div>
                  <div className="tips-title">{selectedDisaster}</div>
                  <div className="tips-subtitle">{t.safetyTips}</div>
                </div>
              </div>
              <div className="tips-list">
                {selectedTips.map((tip, i) => (
                  <div key={i} className="tip-item" style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className="tip-num" style={{ background: selectedMeta.bg, color: selectedMeta.color, border: `1px solid ${selectedMeta.border}` }}>
                      {i + 1}
                    </div>
                    <span className="tip-text">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sos-strip">
          🚨 Emergency Helpline: <strong>112</strong> &nbsp;|&nbsp; Available 24×7
        </div>
      </div>
    </>
  );
}

