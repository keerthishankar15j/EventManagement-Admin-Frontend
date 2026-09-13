import React, { useEffect, useState } from "react";
import axios from "axios";

import AdminUserDetails from "./AdminUserDetails";
import "../styles/AdminUsersPage.css";

// =====================================================
// BACKEND API URL
// =====================================================

const API_BASE_URL =
  "https://user-api-iota-six.vercel.app";

// =====================================================
// AXIOS INSTANCE
// =====================================================

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// =====================================================
// ADMIN USERS PAGE
// =====================================================

function AdminUsersPage() {
  // =====================================================
  // STATES
  // =====================================================

  const [users, setUsers] = useState([]);

  const [loginHistory, setLoginHistory] = useState([]);

  const [search, setSearch] = useState("");

  const [activeFilter, setActiveFilter] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // FETCH USERS
  // =====================================================

  const fetchUsers = async () => {
    try {
      const response = await api.get("/login/getusers");

      console.log(
        "USERS API RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        setUsers(response.data.users || []);
        return true;
      }

      throw new Error(
        response.data?.message ||
          "Unable to fetch users"
      );
    } catch (err) {
      console.error(
        "FETCH USERS ERROR:",
        err
      );

      if (err.response) {
        console.error(
          "USERS STATUS:",
          err.response.status
        );

        console.error(
          "USERS DATA:",
          err.response.data
        );
      }

      throw err;
    }
  };

  // =====================================================
  // FETCH LOGIN HISTORY
  // =====================================================

  const fetchLoginHistory = async () => {
    try {
      const response = await api.get(
        "/loginhistory/gethistory"
      );

      console.log(
        "LOGIN HISTORY API RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        setLoginHistory(
          response.data.history || []
        );

        return true;
      }

      throw new Error(
        response.data?.message ||
          "Unable to fetch login history"
      );
    } catch (err) {
      console.error(
        "FETCH LOGIN HISTORY ERROR:",
        err
      );

      if (err.response) {
        console.error(
          "LOGIN HISTORY STATUS:",
          err.response.status
        );

        console.error(
          "LOGIN HISTORY DATA:",
          err.response.data
        );
      }

      throw err;
    }
  };

  // =====================================================
  // FETCH ALL DATA
  // =====================================================

  const fetchAllData = async (
    showLoader = false
  ) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setError("");

      const results =
        await Promise.allSettled([
          fetchUsers(),
          fetchLoginHistory(),
        ]);

      const usersFailed =
        results[0].status === "rejected";

      const historyFailed =
        results[1].status === "rejected";

      // BOTH FAILED

      if (
        usersFailed &&
        historyFailed
      ) {
        setError(
          "Unable to connect to the user API. Please check the backend."
        );

        return;
      }

      // USERS FAILED

      if (usersFailed) {
        setError(
          "Unable to load users. Please check the user API."
        );

        return;
      }

      // HISTORY FAILED

      if (historyFailed) {
        setError(
          "Users loaded, but login history could not be loaded."
        );

        return;
      }
    } catch (err) {
      console.error(
        "FETCH ALL DATA ERROR:",
        err
      );

      setError(
        "Unable to load user data."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD + AUTO REFRESH
  // =====================================================

  useEffect(() => {
    fetchAllData(true);

    const interval = setInterval(() => {
      fetchAllData(false);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // =====================================================
  // GET HISTORY USER ID
  // =====================================================

  const getHistoryUserId = (item) => {
    if (!item?.userId) {
      return "";
    }

    if (
      typeof item.userId === "object"
    ) {
      return String(
        item.userId._id || ""
      );
    }

    return String(item.userId);
  };

  // =====================================================
  // GET USER HISTORY
  // =====================================================

  const getUserHistory = (userId) => {
    return [...loginHistory]
      .filter(
        (item) =>
          getHistoryUserId(item) ===
          String(userId)
      )
      .sort(
        (a, b) =>
          new Date(
            b.loginTime || 0
          ) -
          new Date(
            a.loginTime || 0
          )
      );
  };

  // =====================================================
  // GET USER STATUS
  // =====================================================

  const getUserStatus = (userId) => {
    const history =
      getUserHistory(userId);

    if (history.length === 0) {
      return "Offline";
    }

    const latestLogin =
      history[0];

    return latestLogin.status ===
      "Active"
      ? "Online"
      : "Offline";
  };

  // =====================================================
  // GET LAST LOGIN
  // =====================================================

  const getLastLogin = (userId) => {
    const history =
      getUserHistory(userId);

    if (history.length === 0) {
      return null;
    }

    return history[0];
  };

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredUsers = users.filter(
    (user) => {
      const status =
        getUserStatus(user._id);

      const searchValue =
        search
          .toLowerCase()
          .trim();

      const name =
        user.name?.toLowerCase() ||
        "";

      const email =
        user.email?.toLowerCase() ||
        "";

      const phone =
        String(
          user.phone || ""
        ).toLowerCase();

      const matchesSearch =
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        phone.includes(searchValue);

      const matchesFilter =
        activeFilter === "all" ||
        (
          activeFilter === "online" &&
          status === "Online"
        ) ||
        (
          activeFilter === "offline" &&
          status === "Offline"
        );

      return (
        matchesSearch &&
        matchesFilter
      );
    }
  );

  // =====================================================
  // COUNTS
  // =====================================================

  const totalUsers =
    users.length;

  const onlineUsers =
    users.filter(
      (user) =>
        getUserStatus(user._id) ===
        "Online"
    ).length;

  const offlineUsers =
    totalUsers -
    onlineUsers;

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Not available";
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  // =====================================================
  // OPEN USER DETAILS
  // =====================================================

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  // =====================================================
  // BACK TO USERS
  // =====================================================

  const handleBack = () => {
    setSelectedUser(null);
    fetchAllData(false);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (
    loading &&
    users.length === 0
  ) {
    return (
      <div className="admin-users-page">
        <div className="users-loading">
          <div className="loading-spinner"></div>

          <h3>
            Loading users
          </h3>

          <p>
            Please wait while we load
            the user data.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // USER DETAILS PAGE
  // =====================================================

  if (selectedUser) {
    return (
      <AdminUserDetails
        user={selectedUser}
        loginHistory={loginHistory}
        onBack={handleBack}
      />
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div className="admin-users-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="users-header">

        <div className="users-heading">

          <span className="users-small-title">
            ADMIN PANEL
          </span>

          <h1>
            User Management
          </h1>

          <p className="users-subtitle">
            Manage and monitor all
            registered users
          </p>

        </div>

        <button
          type="button"
          className="refresh-btn"
          onClick={() =>
            fetchAllData(true)
          }
          disabled={loading}
        >
          <span
            className={
              loading
                ? "refresh-icon spinning"
                : "refresh-icon"
            }
          >
            ↻
          </span>

          {loading
            ? "Refreshing"
            : "Refresh"}
        </button>

      </div>

      {/* =================================================
          STATS
      ================================================= */}

      <div className="user-stats">

        {/* TOTAL USERS */}

        <div className="stat-card">

          <div className="stat-icon total-icon">
            <span>♟</span>
          </div>

          <div className="stat-content">

            <span className="stat-label">
              Total Users
            </span>

            <strong className="stat-number">
              {totalUsers}
            </strong>

          </div>

        </div>

        {/* ONLINE USERS */}

        <div className="stat-card">

          <div className="stat-icon online-icon">
            <span className="status-circle"></span>
          </div>

          <div className="stat-content">

            <span className="stat-label">
              Online Users
            </span>

            <strong className="stat-number">
              {onlineUsers}
            </strong>

          </div>

        </div>

        {/* OFFLINE USERS */}

        <div className="stat-card">

          <div className="stat-icon offline-icon">
            <span className="status-circle"></span>
          </div>

          <div className="stat-content">

            <span className="stat-label">
              Offline Users
            </span>

            <strong className="stat-number">
              {offlineUsers}
            </strong>

          </div>

        </div>

      </div>

      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <div className="user-controls">

        <div className="search-box">

          <span className="search-icon">
            ⌕
          </span>

          <input
            type="text"
            value={search}
            placeholder="Search user by name, email or phone..."
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={() =>
                setSearch("")
              }
            >
              ×
            </button>
          )}

        </div>

        <div className="filter-buttons">

          {/* ALL */}

          <button
            type="button"
            className={
              activeFilter === "all"
                ? "filter-btn active"
                : "filter-btn"
            }
            onClick={() =>
              setActiveFilter("all")
            }
          >
            <span>
              All Users
            </span>

            <small>
              {totalUsers}
            </small>
          </button>

          {/* ONLINE */}

          <button
            type="button"
            className={
              activeFilter === "online"
                ? "filter-btn active online-filter"
                : "filter-btn online-filter"
            }
            onClick={() =>
              setActiveFilter("online")
            }
          >
            <span className="mini-status online"></span>

            <span>
              Online
            </span>

            <small>
              {onlineUsers}
            </small>
          </button>

          {/* OFFLINE */}

          <button
            type="button"
            className={
              activeFilter === "offline"
                ? "filter-btn active offline-filter"
                : "filter-btn offline-filter"
            }
            onClick={() =>
              setActiveFilter("offline")
            }
          >
            <span className="mini-status offline"></span>

            <span>
              Offline
            </span>

            <small>
              {offlineUsers}
            </small>
          </button>

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="users-error">

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              fetchAllData(true)
            }
          >
            Try again
          </button>

        </div>
      )}

      {/* =================================================
          RESULT INFO
      ================================================= */}

      <div className="result-info">

        <span>
          Showing{" "}
          <strong>
            {filteredUsers.length}
          </strong>{" "}
          {filteredUsers.length === 1
            ? "user"
            : "users"}
        </span>

        {(search ||
          activeFilter !== "all") && (
          <button
            type="button"
            className="reset-filter"
            onClick={() => {
              setSearch("");
              setActiveFilter("all");
            }}
          >
            Clear filters
          </button>
        )}

      </div>

      {/* =================================================
          USERS
      ================================================= */}

      {filteredUsers.length > 0 ? (

        <div className="users-grid">

          {filteredUsers.map(
            (user) => {

              const status =
                getUserStatus(
                  user._id
                );

              const latestHistory =
                getLastLogin(
                  user._id
                );

              const isOnline =
                status === "Online";

              const firstLetter =
                user.name
                  ?.charAt(0)
                  .toUpperCase() ||
                "U";

              return (

                <article
                  className="admin-user-card"
                  key={user._id}
                  onClick={() =>
                    handleUserClick(user)
                  }
                >

                  {/* CARD TOP */}

                  <div className="card-top">

                    <div className="profile-wrapper">

                      {user.profileImage ? (

                        <img
                          src={
                            user.profileImage
                          }
                          alt={
                            user.name ||
                            "User"
                          }
                          className="user-avatar"
                        />

                      ) : (

                        <div className="user-avatar default-avatar">
                          {firstLetter}
                        </div>

                      )}

                      <span
                        className={
                          isOnline
                            ? "online-dot"
                            : "offline-dot"
                        }
                      />

                    </div>

                    <span
                      className={
                        isOnline
                          ? "status-badge online"
                          : "status-badge offline"
                      }
                    >
                      <span className="badge-dot"></span>

                      {status}
                    </span>

                  </div>

                  {/* USER NAME */}

                  <div className="user-main-info">

                    <div className="name-row">

                      <h2>
                        {user.name ||
                          "Unnamed User"}
                      </h2>

                      <span className="role-badge">
                        {user.role ||
                          "user"}
                      </span>

                    </div>

                  </div>

                  {/* USER DETAILS */}

                  <div className="user-card-details">

                    {/* EMAIL */}

                    <div className="detail-row">

                      <div className="detail-icon">
                        @
                      </div>

                      <div className="detail-content">

                        <small>
                          EMAIL
                        </small>

                        <p>
                          {user.email ||
                            "Not available"}
                        </p>

                      </div>

                    </div>

                    {/* PHONE */}

                    <div className="detail-row">

                      <div className="detail-icon">
                        ☎
                      </div>

                      <div className="detail-content">

                        <small>
                          PHONE
                        </small>

                        <p
                          className={
                            !user.phone
                              ? "muted-detail"
                              : ""
                          }
                        >
                          {user.phone ||
                            "Not available"}
                        </p>

                      </div>

                    </div>

                    {/* LAST LOGIN */}

                    <div className="detail-row">

                      <div className="detail-icon">
                        ◷
                      </div>

                      <div className="detail-content">

                        <small>
                          LAST LOGIN
                        </small>

                        <p>
                          {latestHistory
                            ? formatDate(
                                latestHistory.loginTime
                              )
                            : "Never logged in"}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* VIEW DETAILS */}

                  <div className="view-user">

                    <span>
                      View Full Details
                    </span>

                    <span className="arrow">
                      →
                    </span>

                  </div>

                </article>
              );
            }
          )}

        </div>

      ) : (

        /* =================================================
           NO USERS
        ================================================= */

        <div className="no-users">

          <div className="no-users-icon">
            ⌕
          </div>

          <h2>
            No Users Found
          </h2>

          <p>
            Try changing your search
            or filter.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setActiveFilter("all");
            }}
          >
            Show All Users
          </button>

        </div>
      )}

    </div>
  );
}

export default AdminUsersPage;