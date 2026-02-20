import React from "react";
import { Instagram, Twitter, Github } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="row py-5">
          <div className="col-md-4 mb-4">
            <h4 className="footer-logo">
              Kinetic<span>Fit</span>
            </h4>
            <p className="text-muted small mt-3">
              Merging biomechanics with nutrition to help you achieve peak
              performance.
            </p>
          </div>
          <div className="col-md-2 col-6 mb-4">
            <h6 className="fw-bold">Product</h6>
            <ul className="list-unstyled footer-links">
              <li>Features</li>
              <li>Pricing</li>
              <li>AI Form</li>
            </ul>
          </div>
          <div className="col-md-2 col-6 mb-4">
            <h6 className="fw-bold">Company</h6>
            <ul className="list-unstyled footer-links">
              <li>About Us</li>
              <li>Contact</li>
              <li>Careers</li>
            </ul>
          </div>
          <div className="col-md-4 mb-4 text-md-end">
            <h6 className="fw-bold">Stay Connected</h6>
            <div className="d-flex justify-content-md-end gap-3 mt-3">
              <Instagram size={20} className="social-icon" />
              <Twitter size={20} className="social-icon" />
              <Github size={20} className="social-icon" />
            </div>
          </div>
        </div>

        <div className="footer-bottom border-top py-4 text-center">
          <p className="athlete-tagline">
            Made with <span className="heart">❤️</span> by{" "}
            <strong>ATHLETES TO ATHLETES</strong>.
          </p>
          <p className="text-muted small mb-0">
            © 2026 KineticFit AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
