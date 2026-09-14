import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
  useParams,
} from "react-router-dom";


const API_URL =
  import.meta.env.VITE_ADMIN_API_URL ||
  "http://localhost:3000";


function UserViewDetails() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();


  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    const fetchUser =
      async () => {

        try {

          const response =
            await axios.get(
              `${API_URL}/admin/users/${id}`
            );


          if (
            response.data.success
          ) {

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


    fetchUser();

  }, [id]);


  if (loading) {

    return (
      <h2>
        Loading...
      </h2>
    );

  }


  if (!user) {

    return (
      <h2>
        User Not Found
      </h2>
    );

  }


  return (

    <div className="user-details">

      <button
        onClick={() =>
          navigate("/users")
        }
      >
        ← Back
      </button>


      <div className="details-card">

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

          <div className="big-avatar">

            {user.name
              ?.charAt(0)
              ?.toUpperCase()}

          </div>

        )}


        <h1>
          {user.name}
        </h1>


        <p>
          <b>Email:</b>{" "}
          {user.email}
        </p>


        <p>
          <b>Type:</b>{" "}
          {user.role}
        </p>


        <p>
          <b>Phone:</b>{" "}
          {user.phone || "N/A"}
        </p>


        <p>
          <b>Bio:</b>{" "}
          {user.bio || "No bio"}
        </p>


        <p>
          <b>Joined:</b>{" "}
          {user.joinedAt
            ? new Date(
                user.joinedAt
              ).toLocaleString()
            : "N/A"}
        </p>


        <p>
          <b>Last Login:</b>{" "}

          {user.lastLogin
            ? new Date(
                user.lastLogin
              ).toLocaleString()
            : "Never"}

        </p>


        <p>
          <b>Status:</b>{" "}
          {user.loginStatus}
        </p>


        <p>
          <b>Login Type:</b>{" "}
          {user.loginType}
        </p>

      </div>

    </div>

  );

}


export default UserViewDetails;