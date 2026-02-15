import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="brand-logo mb-4">
          Kinetic<span>Fit</span>
        </h2>
        <h3>Welcome Back</h3>
        <p className="text-muted mb-4">
          Enter your details to access your dashboard.
        </p>

        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control custom-input"
              placeholder="name@company.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-4">
            <label>Password</label>
            <input
              type="password"
              className="form-control custom-input"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-auth-main w-100">
            Login
          </button>
        </form>

        <p className="mt-4 text-center">
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
