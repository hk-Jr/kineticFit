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

  // FIX: Use local date (YYYY-MM-DD) instead of UTC to avoid timezone shifts
  const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const todayStr = getLocalDateString(today);

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
      // Ensure res.data is an array. Backend should return: [{ date: '2025-05-18', count: 1 }]
      setActivityData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      // Fallback: If backend fails, manually show today as active so it turns green
      setActivityData([{ date: todayStr, count: 1 }]);
    }
  };

  const calculateStreak = (data) => {
    if (!data || data.length === 0) return 0;

    const loggedDates = new Set(data.map((d) => d.date));
    let streak = 0;
    let checkDate = new Date(); // Start checking from today backwards

    while (true) {
      const dateStr = getLocalDateString(checkDate);
      if (loggedDates.has(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // If today hasn't been logged yet, check if yesterday was logged to keep the streak alive
        if (streak === 0) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = getLocalDateString(yesterday);
          if (loggedDates.has(yesterdayStr)) {
            checkDate = yesterday;
            continue;
          }
        }
        break;
      }
    }
    return streak;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-hero bg-dark text-white py-5 mb-4">
        <div className="container">
          <div className="row align-items-center">
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
            </div>

            <div className="col-lg-8 ps-lg-5">
              <div className="streak-display mb-2">
                <Zap
                  size={20}
                  fill={calculateStreak(activityData) > 0 ? "#ffbc00" : "none"}
                  color={calculateStreak(activityData) > 0 ? "#ffbc00" : "#666"}
                />
                <span
                  className="ms-2 fw-bold text-uppercase tracking-wider"
                  style={{ fontSize: "13px" }}
                >
                  Current Streak:{" "}
                  <span className="text-primary">
                    {calculateStreak(activityData)} Days
                  </span>
                </span>
              </div>
              <div className="heatmap-wrapper bg-white p-3 rounded-4 shadow-sm border">
                <CalendarHeatmap
                  startDate={
                    new Date(new Date().setFullYear(today.getFullYear() - 1))
                  }
                  endDate={today}
                  values={activityData}
                  classForValue={(value) => {
                    if (!value || value.count === 0) return "color-empty";
                    return "color-filled-green"; // Specific class name
                  }}
                  tooltipDataAttrs={(value) => ({
                    "data-tip":
                      value && value.date
                        ? `${value.date}: Logged In`
                        : "No Activity",
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-2">
        {/* Welcome Header */}
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
      </div>
    </div>
  );
};

export default Dashboard;
