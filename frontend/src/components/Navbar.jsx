import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const KineticNavbar = () => {
  return (
    <nav className="navbar-wrapper fixed-top d-flex justify-content-center w-100">
      <div className="inner-container d-flex align-items-center w-100 px-4">
        <Link to="/" className="brand-logo me-4 text-decoration-none">
          <span className="logo-text">
            Kinetic<span>Fit</span>
          </span>
        </Link>

        <div className="pill-nav d-flex align-items-center justify-content-between flex-grow-1">
          <div className="d-flex align-items-center ps-3">
            <ul className="nav-list d-flex list-unstyled mb-0">
              <li className="nav-link-item active">
                <span className="status-dot"></span> About Us
              </li>
              <li className="nav-item-simple">Contact</li>
            </ul>
          </div>

          <div className="d-flex align-items-center pe-1">
            {/* These must match the 'path' in App.jsx */}
            <Link to="/login" className="login-btn text-decoration-none me-4">
              Login <span className="arrow-icon">↗</span>
            </Link>
            <Link to="/signup">
              <button className="cta-button">Get Started</button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default KineticNavbar;
