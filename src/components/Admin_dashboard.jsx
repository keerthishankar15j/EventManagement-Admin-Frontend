import React from "react";
import AdminNavbar from "./Admin_navbar";
import "../styles/Admin_Dashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-layout">

      {/* ================= SIDEBAR ================= */}

      <AdminNavbar />


      {/* ================= DASHBOARD CONTENT ================= */}

      <main className="admin-content">

        {/* PAGE HEADER */}

        <div className="dashboard-header">

          <div>
            <div className="dashboard-breadcrumb">
              ADMIN PANEL 
            </div>

            <h1>
              Dashboard
            </h1>

            
          </div>

        </div>


        {/* ================= DASHBOARD CARDS ================= */}

        <div className="dashboard-cards">

          {/* TOTAL EVENTS */}

          <div className="dashboard-card">

            <h3>
              Total Events
            </h3>

            <p>
              0
            </p>

          </div>


          {/* TOTAL USERS */}

          <div className="dashboard-card">

            <h3>
              Total Users
            </h3>

            <p>
              0
            </p>

          </div>


          {/* TOTAL REVENUE */}

          <div className="dashboard-card">

            <h3>
              Total Revenue
            </h3>

            <p>
              ₹0
            </p>

          </div>


          {/* COMPLETED EVENTS */}

          <div className="dashboard-card">

            <h3>
              Completed Events
            </h3>

            <p>
              0
            </p>

          </div>

        </div>


        {/* ================= RECENT EVENTS ================= */}

        <section className="event-section">

          <div className="event-section-header">

            <div>

              <h2>
                Recent Events
              </h2>

              

            </div>

            <button className="view-all-btn">
              View All →
            </button>

          </div>


          {/* TABS */}

          <div className="event-tabs">

            <button className="tab-active">
              View All
            </button>

            <button>
              Upcoming
            </button>

            <button>
              Ongoing
            </button>

            <button>
              Completed
            </button>

          </div>


          {/* TABLE */}

          <div className="dashboard-table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    Event Name
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                <tr>

                  <td colSpan="3"></td>

                </tr>

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>
  );
};

export default AdminDashboard;