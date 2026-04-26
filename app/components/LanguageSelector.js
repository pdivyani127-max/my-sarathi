"use client";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

const languages = [
  { value: "en", label: "English",    flag: "🇬🇧" },
  { value: "hi", label: "हिंदी",       flag: "🇮🇳" },
  { value: "mr", label: "मराठी",       flag: "🇮🇳" },
  { value: "gu", label: "ગુજરાતી",     flag: "🇮🇳" },
  { value: "ta", label: "தமிழ்",       flag: "🇮🇳" },
  { value: "te", label: "తెలుగు",      flag: "🇮🇳" },
  { value: "kn", label: "ಕನ್ನಡ",       flag: "🇮🇳" },
  { value: "ml", label: "മലയാളം",     flag: "🇮🇳" },
  { value: "bn", label: "বাংলা",       flag: "🇮🇳" },
  { value: "pa", label: "ਪੰਜਾਬੀ",      flag: "🇮🇳" },
  { value: "or", label: "ଓଡ଼ିଆ",       flag: "🇮🇳" },
];

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = languages.find((l) => l.value === lang) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (value) => {
    setLang(value);
    setOpen(false);
  };

  return (
    <div className="relative inline-block font-sora z-[100]" ref={ref}>
      {/* Trigger button */}
      <button
        className={`inline-flex items-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 border text-white/75 text-[13px] font-medium cursor-pointer transition-all duration-200 backdrop-blur-md whitespace-nowrap select-none hover:bg-white/10 hover:border-white/20 hover:text-white ${open ? 'border-red-600/40 bg-white/10 text-white' : 'border-white/10'}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-[15px] leading-none">{current.flag}</span>
        <span className="text-[13px]">{current.label}</span>
        <span className={`text-[10px] opacity-50 ml-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-[calc(100%+8px)] right-0 bg-[#0d1117] border border-white/10 rounded-2xl p-1.5 min-w-[160px] shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-xl animate-[dropIn_0.18s_ease] overflow-hidden">
          {languages.map((l, i) => (
            <div key={l.value}>
              <div
                className={`flex items-center gap-2.5 py-2.5 px-3 rounded-lg cursor-pointer text-[13px] transition-colors duration-150 hover:bg-white/5 hover:text-white ${lang === l.value ? 'bg-red-600/15 text-red-400 font-semibold' : 'text-white/60'}`}
                onClick={() => handleSelect(l.value)}
              >
                <span className="text-[15px] leading-none">{l.flag}</span>
                <span>{l.label}</span>
                {lang === l.value && <span className="ml-auto text-[11px] text-red-500 font-bold">✓</span>}
              </div>
              {/* Divider after English */}
              {i === 0 && <div className="h-px bg-white/5 my-1 mx-1.5" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
