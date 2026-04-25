// // export default function LanguageSelector({ lang, setLang }) {

// //   const changeLang = (value) => {
// //     setLang(value); // ✅ update parent (NO refresh)
// //     localStorage.setItem("lang", value); // ✅ persist
// //   };

// //   return (
// //     <select
// //       value={lang}
// //       onChange={(e) => changeLang(e.target.value)}
// //       className="fixed top-4 right-28 bg-white text-black border shadow px-4 py-2 rounded z-50"
// //     >
// //       <option value="en">English</option>
// //       <option value="hi">Hindi</option>
// //       <option value="mr">Marathi</option>
// //       <option value="gu">Gujarati</option>
// //       <option value="ta">Tamil</option>
// //       <option value="te">Telugu</option>
// //       <option value="kn">Kannada</option>
// //       <option value="ml">Malayalam</option>
// //       <option value="bn">Bengali</option>
// //       <option value="pa">Punjabi</option>
// //       <option value="or">Odia</option>
// //     </select>
// //   );
// // }

// import { useLanguage } from "../context/LanguageContext";

// export default function LanguageSelector() {
//   const { lang, setLang } = useLanguage();

//   return (
//     <select
//       value={lang}
//       onChange={(e) => setLang(e.target.value)}
//       className="fixed top-4 right-28 bg-white text-black border shadow px-4 py-2 rounded z-50"
//     >
//       <option value="en">English</option>
//       <option value="hi">Hindi</option>
//       <option value="mr">Marathi</option>
//       <option value="gu">Gujarati</option>
//       <option value="ta">Tamil</option>
//       <option value="te">Telugu</option>
//       <option value="kn">Kannada</option>
//       <option value="ml">Malayalam</option>
//       <option value="bn">Bengali</option>
//       <option value="pa">Punjabi</option>
//       <option value="or">Odia</option>
//     </select>
//   );
// }

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
    <>
      <style>{`
        .lang-wrap {
          position: relative;
          display: inline-block;
          font-family: 'Sora', sans-serif;
          z-index: 100;
        }

        .lang-trigger {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 12px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.75);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          backdrop-filter: blur(8px);
          white-space: nowrap;
          user-select: none;
        }
        .lang-trigger:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          color: #fff;
        }
        .lang-trigger.open {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(220, 38, 38, 0.4);
          color: #fff;
        }

        .lang-flag { font-size: 15px; line-height: 1; }
        .lang-label { font-size: 13px; }
        .lang-chevron {
          font-size: 10px;
          opacity: 0.5;
          transition: transform 0.2s;
          margin-left: 2px;
        }
        .lang-trigger.open .lang-chevron { transform: rotate(180deg); }

        /* Dropdown */
        .lang-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #0d1117;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 6px;
          min-width: 160px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          animation: dropIn 0.18s ease;
          overflow: hidden;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .lang-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
          transition: background 0.15s, color 0.15s;
        }
        .lang-option:hover {
          background: rgba(255, 255, 255, 0.07);
          color: #fff;
        }
        .lang-option.selected {
          background: rgba(220, 38, 38, 0.12);
          color: #f87171;
          font-weight: 600;
        }
        .lang-option.selected .lang-check {
          display: inline;
        }
        .lang-check {
          display: none;
          margin-left: auto;
          font-size: 11px;
          color: #ef4444;
        }

        .lang-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 4px 6px;
        }
      `}</style>

      <div className="lang-wrap" ref={ref}>
        {/* Trigger button */}
        <button
          className={`lang-trigger${open ? " open" : ""}`}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="lang-flag">{current.flag}</span>
          <span className="lang-label">{current.label}</span>
          <span className="lang-chevron">▼</span>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="lang-dropdown">
            {languages.map((l, i) => (
              <div key={l.value}>
                <div
                  className={`lang-option${lang === l.value ? " selected" : ""}`}
                  onClick={() => handleSelect(l.value)}
                >
                  <span className="lang-flag">{l.flag}</span>
                  <span>{l.label}</span>
                  <span className="lang-check">✓</span>
                </div>
                {/* Divider after English */}
                {i === 0 && <div className="lang-divider" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
