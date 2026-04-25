// "use client";
// import { useEffect, useState } from "react";

// const translations = {
//   en: {
//     title: "Project Sarathi",
//     guide: "Guide Me",
//     waiting: "Waiting for alerts..."
//   },
//   hi: {
//     title: "परियोजना सारथी",
//     guide: "मदद करें",
//     waiting: "अलर्ट की प्रतीक्षा..."
//   },
//   mr: {
//     title: "प्रोजेक्ट सारथी",
//     guide: "मदत करा",
//     waiting: "सूचना येण्याची प्रतीक्षा..."
//   },
// };


// const disasterColors = {
//   fire: "bg-red-600",
//   flood: "bg-blue-600",
//   earthquake: "bg-orange-500",
//   gas: "bg-green-500",
//   chemical: "bg-purple-600",
//   cyclone: "bg-indigo-600",
//   tsunami: "bg-cyan-600",
//   heatwave: "bg-yellow-500",
//   coldwave: "bg-blue-300",
//   landslide: "bg-amber-700",
//   default: "bg-gray-600",
// };

// export default function Home() {
//   const [alert, setAlert] = useState(null);
//   const [lang, setLang] = useState("en");
//   const [showGuidePage, setShowGuidePage] = useState(false);
//   const [showGuide, setShowGuide] = useState(false);

//   useEffect(() => {
//     const savedLang = localStorage.getItem("lang");
//     if (savedLang) setLang(savedLang);

//     const data = localStorage.getItem("alert");
//     if (data) setAlert(JSON.parse(data));
//   }, []);

//   const t = translations[lang] || translations.en;
//   const type = alert?.type?.trim().toLowerCase()||
//   "default";
//   const color = disasterColors[type] || disasterColors.default;
 
//   const speakGuide = (type) => {
//   let message = "";

//   if (lang === "hi") {
//     if (type === "gas") message = "नाक ढकें और तुरंत दूर जाएं";
//     else if (type === "fire") message = "तुरंत बाहर निकलें";
//     else if (type === "earthquake") message = "टेबल के नीचे छिपें";
//     else if (type === "flood") message = "ऊंचे स्थान पर जाएं";
//     else if (type === "cyclone") message = "घर के अंदर रहें";
//     else if (type === "tsunami") message = "समुद्र से दूर जाएं";
//     else if (type === "heatwave") message = "पानी पीते रहें";
//     else if (type === "coldwave") message = "गर्म कपड़े पहनें";
//     else if (type === "landslide") message = "सुरक्षित स्थान पर जाएं";
//     else message = "सुरक्षित स्थान पर जाएं";
//   } 
//   else if (lang === "mr") {
//     if (type === "gas") message = "नाक झाका आणि दूर जा";
//     else if (type === "fire") message = "लगेच बाहेर पडा";
//     else if (type === "earthquake") message = "टेबलखाली लपून बसा";
//     else if (type === "flood") message = "उंच ठिकाणी जा";
//     else if (type === "cyclone") message = "घरात राहा";
//     else if (type === "tsunami") message = "समुद्रापासून दूर जा";
//     else if (type === "heatwave") message = "पाणी प्या";
//     else if (type === "coldwave") message = "उबदार कपडे घाला";
//     else if (type === "landslide") message = "सुरक्षित ठिकाणी जा";
//     else message = "सुरक्षित ठिकाणी जा";
//   } 
//   else {
//     if (type === "gas") message = "Cover your nose and move away";
//     else if (type === "fire") message = "Exit immediately";
//     else if (type === "earthquake") message = "Take cover under a table";
//     else if (type === "flood") message = "Move to higher ground";
//     else if (type === "cyclone") message = "Stay indoors";
//     else if (type === "tsunami") message = "Move away from sea";
//     else if (type === "heatwave") message = "Stay hydrated";
//     else if (type === "coldwave") message = "Wear warm clothes";
//     else if (type === "landslide") message = "Move to safe area";
//     else message = "Move to a safe place";
//   }

//   const speech = new SpeechSynthesisUtterance(message);
//   speech.lang = lang === "hi" ? "hi-IN" : lang === "mr" ? "mr-IN" : "en-US";

//   window.speechSynthesis.cancel();
//   setTimeout(() => {
//     window.speechSynthesis.speak(speech);
//   }, 200);
// };
// const translateMessage = (message, type) => {
//   type = type.toLowerCase();

//   if (lang === "hi") {
//   if (type === "gas") return `⚠️ ज़हरीली गैस का रिसाव, तुरंत दूर जाएं`;
//   if (type === "fire") return `🔥 आग लग गई है, तुरंत बाहर निकलें`;
//   if (type === "earthquake") return `🌍 भूकंप आया है, सुरक्षित स्थान पर जाएं`;
//   if (type === "flood") return `🌊 बाढ़ आ रही है, ऊंचे स्थान पर जाएं`;
//   if (type === "cyclone") return `🌀 चक्रवात आ रहा है, घर के अंदर रहें`;
//   if (type === "tsunami") return `🌊🌪️ सुनामी का खतरा, ऊंचे स्थान पर जाएं`;
//   if (type === "heatwave") return `🔥☀️ हीटवेव, पानी पीते रहें`;
//   if (type === "coldwave") return `❄️ कोल्डवेव, गर्म कपड़े पहनें`;
//   if (type === "landslide") return `🏔️⚠️ भूस्खलन का खतरा, सुरक्षित स्थान पर जाएं`;
// } 
// else if (lang === "mr") {
//   if (type === "gas") return `⚠️ विषारी वायू गळती, लगेच दूर जा`;
//   if (type === "fire") return `🔥 आग लागली आहे, लगेच बाहेर पडा`;
//   if (type === "earthquake") return `🌍 भूकंप झाला आहे, सुरक्षित ठिकाणी जा`;
//   if (type === "flood") return `🌊 पूर येत आहे, उंच ठिकाणी जा`;
//   if (type === "cyclone") return `🌀 चक्रीवादळ येत आहे, घरात राहा`;
//   if (type === "tsunami") return `🌊🌪️ सुनामीचा धोका, उंच ठिकाणी जा`;
//   if (type === "heatwave") return `🔥☀️ उष्णतेची लाट, पाणी प्या`;
//   if (type === "coldwave") return `❄️ थंडीची लाट, उबदार कपडे घाला`;
//   if (type === "landslide") return `🏔️⚠️ दरड कोसळण्याचा धोका, सुरक्षित ठिकाणी जा`;
// } 

// else {
//   if (type === "gas") return `⚠️ TOXIC GAS LEAK, MOVE AWAY IMMEDIATELY`;
//   if (type === "fire") return `🔥 FIRE DETECTED, EXIT IMMEDIATELY`;
//   if (type === "earthquake") return `🌍 EARTHQUAKE DETECTED, TAKE COVER`;
//   if (type === "flood") return `🌊 FLOOD INCOMING, MOVE TO HIGHER GROUND`;
//   if (type === "cyclone") return `🌀 CYCLONE APPROACHING, STAY INDOORS`;
//   if (type === "tsunami") return `🌊🌪️ TSUNAMI WARNING, MOVE AWAY FROM SEA`;
//   if (type === "heatwave") return `🔥☀️ HEATWAVE ALERT, STAY HYDRATED`;
//   if (type === "coldwave") return `❄️ COLDWAVE ALERT, STAY WARM`;
//   if (type === "landslide") return `🏔️⚠️ LANDSLIDE RISK, MOVE TO SAFE AREA`;
// }


// };

// const getGuideSteps = (type) => {
//   const t = type?.trim().toLowerCase(); // ✅ use this

//   // 🌐 HINDI
//   if (lang === "hi") {
//     if (t === "earthquake") return ["टेबल के नीचे छिपें", "खिड़कियों से दूर रहें", "लिफ्ट का उपयोग न करें"];
//     if (t === "flood") return ["ऊंचे स्थान पर जाएं", "पानी से दूर रहें", "बिजली बंद करें"];
//     if (t === "fire") return ["तुरंत बाहर निकलें", "सीढ़ियों का उपयोग करें", "नाक ढकें"];
//     if (t === "gas") return ["नाक ढकें", "दूर जाएं", "आग से बचें"];
//     if (t === "cyclone") return ["घर के अंदर रहें", "खिड़कियां बंद करें", "यात्रा से बचें"];
//     if (t === "tsunami") return ["ऊंचे स्थान पर जाएं", "समुद्र से दूर रहें", "अलर्ट का पालन करें"];
//     if (t === "heatwave") return ["पानी पीते रहें", "धूप से बचें", "घर के अंदर रहें"];
//     if (t === "coldwave") return ["गर्म कपड़े पहनें", "घर के अंदर रहें", "ठंड से बचें"];
//     if (t === "landslide") return ["ढलानों से दूर रहें", "सतर्क रहें", "जरूरत हो तो सुरक्षित स्थान पर जाएं"];

//     return ["सुरक्षित स्थान पर जाएं"];
//   }

//   // 🌐 MARATHI
//   else if (lang === "mr") {
//     if (t === "earthquake") return ["टेबलखाली लपा", "खिडक्यांपासून दूर रहा", "लिफ्ट वापरू नका"];
//     if (t === "flood") return ["उंच ठिकाणी जा", "पाण्यापासून दूर रहा", "वीज बंद करा"];
//     if (t === "fire") return ["लगेच बाहेर पडा", "पायऱ्या वापरा", "नाक झाका"];
//     if (t === "gas") return ["नाक झाका", "दूर जा", "आगीपासून दूर रहा"];
//     if (t === "cyclone") return ["घरात राहा", "खिडक्या बंद ठेवा", "प्रवास टाळा"];
//     if (t === "tsunami") return ["उंच ठिकाणी जा", "समुद्रापासून दूर रहा", "सूचना पाळा"];
//     if (t === "heatwave") return ["पाणी प्या", "उन्हापासून दूर रहा", "घरात राहा"];
//     if (t === "coldwave") return ["उबदार कपडे घाला", "घरात राहा", "थंडीपासून बचाव करा"];
//     if (t === "landslide") return ["डोंगर उतारापासून दूर रहा", "सतर्क रहा", "गरज असल्यास स्थलांतर करा"];

//     return ["सुरक्षित ठिकाणी जा"];
//   }

//   // 🌐 ENGLISH (default)
//   else {
//     if (t === "earthquake") return ["Take cover under table", "Stay away from windows", "Do not use lifts"];
//     if (t === "flood") return ["Move to higher ground", "Avoid water", "Turn off electricity"];
//     if (t === "fire") return ["Exit immediately", "Use stairs", "Cover nose"];
//     if (t === "gas") return ["Cover nose", "Move away", "Avoid fire"];
//     if (t === "cyclone") return ["Stay indoors", "Close windows", "Avoid travel"];
//     if (t === "tsunami") return ["Move to higher ground", "Stay away from sea", "Follow alerts"];
//     if (t === "heatwave") return ["Drink water", "Avoid sun", "Stay indoors"];
//     if (t === "coldwave") return ["Wear warm clothes", "Stay indoors", "Avoid exposure"];
//     if (t === "landslide") return ["Move away from slopes", "Stay alert", "Evacuate if needed"];

//     return ["Move to safe place"];
//   }
// };

// const getAlertTitle = (type) => {
//   type = type.toLowerCase();

//   if (lang === "hi") {
//     if (type === "fire") return "आग अलर्ट!";
//     if (type === "flood") return "बाढ़ अलर्ट!";
//     if (type === "earthquake") return "भूकंप अलर्ट!";
//     if (type === "gas") return "गैस अलर्ट!";
//     if (type === "cyclone") return "चक्रवात अलर्ट!";
//     if (type === "tsunami") return "सुनामी अलर्ट!";
//     if (type === "heatwave") return "हीटवेव अलर्ट!";
//     if (type === "coldwave") return "कोल्डवेव अलर्ट!";
//     if (type === "landslide") return "भूस्खलन अलर्ट!";
    
//   } 
//   else if (lang === "mr") {
//     if (type === "fire") return "आग सूचना!";
//     if (type === "flood") return "पूर सूचना!";
//     if (type === "earthquake") return "भूकंप सूचना!";
//     if (type === "gas") return "गॅस सूचना!";
//     if (type === "cyclone") return "चक्रीवादळ सूचना!";
//     if (type === "tsunami") return "सुनामी सूचना!";
//     if (type === "heatwave") return "उष्णता सूचना!";
//     if (type === "coldwave") return "थंडी सूचना!";
//     if (type === "landslide") return "दरड सूचना!";
    
//   } 
//   else {
//     return `${type.toUpperCase()} ALERT!`;
//   }
// };

//   return (
//     <div className="h-screen flex flex-col items-center justify-center bg-blue-50">

//       {/* Language Selector */}
      
//       <h1 className="text-3xl text-gray-700 mb-4">{t.title}</h1>
//       <p className="text-gray-500">{t.waiting}</p>

//       {/* ALERT SCREEN */}
//       {alert && (
//   <div className={`fixed inset-0 ${color} text-white flex flex-col items-center justify-center z-50`}>

//   {/* ✅ ADD THIS */}
//   <select
//     value={lang}
//     onChange={(e) => {
//       setLang(e.target.value);
//       localStorage.setItem("lang", e.target.value);
//     }}
//     className="absolute top-5 right-5 p-2 text-black rounded"
//   >
//     <option value="en">English</option>
//     <option value="hi">Hindi</option>
//     <option value="mr">Marathi</option>
//   </select>

      
// {!showGuidePage ? (

//   // 🟥 ALERT SCREEN
//   <>
   
//     <h1 className="text-6xl font-bold mb-6">
     
//       {getAlertTitle(alert.type)}
//     </h1>

//     <p className="text-2xl mb-6 text-center px-6">
//       {alert.message}
//     </p>

//     <button
//       onClick={() => {
//         setShowGuidePage(true);
//         speakGuide(alert.type);
//       }}
//       className="bg-white text-black px-6 py-3 rounded-lg mb-4 animate-pulse"
//     >
//       {t.guide}
//     </button>
//   </>

// ) : (

//   // 🟩 GUIDE SCREEN
//   <>
//   {/* ✅ SYSTEM MESSAGE BOX (ONLY THIS IS WHITE BOX) */}
//   <div className="mb-6 px-6 py-4 rounded-lg text-center text-lg font-semibold shadow-lg bg-white text-black w-[85%] max-w-md">
//     {translateMessage("", alert.type)}
//   </div>

//   {/* ✅ SAFETY STEPS TITLE */}
//   <h2 className="text-3xl font-bold mb-4">
//     {lang === "hi"
//       ? "🛟 सुरक्षा कदम"
//       : lang === "mr"
//       ? "🛟 सुरक्षा पावले"
//       : "🛟 SAFETY STEPS"}
//   </h2>

//   {/* ✅ STEPS (SEPARATE STYLE — NOT BOX) */}
//   <div className="flex flex-col gap-3 w-[85%] max-w-md">
//     {getGuideSteps(alert.type).map((step, i) => (
//       <div
//         key={i}
        
//         className="flex items-center gap-3 bg-black/20 text-white px-4 py-3 rounded-lg"
//       >
//         <span className="text-xl">✅</span>
//         <span>{step}</span>
//       </div>
//     ))}
//   </div>

//   {/* ✅ BACK BUTTON */}
//   <button
//     onClick={() => setShowGuidePage(false)}
//     className="mt-6 bg-white text-black px-4 py-2 rounded"
//   >
//     ⬅ Back
//   </button>
// </>

// )}

//     <button
//       onClick={() => {
//         setAlert(null);
//         localStorage.removeItem("alert");
//       }}
//       className="bg-black px-4 py-2 rounded"
//     >
//       Dismiss
//     </button>
//   </div>
// )}
//     </div>
//   );
// }
"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-black text-white">
      <h1 className="text-4xl font-bold">WELCOME TO SARATHI</h1>
      <p className="mt-2">Because Every Life Matters</p>

      <div className="mt-6 space-x-4">
        <button onClick={() => router.push("/register")} className="bg-blue-500 px-4 py-2 rounded">
          Register
        </button>

        <button onClick={() => router.push("/login")} className="bg-green-500 px-4 py-2 rounded">
          Login
        </button>
      </div>
    </div>
  );
}