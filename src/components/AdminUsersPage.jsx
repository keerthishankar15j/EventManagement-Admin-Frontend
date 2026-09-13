import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminUserDetails from "./AdminUserDetails";
import "../styles/AdminUsersPage.css";

// =====================================================
// API CONFIGURATION
// =====================================================

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// ADMIN USERS PAGE
// =====================================================

const AdminUsersPage = () => {
  // ===================================================
  // STATES
  // ===================================================

  const [users, setUsers] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [error, setError] = useState("");
  const [historyError, setHistoryError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedUser, setSelectedUser] = useState(null);

  const [activeTab, setActiveTab] = useState("users");

  const [refreshing, setRefreshing] = useState(false);

  // ===================================================
  // FETCH USERS
  // ===================================================

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      setError("");

      const response = await api.get("/login/getusers");

      console.log("USERS RESPONSE:", response.data);

      if (response.data?.success) {
        setUsers(response.data.users || []);
      } else {
        throw new Error(
          response.data?.message || "Unable to fetch users"
        );
      }
    } catch (err) {
      console.error("FETCH USERS ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch users"
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  // ===================================================
  // FETCH LOGIN HISTORY
  // ===================================================

  const fetchLoginHistory = async () => {
    try {
      setLoadingHistory(true);
      setHistoryError("");

      const response = await api.get("/loginhistory/gethistory");

      console.log("LOGIN HISTORY RESPONSE:", response.data);

      if (response.data?.success) {
        setLoginHistory(response.data.history || []);
      } else {
        throw new Error(
          response.data?.message ||
            "Unable to fetch login history"
        );
      }
    } catch (err) {
      console.error("FETCH LOGIN HISTORY ERROR:", err);

      setHistoryError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch login history"
      );
    } finally {
      setLoadingHistory(false);
    }
  };

  // ===================================================
  // FETCH ALL DATA
  // ===================================================

  const fetchAllData = async () => {
    await Promise.all([
      fetchUsers(),
      fetchLoginHistory(),
    ]);
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    console.log("API BASE URL:", API_BASE_URL);

    if (!API_BASE_URL) {
      setError(
        "VITE_API_URL is not configured. Please check your .env file."
      );

      setLoadingUsers(false);
      setLoadingHistory(false);

      return;
    }

    fetchAllData();
  }, []);

  // ===================================================
  // REFRESH
  // ===================================================

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      await fetchAllData();
    } finally {
      setRefreshing(false);
    }
  };

  // ===================================================
  // FILTER USERS
  // ===================================================

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name =
        user.name ||
        user.username ||
        "";

      const email =
        user.email ||
        "";

      const role =
        user.role ||
        "";

      const searchText = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        name.toLowerCase().includes(searchText) ||
        email.toLowerCase().includes(searchText) ||
        role.toLowerCase().includes(searchText);

      const userStatus =
        user.status ||
        "Active";

      const matchesStatus =
        statusFilter === "All" ||
        userStatus.toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  // ===================================================
  // LOGIN HISTORY FILTER
  // ===================================================

  const filteredHistory = useMemo(() => {
    return loginHistory.filter((item) => {
      const name =
        item.name ||
        "";

      const email =
        item.email ||
        "";

      const status =
        item.status ||
        "";

      const searchText = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        name.toLowerCase().includes(searchText) ||
        email.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        status.toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [loginHistory, search, statusFilter]);

  // ===================================================
  // FORMAT DATE
  // ===================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ===================================================
  // FORMAT DATE + TIME
  // ===================================================

  const formatDateTime = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ===================================================
  // GET USER STATUS
  // ===================================================

  const getUserStatus = (user) => {
    if (user.status) {
      return user.status;
    }

    if (user.isActive === true) {
      return "Active";
    }

    return "Active";
  };

  // ===================================================
  // GET INITIALS
  // ===================================================

  const getInitials = (name) => {
    if (!name) {
      return "U";
    }

    const words = name
      .trim()
      .split(" ")
      .filter(Boolean);

    if (words.length === 1) {
      return words[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      words[0][0] +
      words[words.length - 1][0]
    ).toUpperCase();
  };

  // ===================================================
  // USER COUNT
  // ===================================================

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) =>
      getUserStatus(user).toLowerCase() ===
      "active"
  ).length;

  const loggedOutUsers = users.filter(
    (user) =>
      getUserStatus(user).toLowerCase() ===
      "logged out"
  ).length;

  // ===================================================
  // OPEN USER DETAILS
  // ===================================================

  const handleViewUser = (user) => {
    setSelectedUser(user);
  };

  // ===================================================
  // CLOSE USER DETAILS
  // ===================================================

  const handleCloseDetails = () => {
    setSelectedUser(null);
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="admin-users-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-users-header">

        <div>
          <h1>Users</h1>

          <p>
            Manage users and view login history
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="users-stats">

        <div className="stat-card">
          <div className="stat-card-content">
            <span className="stat-title">
              Total Users
            </span>

            <strong>
              {totalUsers}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <span className="stat-title">
              Active Users
            </span>

            <strong>
              {activeUsers}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <span className="stat-title">
              Logged Out
            </span>

            <strong>
              {loggedOutUsers}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <span className="stat-title">
              Login Records
            </span>

            <strong>
              {loginHistory.length}
            </strong>
          </div>
        </div>

      </div>

      {/* =================================================
          TABS
      ================================================= */}

      <div className="admin-users-tabs">

        <button
          className={
            activeTab === "users"
              ? "active"
              : ""
          }
          onClick={() => {
            setActiveTab("users");
            setSelectedUser(null);
          }}
        >
          Users
        </button>

        <button
          className={
            activeTab === "history"
              ? "active"
              : ""
          }
          onClick={() => {
            setActiveTab("history");
            setSelectedUser(null);
          }}
        >
          Login History
        </button>

      </div>

      {/* =================================================
          FILTER SECTION
      ================================================= */}

      <div className="users-filter-section">

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="users-search"
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="users-status-filter"
        >
          <option value="All">
            All Status
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Logged Out">
            Logged Out
          </option>
        </select>

      </div>

      {/* =================================================
          USERS TAB
      ================================================= */}

      {activeTab === "users" && (
        <div className="users-section">

          {loadingUsers ? (
            <div className="loading-message">
              Loading users...
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>

              <button
                onClick={fetchUsers}
              >
                Try Again
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-message">
              No users found.
            </div>
          ) : (
            <div className="users-grid">

              {filteredUsers.map((user, index) => {

                const userName =
                  user.name ||
                  user.username ||
                  "Unknown User";

                const userEmail =
                  user.email ||
                  "No email";

                const userRole =
                  user.role ||
                  "user";

                const userStatus =
                  getUserStatus(user);

                return (
                  <div
                    className="user-card"
                    key={
                      user._id ||
                      user.id ||
                      index
                    }
                  >

                    {/* AVATAR */}

                    <div className="user-avatar">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={userName}
                        />
                      ) : (
                        getInitials(userName)
                      )}
                    </div>

                    {/* USER INFO */}

                    <div className="user-card-info">

                      <h3>
                        {userName}
                      </h3>

                      <p>
                        {userEmail}
                      </p>

                      <span className="user-role">
                        {userRole}
                      </span>

                      <span
                        className={
                          userStatus
                            .toLowerCase()
                            .replace(/\s+/g, "-") +
                          " user-status"
                        }
                      >
                        {userStatus}
                      </span>

                    </div>

                    {/* VIEW BUTTON */}

                    <button
                      className="view-user-btn"
                      onClick={() =>
                        handleViewUser(user)
                      }
                    >
                      View
                    </button>

                  </div>
                );
              })}

            </div>
          )}

        </div>
      )}

      {/* =================================================
          LOGIN HISTORY TAB
      ================================================= */}

      {activeTab === "history" && (
        <div className="login-history-section">

          {loadingHistory ? (
            <div className="loading-message">
              Loading login history...
            </div>
          ) : historyError ? (
            <div className="error-message">
              <p>{historyError}</p>

              <button
                onClick={fetchLoginHistory}
              >
                Try Again
              </button>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="empty-message">
              No login history found.
            </div>
          ) : (
            <div className="login-history-table-wrapper">

              <table className="login-history-table">

                <thead>
                  <tr>
                    <th>
                      User
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Login Time
                    </th>

                    <th>
                      Logout Time
                    </th>

                    <th>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {filteredHistory.map(
                    (item, index) => {

                      const userName =
                        item.name ||
                        "Unknown User";

                      const email =
                        item.email ||
                        "No email";

                      const status =
                        item.status ||
                        "Active";

                      return (
                        <tr
                          key={
                            item._id ||
                            item.id ||
                            index
                          }
                        >

                          <td>
                            <div className="history-user">

                              <div className="history-avatar">
                                {getInitials(
                                  userName
                                )}
                              </div>

                              <span>
                                {userName}
                              </span>

                            </div>
                          </td>

                          <td>
                            {email}
                          </td>

                          <td>
                            {formatDateTime(
                              item.loginTime
                            )}
                          </td>

                          <td>
                            {formatDateTime(
                              item.logoutTime
                            )}
                          </td>

                          <td>

                            <span
                              className={
                                status
                                  .toLowerCase()
                                  .replace(
                                    /\s+/g,
                                    "-"
                                  ) +
                                " history-status"
                              }
                            >
                              {status}
                            </span>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>
      )}

      {/* =================================================
          USER DETAILS MODAL
      ================================================= */}

      {selectedUser && (
        <div className="user-details-overlay">

          <div className="user-details-modal">

            <button
              className="close-details-btn"
              onClick={
                handleCloseDetails
              }
            >
              ×
            </button>

            <AdminUserDetails
              user={selectedUser}
              onClose={
                handleCloseDetails
              }
            />

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminUsersPage;