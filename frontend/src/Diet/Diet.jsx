import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Search,
  Trash2,
  CheckCircle,
  Flame,
  Plus,
} from "lucide-react";
import "./Diet.css";

const VEG_DB = [
  { name: "Paneer Tikka (100g)", calories: 265 },
  { name: "Dal Tadka (1 Bowl)", calories: 150 },
  { name: "Mixed Veg Curry", calories: 120 },
  { name: "Soya Chunks (50g)", calories: 170 },
  { name: "Oats with Milk", calories: 220 },
  { name: "Brown Bread (2 slices)", calories: 150 },
  { name: "Avocado Toast", calories: 250 },
  { name: "Fruit Salad", calories: 90 },
  { name: "Greek Salad", calories: 110 },
  { name: "Broccoli (100g)", calories: 34 },
];

const NON_VEG_DB = [
  { name: "Grilled Salmon", calories: 208 },
  { name: "Boiled Egg (1)", calories: 70 },
  { name: "Chicken Curry", calories: 240 },
  { name: "Egg Omelette (2 eggs)", calories: 180 },
  { name: "Tuna Salad", calories: 190 },
  { name: "Beef Steak (100g)", calories: 250 },
  { name: "Lamb Chops", calories: 290 },
  { name: "Prawns Fry (100g)", calories: 120 },
  { name: "Turkey Sandwich", calories: 310 },
  { name: "Grilled Fish", calories: 160 },
];

const Diet = () => {
  const [meals, setMeals] = useState([]);
  const [totalToday, setTotalToday] = useState(0);
  const [manualFood, setManualFood] = useState({ name: "", calories: "" });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchTodayLog();
  }, [user?._id]);

  const fetchTodayLog = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/diet/${user._id}/${today}`,
      );
      setMeals(res.data.foods || []);
      setTotalToday(res.data.totalCalories || 0);
    } catch (err) {
      console.log("No log found yet.");
    }
  };

  const addFood = async (food) => {
    if (!food.name || !food.calories) return;
    try {
      const res = await axios.post("http://localhost:5000/api/diet/add", {
        userId: user._id,
        date: today,
        food: { name: food.name, calories: Number(food.calories) },
      });
      setMeals(res.data.foods);
      setTotalToday(res.data.totalCalories);
      setManualFood({ name: "", calories: "" }); // Clear manual form
    } catch (err) {
      alert("Error adding food");
    }
  };

  const removeFood = async (index) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/diet/remove/${user._id}/${today}/${index}`,
      );
      setMeals(res.data.foods);
      setTotalToday(res.data.totalCalories);
    } catch (err) {
      alert("Error removing food");
    }
  };

  return (
    <div className="diet-page">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-8">
            {/* --- MANUAL ENTRY SECTION (Add Optional) --- */}
            <div className="diet-card p-4 shadow-sm bg-white rounded-4 mb-4 border">
              <h5 className="fw-bold mb-3 d-flex align-items-center">
                <PlusCircle size={20} className="me-2 text-primary" /> Add
                Custom Food
              </h5>
              <div className="row g-2">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Item Name (e.g. Pasta)"
                    value={manualFood.name}
                    onChange={(e) =>
                      setManualFood({ ...manualFood, name: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Calories"
                    value={manualFood.calories}
                    onChange={(e) =>
                      setManualFood({ ...manualFood, calories: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-primary w-100 fw-bold"
                    onClick={() => addFood(manualFood)}
                  >
                    ADD
                  </button>
                </div>
              </div>
            </div>

            {/* --- VEGETARIAN LIST --- */}
            <div className="d-flex align-items-center mb-3 mt-5">
              <div className="veg-indicator me-2">
                <div className="dot"></div>
              </div>
              <h4 className="fw-bold mb-0 text-success">
                Vegetarian Selection
              </h4>
            </div>
            <div className="row g-3 mb-5">
              {VEG_DB.map((f, i) => (
                <div key={i} className="col-md-6">
                  <div className="food-item-card p-3 d-flex justify-content-between align-items-center shadow-sm">
                    <div>
                      <h6 className="mb-1 fw-bold">{f.name}</h6>
                      <span className="text-muted small">
                        {f.calories} kcal
                      </span>
                    </div>
                    <button
                      className="btn btn-veg-add"
                      onClick={() => addFood(f)}
                    >
                      ADD
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* --- NON-VEGETARIAN LIST --- */}
            <div className="d-flex align-items-center mb-3">
              <div className="non-veg-indicator me-2">
                <div className="dot"></div>
              </div>
              <h4 className="fw-bold mb-0 text-danger">Non-Veg Selection</h4>
            </div>
            <div className="row g-3">
              {NON_VEG_DB.map((f, i) => (
                <div key={i} className="col-md-6">
                  <div className="food-item-card p-3 d-flex justify-content-between align-items-center shadow-sm">
                    <div>
                      <h6 className="mb-1 fw-bold">{f.name}</h6>
                      <span className="text-muted small">
                        {f.calories} kcal
                      </span>
                    </div>
                    <button
                      className="btn btn-nonveg-add"
                      onClick={() => addFood(f)}
                    >
                      ADD
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- SIDEBAR: REVIEW WHAT USER ADDED --- */}
          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: "100px" }}>
              <div className="diet-card p-4 bg-dark text-white rounded-4 shadow mb-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <p className="text-uppercase small tracking-widest opacity-50 mb-0">
                    Today's Intake
                  </p>
                  <Flame size={20} className="text-warning" />
                </div>
                <h1 className="display-3 fw-black text-primary mb-1">
                  {totalToday}
                </h1>
                <p className="small opacity-75">Calories Consumed</p>

                <hr className="border-secondary my-4" />

                <h6 className="fw-bold mb-3">
                  Review Added Items ({meals.length})
                </h6>
                <div
                  className="meal-log-container"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  {meals.length === 0 ? (
                    <p className="text-muted small italic">
                      Your plate is empty...
                    </p>
                  ) : (
                    meals.map((m, i) => (
                      <div
                        key={i}
                        className="log-item d-flex justify-content-between align-items-center mb-2 p-2 rounded bg-secondary bg-opacity-10"
                      >
                        <div className="flex-grow-1">
                          <div className="small fw-bold">{m.name}</div>
                          <div className="text-primary tiny-text">
                            {m.calories} kcal
                          </div>
                        </div>
                        <Trash2
                          size={16}
                          className="text-danger pointer"
                          onClick={() => removeFood(i)}
                        />
                      </div>
                    ))
                  )}
                </div>

                <button
                  className="btn btn-primary w-100 mt-4 py-2 fw-bold rounded-pill"
                  onClick={() => navigate("/dashboard")}
                >
                  <CheckCircle size={18} className="me-2" /> FINISH LOGGING
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diet;
