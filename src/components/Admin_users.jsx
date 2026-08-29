import React from "react";
import AdminNavbar from "../components/Admin_navbar";
import "../styles/Admin_Users.css";

function Users() {
  return (
    <div className="users-layout">

      {/* ================= SIDEBAR ================= */}
      <AdminNavbar />


      {/* ================= MAIN CONTENT ================= */}

      <main className="users-content">

        {/* ================= PAGE HEADER ================= */}

        <div className="users-header">

          <div className="users-title-area">

            <div className="users-breadcrumb">
              ADMIN PANEL / USERS
            </div>

            <h1>Users</h1>

            <p>
              Manage and organize all registered users
            </p>

          </div>


          {/* ================= ADMIN DROPDOWN ================= */}

         

        </div>


        {/* ================= USERS CARD ================= */}

        <section className="users-card">


          {/* ================= TOOLBAR ================= */}

          <div className="users-toolbar">

            {/* LEFT SIDE */}

            <div className="users-heading">

              <h2>
                Users
              </h2>

             

            </div>


            {/* RIGHT SIDE */}

            <div className="users-actions">


              {/* ================= SEARCH ================= */}

              <div className="search-box">

                <span className="search-icon">
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search users..."
                />

              </div>


              {/* ================= STATUS ================= */}

              <select className="status-filter">

                <option>
                  All Status
                </option>

                <option>
                  Active
                </option>

                <option>
                  Inactive
                </option>

              </select>


              {/* ================= ADD USER ================= */}

              <button
                type="button"
                className="add-user-btn"
              >

                <span>
                  +
                </span>

                <span>
                  Add Users
                </span>

                <span>
                  →
                </span>

              </button>

            </div>

          </div>


          {/* ================= TABLE ================= */}

          <div className="users-table-wrapper">

            <table className="users-table">

              {/* ================= TABLE HEADER ================= */}

              <thead>

                <tr>

                  <th>
                    User Name
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Joined Date
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Edit
                  </th>

                  <th>
                    Delete
                  </th>

                </tr>

              </thead>


              {/* ================= EMPTY TABLE ================= */}

              <tbody>

                {/* 
                  Backend user data will be displayed here later.
                  No sample users are added.
                */}

              </tbody>

            </table>

          </div>


          {/* ================= PAGINATION ================= */}

          <div className="pagination">

            <button type="button">
              ‹
            </button>

            <button
              type="button"
              className="active"
            >
              1
            </button>

            <button type="button">
              2
            </button>

            <button type="button">
              3
            </button>

            <button type="button">
              ›
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Users;