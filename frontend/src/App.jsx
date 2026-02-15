import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Navbars
import KineticNavbar from "./components/Navbar";
import AuthenticatedNavbar from "./components/AuthenticatedNavbar";

// Pages
import LandingPage from "./components/LandingPage";
import Footer from "./components/Footer";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import Dashboard from "./Dashboard/Dashboard";
import Diet from "./Diet/Diet";
import Exercise from "./Exercise/Exercise";
import Goals from "./Goals/Goals";

function App() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  // Logic to determine which navbar to show
  const isLandingPage = location.pathname === "/";
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {/* 1. Show the Public Navbar ONLY on landing, and ONLY if NOT logged in */}
      {isLandingPage && !user && <KineticNavbar />}

      {/* 2. Show the Authenticated Navbar ONLY when logged in AND NOT on Landing/Auth pages */}
      {!isLandingPage && !isAuthPage && user && <AuthenticatedNavbar />}

      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route
          path="/"
          element={
            user ? (
              // If user is already logged in, skip landing page and go to dashboard
              <Navigate to="/dashboard" replace />
            ) : (
              <>
                <LandingPage />
                <Footer />
              </>
            )
          }
        />

        {/* Prevent logged-in users from accessing Login/Signup */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" replace /> : <SignUp />}
        />

        {/* --- PRIVATE SYSTEM ROUTES --- */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/diet"
          element={user ? <Diet /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/exercises"
          element={user ? <Exercise /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/goals"
          element={user ? <Goals /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </>
  );
}

export default App;
