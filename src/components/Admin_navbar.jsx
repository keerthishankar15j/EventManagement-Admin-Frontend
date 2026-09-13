import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Admin_navbar.css";

const AdminNavbar = () => {
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

        {/* -------------------------------------------------
            DASHBOARD
        ------------------------------------------------- */}

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


        {/* -------------------------------------------------
            EVENTS
        ------------------------------------------------- */}

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


        {/* -------------------------------------------------
            GALLERY
        ------------------------------------------------- */}

        <NavLink
          to="/gallery"
          className={({ isActive }) =>
            isActive
              ? "menu-item active"
              : "menu-item"
          }
        >
          <span className="menu-icon">
            ▣
          </span>

          <span className="menu-text">
            Gallery
          </span>
        </NavLink>


        {/* -------------------------------------------------
            USERS
        ------------------------------------------------- */}

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


        {/* =================================================
            MESSAGES
        ================================================= */}

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


        </nav>
      {/* =====================================================
          BOTTOM SECTION
      ===================================================== */}

      <div className="sidebar-bottom">


        {/* -------------------------------------------------
            ADMIN PROFILE
        ------------------------------------------------- */}

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


        {/* -------------------------------------------------
            LOGOUT
        ------------------------------------------------- */}

        <button
          type="button"
          className="logout"
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