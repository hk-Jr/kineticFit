import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Utensils, Zap, TrendingUp } from "lucide-react";
import axios from "axios";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [totalToday, setTotalToday] = useState(0);
  const [totalYesterday, setTotalYesterday] = useState(0);
  const [todayFoods, setTodayFoods] = useState([]);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
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
      navigate("/login");
    }
  }, [navigate]);

  const fetchAllData = async (userId) => {
    try {
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayStr = getLocalDateString(yesterdayDate);

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

      // WORKOUT LOGIC: Today's sessions or fallback to last 3 from history
      const allWorkouts = workouts.data || [];
      const todaySessions = allWorkouts.filter((w) => {
        const wDate = w.createdAt
          ? getLocalDateString(new Date(w.createdAt))
          : w.date;
        return wDate === todayStr;
      });

      setRecentWorkouts(
        todaySessions.length > 0 ? todaySessions : allWorkouts.slice(0, 3),
      );

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
          {/* UPDATED EXERCISE CARD */}
          <div className="col-md-6">
            <div
              className="feature-card-premium h-100 d-flex flex-column"
              onClick={() => navigate("/exercises")}
            >
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="icon-box bg-blue">
                  <Dumbbell color="white" size={20} />
                </div>
                <span className="tag">
                  {recentWorkouts.some(
                    (w) =>
                      getLocalDateString(new Date(w.createdAt)) === todayStr,
                  )
                    ? "TODAY'S SESSIONS"
                    : "RECENT HISTORY"}
                </span>
              </div>
              <h4 className="fw-bold">Exercise</h4>

              <div className="mini-log-list mt-2 mb-4">
                {recentWorkouts.length > 0 ? (
                  recentWorkouts.map((w, i) => (
                    <div className="mini-log-item" key={i}>
                      <div className="d-flex flex-column">
                        {/* Logic to handle both naming conventions found in your DB */}
                        <span className="food-name">
                          {w.exerciseName || w.type || "Workout"}
                        </span>
                        {getLocalDateString(new Date(w.createdAt)) !==
                          todayStr && (
                          <span className="history-date">
                            {new Date(w.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <span className="workout-val">{w.reps} reps</span>
                    </div>
                  ))
                ) : (
                  <div className="text-muted small py-2">
                    No sessions found. Let's move!
                  </div>
                )}
              </div>
              <div className="mt-auto">
                <button className="btn-action-primary">Start Training</button>
              </div>
            </div>
          </div>

          {/* DIET CARD */}
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
