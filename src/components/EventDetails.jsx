import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import axios from "axios";

import "../styles/UserViewDetails.css";


const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://api-admin-rouge.vercel.app"
).replace(/\/+$/, "");


const UserViewDetails = () => {

  const { id } =
    useParams();

  const navigate =
    useNavigate();


  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const fetchUser = async () => {

      try {

        setLoading(true);

        setError("");


        const response =
          await axios.get(
            `${API_URL}/admin/users/${id}`
          );


        console.log(
          "USER DETAILS:",
          response.data
        );


        if (
          response.data?.success
        ) {

          setUser(
            response.data.user
          );

        } else {

          setError(
            response.data?.message ||
            "User not found"
          );

        }

      } catch (err) {

        console.error(
          "FETCH USER DETAILS ERROR:",
          err
        );


        setError(
          err.response?.data?.message ||
          "Failed to fetch user details"
        );

      } finally {

        setLoading(false);

      }

    };


    if (id) {

      fetchUser();

    }

  }, [id]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="user-details-page">

        <div className="users-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading user details...
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error || !user) {

    return (

      <div className="user-details-page">

        <div className="no-users">

          <div className="no-users-icon">
            👤
          </div>

          <h2>
            User Not Found
          </h2>

          <p>
            {error ||
              "The user does not exist."}
          </p>


          <button
            type="button"
            onClick={() =>
              navigate("/users")
            }
          >
            ← Back to Users
          </button>

        </div>

      </div>

    );

  }


  // =====================================================
  // MAIN
  // =====================================================

  return (

    <div className="user-details-page">


      {/* BACK */}

      <button
        type="button"
        className="details-back-btn"
        onClick={() =>
          navigate("/users")
        }
      >
        ← Back to Users
      </button>


      {/* HEADER */}

      <div className="user-details-header">

        <span className="details-label">
          USER DETAILS
        </span>

        <h1>
          {user.name ||
            "Unknown User"}
        </h1>

        <p>
          View complete information about this user.
        </p>

      </div>


      {/* CARD */}

      <div className="user-details-card">


        {/* PROFILE */}

        <div className="user-details-profile">

          <div className="user-details-avatar">

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

                {user.name
                  ?.charAt(0)
                  ?.toUpperCase() ||
                  "U"}

              </span>

            )}

          </div>


          <h2>
            {user.name ||
              "Unknown User"}
          </h2>


          <span
            className={
              user.status ===
              "Online"
                ? "status-badge online"
                : "status-badge offline"
            }
          >
            {user.status ===
            "Online"
              ? "Online"
              : "Offline"}
          </span>

        </div>


        {/* INFORMATION */}

        <div className="user-details-info">


          <div className="user-info-box">

            <small>
              NAME
            </small>

            <strong>
              {user.name || "-"}
            </strong>

          </div>


          <div className="user-info-box">

            <small>
              EMAIL
            </small>

            <strong>
              {user.email || "-"}
            </strong>

          </div>


          <div className="user-info-box">

            <small>
              PHONE
            </small>

            <strong>
              {user.phone || "-"}
            </strong>

          </div>


          <div className="user-info-box">

            <small>
              ROLE
            </small>

            <strong>
              {user.role || "user"}
            </strong>

          </div>


          <div className="user-info-box">

            <small>
              STATUS
            </small>

            <strong>
              {user.status || "Offline"}
            </strong>

          </div>


          <div className="user-info-box">

            <small>
              SOURCE
            </small>

            <strong>
              {user.source || "user-project"}
            </strong>

          </div>


        </div>


        {/* BIO */}

        <div className="user-details-bio">

          <h3>
            Bio
          </h3>

          <p>
            {user.bio ||
              "No bio available."}
          </p>

        </div>


        {/* BUTTON */}

        <div className="user-details-actions">

          <button
            type="button"
            onClick={() =>
              navigate("/users")
            }
          >
            ← Back to Users
          </button>

        </div>


      </div>

    </div>

  );

};


export default UserViewDetails;