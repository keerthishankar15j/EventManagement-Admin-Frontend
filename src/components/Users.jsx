import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

import "../styles/Users.css";


/*
=====================================================
ADMIN API
=====================================================
*/

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://api-admin-rouge.vercel.app";


/*
=====================================================
USERS COMPONENT
=====================================================
*/

const Users = () => {

  const navigate =
    useNavigate();


  /*
  ===================================================
  STATE
  ===================================================
  */

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [syncing, setSyncing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");


  /*
  ===================================================
  FETCH USERS
  ===================================================
  */

  const fetchUsers = async () => {

    try {

      setError("");

      const response =
        await axios.get(
          `${API_URL}/admin/users`
        );


      console.log(
        "ADMIN USERS:",
        response.data
      );


      if (
        response.data.success
      ) {

        const usersData =
          Array.isArray(
            response.data.users
          )
            ? response.data.users
            : [];


        setUsers(usersData);

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


  /*
  ===================================================
  INITIAL LOAD
  ===================================================
  
  IMPORTANT:
  Only one API call when page opens.
  
  NO setInterval
  NO polling
  NO 1 second delay
  NO 2 second delay
  
  ===================================================
  */

  useEffect(() => {

    fetchUsers();

  }, []);


  /*
  ===================================================
  AUTO REFRESH WHEN PAGE BECOMES VISIBLE
  ===================================================
  
  If admin changes browser tab and comes back,
  get the latest users.
  
  This is NOT continuous polling.
  
  ===================================================
  */

  useEffect(() => {

    const handleVisibility =
      () => {

        if (
          document.visibilityState ===
          "visible"
        ) {

          fetchUsers();

        }

      };


    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );


    return () => {

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );

    };

  }, []);


  /*
  ===================================================
  MANUAL SYNC
  ===================================================
  */

  const syncUsers = async () => {

    try {

      setSyncing(true);

      setError("");


      const response =
        await axios.post(
          `${API_URL}/admin/sync-users`
        );


      console.log(
        "SYNC USERS:",
        response.data
      );


      if (
        response.data.success
      ) {

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


  /*
  ===================================================
  SEARCH + STATUS FILTER
  ===================================================
  */

  const filteredUsers =
    useMemo(() => {

      const searchValue =
        search
          .trim()
          .toLowerCase();


      return users.filter(
        (user) => {

          /*
          ---------------------------------------------
          Hide Logged Out users
          ---------------------------------------------
          */

          if (
            user.status ===
            "Logged Out"
          ) {

            return false;

          }


          const name =
            user.name
              ?.toLowerCase() ||
            "";


          const email =
            user.email
              ?.toLowerCase() ||
            "";


          const phone =
            String(
              user.phone || ""
            ).toLowerCase();


          /*
          ---------------------------------------------
          Search
          ---------------------------------------------
          */

          const matchesSearch =
            !searchValue ||
            name.includes(
              searchValue
            ) ||
            email.includes(
              searchValue
            ) ||
            phone.includes(
              searchValue
            );


          /*
          ---------------------------------------------
          Status
          ---------------------------------------------
          */

          const matchesStatus =
            statusFilter === "All" ||
            user.status ===
              statusFilter;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      users,
      search,
      statusFilter,
    ]);


  /*
  ===================================================
  GET INITIAL
  ===================================================
  */

  const getInitial = (
    name
  ) => {

    if (!name) {

      return "U";

    }


    return name
      .charAt(0)
      .toUpperCase();

  };


  /*
  ===================================================
  STATUS CLASS
  ===================================================
  */

  const getStatusClass = (
    status
  ) => {

    return status ===
      "Online"
      ? "online"
      : "offline";

  };


  /*
  ===================================================
  VIEW DETAILS
  ===================================================
  */

  const viewDetails = (
    user
  ) => {

    navigate(
      `/users/${user._id}`
    );

  };


  /*
  ===================================================
  LOADING SCREEN
  ===================================================
  */

  if (loading) {

    return (

      <div className="users-page">

        <div className="users-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading users...
          </p>

        </div>

      </div>

    );

  }


  /*
  ===================================================
  MAIN UI
  ===================================================
  */

  return (

    <div className="users-page">


      {/* ============================================
          TOP SECTION
      ============================================ */}

      <div className="users-top">


        <div className="users-heading">

          <span className="heading-small">
            USER MANAGEMENT
          </span>


          <h1>
            Users
          </h1>


          <p>
            View and manage all registered users
          </p>

        </div>


        <button
          className="sync-button"
          onClick={syncUsers}
          disabled={syncing}
        >

          <span className="sync-icon">
            ↻
          </span>


          {syncing
            ? "Syncing..."
            : "Sync Users"}

        </button>

      </div>


      {/* ============================================
          ERROR
      ============================================ */}

      {error && (

        <div className="users-error">

          {error}

        </div>

      )}


      {/* ============================================
          TOOLBAR
      ============================================ */}

      {users.length > 0 && (

        <div className="users-toolbar">


          {/* SEARCH */}

          <div className="search-box">

            <span className="search-icon">
              🔍
            </span>


            <input
              type="text"
              placeholder="Search by name, email or phone number..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />


            {search && (

              <button
                type="button"
                className="clear-search"
                onClick={() =>
                  setSearch("")
                }
              >
                ×
              </button>

            )}

          </div>


          {/* STATUS */}

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

              <option value="All">
                All Users
              </option>


              <option value="Online">
                Online
              </option>


              <option value="Offline">
                Offline
              </option>

            </select>

          </div>

        </div>

      )}


      {/* ============================================
          RESULT COUNT
      ============================================ */}

      {users.length > 0 && (

        <div className="result-info">

          <span>

            Showing{" "}

            <strong>
              {filteredUsers.length}
            </strong>{" "}

            of{" "}

            <strong>
              {
                users.filter(
                  (user) =>
                    user.status !==
                    "Logged Out"
                ).length
              }
            </strong>{" "}

            users

          </span>

        </div>

      )}


      {/* ============================================
          NO USERS
      ============================================ */}

      {users.length === 0 ? (

        <div className="no-users">

          <div className="no-users-icon">
            👥
          </div>


          <h2>
            No Users Found
          </h2>


          <p>
            No users are available yet.
          </p>


          <button
            onClick={syncUsers}
            disabled={syncing}
          >

            {syncing
              ? "Syncing..."
              : "Sync Users"}

          </button>

        </div>

      ) : filteredUsers.length === 0 ? (


        /* ==========================================
           NO SEARCH RESULT
        ========================================== */

        <div className="no-users">

          <div className="no-users-icon">
            🔍
          </div>


          <h2>
            No Matching Users
          </h2>


          <p>
            Try another name, email or phone number.
          </p>


          <button
            onClick={() => {

              setSearch("");

              setStatusFilter("All");

            }}
          >

            Clear Search

          </button>

        </div>


      ) : (


        /* ==========================================
           USER CARDS
        ========================================== */

        <div className="users-grid">

          {filteredUsers.map(
            (user) => {

              const statusClass =
                getStatusClass(
                  user.status
                );


              return (

                <div
                  className="user-card"
                  key={user._id}
                >


                  {/* ================================
                      CARD TOP
                  ================================= */}

                  <div className="card-top">


                    <div className="user-avatar">

                      {user.profileImage ? (

                        <img
                          src={
                            user.profileImage
                          }
                          alt={
                            user.name ||
                            "User"
                          }
                        />

                      ) : (

                        <span>

                          {getInitial(
                            user.name
                          )}

                        </span>

                      )}


                      <span
                        className={`online-dot ${statusClass}`}
                      />

                    </div>


                    <span
                      className={`status-badge ${statusClass}`}
                    >

                      {user.status ===
                      "Online"
                        ? "Online"
                        : "Offline"}

                    </span>

                  </div>


                  {/* ================================
                      CARD CONTENT
                  ================================= */}

                  <div className="user-card-content">


                    <h2>

                      {user.name ||
                        "Unknown User"}

                    </h2>


                    <p className="user-email">

                      ✉{" "}

                      {user.email ||
                        "-"}

                    </p>


                    <p className="user-phone">

                      ☎{" "}

                      {user.phone ||
                        "-"}

                    </p>


                    <div className="user-meta">

                      <span>
                        Role
                      </span>


                      <strong>

                        {user.role ||
                          "user"}

                      </strong>

                    </div>


                    <button
                      type="button"
                      className="view-details-button"
                      onClick={() =>
                        viewDetails(
                          user
                        )
                      }
                    >

                      <span>
                        View Details
                      </span>


                      <span>
                        →
                      </span>

                    </button>

                  </div>

                </div>

              );

            }
          )}

        </div>

      )}

    </div>

  );

};


export default Users;