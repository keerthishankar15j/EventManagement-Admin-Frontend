import React, {
  useEffect,
  useState,
} from "react";

import {
  getLoginHistory,
} from "../api/loginHistoryApi";

import "./LoginHistory.css";

const LoginHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getLoginHistory();

      if (response.success) {
        setHistory(
          response.history || []
        );
      } else {
        setError(
          response.message ||
            "Failed to load login history"
        );
      }
    } catch (error) {
      console.error(
        "Login History Error:",
        error
      );

      setError(
        "Unable to load login history"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDateTime = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
    );
  };

  return (
    <div className="login-history-page">

      <div className="login-history-header">

        <div>
          <h1>Login History</h1>

          <p>
            User login and logout activity
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={loadHistory}
        >
          Refresh
        </button>

      </div>

      {loading && (
        <div className="loading">
          Loading...
        </div>
      )}

      {error && !loading && (
        <div className="error">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Login Time</th>
                <th>Logout Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {history.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="no-data"
                  >
                    No login history found
                  </td>
                </tr>
              ) : (
                history.map(
                  (item, index) => (
                    <tr key={item._id}>

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        {item.name}
                      </td>

                      <td>
                        {item.email}
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
                            item.status ===
                            "Active"
                              ? "active-status"
                              : "logout-status"
                          }
                        >
                          {item.status}
                        </span>
                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
};

export default LoginHistory;