"use client";
import { disasterConfig } from "../data/disasterConfig";
import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../context/LanguageContext";

const translations = {
  en: {
    title: "Project Sarathi",
    guide: "Guide Me",
    waiting: "Waiting for alerts..."
  },
  hi: {
    title: "परियोजना सारथी",
    guide: "मदद करें",
    waiting: "अलर्ट की प्रतीक्षा..."
  },
  mr: {
    title: "प्रोजेक्ट सारथी",
    guide: "मदत करा",
    waiting: "सूचना येण्याची प्रतीक्षा..."
  },
};

const disasterColors = {
  fire: "bg-red-600",
  flood: "bg-blue-600",
  earthquake: "bg-orange-500",
  gas: "bg-green-500",
  chemical: "bg-purple-600",
  cyclone: "bg-indigo-600",
  tsunami: "bg-cyan-600",
  heatwave: "bg-yellow-500",
  coldwave: "bg-blue-300",
  landslide: "bg-amber-700",
  default: "bg-gray-600",
};

export default function Home() {
  const [showAlertPage, setShowAlertPage] = useState(false);
  const [alert, setAlert] = useState(null);
  const { lang, setLang } = useLanguage();
  const [showGuidePage, setShowGuidePage] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [siren, setSiren] = useState(null);
  


useEffect(() => {
  const handleStorageChange = () => {
    const data = localStorage.getItem("alert");
    const dismissed = localStorage.getItem("alertDismissed");

    if (data) {
      const parsed = JSON.parse(data);
      setAlert(parsed);

      if (!dismissed) {
        setShowAlertPage(true);
      }
    } else {
      setAlert(null);
      setShowAlertPage(false);
      localStorage.removeItem("alertDismissed");
    }
  };

  // Run once on load
  handleStorageChange();

  // 🔥 Listen for real-time changes
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, []);

useEffect(() => {
  const audio = new Audio("/siren.mp3");
  audio.preload = "auto";
  setSiren(audio);
}, []);


const removeEmojis = (text) => {
  return text.replace(
    /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu,
    ""
  );
};

useEffect(() => {
  if (!alert || !showAlertPage || !siren) return;

  siren.currentTime = 0;
  siren.play().catch(() => {
    console.log("Autoplay blocked");
  });

  const speak = () => {
    let text = "";

    if (showGuidePage) {
      text = disasterMessage; // page 2
    } else {
      text = `${type.toUpperCase()} alert. ${adminMessage}`; // page 1
    }
  // ✅ REMOVE EMOJIS HERE
    text = removeEmojis(text);
    
    const speech = new SpeechSynthesisUtterance(text);

    speech.lang =
      lang === "hi" ? "hi-IN" :
      lang === "mr" ? "mr-IN" :
      "en-US";

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  const timeout = setTimeout(speak, 1500);
  const interval = setInterval(speak, 10000);

  return () => {
    clearTimeout(timeout);
    clearInterval(interval);
    window.speechSynthesis.cancel();

    siren.pause();
    siren.currentTime = 0;
  };
}, [alert, showAlertPage, showGuidePage, lang, siren]);


  const t = translations[lang] || translations.en;
const type =
  alert?.type?.trim().toLowerCase() || "default";


const config =
  disasterConfig[type] ||
  disasterConfig.default;

const title = config.title?.[lang] || config.title?.en;


//   // 🔹 Admin message (from admin panel)
// const adminMessage = alert?.message;

// // 🔹 Default disaster message (from config)
// const disasterMessage =
//   config.message?.[lang] ||
//   config.message?.en;

const steps =
  config.steps?.[lang] ||
  config.steps?.en ||
  ["Stay safe"];

const tips =
  config.tips?.[lang] ||
  config.tips?.en ||
  ["Stay safe"];

const color = config.color;

const selectedConfig =
  disasterConfig[selectedDisaster?.toLowerCase()] ||
  disasterConfig.default;

  const selectedTips =
  selectedConfig.tips?.[lang] ||
  selectedConfig.tips?.en ||
  [];


const disasters = [
  "FIRE","FLOOD","CYCLONE","TSUNAMI",
  "EARTHQUAKE","HEATWAVE","COLDWAVE","LANDSLIDE","GAS"
];


const speakGuide = () => {
  let textToSpeak = "";

  if (showGuidePage) {
    // 🔴 Guide screen → disaster message
    textToSpeak = disasterMessage;
  } else {
    // 🟢 Alert screen → disaster name + admin message
    const disasterName =
      title || type.toUpperCase();

    textToSpeak = `${disasterName}. ${adminMessage || ""}`;
  }

  const speech = new SpeechSynthesisUtterance(textToSpeak);

  speech.lang =
    lang === "hi" ? "hi-IN" :
    lang === "mr" ? "mr-IN" :
    lang === "bn" ? "bn-IN" :
    lang === "ta" ? "ta-IN" :
    lang === "te" ? "te-IN" :
    lang === "kn" ? "kn-IN" :
    lang === "ml" ? "ml-IN" :
    lang === "gu" ? "gu-IN" :
    lang === "pa" ? "pa-IN" :
    lang === "or" ? "or-IN" :
    "en-US";

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
};


const adminMessage = alert?.message || "";

const disasterMessage =
  config.message?.[lang] ||
  config.message?.en ||
  "";


  return (
    <div className="h-screen flex flex-col items-center justify-center bg-blue-50">
     
        <BackButton disabled={!!selectedDisaster} />
<LanguageSelector />




      {/* Language Selector */}
      
      <h1 className="text-3xl text-gray-700 mb-4">{t.title}</h1>
      <p className="text-gray-500">{t.waiting}</p>

      {/* ALERT SCREEN */}
    
    {alert && showAlertPage ? (

  // 🚨 ALERT SCREEN (YOUR EXISTING CODE)
  <div className={`fixed inset-0 ${color} text-white flex flex-col items-center justify-center z-50`}>

    {/* Language selector */}

    <div className="absolute top-5 right-5">
  <LanguageSelector />
</div>

    {!showGuidePage ? (
      <>
        <h1 className="text-6xl font-bold mb-6">
          {title}
        </h1>

        <div className="bg-white text-black font-bold px-6 py-3 rounded-xl shadow-lg mb-6">
  {adminMessage}
</div>

<button onClick={() => siren?.play()}>
  Enable Sound
</button>

        <button
          onClick={() => {
            setShowGuidePage(true);
            speakGuide();
          }}
          className="bg-white text-black px-6 py-3 rounded-lg mb-4 animate-pulse"
        >
          {t.guide}
        </button>
      </>
    ) : (
      <>
        <div className="mb-6 px-6 py-4 rounded-lg text-center text-lg font-semibold shadow-lg bg-white text-black w-[85%] max-w-md">
{disasterMessage}
          {/* {messageText} */}
        </div>

        <h2 className="text-3xl font-bold mb-4">
          {lang === "hi"
            ? "🛟 सुरक्षा कदम"
            : lang === "mr"
            ? "🛟 सुरक्षा पावले"
            : "🛟 SAFETY STEPS"}
        </h2>

        <div className="flex flex-col gap-3 w-[85%] max-w-md">
          {steps.slice(0, 3).map((step, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-black/20 text-white px-4 py-3 rounded-lg"
            >
              <span className="text-xl">✅</span>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowGuidePage(false)}
          className="mt-6 bg-white text-black px-4 py-2 rounded"
        >
          ⬅ Back
        </button>
      </>
    )}

    {/* ✅ FIXED DISMISS BUTTON */}
    <button
  onClick={() => {
    setShowAlertPage(false);
    localStorage.setItem("alertDismissed", "true"); // ✅ SAVE DISMISS
  }}
  className="bg-black px-4 py-2 rounded mt-4"
>
  Dismiss
</button>
 
  </div>

) : (

 // 🟢 NORMAL PAGE (NO ALERT OR DISMISSED)
<div className="mt-6 w-full max-w-md">

  {/* 🚨 ALERT BUTTON */}
  <button
    onClick={() => setShowAlertPage(true)}
    disabled={!alert}
    className={`w-full mb-4 p-3 rounded ${
      alert ? "bg-red-600 text-white" : "bg-gray-400 text-black cursor-not-allowed"
    }`}
  >
    🚨 VIEW ALERT
  </button>

  {/* 📦 DISASTER LIST */}
  {!selectedDisaster && (
    <div className="flex flex-col gap-3">
      {disasters.map((d, i) => (
        <div
          key={i}
          onClick={() => setSelectedDisaster(d)}
          className="bg-black text-white p-3 text-center rounded cursor-pointer hover:bg-gray-800"
        >
          {d}
        </div>
      ))}
    </div>
  )}

  {/* 📘 TIPS PAGE */}
  {selectedDisaster && (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">
        {selectedDisaster} SAFETY TIPS
      </h2>

      <div className="flex flex-col gap-3">
        {selectedTips.map((tip, i) => (
          <div key={i} className="bg-white text-black p-3 rounded shadow">
            ✅ {tip}
          </div>
        ))}
      </div>

      {/* 🔙 BACK TO LIST */}
      <button
        onClick={() => setSelectedDisaster(null)}
        className="mt-6 bg-black text-white px-4 py-2 rounded"
      >
        ⬅ Back
      </button>
    </div>
  )}

</div>

)}

    </div>
  );
}
