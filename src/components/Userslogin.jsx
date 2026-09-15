import React, { useEffect, useState } from "react";
import "../styles/Userlogin.css";

// =====================================================
// ADMIN BACKEND API
// =====================================================

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://api-admin-rouge.vercel.app"
).replace(/\/+$/, "");

// =====================================================
// ADMIN USERS PAGE
// =====================================================

const Admin_users = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // ===================================================
  // GET USER DATA
  // ===================================================

  const fetchUsers = async (initialLoad = false) => {

    try {

      // First page load only
      if (initialLoad) {
        setLoading(true);
      }

      // Manual refresh only
      if (!initialLoad) {
        setRefreshing(true);
      }

      setError("");

      const response = await fetch(
        `${API_URL}/login-activity/users`
      );

      if (!response.ok) {
        throw new Error(
          `Server Error: ${response.status}`
        );
      }

      const result = await response.json();

      console.log(
        "Login Activity Response:",
        result
      );

      // =================================================
      // GET USERS ARRAY
      // =================================================

      let userList = [];

      if (
        result.success &&
        Array.isArray(result.data?.users)
      ) {
        userList = result.data.users;
      } 
      else if (
        result.success &&
        Array.isArray(result.data)
      ) {
        userList = result.data;
      }

      console.log(
        "Users received:",
        userList
      );

      setUsers(userList);

    } catch (error) {

      console.error(
        "Login Activity Error:",
        error
      );

      setError(
        "Unable to connect to the admin server"
      );

    } finally {

      if (initialLoad) {
        setLoading(false);
      }

      setRefreshing(false);

    }

  };

  // ===================================================
  // LOAD USERS ONLY ONCE
  // ===================================================

  useEffect(() => {

    console.log(
      "USERS PAGE: Initial API call"
    );

    fetchUsers(true);

    // IMPORTANT:
    // NO setInterval()
    // NO automatic refresh

  }, []);

  // ===================================================
  // FORMAT DATE
  // ===================================================

  const formatDate = (date) => {

    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }
    );

  };

  // ===================================================
  // SEARCH
  // ===================================================

  const filteredUsers = users.filter(
    (user) => {

      const searchText =
        search.toLowerCase().trim();

      return (

        String(
          user.name || ""
        )
          .toLowerCase()
          .includes(searchText)

        ||

        String(
          user.email || ""
        )
          .toLowerCase()
          .includes(searchText)

        ||

        String(
          user.status || ""
        )
          .toLowerCase()
          .includes(searchText)

      );

    }
  );

  // ===================================================
  // STATISTICS
  // ===================================================

  const totalRecords =
    users.length;

  const activeUsers =
    users.filter(
      (user) =>
        String(
          user.status || ""
        ).toLowerCase() === "active"
    ).length;

  const loggedOutUsers =
    users.filter(
      (user) =>
        user.logoutTime
    ).length;

  // ===================================================
  // INITIAL LOADING
  // ===================================================

  if (loading) {

    return (

      <div className="users-page">

        <div className="users-loading">

          <div className="loading-spinner"></div>

          <h3>
            Loading User Activity...
          </h3>

          <p>
            Fetching user details
          </p>

        </div>

      </div>

    );

  }

  // ===================================================
  // MAIN PAGE
  // ===================================================

  return (

    <div className="users-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="users-header">

        <div>

          <span className="users-label">
            USER MANAGEMENT
          </span>

          <h1>
            Login Activity
          </h1>

          <p>
            Monitor user login and logout
            activity from the event management
            system.
          </p>

        </div>

        {/* =================================================
            MANUAL REFRESH
        ================================================= */}

        <button
          type="button"
          className="refresh-btn"
          onClick={() => fetchUsers(false)}
          disabled={refreshing}
        >

          {refreshing
            ? "↻ Refreshing..."
            : "↻ Refresh"}

        </button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="users-error">

          <span>
            ⚠
          </span>

          <div>

            <strong>
              Unable to load users
            </strong>

            <p>
              {error}
            </p>

          </div>

        </div>

      )}

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="users-stats">

        {/* TOTAL */}

        <div className="stat-card">

          <div className="stat-icon">
            👥
          </div>

          <div>

            <span>
              Total Records
            </span>

            <strong>
              {totalRecords}
            </strong>

          </div>

        </div>


        {/* ACTIVE */}

        <div className="stat-card">

          <div className="stat-icon">
            ●
          </div>

          <div>

            <span>
              Active Users
            </span>

            <strong>
              {activeUsers}
            </strong>

          </div>

        </div>


        {/* LOGGED OUT */}

        <div className="stat-card">

          <div className="stat-icon">
            ✓
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

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="users-toolbar">

        <div className="search-box">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search name, email or status..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="record-count">

          Showing{" "}

          <strong>
            {filteredUsers.length}
          </strong>

          {" "}of{" "}

          <strong>
            {users.length}
          </strong>

        </div>

      </div>

      {/* =================================================
          USERS TABLE
      ================================================= */}

      <div className="users-table-container">

        <table className="users-table">

          <thead>

            <tr>

              <th>
                S NO
              </th>

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

              <th>
                Created At
              </th>

              <th>
                Updated At
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredUsers.length === 0 ? (

              <tr>

                <td
                  colSpan="8"
                  className="empty-table"
                >

                  <div>
                    🔍
                  </div>

                  <strong>
                    No user records found
                  </strong>

                  <p>
                    Try changing your search.
                  </p>

                </td>

              </tr>

            ) : (

              filteredUsers.map(
                (user, index) => (

                  <tr
                    key={
                      user.id ||
                      user._id ||
                      index
                    }
                  >

                    {/* NUMBER */}

                    <td>
                      {index + 1}
                    </td>


                    {/* USER */}

                    <td>

                      <div className="user-info">

                        <div className="user-avatar">

                          {String(
                            user.name ||
                            "U"
                          )
                            .charAt(0)
                            .toUpperCase()}

                        </div>

                        <div>

                          <strong>
                            {user.name ||
                              "Unknown User"}
                          </strong>

                          <span>
                            {user.email ||
                              "No email"}
                          </span>

                        </div>

                      </div>

                    </td>


                    {/* EMAIL */}

                    <td>

                      <span className="date-text">

                        {user.email ||
                          "No email"}

                      </span>

                    </td>


                    {/* LOGIN TIME */}

                    <td>

                      <span className="date-text">

                        {formatDate(
                          user.loginTime
                        )}

                      </span>

                    </td>


                    {/* LOGOUT TIME */}

                    <td>

                      <span className="date-text">

                        {user.logoutTime
                          ? formatDate(
                              user.logoutTime
                            )
                          : "Not logged out"}

                      </span>

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={`status-badge ${
                          String(
                            user.status || ""
                          ).toLowerCase() ===
                          "active"
                            ? "active"
                            : "inactive"
                        }`}
                      >

                        <span className="status-dot">
                        </span>

                        {user.status ||
                          "Not available"}

                      </span>

                    </td>


                    {/* CREATED */}

                    <td>

                      <span className="date-text">

                        {formatDate(
                          user.createdAt
                        )}

                      </span>

                    </td>


                    {/* UPDATED */}

                    <td>

                      <span className="date-text">

                        {formatDate(
                          user.updatedAt
                        )}

                      </span>

                    </td>

                  </tr>

                )

              )

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default Admin_users;