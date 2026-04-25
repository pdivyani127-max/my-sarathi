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
    name: "",
    dob: "",
    gender: "male",
    state: "",
    phone: "",
    aadhaar: "",
    govId: "",
    username: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser) {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
setUsers(storedUsers);
  }
}, []);

  // 🔒 INPUT CONTROL
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "name") {
      updatedValue = value.replace(/[^a-zA-Z\s]/g, "");
    }

    if (name === "phone") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "aadhaar") {
      updatedValue = value.replace(/\D/g, "").slice(0, 12);
    }

    if (name === "govId") {
      updatedValue = value.toUpperCase();
    }

    setForm({ ...form, [name]: updatedValue });
  };

  // 🔐 PASSWORD VALIDATION
  const validatePassword = (pass) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pass);
  };

  // ⚠️ VALIDATION
  const validateField = (name, value) => {
    if (!value) return "This field is required";

    if (name === "phone" && value.length !== 10) {
      return "Phone must be 10 digits";
    }

    if (name === "aadhaar" && value.length !== 12) {
      return "Aadhaar must be 12 digits";
    }

    if (name === "password" && !validatePassword(value)) {
      return "Weak password (Use A-Z, a-z, 0-9, symbol)";
    }

    if (name === "username" && value.length < 3) {
      return "Username too short";
    }

    if (name === "govId" && !validGovIDs.includes(value)) {
      return "Invalid Government ID";
    }

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
    setErrors({
      ...errors,
      [name]: validateField(name, value)
    });
  };

  // 📲 OTP
  const sendOtp = () => {
    if (form.phone.length !== 10) {
      alert("Enter valid phone number first");
      return;
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    alert("📲 Your OTP is: " + newOtp);
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      setOtpVerified(true);
      alert("✅ OTP Verified");
    } else {
      alert("❌ Incorrect OTP");
    }
  };

  // ✅ REGISTER
  const handleRegister = () => {
    if (!validateAll()) {
      alert("❌ Fix errors first");
      return;
    }

    if (!otpVerified) {
      alert("Verify OTP first");
      return;
    }

    const existingAdmins =
      JSON.parse(localStorage.getItem("admins")) || [];

    existingAdmins.push(form);

    localStorage.setItem("admins", JSON.stringify(existingAdmins));

    alert("✅ Admin Registered Successfully!");
    router.push("/");
  };



  return (
    <div className="p-6 flex flex-col gap-3 max-w-md">

      <div className="flex justify-between">
        <BackButton />
        <LanguageSelector />
      </div>

      <h2 className="text-xl font-bold">Admin Registration</h2>

      <input name="name" placeholder="Name *" value={form.name}
        onChange={handleChange} onBlur={handleBlur}
        className="border p-2" />
      {errors.name && <p className="text-red-500">{errors.name}</p>}

      <input type="date" name="dob" value={form.dob}
        onChange={handleChange} onBlur={handleBlur}
        className="border p-2" />

      <select name="gender" onChange={handleChange}
        className="border p-2 bg-white text-black">
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="others">Others</option>
      </select>

      {/* STATE */}
      <select name="state" value={form.state}
        onChange={handleChange} onBlur={handleBlur}
        className="border p-2 bg-white text-black">
        <option value="" disabled>Select State *</option>
        {validStates.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      {errors.state && <p className="text-red-500">{errors.state}</p>}

      {/* PHONE + OTP */}
      <input name="phone" placeholder="Phone *" value={form.phone}
        onChange={handleChange} onBlur={handleBlur}
        className="border p-2" />
      {errors.phone && <p className="text-red-500">{errors.phone}</p>}

      <button type="button" onClick={sendOtp}
        className="bg-blue-500 text-white p-2">
        Send OTP
      </button>

      <input placeholder="Enter OTP" value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border p-2" />

      <button type="button" onClick={verifyOtp}
        className="bg-green-500 text-white p-2">
        Verify OTP
      </button>

      {otpVerified && <p className="text-green-500">OTP Verified ✅</p>}

      <input name="aadhaar" placeholder="Aadhaar *" value={form.aadhaar}
        onChange={handleChange} onBlur={handleBlur}
        className="border p-2" />
      {errors.aadhaar && <p className="text-red-500">{errors.aadhaar}</p>}

      <input name="govId" placeholder="Government ID *" value={form.govId}
        onChange={handleChange} onBlur={handleBlur}
        className="border p-2" />
      {errors.govId && <p className="text-red-500">{errors.govId}</p>}

      <input name="username" placeholder="Username *" value={form.username}
        onChange={handleChange} onBlur={handleBlur}
        className="border p-2" />
      {errors.username && <p className="text-red-500">{errors.username}</p>}

      <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password *"
    value={form.password || ""}
    onChange={handleChange}
    onBlur={handleBlur}
    className="border p-2 w-full pr-10"
  />

  <span
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-2 cursor-pointer"
  >
    {showPassword ? "🙈" : "👁️"}
  </span>
</div>

{errors.password && (
  <p className="text-red-500">{errors.password}</p>
)}

      {/* <input type="password" name="password" placeholder="Password *"
        value={form.password}
        onChange={handleChange} onBlur={handleBlur}
        className="border p-2" />
      {errors.password && <p className="text-red-500">{errors.password}</p>} */}

      <button onClick={handleRegister}
        className="bg-red-500 text-white p-2 mt-2">
        Register
      </button>
    </div>
  );
  

}