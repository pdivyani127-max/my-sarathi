// "use client";
// import { useRouter } from "next/navigation";
// import BackButton from "../components/BackButton";
// import LanguageSelector from "../components/LanguageSelector";

// export default function Register() {
//   const router = useRouter();

//   return (
//     <div className="flex flex-col items-center mt-20">
//         <BackButton />
// <LanguageSelector />
//       <h2 className="text-2xl mb-4">Register As</h2>

//       <button
//         onClick={() => router.push("/register/user")}
//         className="mb-2 bg-blue-500 p-2 text-white"
//       >
//         User
//       </button>

//       <button
//         onClick={() => router.push("/register/admin")}
//         className="bg-red-500 p-2 text-white"
//       >
//         Admin
//       </button>
//     </div>
//   );
// }

"use client";
import { useRouter } from "next/navigation";
import BackButton from "../components/BackButton";
import LanguageSelector from "../components/LanguageSelector";

export default function Register() {
  const router = useRouter();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=DM+Serif+Display&display=swap');

        .reg-root {
          min-height: 100vh;
          background: #0a0f1e;
          font-family: 'Sora', sans-serif;
          color: #f0f4ff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 24px;
        }
        .reg-root::before {
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
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.2;
        }
        .orb-1 { width: 350px; height: 350px; background: #1e40af; top: -100px; left: -100px; }
        .orb-2 { width: 250px; height: 250px; background: #dc2626; bottom: -80px; right: -80px; }

        .top-bar {
          position: absolute;
          top: 20px; left: 20px; right: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
        }

        .reg-content {
          position: relative;
          z-index: 10;
          text-align: center;
          width: 100%;
          max-width: 480px;
        }

        .reg-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 12px;
        }

        .reg-title {
          font-family: 'DM Serif Display', serif;
          font-size: 38px;
          font-weight: 400;
          color: #f0f4ff;
          margin-bottom: 8px;
          line-height: 1.1;
        }

        .reg-subtitle {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 40px;
          font-weight: 300;
        }

        .reg-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        @media (max-width: 480px) {
          .reg-cards { grid-template-columns: 1fr; }
        }

        .reg-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 28px 20px;
          cursor: pointer;
          transition: all 0.25s ease;
          text-align: left;
          position: relative;
          overflow: hidden;
        }
        .reg-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .reg-card.user::before {
          background: linear-gradient(135deg, rgba(37,99,235,0.15), transparent);
        }
        .reg-card.admin::before {
          background: linear-gradient(135deg, rgba(220,38,38,0.15), transparent);
        }
        .reg-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,255,255,0.15);
        }
        .reg-card.user:hover {
          border-color: rgba(37,99,235,0.4);
          box-shadow: 0 12px 40px rgba(37,99,235,0.15);
        }
        .reg-card.admin:hover {
          border-color: rgba(220,38,38,0.4);
          box-shadow: 0 12px 40px rgba(220,38,38,0.15);
        }
        .reg-card:hover::before { opacity: 1; }

        .card-icon {
          width: 48px; height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }
        .icon-user { background: rgba(37,99,235,0.15); border: 1px solid rgba(37,99,235,0.2); }
        .icon-admin { background: rgba(220,38,38,0.15); border: 1px solid rgba(220,38,38,0.2); }

        .card-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 6px;
          color: #f0f4ff;
          position: relative;
          z-index: 1;
        }
        .card-desc {
          font-size: 12px;
          color: #64748b;
          line-height: 1.6;
          position: relative;
          z-index: 1;
          margin-bottom: 20px;
        }
        .card-cta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          position: relative;
          z-index: 1;
          transition: gap 0.2s ease;
        }
        .cta-user { color: #60a5fa; }
        .cta-admin { color: #f87171; }
        .reg-card:hover .card-cta { gap: 10px; }

        .login-link {
          font-size: 13px;
          color: #475569;
        }
        .login-link span {
          color: #60a5fa;
          cursor: pointer;
          font-weight: 600;
          transition: color 0.2s;
        }
        .login-link span:hover { color: #93c5fd; }

        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.5s ease forwards;
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="reg-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <div className="top-bar">
          <BackButton />
          <LanguageSelector />
        </div>

        <div className="reg-content">
          <p className="reg-label fade-in">Create your account</p>
          <h2 className="reg-title fade-in delay-1">Join Sarathi</h2>
          <p className="reg-subtitle fade-in delay-1">Select the type of account to register</p>

          <div className="reg-cards fade-in delay-2">
            {/* USER CARD */}
            <div className="reg-card user" onClick={() => router.push("/register/user")}>
              <div className="card-icon icon-user">👤</div>
              <div className="card-title">Citizen</div>
              <div className="card-desc">
                Register as a citizen to access emergency services, report incidents, and get real-time alerts.
              </div>
              <div className="card-cta cta-user">
                Register as User <span>→</span>
              </div>
            </div>

            {/* ADMIN CARD */}
            <div className="reg-card admin" onClick={() => router.push("/register/admin")}>
              <div className="card-icon icon-admin">🛡️</div>
              <div className="card-title">Admin</div>
              <div className="card-desc">
                Government officials with valid Gov ID & Aadhaar can register to manage emergency operations.
              </div>
              <div className="card-cta cta-admin">
                Register as Admin <span>→</span>
              </div>
            </div>
          </div>

          <p className="login-link fade-in delay-3">
            Already have an account?{" "}
            <span onClick={() => router.push("/login")}>Login here</span>
          </p>
        </div>
      </div>
    </>
  );
}
