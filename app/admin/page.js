"use client";
import useTranslation from "../utils/useTranslation";
import { validStates } from "../utils/states";
import { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import LanguageSelector from "../components/LanguageSelector";

export default function Admin() {
  const { t } = useTranslation();
  const [affectedState, setAffectedState] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
const [customType, setCustomType] = useState("");

  useEffect(() => {
  const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
  setUsers(storedUsers);
}, []);

const sendAlert = () => {
  if (!type || !message || !affectedState) {
    alert("Fill all fields including state");
    return;
  }

  const finalType = type === "custom" ? customType : type;

localStorage.setItem(
  "alert",
  JSON.stringify({ type: finalType, message })
);

  setShowUsers(true);

  alert("Alert Sent!");
};

const stopAlert = () => {
  // ❌ Remove alert
  localStorage.removeItem("alert");

  // 🔄 Reset UI
  setShowUsers(false);
  setType("");
  setMessage("");
  setAffectedState("");

  alert("🛑 Alert Stopped");
};

const emergencyUsers = users.filter(
  (u) =>
    u.profile === "elderly" ||
    u.profile === "physically_disabled" ||
    u.profile === "blind" ||
    u.profile === "deaf"
);
  
     
  return (
    <div className="p-10">
        <BackButton redirectTo="/" />
        <LanguageSelector />
        

      <>
      {/* 🔥 Heading */}
      <h1 className="text-2xl mb-6">{t.sendAlert}</h1>

      {/* 🔥 Disaster Type */}
     
<select
  value={type}
  onChange={(e) => setType(e.target.value)}
  className="border p-2 mb-2 block w-full bg-white text-black"
>
  <option value="" disabled hidden>Select Disaster</option>

  <option value="fire">Fire</option>
  <option value="flood">Flood</option>
  <option value="earthquake">Earthquake</option>
  <option value="gasleak">Gas Leak</option>
  <option value="chemical">Chemical</option>
  <option value="cyclone">Cyclone</option>
  <option value="tsunami">Tsunami</option>
  <option value="heatwave">Heatwave</option>
  <option value="coldwave">Coldwave</option>
  <option value="landslide">Landslide</option>

  <option value="custom">Other (Type manually)</option>
</select>
      
{/* ✅ Show input ONLY if custom selected */}
{type === "custom" && (
  <input
    placeholder="Enter disaster type"
    value={customType}
    onChange={(e) => setCustomType(e.target.value)}
    className="border p-2 mb-4 w-full"
  />
)}

      {/* 🔥 Message */}
      
      <input
  value={message}   // ✅ ADD
  placeholder={t.message}
  className="border p-2 mb-4 block w-full"
  onChange={(e) => setMessage(e.target.value)}
/>

      {/* 🔥 State Dropdown */}
      <select
        className="border p-2 mb-4 block w-full bg-white text-black"
        value={affectedState}
        onChange={(e) => setAffectedState(e.target.value)}
      >
        <option value="" disabled>
          {t.selectState}
        </option>

        {validStates.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>

      {/* 🔥 Button */}
      <button
        onClick={sendAlert}
        className="bg-red-500 text-white px-6 py-2"
      >
        {t.sendAlert}
      </button>
    </>

    <button
  onClick={stopAlert}
  className="bg-gray-700 text-white px-6 py-2 mt-3"
>
  Stop Alert
</button>

      {showUsers && (
  <>
    <h3 className="mt-6 font-bold">🚨 Vulnerable Users</h3>

    {emergencyUsers.length === 0 && (
      <p>No vulnerable users found</p>
    )}

    {emergencyUsers.map((u, index) => (
      // <div key={index} className="border p-3 mt-2 bg-red-100">
      //   <p><b>Name:</b> {u.name}</p>
      //   <p><b>Phone:</b> {u.phone}</p>
      //   <p><b>Profile:</b> {u.profile}</p>

      //   {u.location && (
      //     <>
      //       <p><b>Location:</b> {u.location.lat}, {u.location.lng}</p>

      //       <a
      //         href={`https://www.google.com/maps?q=${u.location.lat},${u.location.lng}`}
      //         target="_blank"
      //         className="text-blue-500 underline"
      //       >
      //         View on Map
      //       </a>
      //     </>
      //   )}
      // </div>

      <div
  key={index}
  className="bg-white border-l-4 border-red-500 p-4 mt-3 rounded-lg shadow"
>
  <h3 className="font-bold text-lg text-black">
    {u.name || "Unknown User"}
  </h3>

  <p className="text-sm text-gray-600">
    {u.profile}
  </p>

  <p className="text-sm text-black mt-1">
    📞 {u.phone || "Not available"}
  </p>

  <p className="text-sm text-gray-700">
    🚨 {u.emergencyContact || "Not available"}
  </p>

  {u.location && (
    <>
      <p className="text-xs text-gray-500 mt-2">
        📍 {u.location.lat}, {u.location.lng}
      </p>

      <a
        href={`https://www.google.com/maps?q=${u.location.lat},${u.location.lng}`}
        target="_blank"
        className="text-blue-500 underline text-sm"
      >
        View on Map
      </a>
    </>
  )}
</div> 
    ))}
  </>
)}

    </div>
  );
}