

"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=DM+Serif+Display&display=swap');

        .sarathi-root {
          min-height: 100vh;
          background: #0a0f1e;
          font-family: 'Sora', sans-serif;
          color: #f0f4ff;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* Animated background grid */
        .sarathi-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* Glow orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.3;
        }
        .orb-1 {
          width: 400px; height: 400px;
          background: #1e40af;
          top: -100px; left: -100px;
        }
        .orb-2 {
          width: 300px; height: 300px;
          background: #dc2626;
          bottom: -80px; right: -80px;
        }
        .orb-3 {
          width: 200px; height: 200px;
          background: #0891b2;
          top: 50%; left: 60%;
        }

        /* Alert strip */
        .alert-strip {
          position: absolute;
          top: 0; left: 0; right: 0;
          background: linear-gradient(90deg, #dc2626, #b91c1c);
          padding: 8px 20px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #fff;
        }
        .alert-dot {
          width: 8px; height: 8px;
          background: #fca5a5;
          border-radius: 50%;
          animation: blink 1.2s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        /* Main content */
        .content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 40px 24px;
          max-width: 640px;
        }

        /* Badge */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(59,130,246,0.12);
          border: 1px solid rgba(59,130,246,0.3);
          padding: 6px 16px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #93c5fd;
          margin-bottom: 28px;
        }
        .badge-dot {
          width: 6px; height: 6px;
          background: #60a5fa;
          border-radius: 50%;
          animation: blink 1.2s ease-in-out infinite;
        }

        /* Headline */
        .headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(42px, 8vw, 72px);
          font-weight: 400;
          line-height: 1.05;
          margin-bottom: 8px;
          color: #f0f4ff;
          letter-spacing: -0.02em;
        }
        .headline-accent {
          color: #ef4444;
          font-style: italic;
        }
        .tagline {
          font-size: 15px;
          color: #94a3b8;
          margin-bottom: 48px;
          font-weight: 300;
          letter-spacing: 0.04em;
        }

        /* Stats row */
        .stats-row {
          display: flex;
          justify-content: center;
          gap: 32px;
          margin-bottom: 48px;
          flex-wrap: wrap;
        }
        .stat {
          text-align: center;
        }
        .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: #f0f4ff;
          display: block;
        }
        .stat-label {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .stat-divider {
          width: 1px;
          background: rgba(255,255,255,0.08);
          align-self: stretch;
        }

        /* Buttons */
        .btn-group {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }
        .btn-primary {
          background: #2563eb;
          color: #fff;
          border: none;
          padding: 14px 32px;
          border-radius: 8px;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.02em;
        }
        .btn-primary:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(37,99,235,0.4);
        }
        .btn-secondary {
          background: transparent;
          color: #f0f4ff;
          border: 1px solid rgba(255,255,255,0.2);
          padding: 14px 32px;
          border-radius: 8px;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-secondary:hover {
          border-color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.05);
          transform: translateY(-1px);
        }
        .btn-emergency {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: #fff;
          border: none;
          padding: 14px 28px;
          border-radius: 8px;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          letter-spacing: 0.02em;
        }
        .btn-emergency:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(220,38,38,0.5);
        }

        /* Feature cards */
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          max-width: 640px;
          width: 100%;
        }
        @media (max-width: 600px) {
          .feature-grid { grid-template-columns: 1fr; }
          .stats-row { gap: 20px; }
          .stat-divider { display: none; }
        }
        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 16px;
          text-align: left;
          transition: all 0.2s ease;
        }
        .feature-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-2px);
        }
        .feature-icon {
          width: 36px; height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          margin-bottom: 10px;
        }
        .icon-blue { background: rgba(37,99,235,0.15); }
        .icon-red { background: rgba(220,38,38,0.15); }
        .icon-green { background: rgba(5,150,105,0.15); }
        .feature-title {
          font-size: 13px;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 4px;
        }
        .feature-desc {
          font-size: 11px;
          color: #64748b;
          line-height: 1.5;
        }

        /* Footer */
        .footer-note {
          position: absolute;
          bottom: 20px;
          font-size: 11px;
          color: #334155;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* Fade-in animation */
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.6s ease forwards;
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .delay-5 { animation-delay: 0.5s; }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="sarathi-root">
        {/* Orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Alert strip */}
        <div className="alert-strip">
          <div className="alert-dot" />
          Emergency Helpline Active — Dial 112 for Immediate Assistance
          <div className="alert-dot" />
        </div>

        {/* Main content */}
        <div className="content">
          <div className={`badge ${mounted ? "fade-in" : ""}`}>
            <div className="badge-dot" />
            National Emergency Response Platform
          </div>

          <h1 className={`headline ${mounted ? "fade-in delay-1" : ""}`}>
            SARATHI<br />
            <span className="headline-accent">Saves Lives</span>
          </h1>

          <p className={`tagline ${mounted ? "fade-in delay-2" : ""}`}>
            Because Every Life Matters — Rapid Response. Real Relief.
          </p>

          {/* Stats */}
          <div className={`stats-row ${mounted ? "fade-in delay-2" : ""}`}>
            <div className="stat">
              <span className="stat-number">29+</span>
              <span className="stat-label">States Covered</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Active Support</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">112</span>
              <span className="stat-label">Emergency Line</span>
            </div>
          </div>

          {/* Buttons */}
          <div className={`btn-group ${mounted ? "fade-in delay-3" : ""}`}>
            <button className="btn-primary" onClick={() => router.push("/register")}>
              Register Now
            </button>
            <button className="btn-secondary" onClick={() => router.push("/login")}>
              Login
            </button>
            <button className="btn-emergency" onClick={() => router.push("/emergency")}>
              <span>⚠</span> SOS
            </button>
          </div>

          {/* Feature cards */}
          <div className={`feature-grid ${mounted ? "fade-in delay-4" : ""}`}>
            <div className="feature-card">
              <div className="feature-icon icon-blue">🛡️</div>
              <div className="feature-title">Verified Admins</div>
              <div className="feature-desc">Gov ID & Aadhaar verified officials only</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon icon-red">🚨</div>
              <div className="feature-title">Crisis Response</div>
              <div className="feature-desc">Real-time disaster & emergency alerts</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon icon-green">🌐</div>
              <div className="feature-title">Multi-language</div>
              <div className="feature-desc">Support in all Indian languages</div>
            </div>
          </div>
        </div>

        <div className="footer-note">
          Govt. of India Initiative · SARATHI Emergency Platform
        </div>
      </div>
    </>
  );
}

