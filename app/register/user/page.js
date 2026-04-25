"use client";
import useTranslation from "../../utils/useTranslation";
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

export default function UserRegister() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "male",
    phone: "",
    state: "",
    address: "",
    pincode: "",
    aadhaar: "",
    profile: "normal",
    extra: "",
    emergency1: "",
    emergency2: "",
    location: null,
    username: "",
    password: ""    // ✅ ADD THIS LINE
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const location = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      setForm((prev) => ({ ...prev, location }));
    });
  }
}, []);

  // 🔒 INPUT CONTROL (BLOCK WRONG TYPING)
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    // Name → only letters
    if (name === "name") {
      updatedValue = value.replace(/[^a-zA-Z\s]/g, "");
    }

    // Phone → only 10 digits
    if (name === "phone") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    // Aadhaar → only 12 digits
    if (name === "aadhaar") {
      updatedValue = value.replace(/\D/g, "").slice(0, 12);
    }

// if (name === "emergency1" || name === "emergency2") {
//   updatedValue = value.replace(/\D/g, "").slice(0, 10);
// }

    // Pincode → only 6 digits
    if (name === "pincode") {
      updatedValue = value.replace(/\D/g, "").slice(0, 6);
    }

    if (name === "emergency1" || name === "emergency2") {
  updatedValue = value.replace(/\D/g, "").slice(0, 10);
}

    setForm({ ...form, [name]: updatedValue });
  };

  // ⚠️ FIELD VALIDATION
  const validateField = (name, value) => {
    let message = "";

    const isExtraRequired =
  name === "extra" &&
  (form.profile === "elderly" || form.profile === "physically_disabled");

if (
  !value &&
  // !["emergency1", "emergency2"].includes(name) 
  !(
  ["emergency1", "emergency2"].includes(name) &&
  form.profile === "normal"
)&&
  !isExtraRequired &&
  name !== "extra"
) {
  return "This field is required";
}

if (isExtraRequired && !value) {
  return "Please mention condition";
}

    
    if (name === "phone" && value.length !== 10) {
      message = "Phone must be 10 digits";
    }

    if (name === "username" && value.length < 3) {
  return "Username must be at least 3 characters";
}

    if (name === "aadhaar" && value.length !== 12) {
      message = "Aadhaar must be 12 digits";
    }

    if (name === "pincode" && value.length !== 6) {
      message = "Pincode must be 6 digits";
    }

    if (name === "state" && !value) {
  return "Please select a state";
}
    
    return message;
  };

  // 🔍 VALIDATE ALL
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


const isFormValid = () => {
  return Object.keys(form).every((key) => {
    // if (["emergency1", "emergency2"].includes(key)) return true;
    if (
  ["emergency1", "emergency2"].includes(key) &&
  form.profile === "normal"
) {
  return true;
}

    if (
      key === "extra" &&
      !(form.profile === "elderly" || form.profile === "physically_disabled")
    ) {
      return true;
    }

    return form[key] !== "" && !validateField(key, form[key]);
  });
};

const handleRegister = () => {
  console.log("Register clicked");

  // ✅ Get existing users
  const existingUsers =
    JSON.parse(localStorage.getItem("users")) || [];

  // ✅ Check duplicate username
  const exists = existingUsers.find(
    (u) => u.username === form.username
  );

  if (exists) {
    alert("❌ Username already exists");
    return;
  }

  // ✅ Create user object
  const userData = {
    ...form,
    role: "user", // VERY IMPORTANT
  };

  // ✅ Add new user
  existingUsers.push(userData);

  // ✅ Save back
  localStorage.setItem("users", JSON.stringify(existingUsers));

  console.log("Saved users:", existingUsers);

  alert("✅ User Registered Successfully!");
};

// Emergency validation (only if NOT normal)
if (form.profile !== "normal") {
  if (
    name === "emergency1" ||
    name === "emergency2"
  ) {
    const e1 = form.emergency1;
    const e2 = form.emergency2;

    // ❗ At least one must be filled
    if (!e1 && !e2) {
      return "At least one emergency contact is required";
    }

    // ❗ If filled → must be 10 digits
    if (e1 && e1.length !== 10) {
      return "Emergency contact must be 10 digits";
    }

    if (e2 && e2.length !== 10) {
      return "Emergency contact must be 10 digits";
    }
  }
}

  return (
    <div className="p-6 flex flex-col gap-3 max-w-md">
         <BackButton />
        <LanguageSelector />
      <h2 className="text-xl font-bold">{t.registerUser}</h2>

      {/* NAME */}
    
       <input
  name="name"
  placeholder={`${t.name} *`}
  value={form.name}
  onChange={handleChange}
  onBlur={handleBlur}
  className="border p-2"
/>
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

      <input
  name="username"
  placeholder="Username *"
  value={form.username}
  onChange={handleChange}
  onBlur={handleBlur}
  className="border p-2"
/>
{errors.username && (
  <p className="text-red-500 text-sm">{errors.username}</p>
)}

      {/* DOB */}
      <input type="date" name="dob" value={form.dob}
        onChange={handleChange} onBlur={handleBlur}
        className="border p-2" />
      {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}

      {/* GENDER */}
      <select
  name="gender"
  onChange={handleChange}
  className="border p-2 bg-white text-black"
>
  <option value="male">{t.male}</option>
  <option value="female">{t.female}</option>
  <option value="others">{t.others}</option>
</select>

      {/* PHONE */}
        <input
  name="phone"
  placeholder={`${t.phone} *`}
  value={form.phone}
  onChange={handleChange}
  onBlur={handleBlur}
  className="border p-2"
/>
      {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

      {/* STATE */}
       <select
  name="state"
  value={form.state}
  onChange={handleChange}
  onBlur={handleBlur}
  className="border p-2 bg-white text-black"
>
  <option value="" disabled>
    {t.selectState} *
  </option>

  {validStates.map((state) => (
    <option key={state} value={state}>
      {state}
    </option>
  ))}
</select>
{errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}

      {/* ADDRESS */}
    
        <input
  name="address"
  placeholder={`${t.address || "Address"} *`}
  value={form.address}
  onChange={handleChange}
  onBlur={handleBlur}
  className="border p-2"
/>
      {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

      {/* PINCODE */}
    
        <input
  name="pincode"
  placeholder={`${t.pincode || "Pincode"} *`}
  value={form.pincode}
  onChange={handleChange}
  onBlur={handleBlur}
  className="border p-2"
/>
      {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}

      {/* AADHAAR */}
     
        <input
  name="aadhaar"
  placeholder={`${t.aadhaar} *`}
  value={form.aadhaar}
  onChange={handleChange}
  onBlur={handleBlur}
  className="border p-2"
/>
      {errors.aadhaar && <p className="text-red-500 text-sm">{errors.aadhaar}</p>}

      {/* PROFILE */}
    
      <select
  name="profile"
  onChange={handleChange}
  className="border p-2 bg-white text-black"
>
  <option value="normal">Normal</option>
  <option value="elderly">{t.elderly}</option>
  <option value="deaf">{t.deaf}</option>
  <option value="blind">{t.blind}</option>
  <option value="physically_disabled">{t.physically_disabled}</option>
</select>

{(form.profile === "elderly" || form.profile === "physically_disabled") && (
  <input
    name="extra"
    placeholder={t.message}
    onChange={handleChange}
    className="border p-2"
  />
)}
     

      {/* OPTIONAL */}
      <input
  name="emergency1"
  placeholder={`${t.emergency1 || "Emergency Contact 1"}`}
  value={form.emergency1}   // ✅ ADD THIS
  onChange={handleChange}
  onBlur={handleBlur}
  maxLength={10}            // ✅ OPTIONAL but good
  className="border p-2"
/>
     
{/* <input
  name="emergency1"
  placeholder={`${t.emergency1 || "Emergency Contact 1"}`}
  onChange={handleChange}
  className="border p-2"
/> */}

{/* 👇 ADD HERE */}
{errors.emergency1 && (
  <p className="text-red-500 text-sm">{errors.emergency1}</p>
)}

<input
  name="emergency2"
  placeholder={`${t.emergency2 || "Emergency Contact 2"}`}
  value={form.emergency2}   // ✅ ADD THIS
  onChange={handleChange}
  onBlur={handleBlur}
  maxLength={10}
  className="border p-2"
/>

{/* <input
  name="emergency2"
  placeholder={`${t.emergency2 || "Emergency Contact 2"}`}
  onChange={handleChange}
  className="border p-2"
/> */}

{/* 👇 ADD HERE */}
{errors.emergency2 && (
  <p className="text-red-500 text-sm">{errors.emergency2}</p>
)}


<div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder={`${t.password} *`}
    value={form.password}
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, "");
      setForm({ ...form, password: value });
    }}
    className="border p-2 w-full pr-10"
  />

  <span
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-2 cursor-pointer"
  >
    {showPassword ? "🙈" : "👁️"}
  </span>
</div>


<button
  type="button"
  onClick={handleRegister}
  disabled={!isFormValid()}
  className={`p-2 mt-2 text-white ${
    isFormValid() ? "bg-blue-500" : "bg-gray-400 cursor-not-allowed"
  }`}
>
  {t.register}
</button>

      <button
  type="button"
  onClick={() => router.push("/")}
  className="text-blue-500 underline mt-2"
>
  ← Back to Welcome
</button>
    </div>
  );


}