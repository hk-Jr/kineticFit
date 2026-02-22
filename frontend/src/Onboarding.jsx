import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./components/SignUp/SignUp.css"; // Reuse your existing styles for consistency

const Onboarding = () => {
  const [formData, setFormData] = useState({
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

  const handleFinish = async (e) => {
    e.preventDefault();
    setLoading(true);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    try {
      // API call to update the user profile
      const res = await axios.put(
        `http://localhost:5000/api/auth/update-profile/${storedUser._id}`,
        {
          ...formData,
          isOnboardingComplete: true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Update local storage with new user data
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: "500px" }}>
        <h2 className="brand-logo">
          Almost<span> There!</span>
        </h2>
        <p className="text-muted text-center mb-4">
          We just need a few more details to personalize your fitness journey.
        </p>

        <form onSubmit={handleFinish}>
          <div className="row">
            <div className="col-12 mb-3">
              <label className="form-label small fw-bold text-secondary">
                Age
              </label>
              <input
                name="age"
                type="number"
                className="form-control custom-input"
                placeholder="Ex: 25"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label small fw-bold text-secondary">
                Weight (kg)
              </label>
              <input
                name="weight"
                type="number"
                className="form-control custom-input"
                placeholder="70"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label small fw-bold text-secondary">
                Height (cm)
              </label>
              <input
                name="height"
                type="number"
                className="form-control custom-input"
                placeholder="175"
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
            {loading ? "Saving Profile..." : "Let's Start Training"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
