import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

import "../styles/Users.css";


const API_URL =
  import.meta.env.VITE_ADMIN_API_URL ||
  "http://localhost:3000";


function Users() {

  const [users, setUsers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [loading, setLoading] =
    useState(true);


  const navigate =
    useNavigate();


  // ==================================================
  // GET USERS
  // ==================================================

  const fetchUsers =
    async () => {

      try {

        const response =
          await axios.get(
            `${API_URL}/admin/users`
          );


        if (
          response.data.success
        ) {

          setUsers(
            response.data.users || []
          );

        }


      } catch (error) {

        console.error(
          "FETCH USERS ERROR:",
          error
        );


      } finally {

        setLoading(false);

      }

    };


  // ==================================================
  // LOAD IMMEDIATELY
  // ==================================================

  useEffect(() => {

    fetchUsers();

  }, []);


  // ==================================================
  // FILTER
  // ==================================================

  const filteredUsers =
    users.filter((user) => {

      const value =
        search
          .toLowerCase()
          .trim();


      const matchesSearch =

        user.name
          ?.toLowerCase()
          .includes(value)

        ||

        user.email
          ?.toLowerCase()
          .includes(value)

        ||

        user.phone
          ?.toLowerCase()
          .includes(value);


      const matchesFilter =

        filter === "all"

        ||

        user.loginStatus ===
          filter;


      return (
        matchesSearch &&
        matchesFilter
      );

    });


  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formatDate =
    (date) => {

      if (!date) {
        return "Never";
      }


      return new Date(
        date
      ).toLocaleString();

    };


  // ==================================================
  // UI
  // ==================================================

  return (

    <div className="users-page">

      <div className="users-header">

        <div>

          <h1>
            Users
          </h1>

          <p>
            Total Users: {users.length}
          </p>

        </div>


        <input

          type="text"

          placeholder="Search name, email, phone..."

          value={search}

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }

        />

      </div>


      <div className="user-filters">

        <button
          onClick={() =>
            setFilter("all")
          }
        >
          All
        </button>


        <button
          onClick={() =>
            setFilter("online")
          }
        >
          🟢 Online
        </button>


        <button
          onClick={() =>
            setFilter("offline")
          }
        >
          ⚪ Offline
        </button>


        <button
          onClick={() =>
            setFilter("logout")
          }
        >
          🔴 Logout
        </button>

      </div>


      {loading ? (

        <h2>
          Loading Users...
        </h2>

      ) : (

        <div className="users-grid">

          {filteredUsers.map(
            (user) => (

              <div
                className="user-card"
                key={user._id}
              >

                <div className="user-image">

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

                    <div className="avatar">

                      {user.name
                        ?.charAt(0)
                        ?.toUpperCase()}

                    </div>

                  )}

                </div>


                <h2>
                  {user.name}
                </h2>


                <p>
                  {user.email}
                </p>


                <span>
                  Type: {user.role}
                </span>


                <p>
                  Phone:{" "}
                  {user.phone || "N/A"}
                </p>


                <p>
                  Status:{" "}
                  {user.loginStatus}
                </p>


                <p>
                  Last Login:
                  <br />

                  {formatDate(
                    user.lastLogin
                  )}

                </p>


                <button
                  onClick={() =>
                    navigate(
                      `/users/view/${user._id}`
                    )
                  }
                >
                  View Details
                </button>

              </div>

            )
          )}

        </div>

      )}

    </div>

  );

}


export default Users;