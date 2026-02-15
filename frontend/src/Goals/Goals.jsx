import React, { useState } from "react";
import axios from "axios";
import {
  Target,
  Flame,
  Dumbbell,
  Droplets,
  Save,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Goals = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Initialize state with existing user data or defaults
  const [formData, setFormData] = useState({
    dailyCalorieTarget: user?.dailyCalorieTarget || 2000,
    dailySquatTarget: user?.dailySquatTarget || 50,
    dailyPushupTarget: user?.dailyPushupTarget || 30,
    dailyWaterTarget: user?.dailyWaterTarget || 8,
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/auth/update-goals/${user._id}`,
        formData,
      );
      // Update LocalStorage so the Dashboard gets the new targets immediately
      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Mission Targets Updated!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to save goals.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "600px" }}>
      <button
        className="btn btn-link text-dark p-0 mb-4"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
        <div className="bg-primary p-4 text-white text-center">
          <Target size={40} className="mb-2" />
          <h2 className="fw-bold mb-0">Set Your Mission</h2>
          <p className="opacity-75">
            Define your daily targets for peak performance
          </p>
        </div>

        <div className="card-body p-4">
          {/* Calorie Goal */}
          <div className="mb-4">
            <label className="form-label fw-bold d-flex align-items-center">
              <Flame size={18} className="text-danger me-2" /> Daily Calorie
              Goal
            </label>
            <input
              type="number"
              className="form-control form-control-lg bg-light border-0"
              value={formData.dailyCalorieTarget}
              onChange={(e) =>
                setFormData({ ...formData, dailyCalorieTarget: e.target.value })
              }
            />
          </div>

          {/* Squat Goal */}
          <div className="mb-4">
            <label className="form-label fw-bold d-flex align-items-center">
              <Dumbbell size={18} className="text-primary me-2" /> Daily Squat
              Target
            </label>
            <input
              type="number"
              className="form-control form-control-lg bg-light border-0"
              value={formData.dailySquatTarget}
              onChange={(e) =>
                setFormData({ ...formData, dailySquatTarget: e.target.value })
              }
            />
          </div>

          {/* Pushup Goal */}
          <div className="mb-4">
            <label className="form-label fw-bold d-flex align-items-center">
              <Dumbbell size={18} className="text-success me-2" /> Daily Push-up
              Target
            </label>
            <input
              type="number"
              className="form-control form-control-lg bg-light border-0"
              value={formData.dailyPushupTarget}
              onChange={(e) =>
                setFormData({ ...formData, dailyPushupTarget: e.target.value })
              }
            />
          </div>

          {/* Water Goal */}
          <div className="mb-4">
            <label className="form-label fw-bold d-flex align-items-center">
              <Droplets size={18} className="text-info me-2" /> Water Goal
              (Glasses)
            </label>
            <input
              type="number"
              className="form-control form-control-lg bg-light border-0"
              value={formData.dailyWaterTarget}
              onChange={(e) =>
                setFormData({ ...formData, dailyWaterTarget: e.target.value })
              }
            />
          </div>

          <button
            className="btn btn-primary btn-lg w-100 rounded-pill fw-bold shadow mt-2"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <Save size={20} className="me-2" /> Update Targets
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Goals;
