import React from "react";
import { CheckCircle, Zap, ShieldCheck, Activity } from "lucide-react";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-container white-theme">
      {/* Hero Section */}
      <section className="hero-section text-center">
        <div className="container">
          <div className="badge-pill mb-3">V1.0 is now live</div>
          <h1 className="hero-title-clean">
            Perfect Form. <span className="blue-text">Zero Guesswork.</span>
          </h1>
          <p className="hero-subtitle-clean mx-auto">
            KinetiFit uses advanced AI to track your reps and validate your form
            in real-time. The only SaaS tool that merges biomechanics with
            nutrition.
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button className="btn-main">Start Free Trial</button>
            <button className="btn-secondary-light">Explore Features</button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section py-5">
        <div className="container">
          <h2 className="section-label">Features</h2>
          <div className="row g-4 mt-2">
            <FeatureCard
              icon={<Zap color="#007bff" />}
              title="AI Form Analysis"
              desc="Real-time joint angle detection using MediaPipe. Get instant feedback on every rep."
            />
            <FeatureCard
              icon={<Activity color="#007bff" />}
              title="Macro Precision"
              desc="Log 30+ core foods and track your P/C/F ratios with automated daily totals."
            />
            <FeatureCard
              icon={<ShieldCheck color="#007bff" />}
              title="Streak Guard"
              desc="Our gamified system keeps you motivated. Never miss a day with smart notifications."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="how-it-works py-5 bg-light-gray">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2 className="fw-bold">How KinetiFit Works</h2>
              <div className="step mt-4">
                <span className="step-num">01</span>
                <div>
                  <h5>Sync Your Camera</h5>
                  <p className="text-muted">
                    Place your device and let our AI map your body landmarks.
                  </p>
                </div>
              </div>
              <div className="step">
                <span className="step-num">02</span>
                <div>
                  <h5>Perform & Perfect</h5>
                  <p className="text-muted">
                    Receive live 'Good Form' or 'Fix Form' cues as you move.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <div className="demo-box shadow-lg">
                {/* Placeholder for Dashboard Mockup */}
                <p className="text-muted">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="col-md-4">
    <div className="f-card">
      <div className="f-icon">{icon}</div>
      <h5 className="fw-bold mt-3">{title}</h5>
      <p className="text-muted small">{desc}</p>
    </div>
  </div>
);

export default LandingPage;
