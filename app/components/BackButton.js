// "use client";
// import { useRouter, usePathname } from "next/navigation";

// export default function BackButton({ disabled = false }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const handleBack = () => {
//     if (disabled) return; // 🚫 do nothing if disabled

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
//       style={{
//         opacity: disabled ? 0.5 : 1,
//         cursor: disabled ? "not-allowed" : "pointer",
//       }}
//       className="fixed top-4 right-5 bg-black text-white border shadow px-3 py-2 rounded z-50"
//     >
//       ⬅ Back
//     </button>
//   );
// }

"use client";
import { useRouter, usePathname } from "next/navigation";

export default function BackButton({ disabled = false, redirectTo = null }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (disabled) return;

    if (redirectTo) {
      router.push(redirectTo);
    } else if (pathname === "/user") {
      router.push("/login");
    } else if (pathname === "/admin") {
      router.push("/");
    } else if (pathname === "/login") {
      router.push("/");
    } else {
      router.back();
    }
  };

  return (
    <>
      <style>{`
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.15s;
          backdrop-filter: blur(8px);
          letter-spacing: 0.3px;
          white-space: nowrap;
        }
        .back-btn:hover:not(.back-btn--disabled) {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          color: #fff;
          transform: translateX(-2px);
        }
        .back-btn:active:not(.back-btn--disabled) {
          transform: scale(0.96);
        }
        .back-btn--disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .back-btn__arrow {
          font-size: 14px;
          transition: transform 0.2s;
        }
        .back-btn:hover:not(.back-btn--disabled) .back-btn__arrow {
          transform: translateX(-3px);
        }
      `}</style>

      <button
        onClick={handleBack}
        className={`back-btn${disabled ? " back-btn--disabled" : ""}`}
      >
        <span className="back-btn__arrow">←</span>
        Back
      </button>
    </>
  );
}
