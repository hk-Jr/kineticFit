import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
// 1. Import Google Components
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./SignUp.css";

const Signup = () => {
  // Use the ID from your .env if available, otherwise fallback to the string you provided
  const GOOGLE_ID =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    "556642771244-mknmejljmiihsrb0ribhkje4pjktk8ns.apps.googleusercontent.com";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    weight: "",
    height: "",
    fitnessGoal: "Maintenance",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- STANDARD SIGNUP ---
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData,
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      alert("Error creating account. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  // --- GOOGLE SIGNUP LOGIC ---
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Lazy Registration: If Google user hasn't provided physical stats, go to onboarding
      if (
        !res.data.user.height ||
        !res.data.user.weight ||
        !res.data.user.age
      ) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Google Auth Error:", err);
      alert("Google Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_ID}>
      <div className="auth-container">
        <div className="auth-card" style={{ maxWidth: "550px" }}>
          <h2 className="brand-logo">
            Kinetic<span>Fit</span>
          </h2>
          <h3 className="mb-4 text-center">Create Athlete Profile</h3>

          {/* Google Button centered */}
          <div className="d-flex justify-content-center mb-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google Login Failed")}
              useOneTap
              theme="filled_blue"
              shape="pill"
              text="signup_with"
              width="300"
            />
          </div>

          {/* Separator */}
          <div className="text-center mb-4 position-relative">
            <hr />
            <span className="bg-white px-3 text-muted small position-absolute top-50 start-50 translate-middle">
              OR CONTINUE WITH EMAIL
            </span>
          </div>

          <form onSubmit={handleSignup} style={{ textAlign: "left" }}>
            <div className="row">
              <div className="col-12 mb-3">
                <label className="form-label small fw-bold text-secondary">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  className="form-control custom-input"
                  placeholder="John Doe"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label small fw-bold text-secondary">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  className="form-control custom-input"
                  placeholder="athlete@fit.com"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label small fw-bold text-secondary">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  className="form-control custom-input"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-4 mb-3">
                <label className="form-label small fw-bold text-secondary">
                  Age
                </label>
                <input
                  name="age"
                  type="number"
                  className="form-control custom-input"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-4 mb-3">
                <label className="form-label small fw-bold text-secondary">
                  Weight (kg)
                </label>
                <input
                  name="weight"
                  type="number"
                  className="form-control custom-input"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-4 mb-3">
                <label className="form-label small fw-bold text-secondary">
                  Height (cm)
                </label>
                <input
                  name="height"
                  type="number"
                  className="form-control custom-input"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 mb-4">
                <label className="form-label small fw-bold text-secondary">
                  Fitness Goal
                </label>
                <select
                  name="fitnessGoal"
                  className="form-select custom-input"
                  onChange={handleChange}
                >
                  <option value="Maintenance">Maintenance</option>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="btn-auth-main w-100"
              disabled={loading}
            >
              {loading ? "Processing..." : "Complete Registration"}
            </button>
          </form>

          <p className="mt-4 mb-0 text-muted text-center">
            Already an athlete?{" "}
            <Link to="/login" className="blue-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Signup;
