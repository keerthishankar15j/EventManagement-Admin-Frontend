import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminUserDetails from "./AdminUserDetails";
import "../styles/Admin_users.css";

const API_BASE_URL = "https://user-api-iota-six.vercel.app";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH USERS
  // ==========================================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/login/getusers`
      );

      if (response.data.success) {
        setUsers(response.data.users || []);
      } else {
        setError("Unable to fetch users");
      }
    } catch (error) {
      console.error("Fetch users error:", error);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH LOGIN HISTORY
  // ==========================================
  const fetchLoginHistory = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/loginhistory/gethistory`
      );

      if (response.data.success) {
        setLoginHistory(response.data.history || []);
      }
    } catch (error) {
      console.error("Login history error:", error);
    }
  };

  // ==========================================
  // FETCH BOTH
  // ==========================================
  const fetchAllData = async () => {
    await Promise.all([
      fetchUsers(),
      fetchLoginHistory(),
    ]);
  };

  useEffect(() => {
    fetchAllData();

    // Auto refresh every 10 seconds
    const interval = setInterval(() => {
      fetchAllData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // GET USER STATUS
  // ==========================================
  const getUserStatus = (userId) => {
    const userHistory = loginHistory
      .filter(
        (item) =>
          String(item.userId) === String(userId)
      )
      .sort(
        (a, b) =>
          new Date(b.loginTime) -
          new Date(a.loginTime)
      );

    if (userHistory.length === 0) {
      return "Offline";
    }

    const latestLogin = userHistory[0];

    return latestLogin.status === "Active"
      ? "Online"
      : "Offline";
  };

  // ==========================================
  // GET LAST LOGIN
  // ==========================================
  const getLastLogin = (userId) => {
    const userHistory = loginHistory
      .filter(
        (item) =>
          String(item.userId) === String(userId)
      )
      .sort(
        (a, b) =>
          new Date(b.loginTime) -
          new Date(a.loginTime)
      );

    if (userHistory.length === 0) {
      return null;
    }

    return userHistory[0];
  };

  // ==========================================
  // SEARCH + FILTER
  // ==========================================
  const filteredUsers = users.filter((user) => {
    const userStatus = getUserStatus(user._id);

    const searchValue = search
      .toLowerCase()
      .trim();

    const matchesSearch =
      user.name
        ?.toLowerCase()
        .includes(searchValue) ||
      user.email
        ?.toLowerCase()
        .includes(searchValue) ||
      user.phone
        ?.toLowerCase()
        .includes(searchValue);

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "online" &&
        userStatus === "Online") ||
      (activeFilter === "offline" &&
        userStatus === "Offline");

    return matchesSearch && matchesFilter;
  });

  // ==========================================
  // COUNTS
  // ==========================================
  const totalUsers = users.length;

  const onlineUsers = users.filter(
    (user) =>
      getUserStatus(user._id) === "Online"
  ).length;

  const offlineUsers =
    totalUsers - onlineUsers;

  // ==========================================
  // FORMAT DATE
  // ==========================================
  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  // ==========================================
  // OPEN SINGLE USER
  // ==========================================
  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  // ==========================================
  // CLOSE SINGLE USER
  // ==========================================
  const handleBack = () => {
    setSelectedUser(null);

    // Refresh after returning
    fetchAllData();
  };

  // ==========================================
  // SINGLE USER VIEW
  // ==========================================
  if (selectedUser) {
    return (
      <AdminUserDetails
        user={selectedUser}
        loginHistory={loginHistory}
        onBack={handleBack}
      />
    );
  }

  // ==========================================
  // LOADING
  // ==========================================
  if (loading && users.length === 0) {
    return (
      <div className="admin-users-page">
        <div className="users-loading">
          <div className="loading-spinner"></div>
          <h3>Loading users...</h3>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================
  return (
    <div className="admin-users-page">

      {/* HEADER */}
      <div className="users-header">
        <div>
          <p className="users-small-title">
            ADMIN PANEL
          </p>

          <h1>
            User Management
          </h1>

          <p className="users-subtitle">
            Manage and monitor all registered users
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={fetchAllData}
        >
          ↻ Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="user-stats">

        <div className="stat-card">
          <div className="stat-icon">
            👥
          </div>

          <div>
            <span>Total Users</span>
            <h2>{totalUsers}</h2>
          </div>
        </div>

        <div className="stat-card online-stat">
          <div className="stat-icon">
            🟢
          </div>

          <div>
            <span>Online Users</span>
            <h2>{onlineUsers}</h2>
          </div>
        </div>

        <div className="stat-card offline-stat">
          <div className="stat-icon">
            ⚫
          </div>

          <div>
            <span>Offline Users</span>
            <h2>{offlineUsers}</h2>
          </div>
        </div>

      </div>

      {/* SEARCH + FILTER */}
      <div className="user-controls">

        <div className="search-box">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search user by name, email or phone..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              className="clear-search"
              onClick={() => setSearch("")}
            >
              ×
            </button>
          )}
        </div>

        <div className="filter-buttons">

          <button
            className={
              activeFilter === "all"
                ? "filter-btn active"
                : "filter-btn"
            }
            onClick={() =>
              setActiveFilter("all")
            }
          >
            All Users
            <span>{totalUsers}</span>
          </button>

          <button
            className={
              activeFilter === "online"
                ? "filter-btn online active"
                : "filter-btn online"
            }
            onClick={() =>
              setActiveFilter("online")
            }
          >
            🟢 Online
            <span>{onlineUsers}</span>
          </button>

          <button
            className={
              activeFilter === "offline"
                ? "filter-btn offline active"
                : "filter-btn offline"
            }
            onClick={() =>
              setActiveFilter("offline")
            }
          >
            ⚫ Offline
            <span>{offlineUsers}</span>
          </button>

        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="users-error">
          {error}
        </div>
      )}

      {/* RESULT COUNT */}
      <div className="result-info">
        Showing{" "}
        <strong>
          {filteredUsers.length}
        </strong>{" "}
        users
      </div>

      {/* USER CARDS */}
      {filteredUsers.length > 0 ? (

        <div className="users-grid">

          {filteredUsers.map((user) => {

            const status = getUserStatus(
              user._id
            );

            const latestHistory =
              getLastLogin(user._id);

            return (
              <div
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
                        src={user.profileImage}
                        alt={user.name}
                        className="user-avatar"
                      />
                    ) : (
                      <div className="user-avatar default-avatar">
                        {user.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <span
                      className={
                        status === "Online"
                          ? "online-dot"
                          : "offline-dot"
                      }
                    ></span>

                  </div>

                  <span
                    className={
                      status === "Online"
                        ? "status-badge online"
                        : "status-badge offline"
                    }
                  >
                    {status}
                  </span>

                </div>

                {/* NAME */}
                <div className="user-main-info">

                  <h2>
                    {user.name}
                  </h2>

                  <span className="role-badge">
                    {user.role || "user"}
                  </span>

                </div>

                {/* DETAILS */}
                <div className="user-card-details">

                  <div className="detail-row">
                    <span className="detail-icon">
                      ✉
                    </span>

                    <div>
                      <small>Email</small>
                      <p>
                        {user.email ||
                          "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="detail-row">
                    <span className="detail-icon">
                      ☎
                    </span>

                    <div>
                      <small>Phone</small>
                      <p>
                        {user.phone ||
                          "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="detail-row">
                    <span className="detail-icon">
                      🕒
                    </span>

                    <div>
                      <small>Last Login</small>
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

                {/* VIEW BUTTON */}
                <div className="view-user">
                  <span>
                    View Full Details
                  </span>

                  <span className="arrow">
                    →
                  </span>
                </div>

              </div>
            );
          })}

        </div>

      ) : (

        <div className="no-users">
          <div className="no-users-icon">
            🔍
          </div>

          <h2>
            No Users Found
          </h2>

          <p>
            Try changing your search or filter.
          </p>

          <button
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

export default AdminUsers;