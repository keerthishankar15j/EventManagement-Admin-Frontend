import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Admin_navbar.css";

const AdminNavbar = () => {

  const navigate = useNavigate();

  // =====================================================
  // LOGOUT FUNCTION
  // =====================================================
  const handleLogout = () => {

    const confirmLogout = window.confirm(
      "If you are sure you want to log out?"
    );

    if (confirmLogout) {

      // Logout success
      // If you stored login data in localStorage,
      // remove it here.

      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");

      // Go to admin login page
      navigate("/admin-login");
    }

    // If Cancel / No → nothing happens
  };


  return (
    <aside className="admin-sidebar">

      {/* =====================================================
          LOGO
      ===================================================== */}

      <div className="admin-logo">

        <div className="logo-box">
          A
        </div>

        <div className="admin-logo-text">
          <h2>
            Admin<span>Hub</span>
          </h2>

          <p>
            MANAGEMENT PANEL
          </p>
        </div>

      </div>


      {/* =====================================================
          MENU TITLE
      ===================================================== */}

      <div className="menu-title">
        MAIN MENU
      </div>


      {/* =====================================================
          NAVIGATION MENU
      ===================================================== */}

      <nav className="admin-menu">

        {/* DASHBOARD */}
        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) =>
            isActive
              ? "menu-item active"
              : "menu-item"
          }
        >
          <span className="menu-icon">
            ⌂
          </span>

          <span className="menu-text">
            Dashboard
          </span>
        </NavLink>


        {/* EVENTS */}
        <NavLink
          to="/events"
          className={({ isActive }) =>
            isActive
              ? "menu-item active"
              : "menu-item"
          }
        >
          <span className="menu-icon">
            ◇
          </span>

          <span className="menu-text">
            Events
          </span>
        </NavLink>


        {/* USERS */}
        <NavLink
          to="/users"
          className={({ isActive }) =>
            isActive
              ? "menu-item active"
              : "menu-item"
          }
        >
          <span className="menu-icon">
            ♙
          </span>

          <span className="menu-text">
            Users
          </span>
        </NavLink>


        {/* ORGANIZER REQUESTS */}
        <NavLink
          to="/organizer-requests"
          className={({ isActive }) =>
            isActive
              ? "menu-item active"
              : "menu-item"
          }
        >
          <span className="menu-icon">
            ◈
          </span>

          <span className="menu-text">
            Organizer Requests
          </span>
        </NavLink>


        {/* MESSAGES */}
        <NavLink
          to="/admin-messages"
          className={({ isActive }) =>
            isActive
              ? "menu-item active"
              : "menu-item"
          }
        >
          <span className="menu-icon">
            ✉
          </span>

          <span className="menu-text">
            Messages
          </span>
        </NavLink>
{/* BOOKINGS */}
<NavLink
  to="/bookings"
  className={({ isActive }) =>
    isActive
      ? "menu-item active"
      : "menu-item"
  }
>
  <span className="menu-icon">
    📋
  </span>

  <span className="menu-text">
    Bookings
  </span>
</NavLink>
      </nav>


      {/* =====================================================
          BOTTOM SECTION
      ===================================================== */}

      <div className="sidebar-bottom">

        {/* ADMIN PROFILE */}
        <div className="admin-profile">

          <div className="profile-avatar">
            A
          </div>

          <div className="profile-info">

            <strong>
              Admin
            </strong>

            <small>
              Administrator
            </small>

          </div>

          <span className="profile-arrow">
            ⌄
          </span>

        </div>


        {/* LOGOUT */}
        <button
          type="button"
          className="logout"
          onClick={handleLogout}
        >

          <span className="logout-icon">
            ↪
          </span>

          <span>
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
};

export default AdminNavbar;