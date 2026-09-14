import React, { useEffect, useState } from "react";
import axios from "axios";

const ADMIN_API_URL =
  "https://api-admin-rouge.vercel.app";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // GET USERS FROM ADMIN DB
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
  // MANUAL SYNC USERS
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
        // Fetch latest users after sync
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
  // FETCH ONLY ON PAGE LOAD
  // =========================
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div
      style={{
        padding: "30px",
        width: "100%",
      }}
    >
      {/* =========================
          HEADER
      ========================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h2>Users</h2>

        <button
          onClick={syncUsers}
          disabled={syncing}
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: "6px",
            cursor: syncing
              ? "not-allowed"
              : "pointer",
          }}
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
        <div
          style={{
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "6px",
          }}
        >
          {error}
        </div>
      )}

      {/* =========================
          LOADING
      ========================= */}
      {loading ? (
        <div>Loading users...</div>
      ) : users.length === 0 ? (
        <div>No users found.</div>
      ) : (
        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                  }}
                >
                  Name
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                  }}
                >
                  Email
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                  }}
                >
                  Phone
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                  }}
                >
                  Role
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td
                    style={{
                      padding: "12px",
                    }}
                  >
                    {user.name || "-"}
                  </td>

                  <td
                    style={{
                      padding: "12px",
                    }}
                  >
                    {user.email || "-"}
                  </td>

                  <td
                    style={{
                      padding: "12px",
                    }}
                  >
                    {user.phone || "-"}
                  </td>

                  <td
                    style={{
                      padding: "12px",
                    }}
                  >
                    {user.role || "user"}
                  </td>

                  <td
                    style={{
                      padding: "12px",
                    }}
                  >
                    {user.status || "Offline"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;