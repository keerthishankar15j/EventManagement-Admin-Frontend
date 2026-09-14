import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/Users.css";

function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // =====================================================
  // GET USERS
  // =====================================================

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/admin/users"
      );

      console.log("ADMIN USERS:", response.data);

      if (response.data.success) {
        setUsers(response.data.users || []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("FETCH USERS ERROR:", error);
      setUsers([]);
    }
  };

  // =====================================================
  // SYNC USERS
  // =====================================================

  const handleSync = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/admin/sync-users"
      );

      console.log("SYNC RESPONSE:", response.data);

      if (response.data.success) {
        alert(
          `Users Synced Successfully!\n\n` +
            `Total Users: ${response.data.total}\n` +
            `New Users: ${response.data.inserted}\n` +
            `Updated Users: ${response.data.updated}`
        );

        await fetchUsers();
      } else {
        alert(
          response.data.message || "Sync failed"
        );
      }
    } catch (error) {
      console.error("SYNC ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Unable to sync users"
      );
    }
  };

  // =====================================================
  // LOAD USERS
  // =====================================================

  useEffect(() => {
    fetchUsers();
  }, []);

  // =====================================================
  // SEARCH + STATUS FILTER
  // =====================================================

  const filteredUsers = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    return users.filter((user) => {
      const name =
        user.name?.toLowerCase() || "";

      const email =
        user.email?.toLowerCase() || "";

      const phone =
        user.phone?.toLowerCase() || "";

      const matchesSearch =
        !searchText ||
        name.includes(searchText) ||
        email.includes(searchText) ||
        phone.includes(searchText);

      const userStatus =
        user.status?.toLowerCase() || "offline";

      const matchesStatus =
        statusFilter === "all" ||
        userStatus === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [users, search, statusFilter]);

  // =====================================================
  // COUNTS
  // =====================================================

  const totalUsers = users.length;

  const onlineUsers = users.filter(
    (user) =>
      user.status?.toLowerCase() === "online"
  ).length;

  const offlineUsers = users.filter(
    (user) =>
      !user.status ||
      user.status?.toLowerCase() === "offline"
  ).length;

  const loggedOutUsers = users.filter(
    (user) =>
      user.status?.toLowerCase() === "logged out"
  ).length;

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
  // JSX
  // =====================================================

  return (
    <div className="users-page">

      {/* =================================================
          TOP HEADER
      ================================================= */}

      <div className="users-top">

        <div className="users-heading">

          <span className="heading-small">
            USER MANAGEMENT
          </span>

          <h1>
            All Users
          </h1>

          <p>
            Manage and view all registered users
          </p>

        </div>

        <button
          className="sync-button"
          onClick={handleSync}
        >
          <span className="sync-icon">
            ↻
          </span>

          Sync Users
        </button>

      </div>


      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="user-statistics">

        {/* TOTAL */}

        <div className="stat-card total-stat">

          <div className="stat-icon">
            👥
          </div>

          <div>
            <span>Total Users</span>
            <strong>{totalUsers}</strong>
          </div>

        </div>


        {/* ONLINE */}

        <div
          className={`stat-card status-stat ${
            statusFilter === "online"
              ? "active-stat"
              : ""
          }`}
          onClick={() =>
            setStatusFilter(
              statusFilter === "online"
                ? "all"
                : "online"
            )
          }
        >

          <div className="stat-icon online-icon">
            ●
          </div>

          <div>
            <span>Online</span>
            <strong>{onlineUsers}</strong>
          </div>

        </div>


        {/* OFFLINE */}

        <div
          className={`stat-card status-stat ${
            statusFilter === "offline"
              ? "active-stat"
              : ""
          }`}
          onClick={() =>
            setStatusFilter(
              statusFilter === "offline"
                ? "all"
                : "offline"
            )
          }
        >

          <div className="stat-icon offline-icon">
            ●
          </div>

          <div>
            <span>Offline</span>
            <strong>{offlineUsers}</strong>
          </div>

        </div>


        {/* LOGGED OUT */}

        <div
          className={`stat-card status-stat ${
            statusFilter === "logged out"
              ? "active-stat"
              : ""
          }`}
          onClick={() =>
            setStatusFilter(
              statusFilter === "logged out"
                ? "all"
                : "logged out"
            )
          }
        >

          <div className="stat-icon logout-icon">
            ↪
          </div>

          <div>
            <span>Logged Out</span>
            <strong>{loggedOutUsers}</strong>
          </div>

        </div>

      </div>


      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <div className="users-toolbar">

        <div className="search-box">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search by name, email or phone number..."
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

            <option value="all">
              All Users
            </option>

            <option value="online">
              Online
            </option>

            <option value="offline">
              Offline
            </option>

            <option value="logged out">
              Logged Out
            </option>

          </select>

        </div>

      </div>


      {/* =================================================
          RESULT INFO
      ================================================= */}

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
            Search result for{" "}
            <strong>
              "{search}"
            </strong>
          </span>
        )}

      </div>


      {/* =================================================
          NO USERS
      ================================================= */}

      {filteredUsers.length === 0 ? (

        <div className="no-users">

          <div className="no-users-icon">
            👤
          </div>

          <h2>
            No Users Found
          </h2>

          <p>
            Try changing your search or status filter.
          </p>

          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
            }}
          >
            Clear Filters
          </button>

        </div>

      ) : (

        /* =================================================
           USER CARDS
        ================================================= */

        <div className="users-grid">

          {filteredUsers.map(
            (user, index) => {

              const status =
                user.status ||
                "Offline";

              return (

                <div
                  className="user-card"
                  key={
                    user._id || index
                  }
                >

                  {/* CARD TOP */}

                  <div className="card-top">

                    <div className="user-avatar">

                      {user.profileImage ? (

                        <img
                          src={
                            user.profileImage
                          }
                          alt={
                            user.name
                          }
                        />

                      ) : (

                        <span>
                          {user.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "U"}
                        </span>

                      )}

                      <span
                        className={`online-dot ${getStatusClass(
                          status
                        )}`}
                      ></span>

                    </div>


                    <span
                      className={`status-badge ${getStatusClass(
                        status
                      )}`}
                    >
                      {status}
                    </span>

                  </div>


                  {/* USER DETAILS */}

                  <div className="user-card-content">

                    <h2>
                      {user.name ||
                        "Unknown User"}
                    </h2>

                    <p className="user-email">
                      ✉ {user.email}
                    </p>

                    {user.phone && (
                      <p className="user-phone">
                        ☎ {user.phone}
                      </p>
                    )}


                    <div className="user-meta">

                      <span>
                        Role
                      </span>

                      <strong>
                        {user.role ||
                          "user"}
                      </strong>

                    </div>


                    <div className="user-meta">

                      <span>
                        Joined
                      </span>

                      <strong>
                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </strong>

                    </div>

                  </div>


                  {/* VIEW DETAILS */}

                  <button
                    className="view-details-button"
                    onClick={() =>
                      navigate(
                        `/users/view/${user._id}`
                      )
                    }
                  >

                    View Details

                    <span>
                      →
                    </span>

                  </button>

                </div>

              );
            }
          )}

        </div>

      )}

    </div>
  );
}

export default Users;