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
    <div className="min-h-screen bg-bg-base font-sora text-white flex flex-col items-center py-6 px-4 relative overflow-x-hidden bg-grid-pattern-blue">
      <div className="orb bg-blue-700 w-[350px] h-[350px] -top-[100px] -left-[100px]" />
      <div className="orb bg-cyan-600 w-[250px] h-[250px] -bottom-[80px] -right-[80px]" />

      <div className="w-full max-w-[560px] flex justify-between items-center mb-8 relative z-10">
        <BackButton />
        <LanguageSelector />
      </div>

      <div className="w-full max-w-[560px] relative z-10">
        <div className="mb-6 animate-fade-up">
          <div className="inline-flex items-center gap-1.5 bg-blue-600/10 border border-blue-600/25 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase text-blue-400 mb-3.5">
            👤 Citizen Registration
          </div>
          <h2 className="font-dm text-[32px] font-normal leading-tight mb-1.5">Create Account</h2>
          <p className="text-[13px] text-slate-400 font-light">Register to access Sarathi emergency services</p>
        </div>

        {locationStatus !== "idle" && (
          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold mb-6 animate-fade-up ${locationStatus === "fetching" ? "bg-amber-600/10 border-amber-600/25 text-amber-400" : locationStatus === "done" ? "bg-emerald-600/10 border-emerald-600/25 text-emerald-400" : "bg-red-600/10 border-red-600/25 text-red-400"}`}>
            <div className="w-[5px] h-[5px] rounded-full bg-current animate-[blink_1.2s_infinite]" />
            {locationStatus === "fetching" && "Fetching your location..."}
            {locationStatus === "done" && "Location captured ✓"}
            {locationStatus === "error" && "Location unavailable"}
          </div>
        )}

        <div className="flex items-center mb-8 animate-fade-up">
          <div className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors duration-300 ${step === 1 ? "bg-blue-600/15 border-blue-600 text-blue-400" : step > 1 ? "bg-emerald-600/15 border-emerald-600 text-emerald-400" : "bg-white/5 border-white/10 text-slate-500"}`}>{step > 1 ? "✓" : "1"}</div>
            <span className={`text-[11px] font-medium transition-colors ${step === 1 ? "text-blue-400" : step > 1 ? "text-emerald-400" : "text-slate-500"}`}>Personal</span>
          </div>
          <div className={`flex-1 h-px mx-2 ${step > 1 ? "bg-emerald-600" : "bg-white/10"}`} />
          
          <div className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors duration-300 ${step === 2 ? "bg-blue-600/15 border-blue-600 text-blue-400" : step > 2 ? "bg-emerald-600/15 border-emerald-600 text-emerald-400" : "bg-white/5 border-white/10 text-slate-500"}`}>{step > 2 ? "✓" : "2"}</div>
            <span className={`text-[11px] font-medium transition-colors ${step === 2 ? "text-blue-400" : step > 2 ? "text-emerald-400" : "text-slate-500"}`}>Address & ID</span>
          </div>
          <div className={`flex-1 h-px mx-2 ${step > 2 ? "bg-emerald-600" : "bg-white/10"}`} />
          
          <div className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors duration-300 ${step === 3 ? "bg-blue-600/15 border-blue-600 text-blue-400" : "bg-white/5 border-white/10 text-slate-500"}`}>3</div>
            <span className={`text-[11px] font-medium transition-colors ${step === 3 ? "text-blue-400" : "text-slate-500"}`}>Profile & Login</span>
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
                  <input name="name" placeholder="Enter full name" value={form.name} onChange={handleChange} onBlur={handleBlur} autoComplete="off" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[13px] font-sora outline-none transition-all focus:bg-white/10 ${errors.name ? "border-red-500/50" : "border-white/10 focus:border-blue-500/40 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]"}`} />
                  {errors.name && <span className="text-[11px] text-red-400 flex items-center gap-1">⚠ {errors.name}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">Date of Birth *</label>
                  <input type="date" name="dob" value={form.dob} onChange={handleChange} onBlur={handleBlur} autoComplete="off" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[13px] font-sora outline-none transition-all focus:bg-white/10 ${errors.dob ? "border-red-500/50" : "border-white/10 focus:border-blue-500/40 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]"}`} />
                  {errors.dob && <span className="text-[11px] text-red-400 flex items-center gap-1">⚠ {errors.dob}</span>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">Gender *</label>
                  <select name="gender" value={form.gender} onChange={handleChange} autoComplete="off" className="bg-white/5 border border-white/10 rounded-xl py-3 px-3.5 text-[13px] font-sora outline-none transition-all focus:bg-white/10 focus:border-blue-500/40 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] [&>option]:bg-slate-900">
                    <option value="male">{t.male || "Male"}</option>
                    <option value="female">{t.female || "Female"}</option>
                    <option value="others">{t.others || "Others"}</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">Phone Number *</label>
                  <input name="phone" placeholder="10-digit mobile" value={form.phone} onChange={handleChange} onBlur={handleBlur} autoComplete="off" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[13px] font-sora outline-none transition-all focus:bg-white/10 ${errors.phone ? "border-red-500/50" : "border-white/10 focus:border-blue-500/40 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]"}`} />
                  {errors.phone && <span className="text-[11px] text-red-400 flex items-center gap-1">⚠ {errors.phone}</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <button className="flex-1 bg-blue-600 text-white rounded-xl py-3.5 px-4 font-bold text-sm tracking-wide hover:bg-blue-700 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(37,99,235,0.35)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:-translate-y-0 disabled:shadow-none" disabled={!step1Valid} onClick={() => setStep(2)}>Continue to Address →</button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="animate-fade-up">
            <div className="glass-card rounded-2xl p-6 mb-4">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-4 after:content-[''] after:flex-1 after:h-px after:bg-white/10">Address Details</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">State *</label>
                  <select name="state" value={form.state} onChange={handleChange} onBlur={handleBlur} autoComplete="off" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[13px] font-sora outline-none transition-all focus:bg-white/10 [&>option]:bg-slate-900 ${errors.state ? "border-red-500/50" : "border-white/10 focus:border-blue-500/40 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]"}`}>
                    <option value="" disabled>Select State</option>
                    {validStates.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <span className="text-[11px] text-red-400 flex items-center gap-1">⚠ {errors.state}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">Pincode *</label>
                  <input name="pincode" placeholder="6-digit pincode" value={form.pincode} onChange={handleChange} onBlur={handleBlur} autoComplete="off" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[13px] font-sora outline-none transition-all focus:bg-white/10 ${errors.pincode ? "border-red-500/50" : "border-white/10 focus:border-blue-500/40 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]"}`} />
                  {errors.pincode && <span className="text-[11px] text-red-400 flex items-center gap-1">⚠ {errors.pincode}</span>}
                </div>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">Full Address *</label>
                <input name="address" placeholder="House no, Street, Area" value={form.address} onChange={handleChange} onBlur={handleBlur} autoComplete="off" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[13px] font-sora outline-none transition-all focus:bg-white/10 ${errors.address ? "border-red-500/50" : "border-white/10 focus:border-blue-500/40 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]"}`} />
                {errors.address && <span className="text-[11px] text-red-400 flex items-center gap-1">⚠ {errors.address}</span>}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 mb-4">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-4 after:content-[''] after:flex-1 after:h-px after:bg-white/10">Identity Verification</div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">Aadhaar Number *</label>
                <input name="aadhaar" placeholder="12-digit Aadhaar" value={form.aadhaar} onChange={handleChange} onBlur={handleBlur} autoComplete="off" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[13px] font-sora outline-none transition-all focus:bg-white/10 ${errors.aadhaar ? "border-red-500/50" : "border-white/10 focus:border-blue-500/40 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]"}`} />
                {errors.aadhaar && <span className="text-[11px] text-red-400 flex items-center gap-1">⚠ {errors.aadhaar}</span>}
              </div>
            </div>
            
            <div className="flex gap-3 mt-2">
              <button className="bg-white/5 border border-white/10 text-slate-400 rounded-xl py-3.5 px-5 font-semibold text-sm hover:bg-white/10 hover:border-white/20 transition-all" onClick={() => setStep(1)}>← Back</button>
              <button className="flex-1 bg-blue-600 text-white rounded-xl py-3.5 px-4 font-bold text-sm tracking-wide hover:bg-blue-700 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(37,99,235,0.35)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:-translate-y-0 disabled:shadow-none" disabled={!step2Valid} onClick={() => setStep(3)}>Continue to Profile →</button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="animate-fade-up">
            <div className="glass-card rounded-2xl p-6 mb-4">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-4 after:content-[''] after:flex-1 after:h-px after:bg-white/10">User Profile Type</div>
              
              <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
                {Object.entries(profileIcons).map(([key, icon]) => (
                  <div key={key} className={`bg-white/5 border rounded-xl p-3 text-center cursor-pointer transition-all hover:bg-white/10 hover:border-white/20 ${form.profile === key ? "bg-blue-600/15 border-blue-500/40" : "border-white/10"}`} onClick={() => setForm({ ...form, profile: key })}>
                    <div className="text-[22px] mb-1">{icon}</div>
                    <div className={`text-[10px] font-semibold tracking-widest uppercase ${form.profile === key ? "text-blue-400" : "text-slate-400"}`}>{key.replace("_", " ")}</div>
                  </div>
                ))}
              </div>
              
              {(form.profile === "elderly" || form.profile === "physically_disabled") && (
                <div className="flex flex-col gap-1.5 mt-4">
                  <label className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">Please describe condition *</label>
                  <input name="extra" placeholder="e.g. Uses wheelchair, hearing aid..." value={form.extra} onChange={handleChange} className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[13px] font-sora outline-none transition-all focus:bg-white/10 ${errors.extra ? "border-red-500/50" : "border-white/10 focus:border-blue-500/40 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]"}`} />
                  {errors.extra && <span className="text-[11px] text-red-400 flex items-center gap-1">⚠ {errors.extra}</span>}
                </div>
              )}
            </div>

            <div className="glass-card rounded-2xl p-6 mb-4">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-4 after:content-[''] after:flex-1 after:h-px after:bg-white/10">Emergency Contacts</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">Emergency Contact 1 {form.profile === "normal" && "(Optional)"}</label>
                  <input name="emergency1" placeholder="10-digit number" value={form.emergency1} onChange={handleChange} onBlur={handleBlur} autoComplete="off" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[13px] font-sora outline-none transition-all focus:bg-white/10 ${errors.emergency1 ? "border-red-500/50" : "border-white/10 focus:border-blue-500/40 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]"}`} />
                  {errors.emergency1 && <span className="text-[11px] text-red-400 flex items-center gap-1">⚠ {errors.emergency1}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">Emergency Contact 2 {form.profile === "normal" && "(Optional)"}</label>
                  <input name="emergency2" placeholder="10-digit number" value={form.emergency2} onChange={handleChange} onBlur={handleBlur} autoComplete="off" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[13px] font-sora outline-none transition-all focus:bg-white/10 ${errors.emergency2 ? "border-red-500/50" : "border-white/10 focus:border-blue-500/40 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]"}`} />
                  {errors.emergency2 && <span className="text-[11px] text-red-400 flex items-center gap-1">⚠ {errors.emergency2}</span>}
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 mb-4">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-4 after:content-[''] after:flex-1 after:h-px after:bg-white/10">Account Credentials</div>
              
              <div className="flex flex-col gap-1.5 mb-3">
                <label className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">Username *</label>
                <input name="username" placeholder="Choose a username (min 3 chars)" value={form.username} onChange={handleChange} onBlur={handleBlur} autoComplete="off" className={`bg-white/5 border rounded-xl py-3 px-3.5 text-[13px] font-sora outline-none transition-all focus:bg-white/10 ${errors.username ? "border-red-500/50" : "border-white/10 focus:border-blue-500/40 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]"}`} />
                {errors.username && <span className="text-[11px] text-red-400 flex items-center gap-1">⚠ {errors.username}</span>}
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">Password *</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} name="password" placeholder="Create a strong password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={`w-full bg-white/5 border rounded-xl py-3 px-3.5 pr-10 text-[13px] font-sora outline-none transition-all focus:bg-white/10 ${errors.password ? "border-red-500/50" : "border-white/10 focus:border-blue-500/40 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]"}`} />
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
              <button className="flex-1 bg-blue-600 text-white rounded-xl py-3.5 px-4 font-bold text-sm tracking-wide hover:bg-blue-700 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(37,99,235,0.35)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:-translate-y-0 disabled:shadow-none" disabled={!step3Valid || isSubmitting} onClick={handleRegister}>
                {isSubmitting ? <><span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin align-middle mr-2" />Saving...</> : "✅ Complete Registration"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}