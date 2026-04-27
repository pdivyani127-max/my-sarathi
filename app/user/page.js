"use client";
import { disasterConfig } from "../data/disasterConfig";
import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../context/LanguageContext";
import { db } from "../lib/firebase";
import { ref, onValue } from "firebase/database";
import { motion, AnimatePresence } from "framer-motion";
import { TiltCard, SpatialLayer } from "../components/TiltCard";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const translations = {
  en: {
    title: "Project Sarathi",
    guide: "Guide Me",
    waiting: "No Active Incidents",
    disasterLibrary: "Disaster Safety Library",
    browseTitle: "Browse Safety Guides",
    browseSubtitle: "Tap any disaster to view safety protocols",
    safetySteps: "Safety Protocols",
    safetyTips: "Safety Tips",
    backToList: "← Back",
    dismiss: "Dismiss Notification",
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
    browseSubtitle: "सुरक्षा प्रोटोकॉल देखने के लिए टैप करें",
    safetySteps: "सुरक्षा प्रोटोकॉल",
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
    browseSubtitle: "सुरक्षा प्रोटोकॉल पाहण्यासाठी टॅप करा",
    safetySteps: "सुरक्षा प्रोटोकॉल",
    safetyTips: "सुरक्षा टिप्स",
    backToList: "← मागे जा",
    dismiss: "अलर्ट बंद करा",
    enableSound: "आवाज चालू करा 🔊",
    viewAlert: "अलर्ट पहा",
    noAlert: "कोणताही अलर्ट नाही",
  },
};

const disasterMeta = {
  FIRE:       { emoji: "🔥", color: "var(--color-semantic-critical)", bg: "rgba(239, 68, 68, 0.15)",   border: "rgba(239, 68, 68, 0.4)"   },
  FLOOD:      { emoji: "🌊", color: "var(--color-semantic-info)",     bg: "rgba(59, 130, 246, 0.15)",  border: "rgba(59, 130, 246, 0.4)"  },
  CYCLONE:    { emoji: "🌀", color: "#8b5cf6",                        bg: "rgba(139, 92, 246, 0.15)",  border: "rgba(139, 92, 246, 0.4)"  },
  TSUNAMI:    { emoji: "🌏", color: "#06b6d4",                        bg: "rgba(6, 182, 212, 0.15)",   border: "rgba(6, 182, 212, 0.4)"   },
  EARTHQUAKE: { emoji: "🏚️", color: "var(--color-semantic-warning)",  bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.4)"  },
  HEATWAVE:   { emoji: "☀️", color: "#eab308",                        bg: "rgba(234, 179, 8, 0.15)",   border: "rgba(234, 179, 8, 0.4)"   },
  COLDWAVE:   { emoji: "❄️", color: "#93c5fd",                        bg: "rgba(147, 197, 253, 0.15)", border: "rgba(147, 197, 253, 0.4)" },
  LANDSLIDE:  { emoji: "⛰️", color: "#d97706",                        bg: "rgba(217, 119, 6, 0.15)",  border: "rgba(217, 119, 6, 0.4)"   },
  GAS:        { emoji: "☁️", color: "var(--color-semantic-safe)",     bg: "rgba(16, 185, 129, 0.15)",   border: "rgba(16, 185, 129, 0.4)"   },
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
      for (let i = 0; i < 3; i++) {
        playBeep(ctx.currentTime + i * 0.8, 440, 880, 0.7);
      }
    } catch (e) {}
  };

  useEffect(() => {
    setMounted(true);
    const alertRef = ref(db, "activeAlert");
    const unsubscribe = onValue(alertRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setAlert(data);
        setDismissed(false);
        setShowAlertPage(true);
      } else {
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

    const removeEmojis = (text) => text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "");

    const speak = (text) => {
      return new Promise((resolve) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(removeEmojis(text));
        utterance.lang = lang === "hi" ? "hi-IN" : lang === "mr" ? "mr-IN" : "en-US";
        utterance.onend = resolve;
        utterance.onerror = resolve;
        window.speechSynthesis.speak(utterance);
      });
    };

    let stopped = false;

    const loop = async () => {
      while (!stopped) {
        playSiren();
        await new Promise(r => setTimeout(r, 2500));
        if (stopped) break;

        const text = showGuidePage
          ? disasterMessage
          : `${type.toUpperCase()} alert. ${adminMessage}`;
        await speak(text);
        if (stopped) break;

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
  const selectedMeta = disasterMeta[selectedDisaster] || { emoji: "⚠️", color: "#a1a1aa", bg: "rgba(161, 161, 170, 0.15)", border: "rgba(161, 161, 170, 0.4)" };

  const speakGuide = () => {
    const textToSpeak = showGuidePage
      ? disasterMessage
      : `${title || type.toUpperCase()}. ${adminMessage || ""}`;
    const speech = new SpeechSynthesisUtterance(textToSpeak);
    speech.lang = { hi:"hi-IN", mr:"mr-IN", bn:"bn-IN", ta:"ta-IN", te:"te-IN", kn:"kn-IN", ml:"ml-IN", gu:"gu-IN", pa:"pa-IN", or:"or-IN" }[lang] || "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  // ─── APPLE STYLE EMERGENCY SOS OVERLAY ─────────────────────────
  if (alert && showAlertPage && !dismissed) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 min-h-screen flex flex-col items-center justify-center relative overflow-hidden z-[100] text-text-primary bg-[#020617]/80 pt-safe preserve-3d">
          <div className="absolute inset-0 backdrop-blur-[100px] pointer-events-none" style={{ transform: 'translateZ(-100px)' }} />
          <motion.div animate={{ backgroundColor: color || "#dc2626" }} className="absolute w-[800px] h-[800px] rounded-full blur-[200px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors duration-[2s] pointer-events-none opacity-40 z-[-1]" />
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] pointer-events-none z-0" />

          <motion.div initial={{ y: -50 }} animate={{ y: 0 }} transition={{ type: "spring", damping: 20 }} className="fixed top-0 left-0 right-0 flex justify-between items-center py-4 px-6 z-[105] preserve-3d">
            <SpatialLayer depth={20} className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-md shadow-lg">
              <div className="w-2 h-2 rounded-full bg-semantic-critical animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-text-primary/90">SOS Active</span>
            </SpatialLayer>
            <LanguageSelector />
          </motion.div>

          <AnimatePresence mode="wait">
            {!showGuidePage ? (
              <motion.div key="alert-view" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", damping: 20 }} className="relative z-10 flex flex-col items-center px-6 w-full max-w-[480px] preserve-3d">
                <TiltCard multiplier={8} className="w-full text-center">
                  <SpatialLayer depth={50} className="text-[80px] mb-6 drop-shadow-[0_40px_60px_rgba(239,68,68,0.6)] animate-[iconPulse_2s_ease-in-out_infinite_alternate]">
                    {disasterMeta[type.toUpperCase()]?.emoji || "⚠️"}
                  </SpatialLayer>
                  <SpatialLayer depth={30} className="text-[42px] font-bold tracking-tight text-white mb-2 text-center drop-shadow-2xl">
                      {title || type.toUpperCase()}
                  </SpatialLayer>
                  <SpatialLayer depth={10} className="text-[12px] text-white/50 font-bold tracking-[0.2em] uppercase mb-10 text-center">Emergency Bulletin</SpatialLayer>
                </TiltCard>
                
                <TiltCard multiplier={4} className="w-full">
                  <div className="w-full bg-black/40 border border-white/20 rounded-[24px] p-6 text-center text-lg font-medium text-white mb-10 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.7)] leading-relaxed">
                      "{adminMessage}"
                  </div>
                </TiltCard>

                <div className="flex flex-col gap-4 w-full">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-[18px] bg-white text-bg-base rounded-2xl text-[15px] font-bold cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.3)] flex justify-center items-center gap-2" onClick={() => { setShowGuidePage(true); speakGuide(); }}>
                    🛟 {t.guide}
                  </motion.button>
                  <motion.button whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }} whileTap={{ scale: 0.98 }} className="w-full py-4 bg-transparent text-white/60 border border-transparent hover:text-white rounded-2xl text-[14px] font-bold cursor-pointer transition-colors" onClick={() => {
                    setDismissed(true);
                    setShowAlertPage(false);
                  }}>
                    {t.dismiss}
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="guide-view" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} transition={{ type: "spring", damping: 20 }} className="relative z-[2] px-6 w-full max-w-[480px]">
                <div className="w-full bg-black/40 border border-white/15 rounded-[24px] p-6 text-[15px] font-medium text-white mb-8 leading-relaxed backdrop-blur-xl shadow-2xl">
                    {disasterMessage}
                </div>
                
                <h3 className="text-sm font-bold text-white/50 tracking-widest uppercase mb-4 pl-1">{t.safetySteps}</h3>
                
                <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-3 w-full mb-8">
                  {steps.slice(0, 3).map((step, i) => (
                    <motion.div variants={item} key={i} className="flex items-center gap-4 bg-black/30 border border-white/10 rounded-2xl p-4 text-white text-[15px] font-medium backdrop-blur-md">
                      <div className="min-w-[28px] h-[28px] bg-white/10 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      <span className="leading-snug">{step}</span>
                    </motion.div>
                  ))}
                </motion.div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-[16px] bg-white/10 border border-white/10 text-white rounded-2xl text-[14px] font-bold cursor-pointer transition-all hover:bg-white/20" onClick={() => setShowGuidePage(false)}>← Back to Alert</motion.button>
              </motion.div>
            )}
          </AnimatePresence>
      </motion.div>
    );
  }

  // ─── NORMAL PREMIUM PORTAL ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg-base text-text-primary pb-20 relative overflow-x-hidden">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
        <div className="radial-glow glow-red -top-[150px] -right-[150px]" />
        <div className="radial-glow glow-blue -bottom-[200px] -left-[100px]" />
      </motion.div>

      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="sticky top-0 z-50 flex items-center justify-between py-4 px-6 glass-panel rounded-none">
        <div className="text-xl font-bold tracking-tight">SARA<span className="text-semantic-critical">THI</span></div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <BackButton disabled={!!selectedDisaster} />
        </div>
      </motion.div>

      <div className="w-full max-w-[600px] mx-auto px-4 py-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 flex flex-col items-center">
          <motion.div whileHover={{ scale: 1.05, rotate: 5 }} className="w-[64px] h-[64px] mx-auto mb-6 bg-white/5 border border-white/10 rounded-[20px] flex items-center justify-center text-[30px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-md">
              🛡️
          </motion.div>
          <h1 className="text-[32px] md:text-[38px] font-bold tracking-tight mb-2 leading-tight">Project <span className="text-transparent bg-clip-text bg-gradient-to-br from-semantic-critical to-red-800">Sarathi</span></h1>
          <p className="text-[14px] font-medium text-text-secondary">Because Every Life Matters</p>
        </motion.div>

        <TiltCard multiplier={5} className="mb-8 cursor-pointer">
          <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`elevated-card rounded-[32px] p-6 flex items-center justify-between group transition-all duration-300 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.5)] ${alert ? "border-semantic-critical bg-semantic-critical/10" : "border-semantic-safe bg-semantic-safe/5"}`}
              onClick={() => alert && setShowAlertPage(true) && setDismissed(false)}
          >
              <SpatialLayer depth={20} className="flex items-center gap-4">
                <div className={`w-3.5 h-3.5 rounded-full ${alert ? "bg-semantic-critical shadow-[0_0_12px_#ef4444] animate-[pulse_0.8s_infinite]" : "bg-semantic-safe shadow-[0_0_12px_#10b981]"}`} />
                <div className="flex flex-col">
                  <span className={`text-[15px] font-bold ${alert ? "text-semantic-critical" : "text-semantic-safe"}`}>
                    {alert ? `🚨 ${t.viewAlert}` : `✅ ${t.waiting}`}
                  </span>
                  <span className="text-[11px] text-text-muted font-medium mt-0.5">National Security Grid</span>
                </div>
              </SpatialLayer>
              <SpatialLayer depth={40}>
                <span className={`text-[10px] font-bold py-1.5 px-3 rounded-full uppercase tracking-widest ${alert ? "bg-semantic-critical text-white shadow-lg" : "bg-semantic-safe/20 text-semantic-safe"}`}>
                  {alert ? "LIVE" : "CLEAR"}
                </span>
              </SpatialLayer>
          </motion.div>
        </TiltCard>

        <AnimatePresence mode="wait">
          {!selectedDisaster ? (
            <motion.div key="grid-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="text-[12px] font-bold text-text-secondary uppercase tracking-[0.2em]">{t.browseTitle}</div>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              
              <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {disasters.map((d, i) => {
                  const meta = disasterMeta[d];
                  return (
                    <TiltCard key={i} multiplier={12}>
                      <motion.div
                        variants={item}
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
                        whileTap={{ scale: 0.95 }}
                        className="glass-panel w-full h-full rounded-[32px] p-6 flex flex-col items-center justify-center gap-3 cursor-pointer text-center group shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] border border-white/10"
                        onClick={() => setSelectedDisaster(d)}
                      >
                        <SpatialLayer depth={30} className="w-16 h-16 rounded-[24px] flex items-center justify-center text-[30px] border shadow-xl transition-all group-hover:scale-110" style={{ background: meta.bg, borderColor: meta.border }}>{meta.emoji}</SpatialLayer>
                        <SpatialLayer depth={10} className="text-[14px] font-bold tracking-wide text-text-secondary group-hover:text-white transition-colors">{d}</SpatialLayer>
                      </motion.div>
                    </TiltCard>
                  );
                })}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="detail-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-text-secondary text-[12px] font-bold uppercase tracking-widest cursor-pointer mb-6 transition-all hover:bg-white/10 hover:text-text-primary" onClick={() => setSelectedDisaster(null)}>
                {t.backToList}
              </motion.button>
              
              <div className="glass-panel rounded-[32px] p-8 mb-6">
                <div className="flex flex-col md:flex-row md:items-center gap-5 mb-8">
                  <div className="w-16 h-16 rounded-[20px] flex items-center justify-center text-[30px] border shadow-lg" style={{ background: selectedMeta.bg, borderColor: selectedMeta.border }}>
                    {selectedMeta.emoji}
                  </div>
                  <div>
                    <div className="text-3xl font-bold tracking-tight mb-1">{selectedDisaster}</div>
                    <div className="text-[11px] text-text-secondary font-bold tracking-[0.2em] uppercase">{t.safetyTips}</div>
                  </div>
                </div>
                
                <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4">
                  {selectedTips.map((tip, i) => (
                    <motion.div variants={item} key={i} className="flex items-start gap-4 bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                      <div className="min-w-[32px] h-[32px] rounded-xl flex items-center justify-center text-[13px] font-bold shrink-0 border" style={{ background: selectedMeta.bg, color: selectedMeta.color, borderColor: selectedMeta.border }}>
                        {i + 1}
                      </div>
                      <span className="text-[15px] text-white/90 leading-relaxed font-medium mt-1">{tip}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
