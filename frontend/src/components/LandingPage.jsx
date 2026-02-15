import React from "react";
import {
  Zap,
  ShieldCheck,
  Activity,
  EyeOff,
  Lock,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section text-center">
        <div className="container">
          <div className="badge-pill mb-4">Version 2.1.13 - LIVE</div>

          <h1 className="hero-title fw-black">
            PERFECT FORM. <br />
            <span className="blue-text">ZERO GUESSWORK.</span>
          </h1>

          <p className="hero-subtitle mx-auto opacity-75">
            KineticFit leverages edge-computing AI to validate biomechanics in
            real-time. The only protocol merging computer vision with
            nutritional precision.
          </p>

          {/* Action Buttons Container */}
          <div className="hero-actions d-flex justify-content-center gap-3">
            <button className="btn-main" onClick={() => navigate("/signup")}>
              START TRAINING <ArrowRight size={16} className="ms-2" />
            </button>
            <button className="btn-secondary-light">EXPLORE SPECS</button>
          </div>

          {/* Privacy Trust Section - Fixed spacing wrapper */}
          <div className="privacy-section-wrapper">
            <div className="privacy-pill-container">
              <div className="privacy-pill-item">
                <EyeOff size={18} className="text-primary" />
                <span className="fw-black tracking-wider">
                  Camera stays <span className="text-primary">Offline</span>
                </span>
              </div>
              <div className="pill-divider"></div>
              <div className="privacy-pill-item">
                <Lock size={18} className="text-primary" />
                <span className="fw-black tracking-wider">
                  <span className="text-primary">Edge</span> Computing
                </span>
              </div>
              <div className="pill-divider"></div>
              <div className="privacy-pill-item">
                <ShieldCheck size={18} className="text-primary" />
                <span className="fw-black tracking-wider">
                  No Data <span className="text-primary">In-Transit</span>
                </span>
              </div>
            </div>
            <p className="mt-3 text-muted x-small fw-bold tracking-wider pulse-text">
              <Activity size={12} className="me-1 text-primary" /> REAL-TIME
              LOCAL BIOMETRICS
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <h2 className="section-label fw-black tracking-wider mb-5">
            CORE SYSTEMS
          </h2>
          <div className="row g-4">
            <FeatureCard
              icon={<Zap size={24} color="#007bff" />}
              title="Form Analysis"
              desc="Joint angle detection via MediaPipe. Zero-latency feedback loop."
            />
            <FeatureCard
              icon={<Activity size={24} color="#007bff" />}
              title="Macro Engine"
              desc="Precise P/C/F tracking with automated daily aggregate logic."
            />
            <FeatureCard
              icon={<ShieldCheck size={24} color="#007bff" />}
              title="Streak Guard"
              desc="Persistent activity mapping powered by transactional history."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="col-md-4">
    <div className="f-card p-4 h-100 border border-light shadow-sm rounded-4 bg-white">
      <div className="f-icon mb-3 bg-light d-inline-flex p-3 rounded-3">
        {icon}
      </div>
      <h6
        className="fw-black tracking-wider mb-2 text-dark"
        style={{ fontSize: "13px" }}
      >
        {title}
      </h6>
      <p className="text-muted small mb-0 fw-medium">{desc}</p>
    </div>
  </div>
);

export default LandingPage;
