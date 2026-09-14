import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const ADMIN_API_URL =
    import.meta.env.VITE_ADMIN_API_URL ||
    "http://localhost:3000";

  // ==============================
  // GET USERS
  // ==============================
  const getUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${ADMIN_API_URL}/admin/users`
      );

      if (response.data.success) {
        setUsers(response.data.users || []);
      } else {
        setUsers([]);
        setError("Unable to load users");
      }
    } catch (error) {
      console.error("GET USERS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOAD USERS ON PAGE OPEN
  // ==============================
  useEffect(() => {
    getUsers();
  }, []);

  // ==============================
  // SEARCH + FILTER
  // ==============================
  const filteredUsers = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return users.filter((user) => {
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

      const isOnline =
        user.status === "online";

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "online"
          ? isOnline
          : !isOnline;

      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

  // ==============================
  // COUNTS
  // ==============================
  const onlineUsers = users.filter(
    (user) => user.status === "online"
  ).length;

  const offlineUsers =
    users.length - onlineUsers;

  // ==============================
  // VIEW DETAILS
  // ==============================
  const viewDetails = (id) => {
    navigate(`/users/view/${id}`);
  };

  return (
    <div className="users-page">

      {/* =================================
          HEADER
      ================================= */}
      <div className="users-header">

        <div className="users-heading">
          <span className="users-small-title">
            ADMIN PANEL
          </span>

          <h1>Users</h1>

          <p>
            Manage and view all registered users
          </p>
        </div>

        {/* SEARCH */}
        <div className="users-search-box">
          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search name, email or phone..."
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
      </div>


      {/* =================================
          USER SUMMARY
      ================================= */}
      <div className="users-summary">

        <div className="summary-card">
          <div className="summary-icon">
            👥
          </div>

          <div>
            <span>Total Users</span>
            <strong>{users.length}</strong>
          </div>
        </div>


        <div className="summary-card">
          <div className="summary-icon online-icon">
            ●
          </div>

          <div>
            <span>Online</span>
            <strong>{onlineUsers}</strong>
          </div>
        </div>


        <div className="summary-card">
          <div className="summary-icon offline-icon">
            ●
          </div>

          <div>
            <span>Offline</span>
            <strong>{offlineUsers}</strong>
          </div>
        </div>

      </div>


      {/* =================================
          FILTER BUTTONS
      ================================= */}
      <div className="users-filter">

        <button
          className={
            filter === "all"
              ? "filter-btn active"
              : "filter-btn"
          }
          onClick={() => setFilter("all")}
        >
          All Users
          <span>{users.length}</span>
        </button>


        <button
          className={
            filter === "online"
              ? "filter-btn active online-filter"
              : "filter-btn"
          }
          onClick={() => setFilter("online")}
        >
          <i className="online-dot"></i>
          Online
          <span>{onlineUsers}</span>
        </button>


        <button
          className={
            filter === "offline"
              ? "filter-btn active offline-filter"
              : "filter-btn"
          }
          onClick={() => setFilter("offline")}
        >
          <i className="offline-dot"></i>
          Offline
          <span>{offlineUsers}</span>
        </button>

      </div>


      {/* =================================
          LOADING
      ================================= */}
      {loading && (
        <div className="users-loading">
          <div className="loader"></div>
          <p>Loading users...</p>
        </div>
      )}


      {/* =================================
          ERROR
      ================================= */}
      {!loading && error && (
        <div className="users-error">
          <div>⚠️</div>
          <h3>Something went wrong</h3>
          <p>{error}</p>

          <button onClick={getUsers}>
            Try Again
          </button>
        </div>
      )}


      {/* =================================
          NO USERS
      ================================= */}
      {!loading &&
        !error &&
        filteredUsers.length === 0 && (
          <div className="no-users">
            <div className="no-users-icon">
              🔎
            </div>

            <h3>No users found</h3>

            <p>
              Try changing your search or filter.
            </p>
          </div>
        )}


      {/* =================================
          USERS CARDS
      ================================= */}
      {!loading &&
        !error &&
        filteredUsers.length > 0 && (
          <div className="users-grid">

            {filteredUsers.map((user) => {

              const isOnline =
                user.status === "online";

              const firstLetter =
                user.name
                  ?.charAt(0)
                  .toUpperCase() || "U";

              return (
                <div
                  className="user-card"
                  key={user._id}
                >

                  {/* CARD TOP */}
                  <div className="card-top">

                    <div className="user-avatar">

                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name}
                        />
                      ) : (
                        <span>
                          {firstLetter}
                        </span>
                      )}

                      <i
                        className={
                          isOnline
                            ? "status-dot online"
                            : "status-dot offline"
                        }
                      ></i>

                    </div>


                    <div className="user-main-info">

                      <h2>
                        {user.name || "Unknown User"}
                      </h2>

                      <span className="user-role">
                        {user.role || "user"}
                      </span>

                    </div>

                  </div>


                  {/* USER DETAILS */}
                  <div className="card-details">

                    <div className="card-detail-row">
                      <span className="detail-label">
                        EMAIL
                      </span>

                      <p>
                        {user.email || "Not provided"}
                      </p>
                    </div>


                    <div className="card-detail-row">
                      <span className="detail-label">
                        PHONE
                      </span>

                      <p>
                        {user.phone || "Not provided"}
                      </p>
                    </div>


                    <div className="card-detail-row">
                      <span className="detail-label">
                        STATUS
                      </span>

                      <p
                        className={
                          isOnline
                            ? "status-text online-text"
                            : "status-text offline-text"
                        }
                      >
                        <i
                          className={
                            isOnline
                              ? "mini-dot online"
                              : "mini-dot offline"
                          }
                        ></i>

                        {isOnline
                          ? "Online"
                          : "Offline"}
                      </p>
                    </div>

                  </div>


                  {/* VIEW DETAILS */}
                  <button
                    className="view-details-btn"
                    onClick={() =>
                      viewDetails(user._id)
                    }
                  >
                    <span>
                      View Details
                    </span>

                    <b>→</b>
                  </button>

                </div>
              );
            })}

          </div>
        )}

    </div>
  );
}

export default Users;