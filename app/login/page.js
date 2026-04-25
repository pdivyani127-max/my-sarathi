// "use client";
// import { useLanguage } from "../context/LanguageContext";
// import useTranslation from "../utils/useTranslation";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import BackButton from "../components/BackButton";
// import LanguageSelector from "../components/LanguageSelector";

// export default function Login() {
// const router = useRouter();
// const { lang } = useLanguage();
// const { t } = useTranslation(lang);
// const [showPassword, setShowPassword] = useState(false);
// const [username, setUsername] = useState("");
// const [password, setPassword] = useState("");
// const [userData, setUserData] = useState(null);




// useEffect(() => {
//   const users = JSON.parse(localStorage.getItem("users")) || [];
//   if (users.length > 0) {
//     setUserData(users[0]); // just show first user icon
//   }
// }, []);

//   const handleLogin = () => {
//   const users = JSON.parse(localStorage.getItem("users")) || [];
//   const admins = JSON.parse(localStorage.getItem("admins")) || [];

//   // 🔍 Find user
//   const foundUser = users.find(
//     (u) =>
//       u.username === username &&
//       u.password === password
//   );

//   // 🔍 Find admin
//   const foundAdmin = admins.find(
//     (a) =>
//       a.username === username &&
//       a.password === password
//   );

//   console.log("Users:", users);
//   console.log("Admins:", admins);
//   console.log("Entered:", username, password);

//   if (foundUser) {
//     localStorage.setItem("role", "user");
//     router.push("/user");
//   } else if (foundAdmin) {
//     localStorage.setItem("role", "admin");
//     router.push("/admin");
//   } else {
//     alert(t.invalidCredentials || "❌ Invalid Credentials");
//   }
// };

//   return (
//     <div className="flex flex-col items-center mt-20 gap-3">
       
       
// <div className="flex justify-end items-center gap-2 mb-4">
//   <LanguageSelector />
//   <BackButton redirectTo="/" />
// </div>


    
//       <h2 className="text-xl font-bold">{t.login}</h2>
//       <input
//   placeholder={t.username}
//   value={username}
//   onChange={(e) => setUsername(e.target.value)}
//   className="border p-2 pr-10"
// />
//       <div className="relative">
//   <input
//     type={showPassword ? "text" : "password"}
//     placeholder={t.password}
//     value={password}
//     onChange={(e) => {
//   let value = e.target.value;

//   // 👤 USER → only numbers
//   if (username.startsWith("_U")) {
//     value = value.replace(/\D/g, "");
//   }

//   // 🛡 ADMIN → allow everything (no restriction)
//   if (username.startsWith("_A")) {
//     value = value; // no filtering
//   }

//   setPassword(value);
// }}

//     className="border p-2 pr-10"
//   />

//   <span
//     onClick={() => setShowPassword(!showPassword)}
//     className="absolute right-3 top-2 cursor-pointer"
//   >
//     {showPassword ? "🙈" : "👁️"}
//   </span>
// </div>

// <p className="text-sm text-gray-500">
//   {username.startsWith("_A")
//     ? "Admin: Use letters, numbers & symbols"
//     : username.startsWith("_U")
//     ? "User: Only numbers allowed"
//     : "Enter username first"}
// </p>
      

//       <button
//         onClick={handleLogin}
//         className="bg-green-500 text-white p-2 rounded"
//       >
       
//         {t.login}
//       </button>
//     </div>
//   );
// }

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.length > 0) {
      setUserData(users[0]);
    }
  }, []);

  const getRoleType = () => {
    if (username.startsWith("_A")) return "admin";
    if (username.startsWith("_U")) return "user";
    return "unknown";
  };

  const handleLogin = async () => {
    setError("");
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 900));

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const admins = JSON.parse(localStorage.getItem("admins")) || [];

    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );
    const foundAdmin = admins.find(
      (a) => a.username === username && a.password === password
    );

    if (foundUser) {
      localStorage.setItem("role", "user");
      router.push("/user");
    } else if (foundAdmin) {
      localStorage.setItem("role", "admin");
      router.push("/admin");
    } else {
      setIsLoading(false);
      setError(t.invalidCredentials || "❌ Invalid username or password.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const roleType = getRoleType();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .sarathi-login-root {
          min-height: 100vh;
          background: #050810;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Sora', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Grid background */
        .sarathi-login-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(220,38,38,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220,38,38,0.07) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        /* Glow orbs */
        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          opacity: 0.35;
        }
        .orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #dc2626, transparent 70%);
          top: -150px; right: -100px;
        }
        .orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #1e3a8a, transparent 70%);
          bottom: -100px; left: -100px;
        }

        /* Top bar */
        .top-bar {
          position: fixed;
          top: 0; left: 0; right: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          z-index: 50;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(5,8,16,0.6);
          backdrop-filter: blur(12px);
        }

        .brand {
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: #fff;
          letter-spacing: 1px;
        }
        .brand span { color: #ef4444; }

        .top-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* Card */
        .login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 440px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 44px 40px;
          backdrop-filter: blur(20px);
          box-shadow: 0 0 80px rgba(220,38,38,0.08), 0 24px 60px rgba(0,0,0,0.5);
          opacity: 0;
          transform: translateY(24px);
          animation: cardIn 0.6s ease forwards;
        }
        @keyframes cardIn {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Shield icon */
        .shield-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 28px;
        }
        .shield {
          width: 64px; height: 64px;
          background: linear-gradient(135deg, rgba(220,38,38,0.2), rgba(220,38,38,0.05));
          border: 1px solid rgba(220,38,38,0.3);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          box-shadow: 0 0 24px rgba(220,38,38,0.2);
        }

        .login-title {
          text-align: center;
          font-size: 26px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }
        .login-subtitle {
          text-align: center;
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 36px;
        }

        /* Role pill */
        .role-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-family: 'JetBrains Mono', monospace;
          margin-bottom: 20px;
          transition: all 0.3s;
        }
        .role-pill.admin {
          background: rgba(220,38,38,0.12);
          border: 1px solid rgba(220,38,38,0.3);
          color: #f87171;
        }
        .role-pill.user {
          background: rgba(59,130,246,0.12);
          border: 1px solid rgba(59,130,246,0.3);
          color: #60a5fa;
        }
        .role-pill.unknown {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.3);
        }
        .role-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: currentColor;
        }
        .role-pill.admin .role-dot { animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

        /* Input group */
        .input-group {
          margin-bottom: 16px;
        }
        .input-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        .input-wrap {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          pointer-events: none;
        }
        .sarathi-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 13px 14px 13px 42px;
          font-size: 14px;
          font-family: 'Sora', sans-serif;
          color: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .sarathi-input::placeholder { color: rgba(255,255,255,0.2); }
        .sarathi-input:focus {
          border-color: rgba(220,38,38,0.5);
          box-shadow: 0 0 0 3px rgba(220,38,38,0.08);
          background: rgba(255,255,255,0.06);
        }
        .sarathi-input.admin-input:focus {
          border-color: rgba(220,38,38,0.5);
          box-shadow: 0 0 0 3px rgba(220,38,38,0.08);
        }
        .sarathi-input.user-input:focus {
          border-color: rgba(59,130,246,0.5);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.08);
        }

        .eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          opacity: 0.5;
          transition: opacity 0.2s;
          padding: 0;
        }
        .eye-btn:hover { opacity: 1; }

        /* Password hint */
        .pw-hint {
          margin-top: 6px;
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          font-family: 'JetBrains Mono', monospace;
          padding-left: 4px;
        }
        .pw-hint.admin { color: #f87171; }
        .pw-hint.user { color: #60a5fa; }

        /* Error */
        .error-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(220,38,38,0.1);
          border: 1px solid rgba(220,38,38,0.3);
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 13px;
          color: #f87171;
          margin-bottom: 16px;
          animation: shake 0.4s ease;
        }
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          25%{transform:translateX(-6px)}
          75%{transform:translateX(6px)}
        }

        /* Login button */
        .login-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
          transition: transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.5px;
        }
        .login-btn.default {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: #fff;
          box-shadow: 0 4px 20px rgba(220,38,38,0.35);
        }
        .login-btn.user-btn {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #fff;
          box-shadow: 0 4px 20px rgba(59,130,246,0.35);
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(220,38,38,0.45);
        }
        .login-btn.user-btn:hover:not(:disabled) {
          box-shadow: 0 6px 28px rgba(59,130,246,0.45);
        }
        .login-btn:active:not(:disabled) { transform: scale(0.98); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Spinner */
        .spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0 20px;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }
        .divider-text {
          font-size: 11px;
          color: rgba(255,255,255,0.25);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Register link */
        .register-link {
          text-align: center;
          font-size: 13px;
          color: rgba(255,255,255,0.35);
        }
        .register-link a {
          color: #ef4444;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .register-link a:hover { color: #f87171; text-decoration: underline; }

        /* Emergency strip */
        .sos-strip {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: rgba(220,38,38,0.9);
          padding: 10px;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          letter-spacing: 0.5px;
          z-index: 50;
          backdrop-filter: blur(8px);
        }
        .sos-strip span { animation: blink 1.4s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      <div className="sarathi-login-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        {/* Top bar */}
        <div className="top-bar">
          <div className="brand">SARA<span>THI</span></div>
          <div className="top-right">
            <LanguageSelector />
            <BackButton redirectTo="/" />
          </div>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <div className="shield-wrap">
            <div className="shield">🛡️</div>
          </div>

          <h1 className="login-title">{t.login || "Secure Login"}</h1>
          <p className="login-subtitle">Because Every Life Matters</p>

          {/* Role indicator pill */}
          <div className={`role-pill ${roleType}`}>
            <div className="role-dot" />
            {roleType === "admin" && "🛡️ Admin Access — Government Portal"}
            {roleType === "user" && "👤 Citizen Login"}
            {roleType === "unknown" && "Enter your username to continue"}
          </div>

          {/* Username */}
          <div className="input-group">
            <label className="input-label">{t.username || "Username"}</label>
            <div className="input-wrap">
              <span className="input-icon">👤</span>
              <input
                className={`sarathi-input ${roleType === "admin" ? "admin-input" : roleType === "user" ? "user-input" : ""}`}
                placeholder={t.username || "e.g. _U12345 or _A67890"}
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label className="input-label">{t.password || "Password"}</label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                className={`sarathi-input ${roleType === "admin" ? "admin-input" : roleType === "user" ? "user-input" : ""}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  let value = e.target.value;
                  if (username.startsWith("_U")) value = value.replace(/\D/g, "");
                  setPassword(value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
              />
              <button className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <p className={`pw-hint ${roleType}`}>
              {roleType === "admin" && "Admin: letters, numbers & symbols allowed"}
              {roleType === "user" && "User: numbers only"}
              {roleType === "unknown" && "Enter username first to see password rules"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="error-box">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Login Button */}
          <button
            className={`login-btn ${roleType === "user" ? "user-btn" : "default"}`}
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <><span className="spinner" />Verifying...</>
            ) : (
              t.login || "Login to Sarathi"
            )}
          </button>

          <div className="divider">
            <div className="divider-line" />
            <div className="divider-text">New here?</div>
            <div className="divider-line" />
          </div>

          <div className="register-link">
            Don&apos;t have an account?{" "}
            <a href="/register">Register now</a>
          </div>
        </div>

        {/* SOS strip */}
        <div className="sos-strip">
          <span>🚨</span> Emergency Helpline: <strong>112</strong> &nbsp;|&nbsp; Available 24×7 — <span>Because Every Life Matters</span>
        </div>
      </div>
    </>
  );
}
