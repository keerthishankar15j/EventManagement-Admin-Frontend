import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/Admin_Users.css";


const AdminUsers = () => {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // GET USERS
  // =====================================================

  const fetchUsers = async () => {

    try {

      setLoading(true);

      setError("");


      const response =
        await axios.get(
          "http://localhost:9001/api/admin/users"
        );


      setUsers(
        response.data.users
      );


    } catch (error) {

      console.error(
        "FETCH USERS ERROR:",
        error
      );


      setError(
        error.response?.data?.message ||
        "Unable to load users"
      );


    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // PAGE LOAD
  // =====================================================

  useEffect(() => {

    fetchUsers();

  }, []);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="users-loading">
        Loading users...
      </div>
    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
      <div className="users-error">
        {error}
      </div>
    );

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="admin-users-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="users-header">

        <div>

          <div className="users-breadcrumb">
            ADMIN PANEL
          </div>

          <h1>
            Users
          </h1>

          <p>
            View all registered users
          </p>

        </div>


        <div className="total-users">

          Total Users:

          <strong>
            {users.length}
          </strong>

        </div>

      </div>


      {/* =================================================
          TABLE
      ================================================= */}

      <div className="users-table-container">

        <table>

          <thead>

            <tr>

              <th>
                #
              </th>

              <th>
                Name
              </th>

              <th>
                Email
              </th>

              <th>
                Role
              </th>

              <th>
                Phone
              </th>

              <th>
                Joined Date
              </th>

              <th>
                Status
              </th>

            </tr>

          </thead>


          <tbody>

            {users.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="no-users"
                >
                  No users found
                </td>

              </tr>

            ) : (

              users.map(
                (user, index) => {

                  return (

                    <tr
                      key={user._id}
                    >

                      <td>
                        {index + 1}
                      </td>


                      <td>

                        <div className="user-name">

                          <div className="user-avatar">

                            {user.name
                              ?.charAt(0)
                              ?.toUpperCase()}

                          </div>

                          <span>
                            {user.name || "-"}
                          </span>

                        </div>

                      </td>


                      <td>
                        {user.email || "-"}
                      </td>


                      <td>

                        <span className="role-badge">
                          {user.role || "-"}
                        </span>

                      </td>


                      <td>
                        {user.phone || "-"}
                      </td>


                      <td>

                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "-"}

                      </td>


                      <td>

                        <span className="status-badge">
                          ● Registered
                        </span>

                      </td>

                    </tr>

                  );

                }

              )

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

};


export default AdminUsers;