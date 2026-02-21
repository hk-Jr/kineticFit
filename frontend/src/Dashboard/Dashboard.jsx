import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Utensils, Zap, TrendingUp, History } from "lucide-react"; // Added History icon
import axios from "axios";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [totalToday, setTotalToday] = useState(0);
  const [totalYesterday, setTotalYesterday] = useState(0);
  const [todayFoods, setTodayFoods] = useState([]);
  const [recentWorkouts, setRecentWorkouts] = useState([]); // New State for Workouts
  const [activityData, setActivityData] = useState([]);
  const navigate = useNavigate();

  const getLocalDateString = (date) => date.toISOString().split("T")[0];
  const todayStr = getLocalDateString(new Date());

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined") {
      navigate("/login");
      return;
    }

    try {
      const loggedInUser = JSON.parse(storedUser);
      setUser(loggedInUser);
      fetchAllData(loggedInUser._id);
    } catch (e) {
      console.error("User parse error", e);
      navigate("/login");
    }
  }, [navigate]);

  const fetchAllData = async (userId) => {
    try {
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayStr = getLocalDateString(yesterdayDate);

      // Added Workout API call to the Promise.all
      const [tDiet, yDiet, activity, workouts] = await Promise.all([
        axios.get(`http://localhost:5000/api/diet/${userId}/${todayStr}`),
        axios.get(`http://localhost:5000/api/diet/${userId}/${yesterdayStr}`),
        axios.get(`http://localhost:5000/api/auth/activity/${userId}`),
        axios.get(`http://localhost:5000/api/workout/history?userId=${userId}`),
      ]);

      setTotalToday(tDiet.data.totalCalories || 0);
      setTodayFoods(tDiet.data.foods || []);
      setTotalYesterday(yDiet.data.totalCalories || 0);
      setActivityData(Array.isArray(activity.data) ? activity.data : []);

      // Filter workouts for today to match Diet card logic
      const filteredWorkouts = (workouts.data || []).filter((w) => {
        const wDate = w.createdAt
          ? getLocalDateString(new Date(w.createdAt))
          : w.date;
        return wDate === todayStr;
      });
      setRecentWorkouts(filteredWorkouts);

      await axios.post(`http://localhost:5000/api/auth/log-activity/${userId}`);
    } catch (err) {
      console.error("Sync Error:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-hero">
        <div className="container py-4">
          <div className="row align-items-center mb-4">
            <div className="col-md-6">
              <h1 className="display-6 fw-bold text-white mb-2">
                Welcome back, {user?.name}
              </h1>
              <div className="d-flex gap-2 align-items-center">
                <div className="streak-pill-mini">
                  <Zap size={12} fill="#fbbf24" stroke="none" />
                  <span>
                    Your Streak: <strong>{activityData.length} Days</strong>
                  </span>
                </div>
                <span className="badge-elite">KINETIC ELITE</span>
              </div>
            </div>

            <div className="col-md-6 d-flex justify-content-md-end mt-3 mt-md-0">
              <div className="hero-insight-panel">
                <div className="insight-item">
                  <span className="label">YESTERDAY</span>
                  <span className="val">{totalYesterday}</span>
                </div>
                <div className="insight-sep"></div>
                <div className="insight-item">
                  <span className="label text-primary">TODAY'S FUEL</span>
                  <span className="val">
                    {totalToday}{" "}
                    <small className="opacity-50">
                      / {user?.dailyCalorieTarget || 2500}
                    </small>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="heatmap-container-premium">
            <div className="d-flex justify-content-between align-items-center mb-3 px-1">
              <span className="text-muted small fw-bold tracking-wider">
                ANNUAL ACTIVITY
              </span>
              <TrendingUp size={14} className="text-muted" />
            </div>
            <div className="heatmap-resizer">
              <CalendarHeatmap
                startDate={new Date("2026-01-01")}
                endDate={new Date("2026-12-31")}
                values={activityData}
                classForValue={(v) =>
                  !v || v.count === 0 ? "color-empty" : "color-filled-green"
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container content-lift">
        <div className="row g-4 pb-5">
          {/* Workout Card - Now Dynamic */}
          <div className="col-md-6">
            <div
              className="feature-card-premium h-100 d-flex flex-column"
              onClick={() => navigate("/exercises")}
            >
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="icon-box bg-blue">
                  <Dumbbell color="white" size={20} />
                </div>
                <span className="tag">WORKOUTS</span>
              </div>
              <h4 className="fw-bold">Exercise</h4>

              <div className="mini-log-list mt-2 mb-4">
                {recentWorkouts.length > 0 ? (
                  recentWorkouts.slice(-3).map((w, i) => (
                    <div className="mini-log-item" key={i}>
                      <span className="food-name">
                        {w.exerciseName || w.type}
                      </span>
                      <span className="workout-val">{w.reps} reps</span>
                    </div>
                  ))
                ) : (
                  <div className="text-muted small py-2">
                    No sessions today. Let's move!
                  </div>
                )}
              </div>

              <div className="mt-auto">
                <button className="btn-action-primary">Start Training</button>
              </div>
            </div>
          </div>

          {/* Diet Card */}
          <div className="col-md-6">
            <div
              className="feature-card-premium h-100 d-flex flex-column"
              onClick={() => navigate("/diet")}
            >
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="icon-box bg-green">
                  <Utensils color="white" size={20} />
                </div>
                <span className="tag">NUTRITION</span>
              </div>
              <h4 className="fw-bold">Diet Tracker</h4>
              <div className="mini-log-list mt-2 mb-4">
                {todayFoods.length > 0 ? (
                  todayFoods.slice(-3).map((f, i) => (
                    <div className="mini-log-item" key={i}>
                      <span className="food-name">{f.foodName || f.name}</span>
                      <span className="food-cal">{f.calories} kcal</span>
                    </div>
                  ))
                ) : (
                  <div className="text-muted small py-2">
                    Kitchen is empty. Log a meal!
                  </div>
                )}
              </div>
              <div className="mt-auto">
                <button className="btn-action-success">Open Kitchen</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
