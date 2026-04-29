"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "../../components/BackButton";
import LanguageSelector from "../../components/LanguageSelector";
import { saveAdmin, getAdmins } from "../../lib/firebaseHelpers";
import { motion } from "framer-motion";
import { TiltCard, SpatialLayer } from "../../components/TiltCard";

const validStates = [
  "Maharashtra","Delhi","Karnataka","Tamil Nadu","Gujarat","Rajasthan",
  "Uttar Pradesh","Madhya Pradesh","Bihar","West Bengal","Punjab",
  "Haryana","Kerala","Odisha","Assam","Jharkhand","Chhattisgarh",
  "Uttarakhand","Himachal Pradesh","Goa","Tripura","Manipur","Meghalaya",
  "Nagaland","Arunachal Pradesh","Mizoram","Sikkim","Telangana","Andhra Pradesh"
];

const validGovIDs = ["INDADMIN123", "DISASTER001", "GOVSAFE999"];

export default function AdminRegister() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", dob: "", gender: "male", state: "",
    phone: "", aadhaar: "", govId: "", username: "", password: ""
  });
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    if (name === "name") updatedValue = value.replace(/[^a-zA-Z\s]/g, "");
    if (name === "phone") updatedValue = value.replace(/\D/g, "").slice(0, 10);
    if (name === "aadhaar") updatedValue = value.replace(/\D/g, "").slice(0, 12);
    if (name === "govId") updatedValue = value.toUpperCase();
    setForm({ ...form, [name]: updatedValue });
  };

  const validatePassword = (pass) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pass);

  const validateField = (name, value) => {
    if (!value) return "This field is required";
    if (name === "phone" && value.length !== 10) return "Phone must be 10 digits";
    if (name === "aadhaar" && value.length !== 12) return "Aadhaar must be 12 digits";
    if (name === "password" && !validatePassword(value)) return "Use A-Z, a-z, 0-9 & symbol";
    if (name === "username" && value.length < 3) return "Username too short";
    if (name === "govId" && !validGovIDs.includes(value)) return "Invalid Government ID";
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

  const sendOtp = () => {
    if (form.phone.length !== 10) { alert("Enter valid phone number first"); return; }
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    alert("📲 Your OTP is: " + newOtp);
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) { setOtpVerified(true); }
    else { alert("❌ Incorrect OTP"); }
  };

  const handleRegister = async () => {
    if (!validateAll()) { alert("❌ Please fix all errors first"); return; }
    if (!otpVerified) { alert("Please verify OTP first"); return; }

    setIsSubmitting(true);
    try {
      const existingAdmins = await getAdmins();
      if (existingAdmins.find((a) => a.username === form.username)) {
        alert("❌ Username already exists");
        setIsSubmitting(false);
        return;
      }
      await saveAdmin({ ...form, role: "admin" });
      alert("✅ Admin Registered Successfully!");
      router.push("/");
    } catch (error) {
      console.error("Admin registration error:", error);
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const step1Valid = ["name", "dob", "gender", "state"].every(f => form[f] !== "");

  return (
    <div className="min-h-screen bg-bg-base font-inter text-white flex flex-col items-center py-6 px-4 relative overflow-x-hidden perspective-1000">
      
      {/* 3D Deep Background Plane */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="absolute inset-0 pointer-events-none z-0 preserve-3d">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-[0.2] mix-blend-screen" style={{ transform: 'translateZ(-200px) scale(1.3)' }} />
        
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 180, repeat: Infinity, ease: "linear" }} className="absolute inset-0">
           <div className="absolute w-[800px] h-[800px] bg-semantic-critical/20 rounded-full blur-[160px] -top-[200px] -left-[200px]" style={{ transform: 'translateZ(-300px)' }} />
           <div className="absolute w-[600px] h-[600px] bg-[#9f1239]/15 rounded-full blur-[140px] bottom-[10%] right-[-100px]" style={{ transform: 'translateZ(-150px)' }} />
           <div className="absolute w-[500px] h-[500px] bg-accent-purple/10 rounded-full blur-[180px] top-[40%] left-[50%] -translate-x-1/2" style={{ transform: 'translateZ(-400px)' }} />
        </motion.div>
        
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#030712_85%)] z-10" />
      </motion.div>

      <div className="w-full max-w-[560px] flex justify-between items-center mb-8 relative z-20">
        <BackButton />
        <LanguageSelector />
      </div>

      <TiltCard className="w-full max-w-[560px] relative z-20" multiplier={4}>
        <div className="preserve-3d w-full">
          
          <SpatialLayer depth={40} className="mb-8 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-semantic-critical/10 border border-semantic-critical/25 px-3.5 py-1.5 rounded-full text-[11px] font-space font-bold tracking-widest uppercase text-semantic-critical mb-3.5 shadow-[0_0_15px_rgba(225,29,72,0.2)]">
               🛡️ Government Official
            </div>
            <h2 className="font-space text-[36px] font-bold text-white leading-tight mb-1.5 drop-shadow-xl">Admin Portal</h2>
            <p className="text-[13px] text-slate-400 font-light">Verified officials only — Gov ID & Aadhaar required</p>
          </SpatialLayer>

          <SpatialLayer depth={20} className="flex items-center mb-8">
            <div className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 shadow-lg transition-all duration-300 ${step === 1 ? "bg-semantic-critical/20 border-semantic-critical text-semantic-critical shadow-semantic-critical/40" : step > 1 ? "bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-emerald-500/30" : "bg-white/5 border-white/10 text-slate-500"}`}>{step > 1 ? "✓" : "1"}</div>
              <span className={`text-[11px] font-space font-bold uppercase tracking-wider transition-colors ${step === 1 ? "text-semantic-critical" : step > 1 ? "text-emerald-400" : "text-slate-500"}`}>Personal</span>
            </div>
            <div className={`flex-1 h-px mx-2 transition-colors duration-500 ${step > 1 ? "bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-white/10"}`} />
            
            <div className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 shadow-lg transition-all duration-300 ${step === 2 ? "bg-semantic-critical/20 border-semantic-critical text-semantic-critical shadow-semantic-critical/40" : step > 2 ? "bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-emerald-500/30" : "bg-white/5 border-white/10 text-slate-500"}`}>{step > 2 ? "✓" : "2"}</div>
              <span className={`text-[11px] font-space font-bold uppercase tracking-wider transition-colors ${step === 2 ? "text-semantic-critical" : step > 2 ? "text-emerald-400" : "text-slate-500"}`}>Verify</span>
            </div>
            <div className={`flex-1 h-px mx-2 transition-colors duration-500 ${step > 2 ? "bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-white/10"}`} />
            
            <div className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 shadow-lg transition-all duration-300 ${step === 3 ? "bg-semantic-critical/20 border-semantic-critical text-semantic-critical shadow-semantic-critical/40" : "bg-white/5 border-white/10 text-slate-500"}`}>3</div>
              <span className={`text-[11px] font-space font-bold uppercase tracking-wider transition-colors ${step === 3 ? "text-semantic-critical" : "text-slate-500"}`}>Login</span>
            </div>
          </SpatialLayer>

          {/* STEP 1 */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="preserve-3d">
              <SpatialLayer depth={10} className="glass-panel rounded-[24px] p-6 mb-5 relative overflow-hidden group">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-semantic-critical/10 rounded-full blur-[40px] pointer-events-none" />
                <div className="flex items-center gap-2 text-[11px] font-space font-bold tracking-widest uppercase text-slate-300 mb-5 after:content-[''] after:flex-1 after:h-px after:bg-white/10">Personal Details</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-space font-bold text-slate-400 tracking-widest uppercase">Full Name *</label>
                    <input name="name" placeholder="Enter full name" value={form.name} onChange={handleChange} onBlur={handleBlur} autoComplete="off" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[14px] font-inter outline-none transition-all focus:bg-white/10 ${errors.name ? "border-semantic-critical/50 shadow-[0_0_10px_rgba(225,29,72,0.2)]" : "border-white/10 focus:border-semantic-critical/40 focus:shadow-[0_0_15px_rgba(225,29,72,0.15)]"}`} />
                    {errors.name && <span className="text-[11px] text-semantic-critical flex items-center gap-1">⚠ {errors.name}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-space font-bold text-slate-400 tracking-widest uppercase">Date of Birth *</label>
                    <input type="date" name="dob" value={form.dob} onChange={handleChange} onBlur={handleBlur} autoComplete="off" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[14px] font-inter outline-none transition-all focus:bg-white/10 [color-scheme:dark] ${errors.dob ? "border-semantic-critical/50 shadow-[0_0_10px_rgba(225,29,72,0.2)]" : "border-white/10 focus:border-semantic-critical/40 focus:shadow-[0_0_15px_rgba(225,29,72,0.15)]"}`} />
                    {errors.dob && <span className="text-[11px] text-semantic-critical flex items-center gap-1">⚠ {errors.dob}</span>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-space font-bold text-slate-400 tracking-widest uppercase">Gender *</label>
                    <select name="gender" value={form.gender} onChange={handleChange} autoComplete="off" className="bg-white/5 border border-white/10 rounded-xl py-3 px-3.5 text-[14px] font-inter outline-none transition-all focus:bg-white/10 focus:border-semantic-critical/40 focus:shadow-[0_0_15px_rgba(225,29,72,0.15)] [&>option]:bg-bg-panel">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="others">Others</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-space font-bold text-slate-400 tracking-widest uppercase">State *</label>
                    <select name="state" value={form.state} onChange={handleChange} onBlur={handleBlur} autoComplete="off" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[14px] font-inter outline-none transition-all focus:bg-white/10 [&>option]:bg-bg-panel ${errors.state ? "border-semantic-critical/50 shadow-[0_0_10px_rgba(225,29,72,0.2)]" : "border-white/10 focus:border-semantic-critical/40 focus:shadow-[0_0_15px_rgba(225,29,72,0.15)]"}`}>
                      <option value="" disabled>Select State</option>
                      {validStates.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <span className="text-[11px] text-semantic-critical flex items-center gap-1">⚠ {errors.state}</span>}
                  </div>
                </div>
              </SpatialLayer>
              <SpatialLayer depth={20} className="flex gap-3">
                <button className="flex-1 bg-gradient-to-r from-semantic-critical to-[#9f1239] text-white rounded-xl py-3.5 px-4 font-space font-bold text-[15px] tracking-wide hover:shadow-[0_0_30px_rgba(225,29,72,0.4)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none hover:-translate-y-1" disabled={!step1Valid} onClick={() => setStep(2)}>Continue to Verification →</button>
              </SpatialLayer>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="preserve-3d">
              <SpatialLayer depth={10} className="glass-panel rounded-[24px] p-6 mb-4 relative overflow-hidden group">
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none" />
                <div className="flex items-center gap-2 text-[11px] font-space font-bold tracking-widest uppercase text-slate-300 mb-5 after:content-[''] after:flex-1 after:h-px after:bg-white/10">Phone Verification</div>
                <div className="flex gap-3 items-end mb-4">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[11px] font-space font-bold text-slate-400 tracking-widest uppercase">Phone Number *</label>
                    <input name="phone" placeholder="10-digit mobile number" value={form.phone} onChange={handleChange} onBlur={handleBlur} autoComplete="off" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[14px] font-inter outline-none transition-all focus:bg-white/10 ${errors.phone ? "border-semantic-critical/50" : "border-white/10 focus:border-semantic-critical/40 focus:shadow-[0_0_15px_rgba(225,29,72,0.15)]"}`} />
                    {errors.phone && <span className="text-[11px] text-semantic-critical flex items-center gap-1">⚠ {errors.phone}</span>}
                  </div>
                  <button className="bg-semantic-info/20 border border-semantic-info/40 text-semantic-info whitespace-nowrap rounded-xl py-[11px] px-5 font-space font-bold text-[13px] hover:bg-semantic-info/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all h-[47px]" onClick={sendOtp}>Send OTP</button>
                </div>
                <div className="flex gap-3 items-end">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[11px] font-space font-bold text-slate-400 tracking-widest uppercase">Enter OTP *</label>
                    <input placeholder="6-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} autoComplete="one-time-code" className="bg-white/5 border border-white/10 rounded-xl py-3 px-3.5 text-[14px] font-inter tracking-[0.2em] outline-none transition-all focus:bg-white/10 focus:border-semantic-critical/40 focus:shadow-[0_0_15px_rgba(225,29,72,0.15)]" />
                  </div>
                  <button className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 whitespace-nowrap rounded-xl py-[11px] px-6 font-space font-bold text-[13px] hover:bg-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all h-[47px]" onClick={verifyOtp}>Verify</button>
                </div>
                {otpVerified && <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full py-2 px-4 mt-4 text-[12px] font-space font-bold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">✓ Phone Verified Successfully</div>}
              </SpatialLayer>

              <SpatialLayer depth={15} className="glass-panel rounded-[24px] p-6 mb-5 relative overflow-hidden group">
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-semantic-info/10 rounded-full blur-[40px] pointer-events-none" />
                <div className="flex items-center gap-2 text-[11px] font-space font-bold tracking-widest uppercase text-slate-300 mb-5 after:content-[''] after:flex-1 after:h-px after:bg-white/10">Government Identity</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-space font-bold text-slate-400 tracking-widest uppercase">Aadhaar Number *</label>
                    <input name="aadhaar" placeholder="12-digit Aadhaar" value={form.aadhaar} onChange={handleChange} onBlur={handleBlur} autoComplete="off" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[14px] font-inter outline-none transition-all focus:bg-white/10 ${errors.aadhaar ? "border-semantic-critical/50" : "border-white/10 focus:border-semantic-critical/40 focus:shadow-[0_0_15px_rgba(225,29,72,0.15)]"}`} />
                    {errors.aadhaar && <span className="text-[11px] text-semantic-critical flex items-center gap-1">⚠ {errors.aadhaar}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-space font-bold text-slate-400 tracking-widest uppercase">Government ID *</label>
                    <input name="govId" placeholder="e.g. INDADMIN123" value={form.govId} onChange={handleChange} onBlur={handleBlur} autoComplete="on" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[14px] font-inter uppercase outline-none transition-all focus:bg-white/10 ${errors.govId ? "border-semantic-critical/50" : "border-white/10 focus:border-semantic-critical/40 focus:shadow-[0_0_15px_rgba(225,29,72,0.15)]"}`} />
                    {errors.govId && <span className="text-[11px] text-semantic-critical flex items-center gap-1">⚠ {errors.govId}</span>}
                  </div>
                </div>
              </SpatialLayer>
              
              <SpatialLayer depth={20} className="flex gap-3">
                <button className="bg-white/5 border border-white/10 text-slate-300 rounded-xl py-3.5 px-6 font-space font-bold text-[14px] hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1" onClick={() => setStep(1)}>← Back</button>
                <button className="flex-1 bg-gradient-to-r from-semantic-critical to-[#9f1239] text-white rounded-xl py-3.5 px-4 font-space font-bold text-[15px] tracking-wide hover:shadow-[0_0_30px_rgba(225,29,72,0.4)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none hover:-translate-y-1" disabled={!otpVerified || !form.aadhaar || !form.govId} onClick={() => setStep(3)}>Continue to Credentials →</button>
              </SpatialLayer>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="preserve-3d">
              <SpatialLayer depth={15} className="glass-panel rounded-[24px] p-6 mb-5 relative overflow-hidden group">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-purple/10 rounded-full blur-[60px] pointer-events-none" />
                <div className="flex items-center gap-2 text-[11px] font-space font-bold tracking-widest uppercase text-slate-300 mb-5 after:content-[''] after:flex-1 after:h-px after:bg-white/10">Account Credentials</div>
                <div className="flex flex-col gap-1.5 mb-4 relative z-10">
                  <label className="text-[11px] font-space font-bold text-slate-400 tracking-widest uppercase">Username *</label>
                  <input name="username" placeholder="e.g. jdoe_a (add _a for admin)" value={form.username} onChange={handleChange} onBlur={handleBlur} autoComplete="off" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[14px] font-inter outline-none transition-all focus:bg-white/10 ${errors.username ? "border-semantic-critical/50" : "border-white/10 focus:border-semantic-critical/40 focus:shadow-[0_0_15px_rgba(225,29,72,0.15)]"}`} />
                  {errors.username ? <span className="text-[11px] text-semantic-critical flex items-center gap-1">⚠ {errors.username}</span> : <span className="text-[11px] text-slate-400 font-medium">Hint: Append _a to your username (e.g., name_a)</span>}
                </div>
                
                <div className="flex flex-col gap-1.5 relative z-10">
                  <label className="text-[11px] font-space font-bold text-slate-400 tracking-widest uppercase">Password *</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} name="password" placeholder="Min 8 chars, A-Z, a-z, 0-9, symbol" value={form.password} onChange={handleChange} onBlur={handleBlur} autoComplete="new-password" className={`w-full bg-white/5 border rounded-xl py-3 px-3.5 pr-10 text-[14px] font-inter outline-none transition-all focus:bg-white/10 ${errors.password ? "border-semantic-critical/50" : "border-white/10 focus:border-semantic-critical/40 focus:shadow-[0_0_15px_rgba(225,29,72,0.15)]"}`} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-lg text-slate-400 hover:text-white transition-colors" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "🙈" : "👁️"}</span>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 shadow-inner ${form.password.length >= i * 2 ? (validatePassword(form.password) ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-semantic-warning shadow-[0_0_10px_rgba(245,158,11,0.5)]") : "bg-white/10"}`} />
                    ))}
                  </div>
                  {errors.password && <span className="text-[11px] text-semantic-critical flex items-center gap-1 mt-1">⚠ {errors.password}</span>}
                </div>
              </SpatialLayer>
              
              <SpatialLayer depth={20} className="flex gap-3">
                <button className="bg-white/5 border border-white/10 text-slate-300 rounded-xl py-3.5 px-6 font-space font-bold text-[14px] hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1" onClick={() => setStep(2)}>← Back</button>
                <button className="flex-1 bg-gradient-to-r from-semantic-critical to-[#9f1239] text-white rounded-xl py-3.5 px-4 font-space font-bold text-[15px] tracking-wide hover:shadow-[0_0_30px_rgba(225,29,72,0.4)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none hover:-translate-y-1" disabled={isSubmitting} onClick={handleRegister}>
                  {isSubmitting ? <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin align-middle mr-2" />Creating Profile...</> : "🛡️ Complete Registration"}
                </button>
              </SpatialLayer>
            </motion.div>
          )}

        </div>
      </TiltCard>
    </div>
  );
}