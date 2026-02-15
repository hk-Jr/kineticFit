import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Utensils,
  Dumbbell,
  LogOut,
  User,
} from "lucide-react";

const AuthenticatedNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Helper to highlight active link
  const isActive = (path) =>
    location.pathname === path ? "text-primary fw-bold" : "text-dark";

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-3">
      <div className="container">
        <Link
          className="navbar-brand fw-black fs-3 text-primary"
          to="/dashboard"
        >
          KINETIC<span className="text-dark">FIT</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#authNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="authNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-4">
            <li className="nav-item">
              <Link
                className={`nav-link d-flex align-items-center gap-2 ${isActive("/dashboard")}`}
                to="/dashboard"
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link d-flex align-items-center gap-2 ${isActive("/diet")}`}
                to="/diet"
              >
                <Utensils size={18} /> Diet
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link d-flex align-items-center gap-2 ${isActive("/exercises")}`}
                to="/exercises"
              >
                <Dumbbell size={18} /> Exercise
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            <Link
              to="/goals"
              className="text-decoration-none text-dark d-flex align-items-center gap-1"
            >
              <User size={18} className="text-primary" />
              <span className="small fw-bold">{user?.name}</span>
            </Link>
            <button
              className="btn btn-outline-danger btn-sm rounded-pill px-3 d-flex align-items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AuthenticatedNavbar;
