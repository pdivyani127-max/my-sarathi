// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import BackButton from "../../components/BackButton";
// import LanguageSelector from "../../components/LanguageSelector";

// const validStates = [
//   "Maharashtra","Delhi","Karnataka","Tamil Nadu","Gujarat","Rajasthan",
//   "Uttar Pradesh","Madhya Pradesh","Bihar","West Bengal","Punjab",
//   "Haryana","Kerala","Odisha","Assam","Jharkhand","Chhattisgarh",
//   "Uttarakhand","Himachal Pradesh","Goa","Tripura","Manipur","Meghalaya",
//   "Nagaland","Arunachal Pradesh","Mizoram","Sikkim","Telangana","Andhra Pradesh"
// ];

// const validGovIDs = ["INDADMIN123", "DISASTER001", "GOVSAFE999"];

// export default function AdminRegister() {
//   const router = useRouter();
//   const [form, setForm] = useState({
//     name: "",
//     dob: "",
//     gender: "male",
//     state: "",
//     phone: "",
//     aadhaar: "",
//     govId: "",
//     username: "",
//     password: ""
//   });

//   const [errors, setErrors] = useState({});
//   const [users, setUsers] = useState([]);
//   const [otp, setOtp] = useState("");
//   const [generatedOtp, setGeneratedOtp] = useState("");
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//   const storedUser = JSON.parse(localStorage.getItem("user"));

//   if (storedUser) {
//     const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
// setUsers(storedUsers);
//   }
// }, []);

//   // 🔒 INPUT CONTROL
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let updatedValue = value;

//     if (name === "name") {
//       updatedValue = value.replace(/[^a-zA-Z\s]/g, "");
//     }

//     if (name === "phone") {
//       updatedValue = value.replace(/\D/g, "").slice(0, 10);
//     }

//     if (name === "aadhaar") {
//       updatedValue = value.replace(/\D/g, "").slice(0, 12);
//     }

//     if (name === "govId") {
//       updatedValue = value.toUpperCase();
//     }

//     setForm({ ...form, [name]: updatedValue });
//   };

//   // 🔐 PASSWORD VALIDATION
//   const validatePassword = (pass) => {
//     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pass);
//   };

//   // ⚠️ VALIDATION
//   const validateField = (name, value) => {
//     if (!value) return "This field is required";

//     if (name === "phone" && value.length !== 10) {
//       return "Phone must be 10 digits";
//     }

//     if (name === "aadhaar" && value.length !== 12) {
//       return "Aadhaar must be 12 digits";
//     }

//     if (name === "password" && !validatePassword(value)) {
//       return "Weak password (Use A-Z, a-z, 0-9, symbol)";
//     }

//     if (name === "username" && value.length < 3) {
//       return "Username too short";
//     }

//     if (name === "govId" && !validGovIDs.includes(value)) {
//       return "Invalid Government ID";
//     }

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
//     setErrors({
//       ...errors,
//       [name]: validateField(name, value)
//     });
//   };

//   // 📲 OTP
//   const sendOtp = () => {
//     if (form.phone.length !== 10) {
//       alert("Enter valid phone number first");
//       return;
//     }

//     const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
//     setGeneratedOtp(newOtp);
//     alert("📲 Your OTP is: " + newOtp);
//   };

//   const verifyOtp = () => {
//     if (otp === generatedOtp) {
//       setOtpVerified(true);
//       alert("✅ OTP Verified");
//     } else {
//       alert("❌ Incorrect OTP");
//     }
//   };

//   // ✅ REGISTER
//   const handleRegister = () => {
//     if (!validateAll()) {
//       alert("❌ Fix errors first");
//       return;
//     }

//     if (!otpVerified) {
//       alert("Verify OTP first");
//       return;
//     }

//     const existingAdmins =
//       JSON.parse(localStorage.getItem("admins")) || [];

//     existingAdmins.push(form);

//     localStorage.setItem("admins", JSON.stringify(existingAdmins));

//     alert("✅ Admin Registered Successfully!");
//     router.push("/");
//   };



//   return (
//     <div className="p-6 flex flex-col gap-3 max-w-md">

//       <div className="flex justify-between">
//         <BackButton />
//         <LanguageSelector />
//       </div>

//       <h2 className="text-xl font-bold">Admin Registration</h2>

//       <input name="name" placeholder="Name *" value={form.name}
//         onChange={handleChange} onBlur={handleBlur}
//         className="border p-2" />
//       {errors.name && <p className="text-red-500">{errors.name}</p>}

//       <input type="date" name="dob" value={form.dob}
//         onChange={handleChange} onBlur={handleBlur}
//         className="border p-2" />

//       <select name="gender" onChange={handleChange}
//         className="border p-2 bg-white text-black">
//         <option value="male">Male</option>
//         <option value="female">Female</option>
//         <option value="others">Others</option>
//       </select>

//       {/* STATE */}
//       <select name="state" value={form.state}
//         onChange={handleChange} onBlur={handleBlur}
//         className="border p-2 bg-white text-black">
//         <option value="" disabled>Select State *</option>
//         {validStates.map((s) => (
//           <option key={s} value={s}>{s}</option>
//         ))}
//       </select>
//       {errors.state && <p className="text-red-500">{errors.state}</p>}

//       {/* PHONE + OTP */}
//       <input name="phone" placeholder="Phone *" value={form.phone}
//         onChange={handleChange} onBlur={handleBlur}
//         className="border p-2" />
//       {errors.phone && <p className="text-red-500">{errors.phone}</p>}

//       <button type="button" onClick={sendOtp}
//         className="bg-blue-500 text-white p-2">
//         Send OTP
//       </button>

//       <input placeholder="Enter OTP" value={otp}
//         onChange={(e) => setOtp(e.target.value)}
//         className="border p-2" />

//       <button type="button" onClick={verifyOtp}
//         className="bg-green-500 text-white p-2">
//         Verify OTP
//       </button>

//       {otpVerified && <p className="text-green-500">OTP Verified ✅</p>}

//       <input name="aadhaar" placeholder="Aadhaar *" value={form.aadhaar}
//         onChange={handleChange} onBlur={handleBlur}
//         className="border p-2" />
//       {errors.aadhaar && <p className="text-red-500">{errors.aadhaar}</p>}

//       <input name="govId" placeholder="Government ID *" value={form.govId}
//         onChange={handleChange} onBlur={handleBlur}
//         className="border p-2" />
//       {errors.govId && <p className="text-red-500">{errors.govId}</p>}

//       <input name="username" placeholder="Username *" value={form.username}
//         onChange={handleChange} onBlur={handleBlur}
//         className="border p-2" />
//       {errors.username && <p className="text-red-500">{errors.username}</p>}

//       <div className="relative">
//   <input
//     type={showPassword ? "text" : "password"}
//     name="password"
//     placeholder="Password *"
//     value={form.password || ""}
//     onChange={handleChange}
//     onBlur={handleBlur}
//     className="border p-2 w-full pr-10"
//   />

//   <span
//     onClick={() => setShowPassword(!showPassword)}
//     className="absolute right-3 top-2 cursor-pointer"
//   >
//     {showPassword ? "🙈" : "👁️"}
//   </span>
// </div>

// {errors.password && (
//   <p className="text-red-500">{errors.password}</p>
// )}

//       <button onClick={handleRegister}
//         className="bg-red-500 text-white p-2 mt-2">
//         Register
//       </button>
//     </div>
//   );
  

// }

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "../../components/BackButton";
import LanguageSelector from "../../components/LanguageSelector";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
  }, []);

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

  const handleRegister = () => {
    if (!validateAll()) { alert("❌ Please fix all errors first"); return; }
    if (!otpVerified) { alert("Please verify OTP first"); return; }
    const existingAdmins = JSON.parse(localStorage.getItem("admins")) || [];
    existingAdmins.push(form);
    localStorage.setItem("admins", JSON.stringify(existingAdmins));
    alert("✅ Admin Registered Successfully!");
    router.push("/");
  };

  const step1Fields = ["name", "dob", "gender", "state"];
  const step1Valid = step1Fields.every(f => form[f] !== "");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=DM+Serif+Display&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .admin-root {
          min-height: 100vh;
          background: #0a0f1e;
          font-family: 'Sora', sans-serif;
          color: #f0f4ff;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px;
          position: relative;
          overflow-x: hidden;
        }
        .admin-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }
        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.15;
          z-index: 0;
        }
        .orb-1 { width: 350px; height: 350px; background: #1e40af; top: -100px; left: -100px; }
        .orb-2 { width: 250px; height: 250px; background: #dc2626; bottom: -80px; right: -80px; }

        .top-bar {
          width: 100%;
          max-width: 560px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          position: relative;
          z-index: 10;
        }

        .form-wrapper {
          width: 100%;
          max-width: 560px;
          position: relative;
          z-index: 10;
        }

        /* Header */
        .form-header {
          margin-bottom: 32px;
        }
        .form-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(220,38,38,0.1);
          border: 1px solid rgba(220,38,38,0.25);
          padding: 5px 14px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #f87171;
          margin-bottom: 14px;
        }
        .form-title {
          font-family: 'DM Serif Display', serif;
          font-size: 32px;
          font-weight: 400;
          color: #f0f4ff;
          margin-bottom: 6px;
        }
        .form-subtitle {
          font-size: 13px;
          color: #64748b;
          font-weight: 300;
        }

        /* Step indicator */
        .steps {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 32px;
        }
        .step-item {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }
        .step-circle {
          width: 32px; height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          color: #475569;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .step-circle.active {
          background: rgba(220,38,38,0.15);
          border-color: #dc2626;
          color: #f87171;
        }
        .step-circle.done {
          background: rgba(5,150,105,0.15);
          border-color: #059669;
          color: #34d399;
        }
        .step-label {
          font-size: 11px;
          color: #475569;
          font-weight: 500;
          transition: color 0.3s;
        }
        .step-label.active { color: #f87171; }
        .step-label.done { color: #34d399; }
        .step-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 0 8px;
        }
        .step-line.done { background: #059669; }

        /* Section card */
        .section-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 16px;
        }
        .section-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #475569;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .section-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        /* Form fields */
        .field-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }
        .field-group.single { grid-template-columns: 1fr; }
        @media (max-width: 480px) { .field-group { grid-template-columns: 1fr; } }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .field-label {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .field-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 11px 14px;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          color: #f0f4ff;
          width: 100%;
          transition: all 0.2s ease;
          outline: none;
        }
        .field-input::placeholder { color: #334155; }
        .field-input:focus {
          border-color: rgba(220,38,38,0.4);
          background: rgba(220,38,38,0.04);
          box-shadow: 0 0 0 3px rgba(220,38,38,0.08);
        }
        .field-input.error {
          border-color: rgba(239,68,68,0.5);
        }
        .field-input option {
          background: #0f172a;
          color: #f0f4ff;
        }
        .field-error {
          font-size: 11px;
          color: #f87171;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* OTP row */
        .otp-row {
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }
        .otp-row .field { flex: 1; }
        .otp-btn {
          padding: 11px 16px;
          border-radius: 8px;
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
          white-space: nowrap;
          margin-top: 23px;
        }
        .otp-send {
          background: rgba(37,99,235,0.15);
          border: 1px solid rgba(37,99,235,0.3);
          color: #60a5fa;
        }
        .otp-send:hover { background: rgba(37,99,235,0.25); }
        .otp-verify {
          background: rgba(5,150,105,0.15);
          border: 1px solid rgba(5,150,105,0.3);
          color: #34d399;
        }
        .otp-verify:hover { background: rgba(5,150,105,0.25); }

        /* Verified badge */
        .verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(5,150,105,0.1);
          border: 1px solid rgba(5,150,105,0.25);
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          color: #34d399;
          margin-top: 8px;
        }

        /* Password wrapper */
        .pass-wrapper {
          position: relative;
        }
        .pass-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          font-size: 16px;
          color: #475569;
          transition: color 0.2s;
        }
        .pass-toggle:hover { color: #94a3b8; }

        /* Password strength */
        .pass-strength {
          display: flex;
          gap: 4px;
          margin-top: 6px;
        }
        .strength-bar {
          height: 3px;
          flex: 1;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          transition: background 0.3s ease;
        }

        /* Navigation buttons */
        .nav-buttons {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
        .btn-next {
          flex: 1;
          background: #dc2626;
          color: #fff;
          border: none;
          padding: 14px;
          border-radius: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.02em;
        }
        .btn-next:hover {
          background: #b91c1c;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(220,38,38,0.35);
        }
        .btn-next:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        .btn-back-step {
          background: rgba(255,255,255,0.05);
          color: #94a3b8;
          border: 1px solid rgba(255,255,255,0.08);
          padding: 14px 20px;
          border-radius: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-back-step:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.15);
        }

        .fade-in {
          opacity: 0;
          transform: translateY(16px);
          animation: fadeUp 0.4s ease forwards;
        }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="admin-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <div className="top-bar">
          <BackButton />
          <LanguageSelector />
        </div>

        <div className="form-wrapper">
          {/* Header */}
          <div className="form-header fade-in">
            <div className="form-badge">🛡️ Government Official</div>
            <h2 className="form-title">Admin Registration</h2>
            <p className="form-subtitle">Verified officials only — Gov ID & Aadhaar required</p>
          </div>

          {/* Step Indicator */}
          <div className="steps fade-in">
            <div className="step-item">
              <div className={`step-circle ${step === 1 ? "active" : step > 1 ? "done" : ""}`}>
                {step > 1 ? "✓" : "1"}
              </div>
              <span className={`step-label ${step === 1 ? "active" : step > 1 ? "done" : ""}`}>
                Personal Info
              </span>
            </div>
            <div className={`step-line ${step > 1 ? "done" : ""}`} />
            <div className="step-item">
              <div className={`step-circle ${step === 2 ? "active" : step > 2 ? "done" : ""}`}>
                {step > 2 ? "✓" : "2"}
              </div>
              <span className={`step-label ${step === 2 ? "active" : step > 2 ? "done" : ""}`}>
                Verification
              </span>
            </div>
            <div className={`step-line ${step > 2 ? "done" : ""}`} />
            <div className="step-item">
              <div className={`step-circle ${step === 3 ? "active" : ""}`}>3</div>
              <span className={`step-label ${step === 3 ? "active" : ""}`}>Credentials</span>
            </div>
          </div>

          {/* ===== STEP 1 — Personal Info ===== */}
          {step === 1 && (
            <div className="fade-in">
              <div className="section-card">
                <div className="section-title">Personal Details</div>

                <div className="field-group">
                  <div className="field">
                    <label className="field-label">Full Name *</label>
                    <input name="name" placeholder="Enter full name"
                      value={form.name} onChange={handleChange} onBlur={handleBlur}
                      className={`field-input ${errors.name ? "error" : ""}`} />
                    {errors.name && <span className="field-error">⚠ {errors.name}</span>}
                  </div>
                  <div className="field">
                    <label className="field-label">Date of Birth *</label>
                    <input type="date" name="dob" value={form.dob}
                      onChange={handleChange} onBlur={handleBlur}
                      className={`field-input ${errors.dob ? "error" : ""}`} />
                    {errors.dob && <span className="field-error">⚠ {errors.dob}</span>}
                  </div>
                </div>

                <div className="field-group">
                  <div className="field">
                    <label className="field-label">Gender *</label>
                    <select name="gender" value={form.gender} onChange={handleChange}
                      className="field-input">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="others">Others</option>
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">State *</label>
                    <select name="state" value={form.state}
                      onChange={handleChange} onBlur={handleBlur}
                      className={`field-input ${errors.state ? "error" : ""}`}>
                      <option value="" disabled>Select State</option>
                      {validStates.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.state && <span className="field-error">⚠ {errors.state}</span>}
                  </div>
                </div>
              </div>

              <div className="nav-buttons">
                <button className="btn-next"
                  disabled={!step1Valid}
                  onClick={() => setStep(2)}>
                  Continue to Verification →
                </button>
              </div>
            </div>
          )}

          {/* ===== STEP 2 — Verification ===== */}
          {step === 2 && (
            <div className="fade-in">
              <div className="section-card">
                <div className="section-title">Phone & OTP Verification</div>

                <div className="otp-row" style={{ marginBottom: "12px" }}>
                  <div className="field">
                    <label className="field-label">Phone Number *</label>
                    <input name="phone" placeholder="10-digit mobile number"
                      value={form.phone} onChange={handleChange} onBlur={handleBlur}
                      className={`field-input ${errors.phone ? "error" : ""}`} />
                    {errors.phone && <span className="field-error">⚠ {errors.phone}</span>}
                  </div>
                  <button className="otp-btn otp-send" onClick={sendOtp}>Send OTP</button>
                </div>

                <div className="otp-row">
                  <div className="field">
                    <label className="field-label">Enter OTP *</label>
                    <input placeholder="6-digit OTP" value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="field-input" />
                  </div>
                  <button className="otp-btn otp-verify" onClick={verifyOtp}>Verify</button>
                </div>

                {otpVerified && (
                  <div className="verified-badge">✓ Phone Verified Successfully</div>
                )}
              </div>

              <div className="section-card">
                <div className="section-title">Government Identity</div>

                <div className="field-group">
                  <div className="field">
                    <label className="field-label">Aadhaar Number *</label>
                    <input name="aadhaar" placeholder="12-digit Aadhaar"
                      value={form.aadhaar} onChange={handleChange} onBlur={handleBlur}
                      className={`field-input ${errors.aadhaar ? "error" : ""}`} />
                    {errors.aadhaar && <span className="field-error">⚠ {errors.aadhaar}</span>}
                  </div>
                  <div className="field">
                    <label className="field-label">Government ID *</label>
                    <input name="govId" placeholder="e.g. INDADMIN123"
                      value={form.govId} onChange={handleChange} onBlur={handleBlur}
                      className={`field-input ${errors.govId ? "error" : ""}`} />
                    {errors.govId && <span className="field-error">⚠ {errors.govId}</span>}
                  </div>
                </div>
              </div>

              <div className="nav-buttons">
                <button className="btn-back-step" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-next"
                  disabled={!otpVerified || !form.aadhaar || !form.govId}
                  onClick={() => setStep(3)}>
                  Continue to Credentials →
                </button>
              </div>
            </div>
          )}

          {/* ===== STEP 3 — Credentials ===== */}
          {step === 3 && (
            <div className="fade-in">
              <div className="section-card">
                <div className="section-title">Account Credentials</div>

                <div className="field-group single" style={{ marginBottom: "12px" }}>
                  <div className="field">
                    <label className="field-label">Username *</label>
                    <input name="username" placeholder="Choose a username"
                      value={form.username} onChange={handleChange} onBlur={handleBlur}
                      className={`field-input ${errors.username ? "error" : ""}`} />
                    {errors.username && <span className="field-error">⚠ {errors.username}</span>}
                  </div>
                </div>

                <div className="field-group single">
                  <div className="field">
                    <label className="field-label">Password *</label>
                    <div className="pass-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password" placeholder="Min 8 chars, A-Z, a-z, 0-9, symbol"
                        value={form.password} onChange={handleChange} onBlur={handleBlur}
                        className={`field-input ${errors.password ? "error" : ""}`}
                        style={{ paddingRight: "40px" }} />
                      <span className="pass-toggle"
                        onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "🙈" : "👁️"}
                      </span>
                    </div>
                    {/* Password strength bars */}
                    <div className="pass-strength">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="strength-bar" style={{
                          background: form.password.length >= i * 2
                            ? (form.password.length >= 8 && validatePassword(form.password)
                              ? "#059669" : "#d97706")
                            : "rgba(255,255,255,0.06)"
                        }} />
                      ))}
                    </div>
                    {errors.password && <span className="field-error">⚠ {errors.password}</span>}
                  </div>
                </div>
              </div>

              <div className="nav-buttons">
                <button className="btn-back-step" onClick={() => setStep(2)}>← Back</button>
                <button className="btn-next" onClick={handleRegister}>
                  🛡️ Complete Registration
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
