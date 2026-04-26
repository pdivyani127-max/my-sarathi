

// // "use client";
// // import { useLanguage } from "../context/LanguageContext";
// // import useTranslation from "../utils/useTranslation";
// // import { useState, useEffect } from "react";
// // import { useRouter } from "next/navigation";
// // import BackButton from "../components/BackButton";
// // import LanguageSelector from "../components/LanguageSelector";
// // import { findUser, findAdmin } from "../lib/firebaseHelpers";

// // export default function Login() {
// //   const router = useRouter();
// //   const { lang } = useLanguage();
// //   const { t } = useTranslation(lang);
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [username, setUsername] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   const getRoleType = () => {
// //     if (username.startsWith("_A")) return "admin";
// //     if (username.startsWith("_U")) return "user";
// //     return "unknown";
// //   };

// //   // ✅ Updated: checks Firebase instead of localStorage
// //   const handleLogin = async () => {
// //     setError("");
// //     if (!username || !password) {
// //       setError("Please enter both username and password.");
// //       return;
// //     }

// //     setIsLoading(true);
// //     try {
// //       // Check Firebase for user
// //       const foundUser = await findUser(username, password);
// //       if (foundUser) {
// //         localStorage.setItem("role", "user");
// //         router.push("/user");
// //         return;
// //       }

// //       // Check Firebase for admin
// //       const foundAdmin = await findAdmin(username, password);
// //       if (foundAdmin) {
// //         localStorage.setItem("role", "admin");
// //         router.push("/admin");
// //         return;
// //       }

// //       // Neither found
// //       setError(t.invalidCredentials || "❌ Invalid username or password.");
// //     } catch (err) {
// //       console.error("Login error:", err);
// //       setError("Something went wrong. Please try again.");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleKeyDown = (e) => {
// //     if (e.key === "Enter") handleLogin();
// //   };

// //   const roleType = getRoleType();

// //   return (
// //     <>
// //       <style>{`
// //         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
// //         * { box-sizing: border-box; margin: 0; padding: 0; }
// //         .sarathi-login-root { min-height: 100vh; background: #050810; display: flex; align-items: center; justify-content: center; font-family: 'Sora', sans-serif; position: relative; overflow: hidden; }
// //         .sarathi-login-root::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(rgba(220,38,38,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.07) 1px, transparent 1px); background-size: 48px 48px; pointer-events: none; }
// //         .orb { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; opacity: 0.35; }
// //         .orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, #dc2626, transparent 70%); top: -150px; right: -100px; }
// //         .orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, #1e3a8a, transparent 70%); bottom: -100px; left: -100px; }
// //         .top-bar { position: fixed; top: 0; left: 0; right: 0; display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; z-index: 50; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(5,8,16,0.6); backdrop-filter: blur(12px); }
// //         .brand { font-weight: 700; font-size: 18px; color: #fff; letter-spacing: 1px; }
// //         .brand span { color: #ef4444; }
// //         .top-right { display: flex; align-items: center; gap: 12px; }
// //         .login-card { position: relative; z-index: 10; width: 100%; max-width: 440px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 44px 40px; backdrop-filter: blur(20px); box-shadow: 0 0 80px rgba(220,38,38,0.08), 0 24px 60px rgba(0,0,0,0.5); opacity: 0; transform: translateY(24px); animation: cardIn 0.6s ease forwards; }
// //         @keyframes cardIn { to { opacity: 1; transform: translateY(0); } }
// //         .shield-wrap { display: flex; justify-content: center; margin-bottom: 28px; }
// //         .shield { width: 64px; height: 64px; background: linear-gradient(135deg, rgba(220,38,38,0.2), rgba(220,38,38,0.05)); border: 1px solid rgba(220,38,38,0.3); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; box-shadow: 0 0 24px rgba(220,38,38,0.2); }
// //         .login-title { text-align: center; font-size: 26px; font-weight: 700; color: #fff; letter-spacing: 0.5px; margin-bottom: 6px; }
// //         .login-subtitle { text-align: center; font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 36px; }
// //         .role-pill { display: flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-family: 'JetBrains Mono', monospace; margin-bottom: 20px; transition: all 0.3s; }
// //         .role-pill.admin { background: rgba(220,38,38,0.12); border: 1px solid rgba(220,38,38,0.3); color: #f87171; }
// //         .role-pill.user { background: rgba(59,130,246,0.12); border: 1px solid rgba(59,130,246,0.3); color: #60a5fa; }
// //         .role-pill.unknown { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.3); }
// //         .role-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
// //         .role-pill.admin .role-dot { animation: pulse 1.5s infinite; }
// //         @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
// //         .input-group { margin-bottom: 16px; }
// //         .input-label { display: block; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
// //         .input-wrap { position: relative; }
// //         .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 16px; pointer-events: none; }
// //         .sarathi-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 13px 14px 13px 42px; font-size: 14px; font-family: 'Sora', sans-serif; color: #fff; outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; }
// //         .sarathi-input::placeholder { color: rgba(255,255,255,0.2); }
// //         .sarathi-input:focus { border-color: rgba(220,38,38,0.5); box-shadow: 0 0 0 3px rgba(220,38,38,0.08); background: rgba(255,255,255,0.06); }
// //         .sarathi-input.user-input:focus { border-color: rgba(59,130,246,0.5); box-shadow: 0 0 0 3px rgba(59,130,246,0.08); }
// //         .eye-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 16px; opacity: 0.5; transition: opacity 0.2s; padding: 0; }
// //         .eye-btn:hover { opacity: 1; }
// //         .pw-hint { margin-top: 6px; font-size: 11px; color: rgba(255,255,255,0.3); font-family: 'JetBrains Mono', monospace; padding-left: 4px; }
// //         .pw-hint.admin { color: #f87171; }
// //         .pw-hint.user { color: #60a5fa; }
// //         .error-box { display: flex; align-items: center; gap: 8px; background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.3); border-radius: 10px; padding: 11px 14px; font-size: 13px; color: #f87171; margin-bottom: 16px; animation: shake 0.4s ease; }
// //         @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
// //         .login-btn { width: 100%; padding: 14px; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; font-family: 'Sora', sans-serif; cursor: pointer; margin-top: 8px; transition: transform 0.15s, box-shadow 0.2s; letter-spacing: 0.5px; }
// //         .login-btn.default { background: linear-gradient(135deg, #dc2626, #b91c1c); color: #fff; box-shadow: 0 4px 20px rgba(220,38,38,0.35); }
// //         .login-btn.user-btn { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; box-shadow: 0 4px 20px rgba(59,130,246,0.35); }
// //         .login-btn:hover:not(:disabled) { transform: translateY(-1px); }
// //         .login-btn:active:not(:disabled) { transform: scale(0.98); }
// //         .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
// //         .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 8px; }
// //         @keyframes spin { to { transform: rotate(360deg); } }
// //         .divider { display: flex; align-items: center; gap: 12px; margin: 24px 0 20px; }
// //         .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
// //         .divider-text { font-size: 11px; color: rgba(255,255,255,0.25); text-transform: uppercase; letter-spacing: 1px; }
// //         .register-link { text-align: center; font-size: 13px; color: rgba(255,255,255,0.35); }
// //         .register-link a { color: #ef4444; text-decoration: none; font-weight: 500; transition: color 0.2s; }
// //         .register-link a:hover { color: #f87171; text-decoration: underline; }
// //         .sos-strip { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(220,38,38,0.9); padding: 10px; text-align: center; font-size: 13px; font-weight: 600; color: #fff; letter-spacing: 0.5px; z-index: 50; backdrop-filter: blur(8px); }
// //         .sos-strip span { animation: blink 1.4s infinite; }
// //         @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.5} }
// //       `}</style>

// //       <div className="sarathi-login-root">
// //         <div className="orb orb-1" />
// //         <div className="orb orb-2" />

// //         <div className="top-bar">
// //           <div className="brand">SARA<span>THI</span></div>
// //           <div className="top-right">
// //             <LanguageSelector />
// //             <BackButton redirectTo="/" />
// //           </div>
// //         </div>

// //         <div className="login-card">
// //           <div className="shield-wrap">
// //             <div className="shield">🛡️</div>
// //           </div>

// //           <h1 className="login-title">{t.login || "Secure Login"}</h1>
// //           <p className="login-subtitle">Because Every Life Matters</p>

// //           <div className={`role-pill ${roleType}`}>
// //             <div className="role-dot" />
// //             {roleType === "admin" && "🛡️ Admin Access — Government Portal"}
// //             {roleType === "user" && "👤 Citizen Login"}
// //             {roleType === "unknown" && "Enter your username to continue"}
// //           </div>

// //           <div className="input-group">
// //             <label className="input-label">{t.username || "Username"}</label>
// //             <div className="input-wrap">
// //               <span className="input-icon">👤</span>
// //               <input
// //                 className={`sarathi-input ${roleType === "admin" ? "admin-input" : roleType === "user" ? "user-input" : ""}`}
// //                 placeholder={t.username || "e.g. _U12345 or _A67890"}
// //                 value={username}
// //                 onChange={(e) => { setUsername(e.target.value); setError(""); }}
// //                 onKeyDown={handleKeyDown}
// //                 autoComplete="username"
// //               />
// //             </div>
// //           </div>

// //           <div className="input-group">
// //             <label className="input-label">{t.password || "Password"}</label>
// //             <div className="input-wrap">
// //               <span className="input-icon">🔒</span>
// //               <input
// //                 type={showPassword ? "text" : "password"}
// //                 className={`sarathi-input ${roleType === "admin" ? "admin-input" : roleType === "user" ? "user-input" : ""}`}
// //                 placeholder="••••••••"
// //                 value={password}
// //                 onChange={(e) => {
// //                   let value = e.target.value;
// //                   if (username.startsWith("_U")) value = value.replace(/\D/g, "");
// //                   setPassword(value);
// //                   setError("");
// //                 }}
// //                 onKeyDown={handleKeyDown}
// //                 autoComplete="current-password"
// //               />
// //               <button className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
// //                 {showPassword ? "🙈" : "👁️"}
// //               </button>
// //             </div>
// //             <p className={`pw-hint ${roleType}`}>
// //               {roleType === "admin" && "Admin: letters, numbers & symbols allowed"}
// //               {roleType === "user" && "User: numbers only"}
// //               {roleType === "unknown" && "Enter username first to see password rules"}
// //             </p>
// //           </div>

// //           {error && (
// //             <div className="error-box">
// //               <span>⚠️</span>
// //               <span>{error}</span>
// //             </div>
// //           )}

// //           <button
// //             className={`login-btn ${roleType === "user" ? "user-btn" : "default"}`}
// //             onClick={handleLogin}
// //             disabled={isLoading}
// //           >
// //             {isLoading ? <><span className="spinner" />Verifying...</> : t.login || "Login to Sarathi"}
// //           </button>

// //           <div className="divider">
// //             <div className="divider-line" />
// //             <div className="divider-text">New here?</div>
// //             <div className="divider-line" />
// //           </div>

// //           <div className="register-link">
// //             Don&apos;t have an account?{" "}
// //             <a href="/register">Register now</a>
// //           </div>
// //         </div>

// //         <div className="sos-strip">
// //           <span>🚨</span> Emergency Helpline: <strong>112</strong> &nbsp;|&nbsp; Available 24×7 — <span>Because Every Life Matters</span>
// //         </div>
// //       </div>
// //     </>
// //   );
// // }



// "use client";
// import { useLanguage } from "../context/LanguageContext";
// import useTranslation from "../utils/useTranslation";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import BackButton from "../components/BackButton";
// import LanguageSelector from "../components/LanguageSelector";
// import { findUser, findAdmin } from "../lib/firebaseHelpers";

// export default function Login() {
//   const router = useRouter();
//   const { lang } = useLanguage();
//   const { t } = useTranslation(lang);
//   const [showPassword, setShowPassword] = useState(false);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const getRoleType = () => {
//     if (username.startsWith("_A")) return "admin";
//     if (username.startsWith("_U")) return "user";
//     return "unknown";
//   };

//   const handleLogin = async () => {
//     setError("");
//     if (!username || !password) {
//       setError("Please enter both username and password.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const foundUser = await findUser(username, password);
//       if (foundUser) {
//         localStorage.setItem("role", "user");
//         router.push("/user");
//         return;
//       }

//       const foundAdmin = await findAdmin(username, password);
//       if (foundAdmin) {
//         localStorage.setItem("role", "admin");
//         router.push("/admin");
//         return;
//       }

//       setError(t.invalidCredentials || "❌ Invalid username or password.");
//     } catch (err) {
//       console.error("Login error:", err);
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") handleLogin();
//   };

//   const roleType = getRoleType();

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         .sarathi-login-root { min-height: 100vh; background: #050810; display: flex; align-items: center; justify-content: center; font-family: 'Sora', sans-serif; position: relative; overflow: hidden; }
//         .sarathi-login-root::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(rgba(220,38,38,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.07) 1px, transparent 1px); background-size: 48px 48px; pointer-events: none; }
//         .orb { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; opacity: 0.35; }
//         .orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, #dc2626, transparent 70%); top: -150px; right: -100px; }
//         .orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, #1e3a8a, transparent 70%); bottom: -100px; left: -100px; }
//         .top-bar { position: fixed; top: 0; left: 0; right: 0; display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; z-index: 50; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(5,8,16,0.6); backdrop-filter: blur(12px); }
//         .brand { font-weight: 700; font-size: 18px; color: #fff; letter-spacing: 1px; }
//         .brand span { color: #ef4444; }
//         .top-right { display: flex; align-items: center; gap: 12px; }
//         .login-card { position: relative; z-index: 10; width: 100%; max-width: 440px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 44px 40px; backdrop-filter: blur(20px); box-shadow: 0 0 80px rgba(220,38,38,0.08), 0 24px 60px rgba(0,0,0,0.5); opacity: 0; transform: translateY(24px); animation: cardIn 0.6s ease forwards; }
//         @keyframes cardIn { to { opacity: 1; transform: translateY(0); } }
//         .shield-wrap { display: flex; justify-content: center; margin-bottom: 28px; }
//         .shield { width: 64px; height: 64px; background: linear-gradient(135deg, rgba(220,38,38,0.2), rgba(220,38,38,0.05)); border: 1px solid rgba(220,38,38,0.3); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; box-shadow: 0 0 24px rgba(220,38,38,0.2); }
//         .login-title { text-align: center; font-size: 26px; font-weight: 700; color: #fff; letter-spacing: 0.5px; margin-bottom: 6px; }
//         .login-subtitle { text-align: center; font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 36px; }
//         .role-pill { display: flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-family: 'JetBrains Mono', monospace; margin-bottom: 20px; transition: all 0.3s; }
//         .role-pill.admin { background: rgba(220,38,38,0.12); border: 1px solid rgba(220,38,38,0.3); color: #f87171; }
//         .role-pill.user { background: rgba(59,130,246,0.12); border: 1px solid rgba(59,130,246,0.3); color: #60a5fa; }
//         .role-pill.unknown { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.3); }
//         .role-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
//         .role-pill.admin .role-dot { animation: pulse 1.5s infinite; }
//         @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
//         .input-group { margin-bottom: 16px; }
//         .input-label { display: block; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
//         .input-wrap { position: relative; }
//         .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 16px; pointer-events: none; }
//         .sarathi-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 13px 14px 13px 42px; font-size: 14px; font-family: 'Sora', sans-serif; color: #fff; outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; }
//         .sarathi-input::placeholder { color: rgba(255,255,255,0.2); }
//         .sarathi-input:focus { border-color: rgba(220,38,38,0.5); box-shadow: 0 0 0 3px rgba(220,38,38,0.08); background: rgba(255,255,255,0.06); }
//         .sarathi-input.user-input:focus { border-color: rgba(59,130,246,0.5); box-shadow: 0 0 0 3px rgba(59,130,246,0.08); }
//         .eye-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 16px; opacity: 0.5; transition: opacity 0.2s; padding: 0; }
//         .eye-btn:hover { opacity: 1; }
//         .pw-hint { margin-top: 6px; font-size: 11px; color: rgba(255,255,255,0.3); font-family: 'JetBrains Mono', monospace; padding-left: 4px; }
//         .pw-hint.admin { color: #f87171; }
//         .pw-hint.user { color: #60a5fa; }
//         .error-box { display: flex; align-items: center; gap: 8px; background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.3); border-radius: 10px; padding: 11px 14px; font-size: 13px; color: #f87171; margin-bottom: 16px; animation: shake 0.4s ease; }
//         @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
//         .login-btn { width: 100%; padding: 14px; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; font-family: 'Sora', sans-serif; cursor: pointer; margin-top: 8px; transition: transform 0.15s, box-shadow 0.2s; letter-spacing: 0.5px; }
//         .login-btn.default { background: linear-gradient(135deg, #dc2626, #b91c1c); color: #fff; box-shadow: 0 4px 20px rgba(220,38,38,0.35); }
//         .login-btn.user-btn { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; box-shadow: 0 4px 20px rgba(59,130,246,0.35); }
//         .login-btn:hover:not(:disabled) { transform: translateY(-1px); }
//         .login-btn:active:not(:disabled) { transform: scale(0.98); }
//         .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
//         .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 8px; }
//         @keyframes spin { to { transform: rotate(360deg); } }
//         .divider { display: flex; align-items: center; gap: 12px; margin: 24px 0 20px; }
//         .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
//         .divider-text { font-size: 11px; color: rgba(255,255,255,0.25); text-transform: uppercase; letter-spacing: 1px; }
//         .register-link { text-align: center; font-size: 13px; color: rgba(255,255,255,0.35); }
//         .register-link a { color: #ef4444; text-decoration: none; font-weight: 500; transition: color 0.2s; }
//         .register-link a:hover { color: #f87171; text-decoration: underline; }
//         .sos-strip { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(220,38,38,0.9); padding: 10px; text-align: center; font-size: 13px; font-weight: 600; color: #fff; letter-spacing: 0.5px; z-index: 50; backdrop-filter: blur(8px); }
//         .sos-strip span { animation: blink 1.4s infinite; }
//         @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.5} }
//       `}</style>

//       <div className="sarathi-login-root">
//         <div className="orb orb-1" />
//         <div className="orb orb-2" />

//         <div className="top-bar">
//           <div className="brand">SARA<span>THI</span></div>
//           <div className="top-right">
//             <LanguageSelector />
//             <BackButton redirectTo="/" />
//           </div>
//         </div>

//         <div className="login-card">
//           <div className="shield-wrap">
//             <div className="shield">🛡️</div>
//           </div>

//           <h1 className="login-title">{t.login || "Secure Login"}</h1>
//           <p className="login-subtitle">Because Every Life Matters</p>

//           <div className={`role-pill ${roleType}`}>
//             <div className="role-dot" />
//             {roleType === "admin" && "🛡️ Admin Access — Government Portal"}
//             {roleType === "user" && "👤 Citizen Login"}
//             {roleType === "unknown" && "Enter your username to continue"}
//           </div>

//           <div className="input-group">
//             <label className="input-label">{t.username || "Username"}</label>
//             <div className="input-wrap">
//               <span className="input-icon">👤</span>
//               {/* ✅ autoComplete="off" — field starts blank, browser won't autofill on load */}
//               {/* Browser will still show saved suggestions dropdown when user starts typing */}
//               <input
//                 className={`sarathi-input ${roleType === "admin" ? "admin-input" : roleType === "user" ? "user-input" : ""}`}
//                 placeholder={t.username || "e.g. _U12345 or _A67890"}
//                 value={username}
//                 onChange={(e) => { setUsername(e.target.value); setError(""); }}
//                 onKeyDown={handleKeyDown}
//                 autoComplete="off"
//               />
//             </div>
//           </div>

//           <div className="input-group">
//             <label className="input-label">{t.password || "Password"}</label>
//             <div className="input-wrap">
//               <span className="input-icon">🔒</span>
//               {/* ✅ autoComplete="new-password" — prevents browser from autofilling saved password on load */}
//               <input
//                 type={showPassword ? "text" : "password"}
//                 className={`sarathi-input ${roleType === "admin" ? "admin-input" : roleType === "user" ? "user-input" : ""}`}
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => {
//                   let value = e.target.value;
//                   if (username.startsWith("_U")) value = value.replace(/\D/g, "");
//                   setPassword(value);
//                   setError("");
//                 }}
//                 onKeyDown={handleKeyDown}
//                 autoComplete="new-password"
//               />
//               <button className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? "🙈" : "👁️"}
//               </button>
//             </div>
//             <p className={`pw-hint ${roleType}`}>
//               {roleType === "admin" && "Admin: letters, numbers & symbols allowed"}
//               {roleType === "user" && "User: numbers only"}
//               {roleType === "unknown" && "Enter username first to see password rules"}
//             </p>
//           </div>

//           {error && (
//             <div className="error-box">
//               <span>⚠️</span>
//               <span>{error}</span>
//             </div>
//           )}

//           <button
//             className={`login-btn ${roleType === "user" ? "user-btn" : "default"}`}
//             onClick={handleLogin}
//             disabled={isLoading}
//           >
//             {isLoading ? <><span className="spinner" />Verifying...</> : t.login || "Login to Sarathi"}
//           </button>

//           <div className="divider">
//             <div className="divider-line" />
//             <div className="divider-text">New here?</div>
//             <div className="divider-line" />
//           </div>

//           <div className="register-link">
//             Don&apos;t have an account?{" "}
//             <a href="/register">Register now</a>
//           </div>
//         </div>

//         <div className="sos-strip">
//           <span>🚨</span> Emergency Helpline: <strong>112</strong> &nbsp;|&nbsp; Available 24×7 — <span>Because Every Life Matters</span>
//         </div>
//       </div>
//     </>
//   );
// }



// "use client";
// import { useLanguage } from "../context/LanguageContext";
// import useTranslation from "../utils/useTranslation";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import BackButton from "../components/BackButton";
// import LanguageSelector from "../components/LanguageSelector";
// import { findUser, findAdmin } from "../lib/firebaseHelpers";

// export default function Login() {
//   const router = useRouter();
//   const { lang } = useLanguage();
//   const { t } = useTranslation(lang);
//   const [showPassword, setShowPassword] = useState(false);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);

//   // ✅ On mount: load saved username if exists
//   useEffect(() => {
//     const savedUsername = localStorage.getItem("savedUsername");
//     if (savedUsername) {
//       setUsername(savedUsername);
//       setRememberMe(true);
//     }
//   }, []);

//   const getRoleType = () => {
//     if (username.startsWith("_A")) return "admin";
//     if (username.startsWith("_U")) return "user";
//     return "unknown";
//   };

//   const handleLogin = async () => {
//     setError("");
//     if (!username || !password) {
//       setError("Please enter both username and password.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // ✅ Save or clear username based on rememberMe
//       if (rememberMe) {
//         localStorage.setItem("savedUsername", username);
//       } else {
//         localStorage.removeItem("savedUsername");
//       }

//       const foundUser = await findUser(username, password);
//       if (foundUser) {
//         localStorage.setItem("role", "user");
//         router.push("/user");
//         return;
//       }

//       const foundAdmin = await findAdmin(username, password);
//       if (foundAdmin) {
//         localStorage.setItem("role", "admin");
//         router.push("/admin");
//         return;
//       }

//       setError(t.invalidCredentials || "❌ Invalid username or password.");
//     } catch (err) {
//       console.error("Login error:", err);
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") handleLogin();
//   };

//   // ✅ Clear saved username
//   const handleClearSaved = () => {
//     localStorage.removeItem("savedUsername");
//     setUsername("");
//     setRememberMe(false);
//   };

//   const roleType = getRoleType();

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         .sarathi-login-root { min-height: 100vh; background: #050810; display: flex; align-items: center; justify-content: center; font-family: 'Sora', sans-serif; position: relative; overflow: hidden; }
//         .sarathi-login-root::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(rgba(220,38,38,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.07) 1px, transparent 1px); background-size: 48px 48px; pointer-events: none; }
//         .orb { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; opacity: 0.35; }
//         .orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, #dc2626, transparent 70%); top: -150px; right: -100px; }
//         .orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, #1e3a8a, transparent 70%); bottom: -100px; left: -100px; }
//         .top-bar { position: fixed; top: 0; left: 0; right: 0; display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; z-index: 50; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(5,8,16,0.6); backdrop-filter: blur(12px); }
//         .brand { font-weight: 700; font-size: 18px; color: #fff; letter-spacing: 1px; }
//         .brand span { color: #ef4444; }
//         .top-right { display: flex; align-items: center; gap: 12px; }
//         .login-card { position: relative; z-index: 10; width: 100%; max-width: 440px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 44px 40px; backdrop-filter: blur(20px); box-shadow: 0 0 80px rgba(220,38,38,0.08), 0 24px 60px rgba(0,0,0,0.5); opacity: 0; transform: translateY(24px); animation: cardIn 0.6s ease forwards; }
//         @keyframes cardIn { to { opacity: 1; transform: translateY(0); } }
//         .shield-wrap { display: flex; justify-content: center; margin-bottom: 28px; }
//         .shield { width: 64px; height: 64px; background: linear-gradient(135deg, rgba(220,38,38,0.2), rgba(220,38,38,0.05)); border: 1px solid rgba(220,38,38,0.3); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; box-shadow: 0 0 24px rgba(220,38,38,0.2); }
//         .login-title { text-align: center; font-size: 26px; font-weight: 700; color: #fff; letter-spacing: 0.5px; margin-bottom: 6px; }
//         .login-subtitle { text-align: center; font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 36px; }
//         .role-pill { display: flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-family: 'JetBrains Mono', monospace; margin-bottom: 20px; transition: all 0.3s; }
//         .role-pill.admin { background: rgba(220,38,38,0.12); border: 1px solid rgba(220,38,38,0.3); color: #f87171; }
//         .role-pill.user { background: rgba(59,130,246,0.12); border: 1px solid rgba(59,130,246,0.3); color: #60a5fa; }
//         .role-pill.unknown { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.3); }
//         .role-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
//         .role-pill.admin .role-dot { animation: pulse 1.5s infinite; }
//         @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
//         .input-group { margin-bottom: 16px; }
//         .input-label { display: block; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
//         .input-wrap { position: relative; }
//         .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 16px; pointer-events: none; }
//         .sarathi-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 13px 14px 13px 42px; font-size: 14px; font-family: 'Sora', sans-serif; color: #fff; outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; }
//         .sarathi-input::placeholder { color: rgba(255,255,255,0.2); }
//         .sarathi-input:focus { border-color: rgba(220,38,38,0.5); box-shadow: 0 0 0 3px rgba(220,38,38,0.08); background: rgba(255,255,255,0.06); }
//         .sarathi-input.user-input:focus { border-color: rgba(59,130,246,0.5); box-shadow: 0 0 0 3px rgba(59,130,246,0.08); }
//         .eye-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 16px; opacity: 0.5; transition: opacity 0.2s; padding: 0; }
//         .eye-btn:hover { opacity: 1; }
//         .pw-hint { margin-top: 6px; font-size: 11px; color: rgba(255,255,255,0.3); font-family: 'JetBrains Mono', monospace; padding-left: 4px; }
//         .pw-hint.admin { color: #f87171; }
//         .pw-hint.user { color: #60a5fa; }
//         .error-box { display: flex; align-items: center; gap: 8px; background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.3); border-radius: 10px; padding: 11px 14px; font-size: 13px; color: #f87171; margin-bottom: 16px; animation: shake 0.4s ease; }
//         @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }

//         /* ✅ Remember Me & saved username styles */
//         .remember-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
//         .remember-check { display: flex; align-items: center; gap: 8px; cursor: pointer; }
//         .remember-check input[type="checkbox"] { width: 15px; height: 15px; accent-color: #dc2626; cursor: pointer; }
//         .remember-check span { font-size: 12px; color: rgba(255,255,255,0.4); }
//         .saved-chip { display: flex; align-items: center; gap: 6px; background: rgba(220,38,38,0.08); border: 1px solid rgba(220,38,38,0.2); border-radius: 999px; padding: 4px 10px; font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #f87171; }
//         .saved-chip-clear { background: none; border: none; color: #f87171; cursor: pointer; font-size: 13px; padding: 0; opacity: 0.7; transition: opacity 0.2s; }
//         .saved-chip-clear:hover { opacity: 1; }

//         .login-btn { width: 100%; padding: 14px; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; font-family: 'Sora', sans-serif; cursor: pointer; margin-top: 8px; transition: transform 0.15s, box-shadow 0.2s; letter-spacing: 0.5px; }
//         .login-btn.default { background: linear-gradient(135deg, #dc2626, #b91c1c); color: #fff; box-shadow: 0 4px 20px rgba(220,38,38,0.35); }
//         .login-btn.user-btn { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; box-shadow: 0 4px 20px rgba(59,130,246,0.35); }
//         .login-btn:hover:not(:disabled) { transform: translateY(-1px); }
//         .login-btn:active:not(:disabled) { transform: scale(0.98); }
//         .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
//         .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 8px; }
//         @keyframes spin { to { transform: rotate(360deg); } }
//         .divider { display: flex; align-items: center; gap: 12px; margin: 24px 0 20px; }
//         .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
//         .divider-text { font-size: 11px; color: rgba(255,255,255,0.25); text-transform: uppercase; letter-spacing: 1px; }
//         .register-link { text-align: center; font-size: 13px; color: rgba(255,255,255,0.35); }
//         .register-link a { color: #ef4444; text-decoration: none; font-weight: 500; transition: color 0.2s; }
//         .register-link a:hover { color: #f87171; text-decoration: underline; }
//         .sos-strip { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(220,38,38,0.9); padding: 10px; text-align: center; font-size: 13px; font-weight: 600; color: #fff; letter-spacing: 0.5px; z-index: 50; backdrop-filter: blur(8px); }
//         .sos-strip span { animation: blink 1.4s infinite; }
//         @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.5} }
//       `}</style>

//       <div className="sarathi-login-root">
//         <div className="orb orb-1" />
//         <div className="orb orb-2" />

//         <div className="top-bar">
//           <div className="brand">SARA<span>THI</span></div>
//           <div className="top-right">
//             <LanguageSelector />
//             <BackButton redirectTo="/" />
//           </div>
//         </div>

//         <div className="login-card">
//           <div className="shield-wrap">
//             <div className="shield">🛡️</div>
//           </div>

//           <h1 className="login-title">{t.login || "Secure Login"}</h1>
//           <p className="login-subtitle">Because Every Life Matters</p>

//           <div className={`role-pill ${roleType}`}>
//             <div className="role-dot" />
//             {roleType === "admin" && "🛡️ Admin Access — Government Portal"}
//             {roleType === "user" && "👤 Citizen Login"}
//             {roleType === "unknown" && "Enter your username to continue"}
//           </div>

//           <div className="input-group">
//             <label className="input-label">{t.username || "Username"}</label>
//             <div className="input-wrap">
//               <span className="input-icon">👤</span>
//               <input
//                 className={`sarathi-input ${roleType === "admin" ? "admin-input" : roleType === "user" ? "user-input" : ""}`}
//                 placeholder={t.username || "e.g. _U12345 or _A67890"}
//                 value={username}
//                 onChange={(e) => { setUsername(e.target.value); setError(""); }}
//                 onKeyDown={handleKeyDown}
//                 autoComplete="off"
//               />
//             </div>
//           </div>

//           <div className="input-group">
//             <label className="input-label">{t.password || "Password"}</label>
//             <div className="input-wrap">
//               <span className="input-icon">🔒</span>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 className={`sarathi-input ${roleType === "admin" ? "admin-input" : roleType === "user" ? "user-input" : ""}`}
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => {
//                   let value = e.target.value;
//                   if (username.startsWith("_U")) value = value.replace(/\D/g, "");
//                   setPassword(value);
//                   setError("");
//                 }}
//                 onKeyDown={handleKeyDown}
//                 autoComplete="new-password"
//               />
//               <button className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? "🙈" : "👁️"}
//               </button>
//             </div>
//             <p className={`pw-hint ${roleType}`}>
//               {roleType === "admin" && "Admin: letters, numbers & symbols allowed"}
//               {roleType === "user" && "User: numbers only"}
//               {roleType === "unknown" && "Enter username first to see password rules"}
//             </p>
//           </div>

//           {/* ✅ Remember Me row — with saved username chip if active */}
//           <div className="remember-row">
//             <label className="remember-check">
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={(e) => setRememberMe(e.target.checked)}
//               />
//               <span>Remember my username</span>
//             </label>
//             {localStorage.getItem("savedUsername") && (
//               <div className="saved-chip">
//                 👤 {localStorage.getItem("savedUsername")}
//                 <button className="saved-chip-clear" onClick={handleClearSaved} title="Clear saved username">✕</button>
//               </div>
//             )}
//           </div>

//           {error && (
//             <div className="error-box">
//               <span>⚠️</span>
//               <span>{error}</span>
//             </div>
//           )}

//           <button
//             className={`login-btn ${roleType === "user" ? "user-btn" : "default"}`}
//             onClick={handleLogin}
//             disabled={isLoading}
//           >
//             {isLoading ? <><span className="spinner" />Verifying...</> : t.login || "Login to Sarathi"}
//           </button>

//           <div className="divider">
//             <div className="divider-line" />
//             <div className="divider-text">New here?</div>
//             <div className="divider-line" />
//           </div>

//           <div className="register-link">
//             Don&apos;t have an account?{" "}
//             <a href="/register">Register now</a>
//           </div>
//         </div>

//         <div className="sos-strip">
//           <span>🚨</span> Emergency Helpline: <strong>112</strong> &nbsp;|&nbsp; Available 24×7 — <span>Because Every Life Matters</span>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";
import { useLanguage } from "../context/LanguageContext";
import useTranslation from "../utils/useTranslation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "../components/BackButton";
import LanguageSelector from "../components/LanguageSelector";
import { findUser, findAdmin } from "../lib/firebaseHelpers";

export default function Login() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { t } = useTranslation(lang);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // ✅ On mount: load saved username only for the user who last checked "Remember Me"
  useEffect(() => {
    const savedUsername = localStorage.getItem("savedUsername");
    const wasRemembered = localStorage.getItem("rememberMe") === "true";
    if (savedUsername && wasRemembered) {
      setUsername(savedUsername);
      setRememberMe(true);
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
    try {
      if (rememberMe) {
        // Save this specific user's username and remember preference
        localStorage.setItem("savedUsername", username);
        localStorage.setItem("rememberMe", "true");
      } else {
        // Clear any previously saved username
        localStorage.removeItem("savedUsername");
        localStorage.removeItem("rememberMe");
      }

      const foundUser = await findUser(username, password);
      if (foundUser) {
        localStorage.setItem("role", "user");
        localStorage.setItem("loggedInUsername", username);
        router.push("/user");
        return;
      }

      const foundAdmin = await findAdmin(username, password);
      if (foundAdmin) {
        localStorage.setItem("role", "admin");
        localStorage.setItem("loggedInUsername", username);
        router.push("/admin");
        return;
      }

      setError(t.invalidCredentials || "❌ Invalid username or password.");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
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
        .sarathi-login-root { min-height: 100vh; background: #050810; display: flex; align-items: center; justify-content: center; font-family: 'Sora', sans-serif; position: relative; overflow: hidden; }
        .sarathi-login-root::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(rgba(220,38,38,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.07) 1px, transparent 1px); background-size: 48px 48px; pointer-events: none; }
        .orb { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; opacity: 0.35; }
        .orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, #dc2626, transparent 70%); top: -150px; right: -100px; }
        .orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, #1e3a8a, transparent 70%); bottom: -100px; left: -100px; }
        .top-bar { position: fixed; top: 0; left: 0; right: 0; display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; z-index: 50; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(5,8,16,0.6); backdrop-filter: blur(12px); }
        .brand { font-weight: 700; font-size: 18px; color: #fff; letter-spacing: 1px; }
        .brand span { color: #ef4444; }
        .top-right { display: flex; align-items: center; gap: 12px; }
        .login-card { position: relative; z-index: 10; width: 100%; max-width: 440px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 44px 40px; backdrop-filter: blur(20px); box-shadow: 0 0 80px rgba(220,38,38,0.08), 0 24px 60px rgba(0,0,0,0.5); opacity: 0; transform: translateY(24px); animation: cardIn 0.6s ease forwards; }
        @keyframes cardIn { to { opacity: 1; transform: translateY(0); } }
        .shield-wrap { display: flex; justify-content: center; margin-bottom: 28px; }
        .shield { width: 64px; height: 64px; background: linear-gradient(135deg, rgba(220,38,38,0.2), rgba(220,38,38,0.05)); border: 1px solid rgba(220,38,38,0.3); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; box-shadow: 0 0 24px rgba(220,38,38,0.2); }
        .login-title { text-align: center; font-size: 26px; font-weight: 700; color: #fff; letter-spacing: 0.5px; margin-bottom: 6px; }
        .login-subtitle { text-align: center; font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 36px; }
        .role-pill { display: flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-family: 'JetBrains Mono', monospace; margin-bottom: 20px; transition: all 0.3s; }
        .role-pill.admin { background: rgba(220,38,38,0.12); border: 1px solid rgba(220,38,38,0.3); color: #f87171; }
        .role-pill.user { background: rgba(59,130,246,0.12); border: 1px solid rgba(59,130,246,0.3); color: #60a5fa; }
        .role-pill.unknown { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.3); }
        .role-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
        .role-pill.admin .role-dot { animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .input-group { margin-bottom: 16px; }
        .input-label { display: block; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .input-wrap { position: relative; }
        .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 16px; pointer-events: none; }
        .sarathi-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 13px 14px 13px 42px; font-size: 14px; font-family: 'Sora', sans-serif; color: #fff; outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; }
        .sarathi-input::placeholder { color: rgba(255,255,255,0.2); }
        .sarathi-input:focus { border-color: rgba(220,38,38,0.5); box-shadow: 0 0 0 3px rgba(220,38,38,0.08); background: rgba(255,255,255,0.06); }
        .sarathi-input.user-input:focus { border-color: rgba(59,130,246,0.5); box-shadow: 0 0 0 3px rgba(59,130,246,0.08); }
        .eye-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 16px; opacity: 0.5; transition: opacity 0.2s; padding: 0; }
        .eye-btn:hover { opacity: 1; }
        .pw-hint { margin-top: 6px; font-size: 11px; color: rgba(255,255,255,0.3); font-family: 'JetBrains Mono', monospace; padding-left: 4px; }
        .pw-hint.admin { color: #f87171; }
        .pw-hint.user { color: #60a5fa; }
        .error-box { display: flex; align-items: center; gap: 8px; background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.3); border-radius: 10px; padding: 11px 14px; font-size: 13px; color: #f87171; margin-bottom: 16px; animation: shake 0.4s ease; }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        .remember-row { display: flex; align-items: center; margin-bottom: 20px; }
        .remember-check { display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; }
        .remember-check input[type="checkbox"] { width: 15px; height: 15px; accent-color: #dc2626; cursor: pointer; }
        .remember-check span { font-size: 12px; color: rgba(255,255,255,0.4); }
        .login-btn { width: 100%; padding: 14px; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; font-family: 'Sora', sans-serif; cursor: pointer; margin-top: 8px; transition: transform 0.15s, box-shadow 0.2s; letter-spacing: 0.5px; }
        .login-btn.default { background: linear-gradient(135deg, #dc2626, #b91c1c); color: #fff; box-shadow: 0 4px 20px rgba(220,38,38,0.35); }
        .login-btn.user-btn { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; box-shadow: 0 4px 20px rgba(59,130,246,0.35); }
        .login-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .login-btn:active:not(:disabled) { transform: scale(0.98); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 8px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .divider { display: flex; align-items: center; gap: 12px; margin: 24px 0 20px; }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .divider-text { font-size: 11px; color: rgba(255,255,255,0.25); text-transform: uppercase; letter-spacing: 1px; }
        .register-link { text-align: center; font-size: 13px; color: rgba(255,255,255,0.35); }
        .register-link a { color: #ef4444; text-decoration: none; font-weight: 500; transition: color 0.2s; }
        .register-link a:hover { color: #f87171; text-decoration: underline; }
        .sos-strip { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(220,38,38,0.9); padding: 10px; text-align: center; font-size: 13px; font-weight: 600; color: #fff; letter-spacing: 0.5px; z-index: 50; backdrop-filter: blur(8px); }
        .sos-strip span { animation: blink 1.4s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      <div className="sarathi-login-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <div className="top-bar">
          <div className="brand">SARA<span>THI</span></div>
          <div className="top-right">
            <LanguageSelector />
            <BackButton redirectTo="/" />
          </div>
        </div>

        <div className="login-card">
          <div className="shield-wrap">
            <div className="shield">🛡️</div>
          </div>

          <h1 className="login-title">{t.login || "Secure Login"}</h1>
          <p className="login-subtitle">Because Every Life Matters</p>

          <div className={`role-pill ${roleType}`}>
            <div className="role-dot" />
            {roleType === "admin" && "🛡️ Admin Access — Government Portal"}
            {roleType === "user" && "👤 Citizen Login"}
            {roleType === "unknown" && "Enter your username to continue"}
          </div>

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
                autoComplete="off"
              />
            </div>
          </div>

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
                autoComplete="new-password"
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

          {/* ✅ Remember Me — no chip, just a clean checkbox */}
          <div className="remember-row">
            <label className="remember-check">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember my username</span>
            </label>
          </div>

          {error && (
            <div className="error-box">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            className={`login-btn ${roleType === "user" ? "user-btn" : "default"}`}
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? <><span className="spinner" />Verifying...</> : t.login || "Login to Sarathi"}
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

        <div className="sos-strip">
          <span>🚨</span> Emergency Helpline: <strong>112</strong> &nbsp;|&nbsp; Available 24×7 — <span>Because Every Life Matters</span>
        </div>
      </div>
    </>
  );
}