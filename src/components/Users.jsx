import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Users.css";


function Users() {

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [syncing, setSyncing] =
    useState(false);

  const [error, setError] =
    useState("");


  // =====================================================
  // GET USERS FROM ADMIN DATABASE
  // =====================================================

  const fetchUsers = async () => {

    try {

      setLoading(true);

      setError("");


      const response =
        await axios.get(
          "http://localhost:3000/admin/users"
        );


      console.log(
        "Admin Users:",
        response.data
      );


      if (
        response.data.success
      ) {

        setUsers(
          response.data.users || []
        );

      } else {

        setError(
          response.data.message ||
          "Unable to get users"
        );

      }

    } catch (error) {

      console.error(
        "Fetch Users Error:",
        error
      );


      setError(
        error.response?.data?.message ||
        "Unable to connect to admin server"
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


      const response =
        await axios.post(
          "http://localhost:3000/admin/sync-users"
        );


      console.log(
        "Sync Response:",
        response.data
      );


      if (
        response.data.success
      ) {

        alert(
          `Users synchronized successfully!\n\nTotal: ${response.data.total}\nNew: ${response.data.inserted}\nUpdated: ${response.data.updated}`
        );


        // Refresh admin DB users
        await fetchUsers();

      } else {

        alert(
          response.data.message ||
          "Sync failed"
        );

      }

    } catch (error) {

      console.error(
        "Sync Error:",
        error
      );


      alert(
        error.response?.data?.message ||
        "Unable to synchronize users"
      );

    } finally {

      setSyncing(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchUsers();

  }, []);


  return (

    <div className="users-page">

      <div className="users-header">

        <div>

          <h1>
            All Users
          </h1>

          <p>
            Manage Event Management users
          </p>

        </div>


        <button
          className="sync-btn"
          onClick={syncUsers}
          disabled={syncing}
        >

          {syncing
            ? "Syncing..."
            : "Sync Users"}

        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="error-box">

          {error}

        </div>

      )}


      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (

        <div className="loading">

          Loading users...

        </div>

      ) : users.length === 0 ? (

        <div className="empty-box">

          <h2>
            No Users Found
          </h2>

          <p>
            Click "Sync Users" to get
            users from the User Project.
          </p>

        </div>

      ) : (

        <div className="users-grid">

          {users.map(
            (user, index) => (

              <div
                className="user-card"
                key={
                  user._id || index
                }
              >

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
                        ?.toUpperCase() || "U"}

                    </span>

                  )}

                </div>


                <div className="user-info">

                  <h2>
                    {user.name}
                  </h2>

                  <p>
                    {user.email}
                  </p>

                  {user.phone && (

                    <p>
                      📱 {user.phone}
                    </p>

                  )}


                  <span
                    className={`role ${
                      user.role ||
                      "user"
                    }`}
                  >

                    {user.role ||
                      "user"}

                  </span>

                </div>


                <div className="user-date">

                  Joined:{" "}

                  {user.createdAt
                    ? new Date(
                        user.createdAt
                      ).toLocaleDateString()
                    : "N/A"}

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>

  );

}


export default Users;