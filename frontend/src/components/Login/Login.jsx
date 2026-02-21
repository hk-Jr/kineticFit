import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: "420px" }}>
        <h2 className="brand-logo">
          Kinetic<span>Fit</span>
        </h2>
        <h3>Welcome Back</h3>

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

        <p className="mt-4 mb-0 text-muted">
          Don't have an account?{" "}
          <Link to="/signup" className="blue-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
