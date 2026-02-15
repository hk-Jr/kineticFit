import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Dumbbell, Utensils, Zap, User, Edit3, Target } from "lucide-react";
import axios from "axios";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [totalToday, setTotalToday] = useState(0);
  const [activityData, setActivityData] = useState([]);
  const navigate = useNavigate();
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser) {
      navigate("/login");
    } else {
      setUser(loggedInUser);
      fetchDailyStats(loggedInUser._id);
      fetchActivityHeatmap(loggedInUser._id);
    }
  }, [navigate]);

  const fetchDailyStats = async (userId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/diet/${userId}/${todayStr}`,
      );
      setTotalToday(res.data.totalCalories || 0);
    } catch (err) {
      console.log("No diet log found for today.");
    }
  };

  const fetchActivityHeatmap = async (userId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/auth/activity/${userId}`,
      );
      setActivityData(res.data);
    } catch (err) {
      // Fallback: If backend route isn't ready, show today as active
      setActivityData([{ date: todayStr, count: 1 }]);
    }
  };

  //cals streak
  const calculateStreak = (data) => {
    if (!data || data.length === 0) return 0;

    // Sort dates descending (newest first)
    const sortedDates = data
      .map((d) => d.date)
      .sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    let currentDate = new Date(); // Start from today

    // Clean date to YYYY-MM-DD for comparison
    const formatDate = (d) => d.toISOString().split("T")[0];

    for (let i = 0; i < sortedDates.length; i++) {
      const todayStr = formatDate(currentDate);

      if (sortedDates.includes(todayStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1); // Move to yesterday
      } else {
        // If today is missing, check if they at least logged yesterday
        if (streak === 0) {
          currentDate.setDate(currentDate.getDate() - 1);
          const yesterdayStr = formatDate(currentDate);
          if (sortedDates.includes(yesterdayStr)) continue;
        }
        break;
      }
    }
    return streak;
  };

  return (
    <div className="dashboard-container">
      {/* --- HERO SECTION (Profile & Heatmap) --- */}
      <div className="dashboard-hero bg-dark text-white py-5 mb-4">
        <div className="container">
          <div className="row align-items-center">
            {/* Profile Info */}
            <div className="col-lg-4 mb-4 mb-lg-0 border-end border-secondary">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="profile-avatar bg-primary rounded-circle d-flex align-items-center justify-content-center">
                  <User size={40} color="white" />
                </div>
                <div>
                  <h2 className="fw-bold mb-0">{user?.name || "Athlete"}</h2>
                  <p className="text-primary mb-0 small fw-bold">
                    {user?.fitnessGoal || "Kinetic Member"}
                  </p>
                </div>
              </div>
              <button
                className="btn btn-outline-light btn-sm rounded-pill px-3"
                onClick={() => navigate("/goals")}
              >
                <Edit3 size={14} className="me-2" /> Update Profile
              </button>
              <div className="mt-3 d-flex gap-3 text-muted small">
                <span>W: {user?.weight || "--"}kg</span>
                <span>H: {user?.height || "--"}cm</span>
                <span>Age: {user?.age || "--"}</span>
              </div>
            </div>

            {/* Heatmap Section */}
            <div className="col-lg-8 ps-lg-5">
              {/* <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-uppercase fw-bold text-primary mb-0 small">
                  Activity Streak
                </h6>
                <div className="streak-badge-mini">
                  <Zap size={14} fill="#ffbc00" color="#ffbc00" />
                  <span className="ms-1">Streak: 4 days</span>
                </div>
              </div> */}
              <div className="streak-badge mt-2">
                <Zap
                  size={18}
                  fill={calculateStreak(activityData) > 0 ? "#ffbc00" : "#ccc"}
                  color={calculateStreak(activityData) > 0 ? "#ffbc00" : "#ccc"}
                />
                <span>
                  Current Streak: {calculateStreak(activityData)} days
                </span>
              </div>
              <div className="heatmap-wrapper bg-white p-3 rounded-4 shadow-sm">
                <CalendarHeatmap
                  startDate={
                    new Date(new Date().setFullYear(today.getFullYear() - 1))
                  }
                  endDate={today}
                  values={activityData}
                  classForValue={(value) => {
                    if (!value || value.count === 0) return "color-empty";
                    return "color-scale-green";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-2">
        {/* Welcome Header / Quick Stats */}
        <div className="welcome-box p-4 mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h4 className="fw-bold text-white mb-1">Daily Overview</h4>
            <p className="mb-0 opacity-75">
              Keep pushing toward your {user?.fitnessGoal} goal!
            </p>
          </div>

          <div className="summary-card-mini text-center text-white">
            <h6 className="text-uppercase tiny-text mb-1">Today's Fuel</h6>
            <div className="progress-circle-mini">
              <span className="h4 fw-bold mb-0">{totalToday}</span>
              <small className="d-block opacity-75">
                / {user?.dailyCalorieTarget || 2500} kcal
              </small>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="row g-4">
          <div className="col-md-6">
            <div
              className="action-card workout"
              onClick={() => navigate("/exercises")}
            >
              <div className="icon-box">
                <Dumbbell size={32} color="#fff" />
              </div>
              <h3>Start Exercise</h3>
              <p>AI-powered form tracking for Push-ups and Squats.</p>
              <button className="btn-action">Go to Gym</button>
            </div>
          </div>
          <div className="col-md-6">
            <div className="action-card diet" onClick={() => navigate("/diet")}>
              <div className="icon-box">
                <Utensils size={32} color="#fff" />
              </div>
              <h3>Track Diet</h3>
              <p>Log your meals and maintain your macro precision.</p>
              <button className="btn-action">Open Kitchen</button>
            </div>
          </div>
        </div>

        {/* Detailed Performance Section */}
        <div className="summary-section mt-5 p-4 bg-white rounded-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">Daily Performance</h4>
            <div className="badge bg-light text-dark border p-2 px-3 rounded-pill">
              Target: {user?.dailyCalorieTarget || 2500} kcal
            </div>
          </div>
          <div className="row text-center gy-3">
            <div className="col-md-3 border-end">
              <span className="d-block text-muted small">Calories Eaten</span>
              <span className="fw-bold h5 text-primary">{totalToday} kcal</span>
            </div>
            <div className="col-md-3 border-end">
              <span className="d-block text-muted small">Daily Target</span>
              <span className="fw-bold h5">
                {user?.dailyCalorieTarget || 2500}
              </span>
            </div>
            <div className="col-md-3 border-end">
              <span className="d-block text-muted small">Status</span>
              <span
                className={`fw-bold h5 ${totalToday > user?.dailyCalorieTarget ? "text-danger" : "text-success"}`}
              >
                {totalToday > user?.dailyCalorieTarget
                  ? "Over Limit"
                  : "On Track"}
              </span>
            </div>
            <div className="col-md-3">
              <span className="d-block text-muted small">Avg. Accuracy</span>
              <span className="fw-bold h5 text-success">94%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
