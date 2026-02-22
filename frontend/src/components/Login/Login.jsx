import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
// 1. Import Google Components
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Pull Client ID from environment variables
  const GOOGLE_ID =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    "556642771244-mknmejljmiihsrb0ribhkje4pjktk8ns.apps.googleusercontent.com";

  // --- STANDARD LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  // --- GOOGLE LOGIN LOGIC ---
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect check: If user hasn't finished onboarding, send them there
      const user = res.data.user;
      if (!user.height || !user.weight || !user.age) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Google Login Error:", err);
      alert("Google Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_ID}>
      <div className="auth-container">
        <div className="auth-card" style={{ maxWidth: "420px" }}>
          <h2 className="brand-logo">
            Kinetic<span>Fit</span>
          </h2>
          <h3 className="text-center mb-4">Welcome Back</h3>

          {/* Google Login Button */}
          <div className="d-flex justify-content-center mb-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google Login Failed")}
              useOneTap
              theme="filled_blue"
              shape="pill"
              text="signin_with"
              width="320"
            />
          </div>

          {/* Separator */}
          <div className="text-center mb-4 position-relative">
            <hr />
            <span className="bg-white px-3 text-muted small position-absolute top-50 start-50 translate-middle">
              OR WITH EMAIL
            </span>
          </div>

          <form onSubmit={handleLogin} style={{ textAlign: "left" }}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary">
                Email Address
              </label>
              <input
                type="email"
                className="form-control custom-input"
                placeholder="name@company.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label small fw-bold text-secondary">
                Password
              </label>
              <input
                type="password"
                className="form-control custom-input"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-auth-main w-100"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-4 mb-0 text-muted text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="blue-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
