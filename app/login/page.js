"use client";
import { useLanguage } from "../context/LanguageContext";
import useTranslation from "../utils/useTranslation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "../components/BackButton";
import LanguageSelector from "../components/LanguageSelector";

export default function Login() {
const router = useRouter();
const { lang } = useLanguage();
const { t } = useTranslation(lang);
const [showPassword, setShowPassword] = useState(false);
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [userData, setUserData] = useState(null);




useEffect(() => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.length > 0) {
    setUserData(users[0]); // just show first user icon
  }
}, []);

  const handleLogin = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const admins = JSON.parse(localStorage.getItem("admins")) || [];

  // 🔍 Find user
  const foundUser = users.find(
    (u) =>
      u.username === username &&
      u.password === password
  );

  // 🔍 Find admin
  const foundAdmin = admins.find(
    (a) =>
      a.username === username &&
      a.password === password
  );

  console.log("Users:", users);
  console.log("Admins:", admins);
  console.log("Entered:", username, password);

  if (foundUser) {
    localStorage.setItem("role", "user");
    router.push("/user");
  } else if (foundAdmin) {
    localStorage.setItem("role", "admin");
    router.push("/admin");
  } else {
    alert(t.invalidCredentials || "❌ Invalid Credentials");
  }
};

  return (
    <div className="flex flex-col items-center mt-20 gap-3">
       
       
<div className="flex justify-end items-center gap-2 mb-4">
  <LanguageSelector />
  <BackButton redirectTo="/" />
</div>


    
      <h2 className="text-xl font-bold">{t.login}</h2>
      <input
  placeholder={t.username}
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  className="border p-2 pr-10"
/>
      <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder={t.password}
    value={password}
    onChange={(e) => {
  let value = e.target.value;

  // 👤 USER → only numbers
  if (username.startsWith("_U")) {
    value = value.replace(/\D/g, "");
  }

  // 🛡 ADMIN → allow everything (no restriction)
  if (username.startsWith("_A")) {
    value = value; // no filtering
  }

  setPassword(value);
}}

    className="border p-2 pr-10"
  />

  <span
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-2 cursor-pointer"
  >
    {showPassword ? "🙈" : "👁️"}
  </span>
</div>

<p className="text-sm text-gray-500">
  {username.startsWith("_A")
    ? "Admin: Use letters, numbers & symbols"
    : username.startsWith("_U")
    ? "User: Only numbers allowed"
    : "Enter username first"}
</p>
      

      <button
        onClick={handleLogin}
        className="bg-green-500 text-white p-2 rounded"
      >
       
        {t.login}
      </button>
    </div>
  );
}