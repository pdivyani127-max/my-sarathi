

// "use client";
// import useTranslation from "../../utils/useTranslation";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import BackButton from "../../components/BackButton";
// import LanguageSelector from "../../components/LanguageSelector";
// import { saveUser, getUsers } from "../../lib/firebaseHelpers";

// const validStates = [
//   "Maharashtra","Delhi","Karnataka","Tamil Nadu","Gujarat","Rajasthan",
//   "Uttar Pradesh","Madhya Pradesh","Bihar","West Bengal","Punjab",
//   "Haryana","Kerala","Odisha","Assam","Jharkhand","Chhattisgarh",
//   "Uttarakhand","Himachal Pradesh","Goa","Tripura","Manipur","Meghalaya",
//   "Nagaland","Arunachal Pradesh","Mizoram","Sikkim","Telangana","Andhra Pradesh"
// ];

// const profileIcons = {
//   normal: "👤", elderly: "🧓", deaf: "🦻",
//   blind: "👁️", physically_disabled: "♿"
// };

// const validatePassword = (pass) =>
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pass);

// export default function UserRegister() {
//   const router = useRouter();
//   const { t } = useTranslation();
//   const [step, setStep] = useState(1);
//   const [showPassword, setShowPassword] = useState(false);
//   const [locationStatus, setLocationStatus] = useState("idle");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [form, setForm] = useState({
//     name: "", dob: "", gender: "male", phone: "",
//     state: "", address: "", pincode: "", aadhaar: "",
//     profile: "normal", extra: "", emergency1: "", emergency2: "",
//     location: null, username: "", password: ""
//   });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     setLocationStatus("fetching");
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           setForm((prev) => ({ ...prev, location: { lat: pos.coords.latitude, lng: pos.coords.longitude } }));
//           setLocationStatus("done");
//         },
//         () => setLocationStatus("error")
//       );
//     } else { setLocationStatus("error"); }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let v = value;
//     if (name === "name") v = value.replace(/[^a-zA-Z\s]/g, "");
//     if (name === "phone") v = value.replace(/\D/g, "").slice(0, 10);
//     if (name === "aadhaar") v = value.replace(/\D/g, "").slice(0, 12);
//     if (name === "pincode") v = value.replace(/\D/g, "").slice(0, 6);
//     if (name === "emergency1" || name === "emergency2") v = value.replace(/\D/g, "").slice(0, 10);
//     setForm({ ...form, [name]: v });
//   };

//   const validateField = (name, value) => {
//     const isExtraRequired = name === "extra" && (form.profile === "elderly" || form.profile === "physically_disabled");
//     const isEmergencyOptional = ["emergency1","emergency2"].includes(name) && form.profile === "normal";
//     if (!value && !isEmergencyOptional && !isExtraRequired && name !== "extra") return "This field is required";
//     if (isExtraRequired && !value) return "Please mention condition";
//     if (name === "phone" && value.length !== 10) return "Phone must be 10 digits";
//     if (name === "username" && value.length < 3) return "Username must be at least 3 characters";
//     if (name === "aadhaar" && value.length !== 12) return "Aadhaar must be 12 digits";
//     if (name === "pincode" && value.length !== 6) return "Pincode must be 6 digits";
//     if (name === "state" && !value) return "Please select a state";
//     return "";
//   };

//   const validateAll = () => {
//     let newErrors = {};
//     Object.keys(form).forEach((key) => {
//       const err = validateField(key, form[key]);
//       if (err) newErrors[key] = err;
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     setErrors({ ...errors, [name]: validateField(name, value) });
//   };

//   // ✅ Updated: saves to Firebase instead of localStorage
//   const handleRegister = async () => {
//     if (!validateAll()) { alert("❌ Please fix all errors first"); return; }

//     setIsSubmitting(true);
//     try {
//       // Check if username already exists in Firebase
//       const existingUsers = await getUsers();
//       if (existingUsers.find((u) => u.username === form.username)) {
//         alert("❌ Username already exists");
//         setIsSubmitting(false);
//         return;
//       }

//       // Save user to Firebase
//       await saveUser({ ...form, role: "user" });

//       alert("✅ Registered Successfully!");
//       router.push("/");
//     } catch (error) {
//       console.error("Registration error:", error);
//       alert("❌ Something went wrong. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const step1Valid = form.name && form.dob && form.gender && form.phone && form.phone.length === 10;
//   const step2Valid = form.state && form.address && form.pincode && form.pincode.length === 6 && form.aadhaar && form.aadhaar.length === 12;
//   const step3Valid = form.username && form.username.length >= 3 && form.password;

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=DM+Serif+Display&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         .user-root {
//           min-height: 100vh; background: #0a0f1e;
//           font-family: 'Sora', sans-serif; color: #f0f4ff;
//           display: flex; flex-direction: column; align-items: center;
//           padding: 24px; position: relative; overflow-x: hidden;
//         }
//         .user-root::before {
//           content: ''; position: absolute; inset: 0;
//           background-image: linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px);
//           background-size: 40px 40px; pointer-events: none;
//         }
//         .orb { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; opacity: 0.15; z-index: 0; }
//         .orb-1 { width: 350px; height: 350px; background: #1d4ed8; top: -100px; left: -100px; }
//         .orb-2 { width: 250px; height: 250px; background: #0891b2; bottom: -80px; right: -80px; }
//         .top-bar { width: 100%; max-width: 560px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; position: relative; z-index: 10; }
//         .form-wrapper { width: 100%; max-width: 560px; position: relative; z-index: 10; }
//         .form-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(37,99,235,0.1); border: 1px solid rgba(37,99,235,0.25); padding: 5px 14px; border-radius: 999px; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #60a5fa; margin-bottom: 14px; }
//         .form-title { font-family: 'DM Serif Display', serif; font-size: 32px; font-weight: 400; color: #f0f4ff; margin-bottom: 6px; }
//         .form-subtitle { font-size: 13px; color: #64748b; font-weight: 300; margin-bottom: 20px; }
//         .location-pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 999px; font-size: 11px; font-weight: 600; margin-bottom: 20px; }
//         .loc-fetching { background: rgba(217,119,6,0.1); border: 1px solid rgba(217,119,6,0.25); color: #fbbf24; }
//         .loc-done { background: rgba(5,150,105,0.1); border: 1px solid rgba(5,150,105,0.25); color: #34d399; }
//         .loc-error { background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.25); color: #f87171; }
//         .loc-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; animation: blink 1.2s infinite; }
//         @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
//         .steps { display: flex; align-items: center; margin-bottom: 24px; }
//         .step-item { display: flex; align-items: center; gap: 8px; flex: 1; }
//         .step-circle { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; border: 1.5px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: #475569; flex-shrink: 0; transition: all 0.3s ease; }
//         .step-circle.active { background: rgba(37,99,235,0.15); border-color: #2563eb; color: #60a5fa; }
//         .step-circle.done { background: rgba(5,150,105,0.15); border-color: #059669; color: #34d399; }
//         .step-label { font-size: 10px; color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
//         .step-label.active { color: #60a5fa; }
//         .step-label.done { color: #34d399; }
//         .step-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); margin: 0 6px; }
//         .step-line.done { background: #059669; }
//         .section-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 24px; margin-bottom: 14px; }
//         .section-title { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #475569; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
//         .section-title::after { content:''; flex:1; height:1px; background: rgba(255,255,255,0.06); }
//         .field-group { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
//         .field-group.single { grid-template-columns: 1fr; }
//         @media (max-width: 480px) { .field-group { grid-template-columns: 1fr; } }
//         .field { display: flex; flex-direction: column; gap: 6px; }
//         .field-label { font-size: 11px; font-weight: 600; color: #64748b; letter-spacing: 0.06em; text-transform: uppercase; }
//         .field-input { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 11px 14px; font-family: 'Sora', sans-serif; font-size: 13px; color: #f0f4ff; width: 100%; transition: all 0.2s ease; outline: none; }
//         .field-input::placeholder { color: #334155; }
//         .field-input:focus { border-color: rgba(37,99,235,0.4); background: rgba(37,99,235,0.04); box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
//         .field-input.error { border-color: rgba(239,68,68,0.5); }
//         .field-input option { background: #0f172a; color: #f0f4ff; }
//         .field-error { font-size: 11px; color: #f87171; }
//         .profile-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
//         @media (max-width: 400px) { .profile-grid { grid-template-columns: repeat(2,1fr); } }
//         .profile-option { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 12px 8px; text-align: center; cursor: pointer; transition: all 0.2s ease; }
//         .profile-option:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12); }
//         .profile-option.selected { background: rgba(37,99,235,0.12); border-color: rgba(37,99,235,0.4); }
//         .profile-emoji { font-size: 22px; margin-bottom: 4px; }
//         .profile-label { font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
//         .profile-option.selected .profile-label { color: #60a5fa; }
//         .pass-wrapper { position: relative; }
//         .pass-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); cursor: pointer; font-size: 16px; color: #475569; }
//         .pass-strength { display: flex; gap: 4px; margin-top: 6px; }
//         .strength-bar { height: 3px; flex: 1; border-radius: 999px; background: rgba(255,255,255,0.06); transition: background 0.3s ease; }
//         .nav-buttons { display: flex; gap: 12px; margin-top: 8px; }
//         .btn-next { flex: 1; background: #2563eb; color: #fff; border: none; padding: 14px; border-radius: 10px; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s ease; }
//         .btn-next:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(37,99,235,0.35); }
//         .btn-next:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
//         .btn-back-step { background: rgba(255,255,255,0.05); color: #94a3b8; border: 1px solid rgba(255,255,255,0.08); padding: 14px 20px; border-radius: 10px; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
//         .btn-back-step:hover { background: rgba(255,255,255,0.08); }
//         .fade-in { opacity:0; transform:translateY(16px); animation: fadeUp 0.4s ease forwards; }
//         @keyframes fadeUp { to { opacity:1; transform:translateY(0); } }
//         .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 8px; }
//         @keyframes spin { to { transform: rotate(360deg); } }
//       `}</style>

//       <div className="user-root">
//         <div className="orb orb-1" />
//         <div className="orb orb-2" />

//         <div className="top-bar">
//           <BackButton />
//           <LanguageSelector />
//         </div>

//         <div className="form-wrapper">
//           <div className="fade-in">
//             <div className="form-badge">👤 Citizen Registration</div>
//             <h2 className="form-title">Create Account</h2>
//             <p className="form-subtitle">Register to access Sarathi emergency services</p>
//           </div>

//           {locationStatus !== "idle" && (
//             <div className={`location-pill ${locationStatus === "fetching" ? "loc-fetching" : locationStatus === "done" ? "loc-done" : "loc-error"}`}>
//               <div className="loc-dot" />
//               {locationStatus === "fetching" && "Fetching your location..."}
//               {locationStatus === "done" && "Location captured ✓"}
//               {locationStatus === "error" && "Location unavailable"}
//             </div>
//           )}

//           {/* Steps */}
//           <div className="steps fade-in">
//             {["Personal","Address & ID","Profile & Login"].map((label, i) => (
//               <div key={label} style={{display:"flex",alignItems:"center",flex:1}}>
//                 <div className="step-item">
//                   <div className={`step-circle ${step === i+1 ? "active" : step > i+1 ? "done" : ""}`}>
//                     {step > i+1 ? "✓" : i+1}
//                   </div>
//                   <span className={`step-label ${step === i+1 ? "active" : step > i+1 ? "done" : ""}`}>{label}</span>
//                 </div>
//                 {i < 2 && <div className={`step-line ${step > i+1 ? "done" : ""}`} />}
//               </div>
//             ))}
//           </div>

//           {/* STEP 1 */}
//           {step === 1 && (
//             <div className="fade-in">
//               <div className="section-card">
//                 <div className="section-title">Personal Details</div>
//                 <div className="field-group">
//                   <div className="field">
//                     <label className="field-label">Full Name *</label>
//                     <input name="name" placeholder="Enter full name" value={form.name}
//                       onChange={handleChange} onBlur={handleBlur}
//                       className={`field-input ${errors.name ? "error" : ""}`} />
//                     {errors.name && <span className="field-error">⚠ {errors.name}</span>}
//                   </div>
//                   <div className="field">
//                     <label className="field-label">Date of Birth *</label>
//                     <input type="date" name="dob" value={form.dob}
//                       onChange={handleChange} onBlur={handleBlur}
//                       className={`field-input ${errors.dob ? "error" : ""}`} />
//                     {errors.dob && <span className="field-error">⚠ {errors.dob}</span>}
//                   </div>
//                 </div>
//                 <div className="field-group">
//                   <div className="field">
//                     <label className="field-label">Gender *</label>
//                     <select name="gender" value={form.gender} onChange={handleChange} className="field-input">
//                       <option value="male">{t.male || "Male"}</option>
//                       <option value="female">{t.female || "Female"}</option>
//                       <option value="others">{t.others || "Others"}</option>
//                     </select>
//                   </div>
//                   <div className="field">
//                     <label className="field-label">Phone Number *</label>
//                     <input name="phone" placeholder="10-digit mobile" value={form.phone}
//                       onChange={handleChange} onBlur={handleBlur}
//                       className={`field-input ${errors.phone ? "error" : ""}`} />
//                     {errors.phone && <span className="field-error">⚠ {errors.phone}</span>}
//                   </div>
//                 </div>
//               </div>
//               <div className="nav-buttons">
//                 <button className="btn-next" disabled={!step1Valid} onClick={() => setStep(2)}>
//                   Continue to Address →
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* STEP 2 */}
//           {step === 2 && (
//             <div className="fade-in">
//               <div className="section-card">
//                 <div className="section-title">Address Details</div>
//                 <div className="field-group">
//                   <div className="field">
//                     <label className="field-label">State *</label>
//                     <select name="state" value={form.state} onChange={handleChange} onBlur={handleBlur}
//                       className={`field-input ${errors.state ? "error" : ""}`}>
//                       <option value="" disabled>Select State</option>
//                       {validStates.map((s) => <option key={s} value={s}>{s}</option>)}
//                     </select>
//                     {errors.state && <span className="field-error">⚠ {errors.state}</span>}
//                   </div>
//                   <div className="field">
//                     <label className="field-label">Pincode *</label>
//                     <input name="pincode" placeholder="6-digit pincode" value={form.pincode}
//                       onChange={handleChange} onBlur={handleBlur}
//                       className={`field-input ${errors.pincode ? "error" : ""}`} />
//                     {errors.pincode && <span className="field-error">⚠ {errors.pincode}</span>}
//                   </div>
//                 </div>
//                 <div className="field-group single">
//                   <div className="field">
//                     <label className="field-label">Full Address *</label>
//                     <input name="address" placeholder="House no, Street, Area" value={form.address}
//                       onChange={handleChange} onBlur={handleBlur}
//                       className={`field-input ${errors.address ? "error" : ""}`} />
//                     {errors.address && <span className="field-error">⚠ {errors.address}</span>}
//                   </div>
//                 </div>
//               </div>
//               <div className="section-card">
//                 <div className="section-title">Identity Verification</div>
//                 <div className="field-group single">
//                   <div className="field">
//                     <label className="field-label">Aadhaar Number *</label>
//                     <input name="aadhaar" placeholder="12-digit Aadhaar" value={form.aadhaar}
//                       onChange={handleChange} onBlur={handleBlur}
//                       className={`field-input ${errors.aadhaar ? "error" : ""}`} />
//                     {errors.aadhaar && <span className="field-error">⚠ {errors.aadhaar}</span>}
//                   </div>
//                 </div>
//               </div>
//               <div className="nav-buttons">
//                 <button className="btn-back-step" onClick={() => setStep(1)}>← Back</button>
//                 <button className="btn-next" disabled={!step2Valid} onClick={() => setStep(3)}>
//                   Continue to Profile →
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* STEP 3 */}
//           {step === 3 && (
//             <div className="fade-in">
//               <div className="section-card">
//                 <div className="section-title">User Profile Type</div>
//                 <div className="profile-grid">
//                   {Object.entries(profileIcons).map(([key, icon]) => (
//                     <div key={key}
//                       className={`profile-option ${form.profile === key ? "selected" : ""}`}
//                       onClick={() => setForm({ ...form, profile: key })}>
//                       <div className="profile-emoji">{icon}</div>
//                       <div className="profile-label">{key.replace("_", " ")}</div>
//                     </div>
//                   ))}
//                 </div>
//                 {(form.profile === "elderly" || form.profile === "physically_disabled") && (
//                   <div className="field" style={{ marginTop: "14px" }}>
//                     <label className="field-label">Please describe condition *</label>
//                     <input name="extra" placeholder="e.g. Uses wheelchair, hearing aid..."
//                       value={form.extra} onChange={handleChange}
//                       className={`field-input ${errors.extra ? "error" : ""}`} />
//                     {errors.extra && <span className="field-error">⚠ {errors.extra}</span>}
//                   </div>
//                 )}
//               </div>

//               <div className="section-card">
//                 <div className="section-title">Emergency Contacts</div>
//                 <div className="field-group">
//                   <div className="field">
//                     <label className="field-label">Emergency Contact 1</label>
//                     <input name="emergency1" placeholder="10-digit number" value={form.emergency1}
//                       onChange={handleChange} onBlur={handleBlur}
//                       className={`field-input ${errors.emergency1 ? "error" : ""}`} />
//                     {errors.emergency1 && <span className="field-error">⚠ {errors.emergency1}</span>}
//                   </div>
//                   <div className="field">
//                     <label className="field-label">Emergency Contact 2</label>
//                     <input name="emergency2" placeholder="10-digit number" value={form.emergency2}
//                       onChange={handleChange} onBlur={handleBlur}
//                       className={`field-input ${errors.emergency2 ? "error" : ""}`} />
//                     {errors.emergency2 && <span className="field-error">⚠ {errors.emergency2}</span>}
//                   </div>
//                 </div>
//               </div>

//               <div className="section-card">
//                 <div className="section-title">Account Credentials</div>
//                 <div className="field-group single" style={{marginBottom:"12px"}}>
//                   <div className="field">
//                     <label className="field-label">Username *</label>
//                     <input name="username" placeholder="Choose a username (min 3 chars)" value={form.username}
//                       onChange={handleChange} onBlur={handleBlur}
//                       className={`field-input ${errors.username ? "error" : ""}`} />
//                     {errors.username && <span className="field-error">⚠ {errors.username}</span>}
//                   </div>
//                 </div>
//                 <div className="field-group single">
//                   <div className="field">
//                     <label className="field-label">Password *</label>
//                     <div className="pass-wrapper">
//                       <input type={showPassword ? "text" : "password"}
//                         name="password" placeholder="Create a strong password"
//                         value={form.password}
//                         onChange={(e) => setForm({ ...form, password: e.target.value })}
//                         className={`field-input ${errors.password ? "error" : ""}`}
//                         style={{ paddingRight: "40px" }} />
//                       <span className="pass-toggle" onClick={() => setShowPassword(!showPassword)}>
//                         {showPassword ? "🙈" : "👁️"}
//                       </span>
//                     </div>
//                     <div className="pass-strength">
//                       {[1,2,3,4].map(i => (
//                         <div key={i} className="strength-bar" style={{
//                           background: form.password.length >= i * 2
//                             ? (validatePassword(form.password) ? "#059669" : "#d97706")
//                             : "rgba(255,255,255,0.06)"
//                         }} />
//                       ))}
//                     </div>
//                     {errors.password && <span className="field-error">⚠ {errors.password}</span>}
//                   </div>
//                 </div>
//               </div>

//               <div className="nav-buttons">
//                 <button className="btn-back-step" onClick={() => setStep(2)}>← Back</button>
//                 <button className="btn-next" disabled={!step3Valid || isSubmitting} onClick={handleRegister}>
//                   {isSubmitting ? <><span className="spinner" />Saving...</> : "✅ Complete Registration"}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

"use client";
import useTranslation from "../../utils/useTranslation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "../../components/BackButton";
import LanguageSelector from "../../components/LanguageSelector";
import { saveUser, getUsers } from "../../lib/firebaseHelpers";

const validStates = [
  "Maharashtra","Delhi","Karnataka","Tamil Nadu","Gujarat","Rajasthan",
  "Uttar Pradesh","Madhya Pradesh","Bihar","West Bengal","Punjab",
  "Haryana","Kerala","Odisha","Assam","Jharkhand","Chhattisgarh",
  "Uttarakhand","Himachal Pradesh","Goa","Tripura","Manipur","Meghalaya",
  "Nagaland","Arunachal Pradesh","Mizoram","Sikkim","Telangana","Andhra Pradesh"
];

const profileIcons = {
  normal: "👤", elderly: "🧓", deaf: "🦻",
  blind: "👁️", physically_disabled: "♿"
};

const validatePassword = (pass) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pass);

export default function UserRegister() {
  const router = useRouter();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", dob: "", gender: "male", phone: "",
    state: "", address: "", pincode: "", aadhaar: "",
    profile: "normal", extra: "", emergency1: "", emergency2: "",
    location: null, username: "", password: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setLocationStatus("fetching");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((prev) => ({ ...prev, location: { lat: pos.coords.latitude, lng: pos.coords.longitude } }));
          setLocationStatus("done");
        },
        () => setLocationStatus("error")
      );
    } else { setLocationStatus("error"); }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "name") v = value.replace(/[^a-zA-Z\s]/g, "");
    if (name === "phone") v = value.replace(/\D/g, "").slice(0, 10);
    if (name === "aadhaar") v = value.replace(/\D/g, "").slice(0, 12);
    if (name === "pincode") v = value.replace(/\D/g, "").slice(0, 6);
    if (name === "emergency1" || name === "emergency2") v = value.replace(/\D/g, "").slice(0, 10);
    setForm({ ...form, [name]: v });
  };

  const validateField = (name, value) => {
    const isExtraRequired = name === "extra" && (form.profile === "elderly" || form.profile === "physically_disabled");
    const isEmergencyOptional = ["emergency1","emergency2"].includes(name) && form.profile === "normal";
    if (!value && !isEmergencyOptional && !isExtraRequired && name !== "extra") return "This field is required";
    if (isExtraRequired && !value) return "Please mention condition";
    if (name === "phone" && value.length !== 10) return "Phone must be 10 digits";
    if (name === "username" && value.length < 3) return "Username must be at least 3 characters";
    if (name === "aadhaar" && value.length !== 12) return "Aadhaar must be 12 digits";
    if (name === "pincode" && value.length !== 6) return "Pincode must be 6 digits";
    if (name === "state" && !value) return "Please select a state";
    return "";
  };

  const validateAll = () => {
    let newErrors = {};
    Object.keys(form).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleRegister = async () => {
    if (!validateAll()) { alert("❌ Please fix all errors first"); return; }

    setIsSubmitting(true);
    try {
      const existingUsers = await getUsers();
      if (existingUsers.find((u) => u.username === form.username)) {
        alert("❌ Username already exists");
        setIsSubmitting(false);
        return;
      }
      await saveUser({ ...form, role: "user" });
      alert("✅ Registered Successfully!");
      router.push("/");
    } catch (error) {
      console.error("Registration error:", error);
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const step1Valid = form.name && form.dob && form.gender && form.phone && form.phone.length === 10;
  const step2Valid = form.state && form.address && form.pincode && form.pincode.length === 6 && form.aadhaar && form.aadhaar.length === 12;
  const step3Valid = form.username && form.username.length >= 3 && form.password;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .user-root {
          min-height: 100vh; background: #0a0f1e;
          font-family: 'Sora', sans-serif; color: #f0f4ff;
          display: flex; flex-direction: column; align-items: center;
          padding: 24px; position: relative; overflow-x: hidden;
        }
        .user-root::before {
          content: ''; position: absolute; inset: 0;
          background-image: linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px);
          background-size: 40px 40px; pointer-events: none;
        }
        .orb { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; opacity: 0.15; z-index: 0; }
        .orb-1 { width: 350px; height: 350px; background: #1d4ed8; top: -100px; left: -100px; }
        .orb-2 { width: 250px; height: 250px; background: #0891b2; bottom: -80px; right: -80px; }
        .top-bar { width: 100%; max-width: 560px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; position: relative; z-index: 10; }
        .form-wrapper { width: 100%; max-width: 560px; position: relative; z-index: 10; }
        .form-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(37,99,235,0.1); border: 1px solid rgba(37,99,235,0.25); padding: 5px 14px; border-radius: 999px; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #60a5fa; margin-bottom: 14px; }
        .form-title { font-family: 'DM Serif Display', serif; font-size: 32px; font-weight: 400; color: #f0f4ff; margin-bottom: 6px; }
        .form-subtitle { font-size: 13px; color: #64748b; font-weight: 300; margin-bottom: 20px; }
        .location-pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 999px; font-size: 11px; font-weight: 600; margin-bottom: 20px; }
        .loc-fetching { background: rgba(217,119,6,0.1); border: 1px solid rgba(217,119,6,0.25); color: #fbbf24; }
        .loc-done { background: rgba(5,150,105,0.1); border: 1px solid rgba(5,150,105,0.25); color: #34d399; }
        .loc-error { background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.25); color: #f87171; }
        .loc-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; animation: blink 1.2s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        .steps { display: flex; align-items: center; margin-bottom: 24px; }
        .step-item { display: flex; align-items: center; gap: 8px; flex: 1; }
        .step-circle { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; border: 1.5px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: #475569; flex-shrink: 0; transition: all 0.3s ease; }
        .step-circle.active { background: rgba(37,99,235,0.15); border-color: #2563eb; color: #60a5fa; }
        .step-circle.done { background: rgba(5,150,105,0.15); border-color: #059669; color: #34d399; }
        .step-label { font-size: 10px; color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
        .step-label.active { color: #60a5fa; }
        .step-label.done { color: #34d399; }
        .step-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); margin: 0 6px; }
        .step-line.done { background: #059669; }
        .section-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 24px; margin-bottom: 14px; }
        .section-title { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #475569; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .section-title::after { content:''; flex:1; height:1px; background: rgba(255,255,255,0.06); }
        .field-group { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .field-group.single { grid-template-columns: 1fr; }
        @media (max-width: 480px) { .field-group { grid-template-columns: 1fr; } }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field-label { font-size: 11px; font-weight: 600; color: #64748b; letter-spacing: 0.06em; text-transform: uppercase; }
        .field-input { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 11px 14px; font-family: 'Sora', sans-serif; font-size: 13px; color: #f0f4ff; width: 100%; transition: all 0.2s ease; outline: none; }
        .field-input::placeholder { color: #334155; }
        .field-input:focus { border-color: rgba(37,99,235,0.4); background: rgba(37,99,235,0.04); box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
        .field-input.error { border-color: rgba(239,68,68,0.5); }
        .field-input option { background: #0f172a; color: #f0f4ff; }
        .field-error { font-size: 11px; color: #f87171; }
        .profile-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        @media (max-width: 400px) { .profile-grid { grid-template-columns: repeat(2,1fr); } }
        .profile-option { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 12px 8px; text-align: center; cursor: pointer; transition: all 0.2s ease; }
        .profile-option:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12); }
        .profile-option.selected { background: rgba(37,99,235,0.12); border-color: rgba(37,99,235,0.4); }
        .profile-emoji { font-size: 22px; margin-bottom: 4px; }
        .profile-label { font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
        .profile-option.selected .profile-label { color: #60a5fa; }
        .pass-wrapper { position: relative; }
        .pass-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); cursor: pointer; font-size: 16px; color: #475569; }
        .pass-strength { display: flex; gap: 4px; margin-top: 6px; }
        .strength-bar { height: 3px; flex: 1; border-radius: 999px; background: rgba(255,255,255,0.06); transition: background 0.3s ease; }
        .pass-hint { margin-top: 8px; background: rgba(37,99,235,0.07); border: 1px solid rgba(37,99,235,0.15); border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px; }
        .pass-hint-row { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #64748b; }
        .pass-hint-row.valid { color: #34d399; }
        .pass-hint-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
        .nav-buttons { display: flex; gap: 12px; margin-top: 8px; }
        .btn-next { flex: 1; background: #2563eb; color: #fff; border: none; padding: 14px; border-radius: 10px; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s ease; }
        .btn-next:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(37,99,235,0.35); }
        .btn-next:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
        .btn-back-step { background: rgba(255,255,255,0.05); color: #94a3b8; border: 1px solid rgba(255,255,255,0.08); padding: 14px 20px; border-radius: 10px; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
        .btn-back-step:hover { background: rgba(255,255,255,0.08); }
        .fade-in { opacity:0; transform:translateY(16px); animation: fadeUp 0.4s ease forwards; }
        @keyframes fadeUp { to { opacity:1; transform:translateY(0); } }
        .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 8px; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="user-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <div className="top-bar">
          <BackButton />
          <LanguageSelector />
        </div>

        <div className="form-wrapper">
          <div className="fade-in">
            <div className="form-badge">👤 Citizen Registration</div>
            <h2 className="form-title">Create Account</h2>
            <p className="form-subtitle">Register to access Sarathi emergency services</p>
          </div>

          {locationStatus !== "idle" && (
            <div className={`location-pill ${locationStatus === "fetching" ? "loc-fetching" : locationStatus === "done" ? "loc-done" : "loc-error"}`}>
              <div className="loc-dot" />
              {locationStatus === "fetching" && "Fetching your location..."}
              {locationStatus === "done" && "Location captured ✓"}
              {locationStatus === "error" && "Location unavailable"}
            </div>
          )}

          <div className="steps fade-in">
            {["Personal","Address & ID","Profile & Login"].map((label, i) => (
              <div key={label} style={{display:"flex",alignItems:"center",flex:1}}>
                <div className="step-item">
                  <div className={`step-circle ${step === i+1 ? "active" : step > i+1 ? "done" : ""}`}>
                    {step > i+1 ? "✓" : i+1}
                  </div>
                  <span className={`step-label ${step === i+1 ? "active" : step > i+1 ? "done" : ""}`}>{label}</span>
                </div>
                {i < 2 && <div className={`step-line ${step > i+1 ? "done" : ""}`} />}
              </div>
            ))}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="fade-in">
              <div className="section-card">
                <div className="section-title">Personal Details</div>
                <div className="field-group">
                  <div className="field">
                    <label className="field-label">Full Name *</label>
                    <input name="name" placeholder="Enter full name" value={form.name}
                      onChange={handleChange} onBlur={handleBlur} autoComplete="off"
                      className={`field-input ${errors.name ? "error" : ""}`} />
                    {errors.name && <span className="field-error">⚠ {errors.name}</span>}
                  </div>
                  <div className="field">
                    <label className="field-label">Date of Birth *</label>
                    <input type="date" name="dob" value={form.dob}
                      onChange={handleChange} onBlur={handleBlur} autoComplete="off"
                      className={`field-input ${errors.dob ? "error" : ""}`} />
                    {errors.dob && <span className="field-error">⚠ {errors.dob}</span>}
                  </div>
                </div>
                <div className="field-group">
                  <div className="field">
                    <label className="field-label">Gender *</label>
                    <select name="gender" value={form.gender} onChange={handleChange} autoComplete="off" className="field-input">
                      <option value="male">{t.male || "Male"}</option>
                      <option value="female">{t.female || "Female"}</option>
                      <option value="others">{t.others || "Others"}</option>
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">Phone Number *</label>
                    <input name="phone" placeholder="10-digit mobile" value={form.phone}
                      onChange={handleChange} onBlur={handleBlur} autoComplete="off"
                      className={`field-input ${errors.phone ? "error" : ""}`} />
                    {errors.phone && <span className="field-error">⚠ {errors.phone}</span>}
                  </div>
                </div>
              </div>
              <div className="nav-buttons">
                <button className="btn-next" disabled={!step1Valid} onClick={() => setStep(2)}>
                  Continue to Address →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="fade-in">
              <div className="section-card">
                <div className="section-title">Address Details</div>
                <div className="field-group">
                  <div className="field">
                    <label className="field-label">State *</label>
                    <select name="state" value={form.state} onChange={handleChange} onBlur={handleBlur} autoComplete="off"
                      className={`field-input ${errors.state ? "error" : ""}`}>
                      <option value="" disabled>Select State</option>
                      {validStates.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <span className="field-error">⚠ {errors.state}</span>}
                  </div>
                  <div className="field">
                    <label className="field-label">Pincode *</label>
                    <input name="pincode" placeholder="6-digit pincode" value={form.pincode}
                      onChange={handleChange} onBlur={handleBlur} autoComplete="off"
                      className={`field-input ${errors.pincode ? "error" : ""}`} />
                    {errors.pincode && <span className="field-error">⚠ {errors.pincode}</span>}
                  </div>
                </div>
                <div className="field-group single">
                  <div className="field">
                    <label className="field-label">Full Address *</label>
                    <input name="address" placeholder="House no, Street, Area" value={form.address}
                      onChange={handleChange} onBlur={handleBlur} autoComplete="off"
                      className={`field-input ${errors.address ? "error" : ""}`} />
                    {errors.address && <span className="field-error">⚠ {errors.address}</span>}
                  </div>
                </div>
              </div>
              <div className="section-card">
                <div className="section-title">Identity Verification</div>
                <div className="field-group single">
                  <div className="field">
                    <label className="field-label">Aadhaar Number *</label>
                    <input name="aadhaar" placeholder="12-digit Aadhaar" value={form.aadhaar}
                      onChange={handleChange} onBlur={handleBlur} autoComplete="off"
                      className={`field-input ${errors.aadhaar ? "error" : ""}`} />
                    {errors.aadhaar && <span className="field-error">⚠ {errors.aadhaar}</span>}
                  </div>
                </div>
              </div>
              <div className="nav-buttons">
                <button className="btn-back-step" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-next" disabled={!step2Valid} onClick={() => setStep(3)}>
                  Continue to Profile →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="fade-in">
              <div className="section-card">
                <div className="section-title">User Profile Type</div>
                <div className="profile-grid">
                  {Object.entries(profileIcons).map(([key, icon]) => (
                    <div key={key}
                      className={`profile-option ${form.profile === key ? "selected" : ""}`}
                      onClick={() => setForm({ ...form, profile: key })}>
                      <div className="profile-emoji">{icon}</div>
                      <div className="profile-label">{key.replace("_", " ")}</div>
                    </div>
                  ))}
                </div>
                {(form.profile === "elderly" || form.profile === "physically_disabled") && (
                  <div className="field" style={{ marginTop: "14px" }}>
                    <label className="field-label">Please describe condition *</label>
                    <input name="extra" placeholder="e.g. Uses wheelchair, hearing aid..."
                      value={form.extra} onChange={handleChange} autoComplete="off"
                      className={`field-input ${errors.extra ? "error" : ""}`} />
                    {errors.extra && <span className="field-error">⚠ {errors.extra}</span>}
                  </div>
                )}
              </div>

              <div className="section-card">
                <div className="section-title">Emergency Contacts</div>
                <div className="field-group">
                  <div className="field">
                    <label className="field-label">Emergency Contact 1</label>
                    <input name="emergency1" placeholder="10-digit number" value={form.emergency1}
                      onChange={handleChange} onBlur={handleBlur} autoComplete="off"
                      className={`field-input ${errors.emergency1 ? "error" : ""}`} />
                    {errors.emergency1 && <span className="field-error">⚠ {errors.emergency1}</span>}
                  </div>
                  <div className="field">
                    <label className="field-label">Emergency Contact 2</label>
                    <input name="emergency2" placeholder="10-digit number" value={form.emergency2}
                      onChange={handleChange} onBlur={handleBlur} autoComplete="off"
                      className={`field-input ${errors.emergency2 ? "error" : ""}`} />
                    {errors.emergency2 && <span className="field-error">⚠ {errors.emergency2}</span>}
                  </div>
                </div>
              </div>

              <div className="section-card">
                <div className="section-title">Account Credentials</div>
                <div className="field-group single" style={{marginBottom:"12px"}}>
                  <div className="field">
                    <label className="field-label">Username *</label>
                    {/* ✅ autoComplete="off" prevents browser from suggesting saved usernames */}
                    <input name="username" placeholder="Choose a username (min 3 chars)" value={form.username}
                      onChange={handleChange} onBlur={handleBlur} autoComplete="on"
                      className={`field-input ${errors.username ? "error" : ""}`} />
                    {errors.username && <span className="field-error">⚠ {errors.username}</span>}
                  </div>
                </div>
                <div className="field-group single">
                  <div className="field">
                    <label className="field-label">Password *</label>
                    <div className="pass-wrapper">
                      {/* ✅ autoComplete="new-password" prevents browser from autofilling saved passwords */}
                      <input type={showPassword ? "text" : "password"}
                        name="password" placeholder="Create a strong password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        autoComplete="new-password"
                        className={`field-input ${errors.password ? "error" : ""}`}
                        style={{ paddingRight: "40px" }} />
                      <span className="pass-toggle" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "🙈" : "👁️"}
                      </span>
                    </div>
                    <div className="pass-strength">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="strength-bar" style={{
                          background: form.password.length >= i * 2
                            ? (validatePassword(form.password) ? "#059669" : "#d97706")
                            : "rgba(255,255,255,0.06)"
                        }} />
                      ))}
                    </div>
                    {/* ✅ Password hint box — shows requirements, ticks off as user types */}
                    <div className="pass-hint">
                      <div className={`pass-hint-row ${form.password.length >= 8 ? "valid" : ""}`}>
                        <div className="pass-hint-dot" />
                        {form.password.length >= 8 ? "✓" : "○"} At least 8 characters
                      </div>
                      <div className={`pass-hint-row ${/[A-Z]/.test(form.password) ? "valid" : ""}`}>
                        <div className="pass-hint-dot" />
                        {/[A-Z]/.test(form.password) ? "✓" : "○"} One uppercase letter (A–Z)
                      </div>
                      <div className={`pass-hint-row ${/[a-z]/.test(form.password) ? "valid" : ""}`}>
                        <div className="pass-hint-dot" />
                        {/[a-z]/.test(form.password) ? "✓" : "○"} One lowercase letter (a–z)
                      </div>
                      <div className={`pass-hint-row ${/\d/.test(form.password) ? "valid" : ""}`}>
                        <div className="pass-hint-dot" />
                        {/\d/.test(form.password) ? "✓" : "○"} One number (0–9)
                      </div>
                      <div className={`pass-hint-row ${/[@$!%*?&]/.test(form.password) ? "valid" : ""}`}>
                        <div className="pass-hint-dot" />
                        {/[@$!%*?&]/.test(form.password) ? "✓" : "○"} One symbol (@$!%*?&)
                      </div>
                    </div>
                    {errors.password && <span className="field-error">⚠ {errors.password}</span>}
                  </div>
                </div>
              </div>

              <div className="nav-buttons">
                <button className="btn-back-step" onClick={() => setStep(2)}>← Back</button>
                <button className="btn-next" disabled={!step3Valid || isSubmitting} onClick={handleRegister}>
                  {isSubmitting ? <><span className="spinner" />Saving...</> : "✅ Complete Registration"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}