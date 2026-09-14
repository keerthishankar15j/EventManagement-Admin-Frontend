import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import "../styles/UserViewDetails.css";

function UserViewDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // GET SINGLE USER
  // =====================================================

  const fetchUser = async () => {

    try {

      setLoading(true);

      const response =
        await axios.get(
          `http://localhost:3000/admin/users/${id}`
        );

      console.log(
        "USER DETAILS:",
        response.data
      );

      if (response.data.success) {

        setUser(
          response.data.user
        );

      }

    } catch (error) {

      console.error(
        "USER DETAILS ERROR:",
        error
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchUser();

  }, [id]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="details-loading">

        <div className="details-spinner"></div>

        <p>
          Loading user details...
        </p>

      </div>

    );

  }

  // =====================================================
  // USER NOT FOUND
  // =====================================================

  if (!user) {

    return (

      <div className="details-not-found">

        <div className="not-found-icon">
          👤
        </div>

        <h2>
          User Not Found
        </h2>

        <p>
          The requested user could not be found.
        </p>

        <button
          onClick={() =>
            navigate("/users")
          }
        >
          ← Back to Users
        </button>

      </div>

    );

  }

  // =====================================================
  // STATUS
  // =====================================================

  const status =
    user.status || "Offline";

  const statusClass =
    status.toLowerCase() === "online"
      ? "online"
      : status.toLowerCase() ===
        "logged out"
      ? "logged-out"
      : "offline";

  // =====================================================
  // JSX
  // =====================================================

  return (

    <div className="user-details-page">

      {/* =================================================
          TOP
      ================================================= */}

      <div className="details-top">

        <button
          className="back-button"
          onClick={() =>
            navigate("/users")
          }
        >
          ← Back to Users
        </button>

        <span>
          User Details
        </span>

      </div>


      {/* =================================================
          PROFILE HEADER
      ================================================= */}

      <div className="profile-header">

        <div className="profile-avatar">

          {user.profileImage ? (

            <img
              src={user.profileImage}
              alt={user.name}
            />

          ) : (

            <span>
              {user.name
                ?.charAt(0)
                ?.toUpperCase() ||
                "U"}
            </span>

          )}

          <div
            className={`profile-status-dot ${statusClass}`}
          ></div>

        </div>


        <div className="profile-main">

          <div className="profile-name-row">

            <h1>
              {user.name ||
                "Unknown User"}
            </h1>

            <span
              className={`profile-status ${statusClass}`}
            >
              {status}
            </span>

          </div>

          <p>
            {user.email}
          </p>

          <span className="profile-role">
            {user.role || "user"}
          </span>

        </div>

      </div>


      {/* =================================================
          INFORMATION GRID
      ================================================= */}

      <div className="details-grid">

        {/* PERSONAL INFORMATION */}

        <div className="details-card">

          <div className="details-card-title">
            <span>
              👤
            </span>

            <h2>
              Personal Information
            </h2>
          </div>

          <div className="information-list">

            <div className="information-row">

              <span>
                Full Name
              </span>

              <strong>
                {user.name || "N/A"}
              </strong>

            </div>


            <div className="information-row">

              <span>
                Email Address
              </span>

              <strong>
                {user.email || "N/A"}
              </strong>

            </div>


            <div className="information-row">

              <span>
                Phone Number
              </span>

              <strong>
                {user.phone || "Not Provided"}
              </strong>

            </div>


            <div className="information-row">

              <span>
                Role
              </span>

              <strong className="capitalize">
                {user.role || "user"}
              </strong>

            </div>

          </div>

        </div>


        {/* ACCOUNT INFORMATION */}

        <div className="details-card">

          <div className="details-card-title">

            <span>
              🔐
            </span>

            <h2>
              Account Information
            </h2>

          </div>


          <div className="information-list">

            <div className="information-row">

              <span>
                Account Status
              </span>

              <strong
                className={`account-status ${statusClass}`}
              >
                {status}
              </strong>

            </div>


            <div className="information-row">

              <span>
                User ID
              </span>

              <strong className="user-id">
                {user.sourceUserId ||
                  user._id ||
                  "N/A"}
              </strong>

            </div>


            <div className="information-row">

              <span>
                Registered On
              </span>

              <strong>
                {user.createdAt
                  ? new Date(
                      user.createdAt
                    ).toLocaleString()
                  : "N/A"}
              </strong>

            </div>


            <div className="information-row">

              <span>
                Last Updated
              </span>

              <strong>
                {user.updatedAt
                  ? new Date(
                      user.updatedAt
                    ).toLocaleString()
                  : "N/A"}
              </strong>

            </div>

          </div>

        </div>


        {/* BIO */}

        <div className="details-card bio-card">

          <div className="details-card-title">

            <span>
              📝
            </span>

            <h2>
              About User
            </h2>

          </div>


          <div className="bio-content">

            {user.bio ? (
              <p>
                {user.bio}
              </p>
            ) : (
              <p className="no-bio">
                No bio has been provided by this user.
              </p>
            )}

          </div>

        </div>


        {/* PROFILE IMAGE */}

        {user.profileImage && (

          <div className="details-card">

            <div className="details-card-title">

              <span>
                🖼
              </span>

              <h2>
                Profile Image
              </h2>

            </div>

            <div className="large-profile-image">

              <img
                src={user.profileImage}
                alt={user.name}
              />

            </div>

          </div>

        )}

      </div>


      {/* =================================================
          BOTTOM BUTTON
      ================================================= */}

      <div className="details-footer">

        <button
          className="footer-back-button"
          onClick={() =>
            navigate("/users")
          }
        >
          ← Back to All Users
        </button>

      </div>

    </div>

  );
}

export default UserViewDetails;