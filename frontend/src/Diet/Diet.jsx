import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Add this for routing
import {
  PlusCircle,
  Search,
  Utensils,
  Trash2,
  CheckCircle,
} from "lucide-react";
import "./Diet.css";

const FOOD_DB = [
  {
    name: "Chicken Breast (100g)",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
  },
  {
    name: "White Rice (100g)",
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
  },
  { name: "Turkey Roast (100g)", calories: 189, protein: 29, carbs: 0, fat: 7 },
  {
    name: "Sweet Potato (100g)",
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
  },
  { name: "Protein Shake", calories: 120, protein: 24, carbs: 3, fat: 1.5 },
  { name: "Egg (Large)", calories: 70, protein: 6, carbs: 0.5, fat: 5 },
  {
    name: "Christmas Cake (Slice)",
    calories: 350,
    protein: 3,
    carbs: 55,
    fat: 12,
  },
];

const Diet = () => {
  const [meals, setMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalToday, setTotalToday] = useState(0);
  const [manualFood, setManualFood] = useState({ name: "", calories: "" });

  const navigate = useNavigate(); // Initialize navigation
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
      console.error("Fetch Error:", err);
    }
  };

  const addFood = async (food) => {
    if (!user?._id) return alert("Please login again!");
    if (!food.name || !food.calories)
      return alert("Fill in name and calories!");

    try {
      const foodData = {
        name: food.name,
        calories: Number(food.calories),
        protein: food.protein || 0,
        carbs: food.carbs || 0,
        fat: food.fat || 0,
      };

      const res = await axios.post("http://localhost:5000/api/diet/add", {
        userId: user._id,
        date: today,
        food: foodData,
      });

      setMeals(res.data.foods);
      setTotalToday(res.data.totalCalories);
      setSearchTerm("");
      setManualFood({ name: "", calories: "" }); // Reset manual inputs
    } catch (err) {
      alert("Failed to add food.");
    }
  };

  const removeFood = async (mealIndex) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/diet/remove/${user._id}/${today}/${mealIndex}`,
      );
      setMeals(res.data.foods);
      setTotalToday(res.data.totalCalories);
    } catch (err) {
      alert("Could not remove item");
    }
  };

  const filteredFoods = FOOD_DB.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      searchTerm !== "",
  );

  return (
    <div className="diet-page">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="diet-card p-4 shadow-sm bg-white rounded-4 mb-4">
              <h4 className="fw-bold mb-3">
                <Search size={20} className="me-2" /> Search & Add
              </h4>
              <input
                type="text"
                className="form-control form-control-lg mb-2"
                placeholder="Search food database..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {filteredFoods.map((f, i) => (
                <div
                  key={i}
                  className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light rounded-2 mb-2"
                  onClick={() => addFood(f)}
                  style={{ cursor: "pointer" }}
                >
                  <span>
                    {f.name} <b className="text-primary">+{f.calories} kcal</b>
                  </span>
                  <button className="btn btn-sm btn-primary">Add</button>
                </div>
              ))}

              <hr className="my-4" />

              <h4 className="fw-bold mb-3">
                <PlusCircle size={20} className="me-2" /> Custom Entry
              </h4>
              <div className="row g-2">
                <div className="col-md-7">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Food Name"
                    value={manualFood.name}
                    onChange={(e) =>
                      setManualFood({ ...manualFood, name: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="kcal"
                    value={manualFood.calories}
                    onChange={(e) =>
                      setManualFood({ ...manualFood, calories: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-outline-dark w-100"
                    onClick={() => addFood(manualFood)}
                  >
                    ADD
                  </button>
                </div>
              </div>
            </div>

            <h4 className="fw-bold mb-3">Kinetic Food Library</h4>
            <div className="row g-3 mb-5">
              {FOOD_DB.map((f, i) => (
                <div key={i} className="col-md-4">
                  <div className="library-item p-3 border rounded-3 text-center bg-white shadow-sm h-100">
                    <h6 className="fw-bold">{f.name}</h6>
                    <p className="text-primary small mb-2">{f.calories} kcal</p>
                    <button
                      className="btn btn-primary btn-sm w-100"
                      onClick={() => addFood(f)}
                    >
                      Add to Log
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* --- THE MAIN SUBMIT BUTTON --- */}
            <div className="text-center py-4 border-top">
              <button
                className="btn btn-success btn-lg px-5 shadow fw-bold"
                onClick={() => navigate("/dashboard")}
              >
                <CheckCircle className="me-2" /> FINISH & SAVE TO DASHBOARD
              </button>
            </div>
          </div>

          <div className="col-lg-4">
            <div
              className="diet-card p-4 bg-dark text-white rounded-4 sticky-top"
              style={{ top: "100px" }}
            >
              <h1 className="display-2 fw-bold text-primary mb-0">
                {totalToday}
              </h1>
              <p className="text-muted">Total Calories Today</p>

              <div className="mt-4">
                <h6 className="border-bottom border-secondary pb-2 mb-3">
                  Today's Log
                </h6>
                {meals.length === 0 ? (
                  <p className="text-muted small">No items added yet.</p>
                ) : (
                  meals.map((m, i) => (
                    <div
                      key={i}
                      className="d-flex justify-content-between align-items-center mb-3 p-2 rounded bg-secondary bg-opacity-10"
                    >
                      <span className="small">
                        {m.name} <br />
                        <b className="text-primary">{m.calories} kcal</b>
                      </span>
                      <Trash2
                        size={18}
                        className="text-danger"
                        onClick={() => removeFood(i)}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diet;
