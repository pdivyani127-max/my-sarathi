
// "use client";
// import { useRouter, usePathname } from "next/navigation";

// export default function BackButton() {
//   const router = useRouter();
//   const pathname = usePathname();

//   const handleBack = () => {
//     if (pathname === "/user") {
//       router.push("/login");   // 👤 user → login
//     } 
//     else if (pathname === "/admin") {
//       router.push("/");        // 🧑‍💻 admin → homepage
//     } 
//     else if (pathname === "/login") {
//       router.push("/");        // login → homepage
//     } 
//     else {
//       router.back();           // default behavior
//     }
//   };

//   return (
//     <button
//       onClick={handleBack}
//        className="fixed top-4 right-5 bg-black text-white border shadow px-3 py-2 rounded  z-50"
    
//     >
//       ⬅ Back
//     </button>
//   );
// }


"use client";
import { useRouter, usePathname } from "next/navigation";

export default function BackButton({ disabled = false }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (disabled) return; // 🚫 do nothing if disabled

    if (pathname === "/user") {
      router.push("/login");   // 👤 user → login
    } 
    else if (pathname === "/admin") {
      router.push("/");        // 🧑‍💻 admin → homepage
    } 
    else if (pathname === "/login") {
      router.push("/");        // login → homepage
    } 
    else {
      router.back();           // default behavior
    }
  };

  return (
    <button
      onClick={handleBack}
      style={{
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      className="fixed top-4 right-5 bg-black text-white border shadow px-3 py-2 rounded z-50"
    >
      ⬅ Back
    </button>
  );
}