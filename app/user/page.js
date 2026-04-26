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
      <div className="fixed inset-0 min-h-screen font-sora flex flex-col items-center justify-center relative overflow-hidden z-[100] text-white">
          <div className="absolute inset-0 transition-colors duration-[2s] pointer-events-none" style={{ backgroundColor: color || "#dc2626" }}>
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.04)_0px,rgba(0,0,0,0.04)_20px,transparent_20px,transparent_40px)]" />
          </div>
          <div className="absolute inset-0 bg-white/5 animate-[pulse_1s_ease-in-out_infinite] pointer-events-none" />

          <div className="fixed top-0 left-0 right-0 flex justify-between items-center py-[14px] px-5 bg-black/20 backdrop-blur-md z-10">
            <div className="font-jetbrains text-[11px] font-medium bg-black/30 text-white/80 py-[5px] px-3 rounded-full tracking-wide">
              🚨 EMERGENCY ALERT ACTIVE
            </div>
            <LanguageSelector />
          </div>

          <div className="relative z-[2] flex flex-col items-center pt-[100px] px-5 pb-20 w-full max-w-[480px]">
            {!showGuidePage ? (
              <>
                <div className="text-[72px] mb-4 animate-[iconPulse_0.8s_ease-in-out_infinite_alternate]">
                  {disasterMeta[type.toUpperCase()]?.emoji || "⚠️"}
                </div>
                <div className="text-[52px] font-extrabold text-white tracking-[3px] text-shadow-[0_4px_20px_rgba(0,0,0,0.3)] mb-2 text-center drop-shadow-xl">
                    {title || type.toUpperCase()}
                </div>
                <div className="text-[13px] text-white/60 tracking-[2px] uppercase mb-7">Emergency Alert — Sarathi</div>
                <div className="w-full bg-black/25 border border-white/20 rounded-2xl py-[18px] px-5 text-center text-base font-semibold text-white mb-6 backdrop-blur-md">
                    {adminMessage}
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <button className="w-full py-4 bg-white text-black border-none rounded-xl text-base font-bold font-sora cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.2)] animate-[guidePulse_1.5s_ease-in-out_infinite] transition-transform hover:scale-[1.02] active:scale-95" onClick={() => { setShowGuidePage(true); speakGuide(); }}>
                    🛟 {t.guide}
                  </button>
                  <button className="w-full py-[13px] bg-black/30 text-white/70 border border-black/20 rounded-xl text-sm font-medium font-sora cursor-pointer transition-colors hover:bg-black/50 hover:text-white" onClick={() => {
                    setDismissed(true);
                    setShowAlertPage(false);
                  }}>
                    {t.dismiss}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-full bg-black/20 border border-white/15 rounded-2xl py-[18px] px-5 text-[15px] font-medium text-white mb-6 leading-relaxed backdrop-blur-md">
                    {disasterMessage}
                </div>
                <div className="text-xl font-bold text-white mb-3.5 self-start">🛟 {t.safetySteps}</div>
                <div className="flex flex-col gap-2.5 w-full mb-5">
                  {steps.slice(0, 3).map((step, i) => (
                    <div key={i} className="flex items-center gap-3 bg-black/20 border border-white/10 rounded-xl py-3.5 px-4 text-white text-sm animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className="min-w-[28px] h-[28px] bg-white/20 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
                <button className="py-3 px-7 bg-white/15 text-white border border-white/30 rounded-xl text-sm font-semibold font-sora cursor-pointer transition-colors hover:bg-white/25 w-full" onClick={() => setShowGuidePage(false)}>← Back</button>
              </>
            )}
          </div>
      </div>
    );
  }

  // ─── NORMAL PAGE ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg-base font-sora text-white pb-16 relative overflow-x-hidden bg-grid-pattern">
      <div className="orb bg-red-600/30 w-[500px] h-[500px] -top-[180px] -right-[120px]" />
      <div className="orb bg-blue-900/35 w-[450px] h-[450px] -bottom-[150px] -left-[100px]" />

      <div className="sticky top-0 z-50 flex items-center justify-between py-3.5 px-5 bg-bg-base/70 backdrop-blur-md border-b border-white/5">
        <div className="text-lg font-extrabold tracking-wide">SARA<span className="text-red-500">THI</span></div>
        <div className="flex items-center gap-2.5">
          <LanguageSelector />
          <BackButton disabled={!!selectedDisaster} />
        </div>
      </div>

      <div className="w-full max-w-[500px] mx-auto px-4 py-6 relative z-10">
        <div className="text-center mb-8 animate-fade-up">
          <div className="w-[72px] h-[72px] mx-auto mb-4 bg-gradient-to-br from-red-600/20 to-red-600/5 border border-red-600/25 rounded-2xl flex items-center justify-center text-[32px] shadow-[0_0_32px_rgba(220,38,38,0.15)] drop-shadow">
              🛡️
          </div>
          <h1 className="text-[28px] font-extrabold tracking-wide mb-1 leading-tight">{t.title.split(" ")[0]} <span className="text-red-500">{t.title.split(" ")[1] || ""}</span></h1>
          <p className="text-[13px] text-white/40">Because Every Life Matters</p>
        </div>

        {/* Status card */}
        <div
            className={`rounded-2xl p-4 flex items-center justify-between mb-5 cursor-pointer transition-transform duration-150 hover:scale-[1.01] animate-[fadeUp_0.6s_0.1s_ease_both] ${alert ? "bg-red-600/10 border border-red-500/35 shadow-[0_0_20px_rgba(220,38,38,0.12)]" : "bg-green-500/10 border border-green-500/20"}`}
            onClick={() => alert && setShowAlertPage(true) && setDismissed(false)}
        >
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${alert ? "bg-red-500 shadow-[0_0_8px_#ef4444] animate-[alertPulse_0.8s_infinite]" : "bg-green-500 shadow-[0_0_8px_#22c55e]"}`} />
              <span className={`text-sm font-medium ${alert ? "text-red-400" : "text-green-400"}`}>
                {alert ? `🚨 ${t.viewAlert}` : `✅ ${t.waiting}`}
              </span>
            </div>
            <span className={`font-jetbrains text-[10px] py-1 px-2.5 rounded-full font-medium ${alert ? "bg-red-600/20 text-red-400" : "bg-green-500/15 text-green-400"}`}>
              {alert ? "LIVE" : "CLEAR"}
            </span>
        </div>

        {!selectedDisaster ? (
          <>
            <div className="flex items-center gap-2.5 mb-4 animate-[fadeUp_0.6s_0.2s_ease_both]">
              <div className="text-[11px] text-white/35 uppercase tracking-[1.5px] whitespace-nowrap">{t.browseTitle}</div>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <p className="text-xs text-white/35 mb-4 animate-[fadeUp_0.6s_0.25s_ease_both]">
              {t.browseSubtitle}
            </p>
            <div className="grid grid-cols-3 gap-2.5 animate-[fadeUp_0.6s_0.25s_ease_both]">
              {disasters.map((d, i) => {
                const meta = disasterMeta[d];
                return (
                  <div
                    key={i}
                    className="rounded-[14px] p-2.5 flex flex-col items-center justify-center gap-2 cursor-pointer border transition-all duration-200 hover:-translate-y-1 text-center"
                    style={{ background: meta.bg, borderColor: meta.border, color: meta.color, animationDelay: `${i * 0.05}s` }}
                    onClick={() => setSelectedDisaster(d)}
                  >
                    <div className="text-[28px]">{meta.emoji}</div>
                    <div className="text-[11px] font-semibold tracking-[0.5px]">{d}</div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="animate-fade-up">
            <button className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white/70 text-[13px] font-medium font-sora cursor-pointer mb-5 transition-colors hover:bg-white/10 hover:text-white" onClick={() => setSelectedDisaster(null)}>
              {t.backToList}
            </button>
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[26px] border" style={{ background: selectedMeta.bg, borderColor: selectedMeta.border, color: selectedMeta.color }}>
                {selectedMeta.emoji}
              </div>
              <div>
                <div className="text-[22px] font-extrabold">{selectedDisaster}</div>
                <div className="text-xs text-white/40 mt-0.5">{t.safetyTips}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              {selectedTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/[0.03] border border-white/5 rounded-xl p-3.5 animate-fade-up" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="min-w-[26px] h-[26px] rounded-lg flex items-center justify-center text-[11px] font-bold font-jetbrains shrink-0" style={{ background: selectedMeta.bg, color: selectedMeta.color, border: `1px solid ${selectedMeta.border}` }}>
                    {i + 1}
                  </div>
                  <span className="text-[13px] text-white/80 leading-relaxed font-light">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-red-600/90 py-2.5 px-2.5 text-center text-[13px] font-semibold text-white tracking-wide z-50 backdrop-blur-md">
        <span className="animate-[blink_1.4s_infinite]">🚨</span> Emergency Helpline: <strong>112</strong> &nbsp;|&nbsp; Available 24×7
      </div>
    </div>
  );
}
