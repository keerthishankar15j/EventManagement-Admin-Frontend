import React, { useEffect, useState } from "react";
import "../styles/Userlogin.css";

// =====================================================
// YOUR ADMIN BACKEND API
// =====================================================

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000"
).replace(/\/+$/, "");

// =====================================================
// ADMIN USERS PAGE
// =====================================================

const Admin_users = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // ===================================================
  // GET USER DATA
  // ===================================================

  const fetchUsers = async () => {

    try {

      setLoading(true);
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
      // IMPORTANT
      // API RESPONSE:
      //
      // result.data.users
      //
      // NOT:
      //
      // result.data
      // =================================================

      if (result.success) {

        const userList =
          Array.isArray(result.data?.users)
            ? result.data.users
            : Array.isArray(result.data)
            ? result.data
            : [];

        console.log(
          "Users received:",
          userList
        );

        setUsers(userList);

      } else {

        setError(
          result.message ||
          "Unable to fetch user details"
        );

      }

    } catch (error) {

      console.error(
        "Login Activity Error:",
        error
      );

      setError(
        "Unable to connect to the admin server"
      );

    } finally {

      setLoading(false);

    }

  };

  // ===================================================
  // FIRST LOAD
  // ===================================================

  useEffect(() => {

    fetchUsers();

  }, []);

  // ===================================================
  // AUTO REFRESH EVERY 10 SECONDS
  // ===================================================

  useEffect(() => {

    const interval = setInterval(() => {

      fetchUsers();

    }, 10000);

    return () => clearInterval(interval);

  }, []);

  // ===================================================
  // FORMAT DATE
  // ===================================================

  const formatDate = (date) => {

    if (!date) {
      return "Not available";
    }

    try {

      const formattedDate =
        new Date(date).toLocaleString(
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

      return formattedDate;

    } catch (error) {

      return "Invalid date";

    }

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
          user.userId ||
          user.id ||
          ""
        )
          .toLowerCase()
          .includes(searchText)

        ||

        String(
          user._id ||
          user.id ||
          ""
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
  // LOADING
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

      {/* ============================================
          HEADER
      ============================================ */}

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

        <button
          className="refresh-btn"
          onClick={fetchUsers}
        >
          ↻ Refresh
        </button>

      </div>

      {/* ============================================
          ERROR
      ============================================ */}

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

      {/* ============================================
          STATISTICS
      ============================================ */}

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

      {/* ============================================
          SEARCH
      ============================================ */}

      <div className="users-toolbar">

        <div className="search-box">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search name, email, ID or status..."
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

      {/* ============================================
          TABLE
      ============================================ */}

      <div className="users-table-container">

        <table className="users-table">

          <thead>

            <tr>

              <th>
                #
              </th>

              <th>
                User
              </th>

              <th>
                User ID
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
                  colSpan="9"
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
                (user, index) => {

                  // =================================
                  // SUPPORT BOTH id AND _id
                  // =================================

                  const userId =
                    user.userId ||
                    user.id ||
                    user._id ||
                    "N/A";

                  return (

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

                      {/* USER ID */}

                      <td>

                        <span className="id-text">

                          {userId}

                        </span>

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

                        {formatDate(
                          user.createdAt
                        )}

                      </td>

                      {/* UPDATED */}

                      <td>

                        {formatDate(
                          user.updatedAt
                        )}

                      </td>

                    </tr>

                  );

                }

              )

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default Admin_users;