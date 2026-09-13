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

  // =====================================================
  // FETCH USERS
  // =====================================================

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/login/getusers`
      );

      if (response.data?.success) {
        setUsers(response.data.users || []);
      } else {
        setError("Unable to fetch users");
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Failed to load users");
    }
  };

  // =====================================================
  // FETCH LOGIN HISTORY
  // =====================================================

  const fetchLoginHistory = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/loginhistory/gethistory`
      );

      if (response.data?.success) {
        setLoginHistory(response.data.history || []);
      }
    } catch (err) {
      console.error("Login history error:", err);
    }
  };

  // =====================================================
  // FETCH ALL DATA
  // =====================================================

  const fetchAllData = async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setError("");

      await Promise.all([
        fetchUsers(),
        fetchLoginHistory(),
      ]);
    } catch (err) {
      console.error("Fetch all data error:", err);
      setError("Unable to load user data");
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

    return () => clearInterval(interval);
  }, []);

  // =====================================================
  // GET USER HISTORY
  // =====================================================

  const getUserHistory = (userId) => {
    return loginHistory
      .filter(
        (item) =>
          String(item.userId) === String(userId)
      )
      .sort(
        (a, b) =>
          new Date(b.loginTime) -
          new Date(a.loginTime)
      );
  };

  // =====================================================
  // GET USER STATUS
  // =====================================================

  const getUserStatus = (userId) => {
    const userHistory = getUserHistory(userId);

    if (userHistory.length === 0) {
      return "Offline";
    }

    const latestLogin = userHistory[0];

    return latestLogin.status === "Active"
      ? "Online"
      : "Offline";
  };

  // =====================================================
  // GET LAST LOGIN
  // =====================================================

  const getLastLogin = (userId) => {
    const userHistory = getUserHistory(userId);

    if (userHistory.length === 0) {
      return null;
    }

    return userHistory[0];
  };

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredUsers = users.filter((user) => {
    const status = getUserStatus(user._id);

    const searchValue = search
      .toLowerCase()
      .trim();

    const name =
      user.name?.toLowerCase() || "";

    const email =
      user.email?.toLowerCase() || "";

    const phone =
      String(user.phone || "").toLowerCase();

    const matchesSearch =
      name.includes(searchValue) ||
      email.includes(searchValue) ||
      phone.includes(searchValue);

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "online" &&
        status === "Online") ||
      (activeFilter === "offline" &&
        status === "Offline");

    return matchesSearch && matchesFilter;
  });

  // =====================================================
  // COUNTS
  // =====================================================

  const totalUsers = users.length;

  const onlineUsers = users.filter(
    (user) =>
      getUserStatus(user._id) === "Online"
  ).length;

  const offlineUsers =
    totalUsers - onlineUsers;

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
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
  // BACK FROM USER DETAILS
  // =====================================================

  const handleBack = () => {
    setSelectedUser(null);
    fetchAllData(false);
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading && users.length === 0) {
    return (
      <div className="admin-users-page">
        <div className="users-loading">
          <div className="loading-spinner"></div>

          <h3>Loading users</h3>

          <p>Please wait while we load the user data.</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // USER DETAILS
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

          <h1>User Management</h1>

          <p className="users-subtitle">
            Manage and monitor all registered users
          </p>

        </div>

        <button
          type="button"
          className="refresh-btn"
          onClick={() => fetchAllData(true)}
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

          {loading ? "Refreshing" : "Refresh"}
        </button>

      </div>

      {/* =================================================
          STATS
      ================================================= */}

      <div className="user-stats">

        {/* TOTAL */}

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

        {/* ONLINE */}

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

        {/* OFFLINE */}

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
          CONTROLS
      ================================================= */}

      <div className="user-controls">

        {/* SEARCH */}

        <div className="search-box">

          <span className="search-icon">
            ⌕
          </span>

          <input
            type="text"
            value={search}
            placeholder="Search user by name, email or phone..."
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}

        </div>

        {/* FILTERS */}

        <div className="filter-buttons">

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
            <span>All Users</span>

            <small>
              {totalUsers}
            </small>
          </button>

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

            <span>Online</span>

            <small>
              {onlineUsers}
            </small>
          </button>

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

            <span>Offline</span>

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
          <span>{error}</span>

          <button
            type="button"
            onClick={() => fetchAllData(true)}
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

        {(search || activeFilter !== "all") && (
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
          USER CARDS
      ================================================= */}

      {filteredUsers.length > 0 ? (

        <div className="users-grid">

          {filteredUsers.map((user) => {

            const status =
              getUserStatus(user._id);

            const latestHistory =
              getLastLogin(user._id);

            const isOnline =
              status === "Online";

            const firstLetter =
              user.name
                ?.charAt(0)
                .toUpperCase() || "U";

            return (
              <article
                className="admin-user-card"
                key={user._id}
                onClick={() =>
                  handleUserClick(user)
                }
              >

                {/* TOP */}

                <div className="card-top">

                  <div className="profile-wrapper">

                    {user.profileImage ? (

                      <img
                        src={user.profileImage}
                        alt={user.name || "User"}
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
                      {user.role || "user"}
                    </span>

                  </div>

                </div>

                {/* DETAILS */}

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

                {/* FOOTER */}

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
          })}

        </div>

      ) : (

        /* =================================================
           EMPTY STATE
        ================================================= */

        <div className="no-users">

          <div className="no-users-icon">
            ⌕
          </div>

          <h2>
            No Users Found
          </h2>

          <p>
            Try changing your search or filter.
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

export default AdminUsers;
