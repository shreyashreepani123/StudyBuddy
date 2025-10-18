import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png"; // ✅ your logo path (adjust if needed)

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Upload" },
    { path: "/summary", label: "Summary" },
    { path: "/quiz", label: "Quiz" },
    { path: "/learn", label: "Learn" },
    { path: "/chat", label: "Chat" },
  ];

  return (
    <nav className="navbar glass-navbar">
      <div className="navbar-left">
        <img src={logo} alt="StudyBuddy Logo" className="navbar-logo-img" />
        <h1 className="navbar-logo">StudyBuddy</h1>
      </div>

      <div className="navbar-links">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-link ${
              location.pathname === link.path ? "active" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
