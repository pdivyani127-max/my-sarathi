"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "../../components/BackButton";
import LanguageSelector from "../../components/LanguageSelector";
import { saveAdmin, getAdmins } from "../../lib/firebaseHelpers";

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
    <div className="min-h-screen bg-bg-base font-sora text-white flex flex-col items-center py-6 px-4 relative overflow-x-hidden bg-grid-pattern-blue">
      <div className="orb bg-blue-900 w-[350px] h-[350px] -top-[100px] -left-[100px]" />
      <div className="orb bg-red-600 w-[250px] h-[250px] -bottom-[80px] -right-[80px]" />

      <div className="w-full max-w-[560px] flex justify-between items-center mb-8 relative z-10">
        <BackButton />
        <LanguageSelector />
      </div>

      <div className="w-full max-w-[560px] relative z-10">
        <div className="mb-8 animate-fade-up">
          <div className="inline-flex items-center gap-1.5 bg-red-600/10 border border-red-600/25 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase text-red-400 mb-3.5">
             🛡️ Government Official
          </div>
          <h2 className="font-dm text-[32px] font-normal leading-tight mb-1.5">Admin Registration</h2>
          <p className="text-[13px] text-slate-400 font-light">Verified officials only — Gov ID & Aadhaar required</p>
        </div>

        <div className="flex items-center mb-8 animate-fade-up">
          <div className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors duration-300 ${step === 1 ? "bg-red-600/15 border-red-600 text-red-400" : step > 1 ? "bg-emerald-600/15 border-emerald-600 text-emerald-400" : "bg-white/5 border-white/10 text-slate-500"}`}>{step > 1 ? "✓" : "1"}</div>
            <span className={`text-[11px] font-medium transition-colors ${step === 1 ? "text-red-400" : step > 1 ? "text-emerald-400" : "text-slate-500"}`}>Personal Info</span>
          </div>
          <div className={`flex-1 h-px mx-2 ${step > 1 ? "bg-emerald-600" : "bg-white/10"}`} />
          
          <div className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors duration-300 ${step === 2 ? "bg-red-600/15 border-red-600 text-red-400" : step > 2 ? "bg-emerald-600/15 border-emerald-600 text-emerald-400" : "bg-white/5 border-white/10 text-slate-500"}`}>{step > 2 ? "✓" : "2"}</div>
            <span className={`text-[11px] font-medium transition-colors ${step === 2 ? "text-red-400" : step > 2 ? "text-emerald-400" : "text-slate-500"}`}>Verification</span>
          </div>
          <div className={`flex-1 h-px mx-2 ${step > 2 ? "bg-emerald-600" : "bg-white/10"}`} />
          
          <div className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors duration-300 ${step === 3 ? "bg-red-600/15 border-red-600 text-red-400" : "bg-white/5 border-white/10 text-slate-500"}`}>3</div>
            <span className={`text-[11px] font-medium transition-colors ${step === 3 ? "text-red-400" : "text-slate-500"}`}>Credentials</span>
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="animate-fade-up">
            <div className="glass-card rounded-2xl p-6 mb-4">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-4 after:content-[''] after:flex-1 after:h-px after:bg-white/10">Personal Details</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">Full Name *</label>
                  <input name="name" placeholder="Enter full name" value={form.name} onChange={handleChange} onBlur={handleBlur} autoComplete="off" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[13px] font-sora outline-none transition-all focus:bg-white/10 ${errors.name ? "border-red-500/50" : "border-white/10 focus:border-red-500/40 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]"}`} />
                  {errors.name && <span className="text-[11px] text-red-400 flex items-center gap-1">⚠ {errors.name}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">Date of Birth *</label>
                  <input type="date" name="dob" value={form.dob} onChange={handleChange} onBlur={handleBlur} autoComplete="off" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[13px] font-sora outline-none transition-all focus:bg-white/10 ${errors.dob ? "border-red-500/50" : "border-white/10 focus:border-red-500/40 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]"}`} />
                  {errors.dob && <span className="text-[11px] text-red-400 flex items-center gap-1">⚠ {errors.dob}</span>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">Gender *</label>
                  <select name="gender" value={form.gender} onChange={handleChange} autoComplete="off" className="bg-white/5 border border-white/10 rounded-xl py-3 px-3.5 text-[13px] font-sora outline-none transition-all focus:bg-white/10 focus:border-red-500/40 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)] [&>option]:bg-slate-900">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">State *</label>
                  <select name="state" value={form.state} onChange={handleChange} onBlur={handleBlur} autoComplete="off" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[13px] font-sora outline-none transition-all focus:bg-white/10 [&>option]:bg-slate-900 ${errors.state ? "border-red-500/50" : "border-white/10 focus:border-red-500/40 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]"}`}>
                    <option value="" disabled>Select State</option>
                    {validStates.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <span className="text-[11px] text-red-400 flex items-center gap-1">⚠ {errors.state}</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <button className="flex-1 bg-red-600 text-white rounded-xl py-3.5 px-4 font-bold text-sm tracking-wide hover:bg-red-700 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(220,38,38,0.35)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:-translate-y-0 disabled:shadow-none" disabled={!step1Valid} onClick={() => setStep(2)}>Continue to Verification →</button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="animate-fade-up">
            <div className="glass-card rounded-2xl p-6 mb-4">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-4 after:content-[''] after:flex-1 after:h-px after:bg-white/10">Phone & OTP Verification</div>
              <div className="flex gap-2 items-end mb-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">Phone Number *</label>
                  <input name="phone" placeholder="10-digit mobile number" value={form.phone} onChange={handleChange} onBlur={handleBlur} autoComplete="off" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[13px] font-sora outline-none transition-all focus:bg-white/10 ${errors.phone ? "border-red-500/50" : "border-white/10 focus:border-red-500/40 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]"}`} />
                  {errors.phone && <span className="text-[11px] text-red-400 flex items-center gap-1">⚠ {errors.phone}</span>}
                </div>
                <button className="bg-blue-600/15 border border-blue-600/30 text-blue-400 whitespace-nowrap rounded-xl py-[11px] px-4 font-semibold text-xs hover:bg-blue-600/25 transition-colors h-[45px]" onClick={sendOtp}>Send OTP</button>
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">Enter OTP *</label>
                  <input placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} autoComplete="one-time-code" className="bg-white/5 border border-white/10 rounded-xl py-3 px-3.5 text-[13px] font-sora outline-none transition-all focus:bg-white/10 focus:border-red-500/40 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]" />
                </div>
                <button className="bg-emerald-600/15 border border-emerald-600/30 text-emerald-400 whitespace-nowrap rounded-xl py-[11px] px-4 font-semibold text-xs hover:bg-emerald-600/25 transition-colors h-[45px]" onClick={verifyOtp}>Verify</button>
              </div>
              {otpVerified && <div className="inline-flex items-center gap-1.5 bg-emerald-600/10 border border-emerald-600/25 rounded-full py-1.5 px-3.5 mt-3 text-xs font-semibold text-emerald-400">✓ Phone Verified Successfully</div>}
            </div>

            <div className="glass-card rounded-2xl p-6 mb-4">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-4 after:content-[''] after:flex-1 after:h-px after:bg-white/10">Government Identity</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">Aadhaar Number *</label>
                  <input name="aadhaar" placeholder="12-digit Aadhaar" value={form.aadhaar} onChange={handleChange} onBlur={handleBlur} autoComplete="off" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[13px] font-sora outline-none transition-all focus:bg-white/10 ${errors.aadhaar ? "border-red-500/50" : "border-white/10 focus:border-red-500/40 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]"}`} />
                  {errors.aadhaar && <span className="text-[11px] text-red-400 flex items-center gap-1">⚠ {errors.aadhaar}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">Government ID *</label>
                  <input name="govId" placeholder="e.g. INDADMIN123" value={form.govId} onChange={handleChange} onBlur={handleBlur} autoComplete="on" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[13px] font-sora outline-none transition-all focus:bg-white/10 ${errors.govId ? "border-red-500/50" : "border-white/10 focus:border-red-500/40 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]"}`} />
                  {errors.govId && <span className="text-[11px] text-red-400 flex items-center gap-1">⚠ {errors.govId}</span>}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-2">
              <button className="bg-white/5 border border-white/10 text-slate-400 rounded-xl py-3.5 px-5 font-semibold text-sm hover:bg-white/10 hover:border-white/20 transition-all" onClick={() => setStep(1)}>← Back</button>
              <button className="flex-1 bg-red-600 text-white rounded-xl py-3.5 px-4 font-bold text-sm tracking-wide hover:bg-red-700 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(220,38,38,0.35)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:-translate-y-0 disabled:shadow-none" disabled={!otpVerified || !form.aadhaar || !form.govId} onClick={() => setStep(3)}>Continue to Credentials →</button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="animate-fade-up">
            <div className="glass-card rounded-2xl p-6 mb-4">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-4 after:content-[''] after:flex-1 after:h-px after:bg-white/10">Account Credentials</div>
              <div className="flex flex-col gap-1.5 mb-3">
                <label className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">Username *</label>
                <input name="username" placeholder="Choose a username" value={form.username} onChange={handleChange} onBlur={handleBlur} autoComplete="off" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[13px] font-sora outline-none transition-all focus:bg-white/10 ${errors.username ? "border-red-500/50" : "border-white/10 focus:border-red-500/40 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]"}`} />
                {errors.username && <span className="text-[11px] text-red-400 flex items-center gap-1">⚠ {errors.username}</span>}
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">Password *</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} name="password" placeholder="Min 8 chars, A-Z, a-z, 0-9, symbol" value={form.password} onChange={handleChange} onBlur={handleBlur} autoComplete="new-password" className={`w-full bg-white/5 border rounded-xl py-3 px-3.5 pr-10 text-[13px] font-sora outline-none transition-all focus:bg-white/10 ${errors.password ? "border-red-500/50" : "border-white/10 focus:border-red-500/40 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]"}`} />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-base text-slate-400 hover:text-slate-300 transition-colors" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "🙈" : "👁️"}</span>
                </div>
                <div className="flex gap-1 mt-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${form.password.length >= i * 2 ? (validatePassword(form.password) ? "bg-emerald-600" : "bg-amber-500") : "bg-white/10"}`} />
                  ))}
                </div>
                {errors.password && <span className="text-[11px] text-red-400 flex items-center gap-1 mt-1">⚠ {errors.password}</span>}
              </div>
            </div>
            
            <div className="flex gap-3 mt-2">
              <button className="bg-white/5 border border-white/10 text-slate-400 rounded-xl py-3.5 px-5 font-semibold text-sm hover:bg-white/10 hover:border-white/20 transition-all" onClick={() => setStep(2)}>← Back</button>
              <button className="flex-1 bg-red-600 text-white rounded-xl py-3.5 px-4 font-bold text-sm tracking-wide hover:bg-red-700 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(220,38,38,0.35)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:-translate-y-0 disabled:shadow-none" disabled={isSubmitting} onClick={handleRegister}>
                {isSubmitting ? <><span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin align-middle mr-2" />Saving...</> : "🛡️ Complete Registration"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}