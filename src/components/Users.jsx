import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../styles/Users.css";

const ADMIN_API_URL =
  "https://api-admin-rouge.vercel.app";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  // =====================================================
  // GET USERS
  // =====================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${ADMIN_API_URL}/admin/users`
      );

      console.log(
        "ADMIN USERS:",
        response.data
      );

      if (response.data.success) {
        setUsers(
          Array.isArray(response.data.users)
            ? response.data.users
            : []
        );
      } else {
        setUsers([]);

        setError(
          response.data.message ||
            "Users not found"
        );
      }
    } catch (error) {
      console.error(
        "FETCH USERS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SYNC USERS
  // =====================================================

  const syncUsers = async () => {
    try {
      setSyncing(true);
      setError("");

      const response = await axios.post(
        `${ADMIN_API_URL}/admin/sync-users`
      );

      console.log(
        "SYNC USERS:",
        response.data
      );

      if (response.data.success) {
        await fetchUsers();
      } else {
        setError(
          response.data.message ||
            "User sync failed"
        );
      }
    } catch (error) {
      console.error(
        "SYNC USERS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to sync users"
      );
    } finally {
      setSyncing(false);
    }
  };

  // =====================================================
  // LOAD USERS ONLY ONCE
  // =====================================================

  useEffect(() => {
    fetchUsers();
  }, []);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalUsers = users.length;

  const onlineUsers = users.filter(
    (user) =>
      user.status === "Online"
  ).length;

  const offlineUsers = users.filter(
    (user) =>
      user.status === "Offline"
  ).length;

  const loggedOutUsers = users.filter(
    (user) =>
      user.status === "Logged Out"
  ).length;

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredUsers = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return users.filter((user) => {
      const name =
        user.name?.toLowerCase() || "";

      const email =
        user.email?.toLowerCase() || "";

      const phone =
        user.phone?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        phone.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        user.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    statusFilter,
  ]);

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    if (status === "Online") {
      return "online";
    }

    if (status === "Logged Out") {
      return "logged-out";
    }

    return "offline";
  };

  // =====================================================
  // AVATAR LETTER
  // =====================================================

  const getInitial = (name) => {
    if (!name) {
      return "U";
    }

    return name
      .charAt(0)
      .toUpperCase();
  };

  // =====================================================
  // VIEW DETAILS
  // =====================================================

  const handleViewDetails = (user) => {
    alert(
      `Name: ${user.name || "-"}\n` +
      `Email: ${user.email || "-"}\n` +
      `Phone: ${user.phone || "-"}\n` +
      `Role: ${user.role || "user"}\n` +
      `Status: ${user.status || "Offline"}`
    );
  };

  return (
    <div className="users-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="users-top">

        <div className="users-heading">

          <span className="heading-small">
            USER MANAGEMENT
          </span>

          <h1>
            Users
          </h1>

          <p>
            Manage and monitor all registered users
          </p>

        </div>

        <button
          className="sync-button"
          onClick={syncUsers}
          disabled={syncing}
        >
          <span className="sync-icon">
            ↻
          </span>

          {syncing
            ? "Syncing..."
            : "Sync Users"}
        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="users-error">
          {error}
        </div>
      )}


      {/* =================================================
          STATISTICS
      ================================================= */}

      {!loading && (
        <div className="user-statistics">

          {/* TOTAL */}

          <div
            className={`stat-card ${
              statusFilter === "All"
                ? "active-stat"
                : ""
            }`}
            onClick={() =>
              setStatusFilter("All")
            }
          >

            <div className="stat-icon">
              👥
            </div>

            <div>
              <span>
                Total Users
              </span>

              <strong>
                {totalUsers}
              </strong>
            </div>

          </div>


          {/* ONLINE */}

          <div
            className={`stat-card ${
              statusFilter === "Online"
                ? "active-stat"
                : ""
            }`}
            onClick={() =>
              setStatusFilter("Online")
            }
          >

            <div className="stat-icon online-icon">
              ●
            </div>

            <div>
              <span>
                Online
              </span>

              <strong>
                {onlineUsers}
              </strong>
            </div>

          </div>


          {/* OFFLINE */}

          <div
            className={`stat-card ${
              statusFilter === "Offline"
                ? "active-stat"
                : ""
            }`}
            onClick={() =>
              setStatusFilter("Offline")
            }
          >

            <div className="stat-icon offline-icon">
              ○
            </div>

            <div>
              <span>
                Offline
              </span>

              <strong>
                {offlineUsers}
              </strong>
            </div>

          </div>


          {/* LOGGED OUT */}

          <div
            className={`stat-card ${
              statusFilter === "Logged Out"
                ? "active-stat"
                : ""
            }`}
            onClick={() =>
              setStatusFilter("Logged Out")
            }
          >

            <div className="stat-icon logout-icon">
              ↪
            </div>

            <div>
              <span>
                Logged Out
              </span>

              <strong>
                {loggedOutUsers}
              </strong>
            </div>

          </div>

        </div>
      )}


      {/* =================================================
          TOOLBAR
      ================================================= */}

      {!loading &&
        users.length > 0 && (
          <div className="users-toolbar">

            {/* SEARCH */}

            <div className="search-box">

              <span className="search-icon">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search users by name, email or phone..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {search && (
                <button
                  className="clear-search"
                  onClick={() =>
                    setSearch("")
                  }
                  type="button"
                >
                  ×
                </button>
              )}

            </div>


            {/* STATUS FILTER */}

            <div className="status-filter">

              <label>
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
              >
                <option value="All">
                  All
                </option>

                <option value="Online">
                  Online
                </option>

                <option value="Offline">
                  Offline
                </option>

                <option value="Logged Out">
                  Logged Out
                </option>
              </select>

            </div>

          </div>
        )}


      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (

        <div className="users-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading users...
          </p>

        </div>

      ) : users.length === 0 ? (

        /* =================================================
           NO USERS
        ================================================= */

        <div className="no-users">

          <div className="no-users-icon">
            👥
          </div>

          <h2>
            No Users Found
          </h2>

          <p>
            There are no users available yet.
          </p>

          <button
            onClick={syncUsers}
            disabled={syncing}
          >
            {syncing
              ? "Syncing..."
              : "Sync Users"}
          </button>

        </div>

      ) : filteredUsers.length === 0 ? (

        /* =================================================
           NO SEARCH RESULT
        ================================================= */

        <div className="no-users">

          <div className="no-users-icon">
            🔍
          </div>

          <h2>
            No Matching Users
          </h2>

          <p>
            Try a different search or status filter.
          </p>

          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
            }}
          >
            Clear Filters
          </button>

        </div>

      ) : (

        /* =================================================
           RESULT INFO + USER GRID
        ================================================= */

        <>

          <div className="result-info">

            <span>
              Showing{" "}
              <strong>
                {filteredUsers.length}
              </strong>{" "}
              of{" "}
              <strong>
                {totalUsers}
              </strong>{" "}
              users
            </span>

            {search && (
              <span>
                Search:{" "}
                <strong>
                  {search}
                </strong>
              </span>
            )}

          </div>


          <div className="users-grid">

            {filteredUsers.map((user) => {

              const statusClass =
                getStatusClass(
                  user.status
                );

              return (
                <div
                  className="user-card"
                  key={user._id}
                >

                  {/* =================================================
                     CARD TOP
                  ================================================= */}

                  <div className="card-top">

                    <div className="user-avatar">

                      {user.profileImage ? (
                        <img
                          src={
                            user.profileImage
                          }
                          alt={
                            user.name ||
                            "User"
                          }
                        />
                      ) : (
                        <span>
                          {getInitial(
                            user.name
                          )}
                        </span>
                      )}

                      <span
                        className={`online-dot ${statusClass}`}
                      ></span>

                    </div>


                    {/* STATUS */}

                    <span
                      className={`status-badge ${statusClass}`}
                    >
                      {user.status ||
                        "Offline"}
                    </span>

                  </div>


                  {/* =================================================
                     USER CONTENT
                  ================================================= */}

                  <div className="user-card-content">

                    <h2>
                      {user.name ||
                        "Unknown User"}
                    </h2>

                    <p className="user-email">
                      ✉{" "}
                      {user.email ||
                        "-"}
                    </p>

                    <p className="user-phone">
                      ☎{" "}
                      {user.phone ||
                        "-"}
                    </p>


                    {/* USER META */}

                    <div className="user-meta">

                      <span>
                        Role
                      </span>

                      <strong>
                        {user.role ||
                          "user"}
                      </strong>

                    </div>


                    {/* VIEW DETAILS */}

                    <button
                      className="view-details-button"
                      onClick={() =>
                        handleViewDetails(
                          user
                        )
                      }
                      type="button"
                    >

                      <span>
                        View Details
                      </span>

                      <span>
                        →
                      </span>

                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        </>
      )}

    </div>
  );
};

export default Users;