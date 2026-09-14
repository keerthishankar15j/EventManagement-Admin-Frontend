import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Users.css";

const ADMIN_API_URL =
  "https://api-admin-rouge.vercel.app";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // GET USERS
  // =========================
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
        setUsers(response.data.users || []);
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

  // =========================
  // MANUAL SYNC
  // =========================
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

  // =========================
  // LOAD USERS ONLY ONCE
  // =========================
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="users-page">

      {/* =========================
          HEADER
      ========================= */}
      <div className="users-header">
        <h2 className="users-title">
          Users
        </h2>

        <button
          className="sync-users-btn"
          onClick={syncUsers}
          disabled={syncing}
        >
          {syncing
            ? "Syncing..."
            : "Sync Users"}
        </button>
      </div>

      {/* =========================
          ERROR
      ========================= */}
      {error && (
        <div className="users-error">
          {error}
        </div>
      )}

      {/* =========================
          CONTENT
      ========================= */}
      <div className="users-table-container">

        {loading ? (
          <div className="users-loading">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="users-empty">
            No users found.
          </div>
        ) : (
          <table className="users-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>

                  <td>
                    {user.name || "-"}
                  </td>

                  <td>
                    {user.email || "-"}
                  </td>

                  <td>
                    {user.phone || "-"}
                  </td>

                  <td>
                    {user.role || "user"}
                  </td>

                  <td>
                    <span
                      className={`user-status ${
                        user.status === "Online"
                          ? "online"
                          : "offline"
                      }`}
                    >
                      {user.status ||
                        "Offline"}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>
    </div>
  );
};

export default Users;