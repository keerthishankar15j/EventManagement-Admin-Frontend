import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/UserViewDetails.css";

function UserViewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ADMIN_API_URL =
    import.meta.env.VITE_ADMIN_API_URL ||
    "http://localhost:3000";

  const getUser = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${ADMIN_API_URL}/admin/users/${id}`
      );

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        setError("User not found");
      }
    } catch (error) {
      console.error(
        "GET USER DETAILS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load user details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [id]);

  if (loading) {
    return (
      <div className="user-details-loading">
        <div className="loader"></div>
        <p>Loading user details...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="user-details-error">
        <h2>User Not Found</h2>

        <p>
          {error || "This user does not exist."}
        </p>

        <button
          onClick={() => navigate("/users")}
        >
          ← Back to Users
        </button>
      </div>
    );
  }

  const isOnline =
    user.status === "online";

  const firstLetter =
    user.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="user-view-page">

      {/* BACK */}
      <button
        className="back-users-btn"
        onClick={() => navigate("/users")}
      >
        ← Back to Users
      </button>


      {/* HEADER */}
      <div className="user-view-header">

        <div>
          <span>User Profile</span>

          <h1>User Details</h1>
        </div>

        <div
          className={
            isOnline
              ? "large-status online-status"
              : "large-status offline-status"
          }
        >
          <i></i>

          {isOnline
            ? "Online"
            : "Offline"}
        </div>

      </div>


      {/* PROFILE CARD */}
      <div className="profile-card">

        {/* PROFILE */}
        <div className="profile-top">

          <div className="large-avatar">

            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
              />
            ) : (
              firstLetter
            )}

          </div>

          <div className="profile-name">

            <h2>
              {user.name}
            </h2>

            <span>
              {user.role || "user"}
            </span>

            <p>
              {user.email}
            </p>

          </div>

        </div>


        {/* DETAILS */}
        <div className="profile-details">

          <div className="profile-detail">
            <span>FULL NAME</span>
            <strong>
              {user.name || "-"}
            </strong>
          </div>


          <div className="profile-detail">
            <span>EMAIL ADDRESS</span>
            <strong>
              {user.email || "-"}
            </strong>
          </div>


          <div className="profile-detail">
            <span>PHONE NUMBER</span>
            <strong>
              {user.phone || "Not provided"}
            </strong>
          </div>


          <div className="profile-detail">
            <span>ROLE</span>
            <strong>
              {user.role || "user"}
            </strong>
          </div>


          <div className="profile-detail">
            <span>STATUS</span>
            <strong
              className={
                isOnline
                  ? "detail-online"
                  : "detail-offline"
              }
            >
              {isOnline
                ? "Online"
                : "Offline"}
            </strong>
          </div>


          <div className="profile-detail">
            <span>JOINED DATE</span>

            <strong>
              {user.createdAt
                ? new Date(
                    user.createdAt
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )
                : "-"}
            </strong>
          </div>

        </div>


        {/* BIO */}
        <div className="profile-bio">

          <span>BIO</span>

          <p>
            {user.bio ||
              "No bio information available."}
          </p>

        </div>

      </div>

    </div>
  );
}

export default UserViewDetails;