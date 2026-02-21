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
    <div className="landing-page-root">
      {/* --- REFINED BACKGROUND LAYER --- */}
      <div className="bg-canvas">
        <div className="subtle-grid"></div>
        <div className="radial-glow"></div>
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <section className="hero-section text-center">
        <div className="container position-relative">
          <div className="version-badge mb-4">SYSTEM V1.0 // ACTIVE</div>

          <h1 className="hero-main-title fw-black">
            PERFECT FORM. <br />
            <span className="text-blue-accent">ZERO GUESSWORK.</span>
          </h1>

          <p className="hero-description mx-auto">
            KineticFit leverages edge-computing AI to validate biomechanics in
            real-time. The only protocol merging computer vision with
            nutritional precision.
          </p>

          <div className="hero-btn-group d-flex justify-content-center gap-3">
            <button
              className="btn-solid-dark"
              onClick={() => navigate("/signup")}
            >
              START TRAINING <ArrowRight size={16} className="ms-2" />
            </button>
            <button className="btn-outline-light">EXPLORE SPECS</button>
          </div>

          <div className="trust-pills-wrapper">
            <div className="privacy-pill-bar">
              <div className="privacy-item">
                <EyeOff size={18} className="icon-blue" />
                <span className="pill-text">
                  Camera stays <span className="icon-blue">Offline</span>
                </span>
              </div>
              <div className="vertical-divider"></div>
              <div className="privacy-item">
                <Lock size={18} className="icon-blue" />
                <span className="pill-text">
                  <span className="icon-blue">Edge</span> Computing
                </span>
              </div>
              <div className="vertical-divider"></div>
              <div className="privacy-item">
                <ShieldCheck size={18} className="icon-blue" />
                <span className="pill-text">
                  No Data <span className="icon-blue">In-Transit</span>
                </span>
              </div>
            </div>
            <p className="biometrics-tag mt-4">
              <Activity size={12} className="me-1 icon-blue" /> REAL-TIME LOCAL
              BIOMETRICS
            </p>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="core-features-section py-5">
        <div className="container">
          <h2 className="core-systems-heading fw-black mb-5">CORE SYSTEMS</h2>
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
    <div className="feature-card-item">
      <div className="icon-box mb-3">{icon}</div>
      <h6 className="feature-card-title">{title}</h6>
      <p className="feature-card-desc">{desc}</p>
    </div>
  </div>
);

export default LandingPage;
