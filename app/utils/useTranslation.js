"use client";
import { useMemo } from "react";
import { useState, useEffect } from "react";
import { translations } from "./translations";

// export default function useTranslation() {
//   const [lang, setLang] = useState("en");

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedLang = localStorage.getItem("lang") || "en";
//       setLang(storedLang);
//     }
//   }, []);

//   const t = translations[lang] || translations.en;

//   return { t, lang };
// }

export default function useTranslation(lang) {
  const t = translations[lang] || translations.en;
  return { t };
}