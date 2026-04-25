// export default function LanguageSelector({ lang, setLang }) {

//   const changeLang = (value) => {
//     setLang(value); // ✅ update parent (NO refresh)
//     localStorage.setItem("lang", value); // ✅ persist
//   };

//   return (
//     <select
//       value={lang}
//       onChange={(e) => changeLang(e.target.value)}
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

import { useLanguage } from "../context/LanguageContext";

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      className="fixed top-4 right-28 bg-white text-black border shadow px-4 py-2 rounded z-50"
    >
      <option value="en">English</option>
      <option value="hi">Hindi</option>
      <option value="mr">Marathi</option>
      <option value="gu">Gujarati</option>
      <option value="ta">Tamil</option>
      <option value="te">Telugu</option>
      <option value="kn">Kannada</option>
      <option value="ml">Malayalam</option>
      <option value="bn">Bengali</option>
      <option value="pa">Punjabi</option>
      <option value="or">Odia</option>
    </select>
  );
}