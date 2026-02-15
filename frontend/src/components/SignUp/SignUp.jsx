import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./SignUp.css"; // Reuse the same auth styling

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    weight: "",
    height: "",
    fitnessGoal: "Maintenance",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData,
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      alert("Error creating account. Email might already exist.");
    }
  };

  return (
    <div className="auth-container py-5">
      <div className="auth-card" style={{ maxWidth: "500px" }}>
        <h2 className="brand-logo mb-4">
          Kinetic<span>Fit</span>
        </h2>
        <h3>Create Athlete Profile</h3>

        <form onSubmit={handleSignup}>
          <div className="row">
            <div className="col-md-12 mb-3">
              <label>Full Name</label>
              <input
                name="name"
                type="text"
                className="form-control custom-input"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>Email</label>
              <input
                name="email"
                type="email"
                className="form-control custom-input"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>Password</label>
              <input
                name="password"
                type="password"
                className="form-control custom-input"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label>Age</label>
              <input
                name="age"
                type="number"
                className="form-control custom-input"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label>Weight (kg)</label>
              <input
                name="weight"
                type="number"
                className="form-control custom-input"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label>Height (cm)</label>
              <input
                name="height"
                type="number"
                className="form-control custom-input"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-12 mb-4">
              <label>Fitness Goal</label>
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
          <button type="submit" className="btn-auth-main w-100">
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center">
          Already an athlete?{" "}
          <Link to="/login" className="blue-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
