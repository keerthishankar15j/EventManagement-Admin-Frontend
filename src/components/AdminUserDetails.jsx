import React from "react";
import "./AdminUserDetails.css";

function AdminUserDetails({
  user,
  loginHistory,
  onBack,
}) {

  // ==========================================
  // USER LOGIN HISTORY
  // ==========================================
  const userHistory = loginHistory
    .filter(
      (item) =>
        String(item.userId) ===
        String(user._id)
    )
    .sort(
      (a, b) =>
        new Date(b.loginTime) -
        new Date(a.loginTime)
    );

  // ==========================================
  // CURRENT STATUS
  // ==========================================
  const latestHistory =
    userHistory.length > 0
      ? userHistory[0]
      : null;

  const isOnline =
    latestHistory?.status === "Active";

  // ==========================================
  // DATE FORMAT
  // ==========================================
  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        dateStyle: "full",
        timeStyle: "short",
      }
    );
  };

  // ==========================================
  // JOINED DATE
  // ==========================================
  const joinedDate =
    user.createdAt
      ? formatDate(user.createdAt)
      : "Not available";

  // ==========================================
  // LAST LOGIN
  // ==========================================
  const lastLogin =
    latestHistory?.loginTime
      ? formatDate(
          latestHistory.loginTime
        )
      : "Never logged in";

  // ==========================================
  // LAST LOGOUT
  // ==========================================
  const lastLogout =
    latestHistory?.logoutTime
      ? formatDate(
          latestHistory.logoutTime
        )
      : isOnline
      ? "Currently online"
      : "Not available";

  return (
    <div className="user-details-page">

      {/* =====================================
          TOP HEADER
      ===================================== */}

      <div className="details-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to Users
        </button>

        <div className="details-heading">
          <p>USER PROFILE</p>
          <h1>
            User Details
          </h1>
        </div>

      </div>

      {/* =====================================
          PROFILE HERO
      ===================================== */}

      <div className="profile-hero">

        <div className="large-profile-wrapper">

          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="large-profile-image"
            />
          ) : (
            <div className="large-default-avatar">
              {user.name
                ?.charAt(0)
                .toUpperCase()}
            </div>
          )}

          <span
            className={
              isOnline
                ? "large-status-dot online"
                : "large-status-dot offline"
            }
          ></span>

        </div>

        <div className="profile-hero-info">

          <div className="name-line">

            <h2>
              {user.name}
            </h2>

            <span
              className={
                isOnline
                  ? "large-status-badge online"
                  : "large-status-badge offline"
              }
            >
              {isOnline
                ? "● Online"
                : "● Offline"}
            </span>

          </div>

          <p className="profile-email">
            {user.email}
          </p>

          <span className="profile-role">
            {user.role || "user"}
          </span>

        </div>

      </div>

      {/* =====================================
          INFORMATION GRID
      ===================================== */}

      <div className="details-section">

        <div className="section-title">
          <span></span>
          <h2>
            Personal Information
          </h2>
        </div>

        <div className="details-grid">

          {/* NAME */}
          <div className="info-box">
            <span className="info-icon">
              👤
            </span>

            <div>
              <small>
                Full Name
              </small>

              <strong>
                {user.name ||
                  "Not available"}
              </strong>
            </div>
          </div>

          {/* EMAIL */}
          <div className="info-box">
            <span className="info-icon">
              ✉
            </span>

            <div>
              <small>
                Email Address
              </small>

              <strong>
                {user.email ||
                  "Not available"}
              </strong>
            </div>
          </div>

          {/* PHONE */}
          <div className="info-box">
            <span className="info-icon">
              ☎
            </span>

            <div>
              <small>
                Phone Number
              </small>

              <strong>
                {user.phone ||
                  "Not available"}
              </strong>
            </div>
          </div>

          {/* ROLE */}
          <div className="info-box">
            <span className="info-icon">
              🛡
            </span>

            <div>
              <small>
                Account Role
              </small>

              <strong>
                {user.role ||
                  "user"}
              </strong>
            </div>
          </div>

          {/* JOINED DATE */}
          <div className="info-box">
            <span className="info-icon">
              📅
            </span>

            <div>
              <small>
                Joined Date
              </small>

              <strong>
                {joinedDate}
              </strong>
            </div>
          </div>

          {/* USER ID */}
          <div className="info-box">
            <span className="info-icon">
              🆔
            </span>

            <div>
              <small>
                User ID
              </small>

              <strong className="user-id">
                {user._id}
              </strong>
            </div>
          </div>

        </div>

      </div>

      {/* =====================================
          BIO
      ===================================== */}

      <div className="details-section">

        <div className="section-title">
          <span></span>
          <h2>
            About User
          </h2>
        </div>

        <div className="bio-box">

          <p>
            {user.bio
              ? user.bio
              : "This user has not added a bio yet."}
          </p>

        </div>

      </div>

      {/* =====================================
          LOGIN INFORMATION
      ===================================== */}

      <div className="details-section">

        <div className="section-title">
          <span></span>
          <h2>
            Login Information
          </h2>
        </div>

        <div className="login-summary">

          <div className="login-box">
            <span>Current Status</span>

            <strong
              className={
                isOnline
                  ? "text-online"
                  : "text-offline"
              }
            >
              {isOnline
                ? "Online"
                : "Offline"}
            </strong>
          </div>

          <div className="login-box">
            <span>Last Login</span>

            <strong>
              {lastLogin}
            </strong>
          </div>

          <div className="login-box">
            <span>Last Logout</span>

            <strong>
              {lastLogout}
            </strong>
          </div>

          <div className="login-box">
            <span>Total Sessions</span>

            <strong>
              {userHistory.length}
            </strong>
          </div>

        </div>

      </div>

      {/* =====================================
          LOGIN HISTORY
      ===================================== */}

      <div className="details-section">

        <div className="section-title">
          <span></span>
          <h2>
            Login History
          </h2>
        </div>

        {userHistory.length > 0 ? (

          <div className="history-table-wrapper">

            <table className="history-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Login Time</th>
                  <th>Logout Time</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {userHistory.map(
                  (history, index) => (

                    <tr key={history._id}>

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        {formatDate(
                          history.loginTime
                        )}
                      </td>

                      <td>
                        {history.logoutTime
                          ? formatDate(
                              history.logoutTime
                            )
                          : "-"}
                      </td>

                      <td>

                        <span
                          className={
                            history.status ===
                            "Active"
                              ? "history-status active"
                              : "history-status logged-out"
                          }
                        >
                          {history.status}
                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="no-history">
            <span>🕒</span>
            <p>
              No login history available
            </p>
          </div>

        )}

      </div>

    </div>
  );
}

export default AdminUserDetails;