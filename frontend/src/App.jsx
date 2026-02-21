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

  // FIX: Safety check to handle null or "undefined" strings
  const storedUser = localStorage.getItem("user");
  const user =
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  const isLandingPage = location.pathname === "/";
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {isLandingPage && !user && <KineticNavbar />}
      {!isLandingPage && !isAuthPage && user && <AuthenticatedNavbar />}

      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <>
                <LandingPage />
                <Footer />
              </>
            )
          }
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" replace /> : <SignUp />}
        />
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
