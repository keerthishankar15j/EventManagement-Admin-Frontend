import React from "react";
import "../styles/Admin_Dashboard.css";

const AdminDashboard = () => {
  return (
    <main className="admin-content">

      {/* =================================================
          DASHBOARD HEADER
      ================================================= */}

      <div className="dashboard-header">

        <div className="dashboard-title-area">

          <div className="dashboard-breadcrumb">
            ADMIN PANEL
          </div>

          <h1>
            Dashboard
          </h1>

          <p className="dashboard-subtitle">
            Welcome to your admin dashboard
          </p>

        </div>

      </div>


      {/* =================================================
          DASHBOARD CARDS
      ================================================= */}

      <div className="dashboard-cards">

        {/* TOTAL EVENTS */}

        <div className="dashboard-card purple-card">

          <div className="card-icon">
            📅
          </div>

          <div className="card-content">

            <h3>
              Total Events
            </h3>

            <p>
              0
            </p>

          </div>

        </div>


        {/* TOTAL USERS */}

        <div className="dashboard-card blue-card">

          <div className="card-icon">
            👥
          </div>

          <div className="card-content">

            <h3>
              Total Users
            </h3>

            <p>
              0
            </p>

          </div>

        </div>


        {/* TOTAL REVENUE */}

        <div className="dashboard-card green-card">

          <div className="card-icon">
            ₹
          </div>

          <div className="card-content">

            <h3>
              Total Revenue
            </h3>

            <p>
              ₹0
            </p>

          </div>

        </div>


        {/* COMPLETED EVENTS */}

        <div className="dashboard-card orange-card">

          <div className="card-icon">
            ✓
          </div>

          <div className="card-content">

            <h3>
              Completed Events
            </h3>

            <p>
              0
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          RECENT EVENTS
      ================================================= */}

      <section className="event-section">

        <div className="event-section-header">

          <div>

            <h2>
              Recent Events
            </h2>

            <p>
              View your latest events
            </p>

          </div>

          <button
            className="view-all-btn"
            type="button"
          >
            View All →
          </button>

        </div>


        {/* =================================================
            TABS
        ================================================= */}

        <div className="event-tabs">

          <button
            type="button"
            className="tab-active"
          >
            View All
          </button>

          <button type="button">
            Upcoming
          </button>

          <button type="button">
            Ongoing
          </button>

          <button type="button">
            Completed
          </button>

        </div>


        {/* =================================================
            TABLE
        ================================================= */}

        <div className="dashboard-table-wrapper">

          <table className="dashboard-table">

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

                <td colSpan="3">

                  <div className="empty-events">

                    <div className="empty-icon">
                      📅
                    </div>

                    <h3>
                      No Events Yet
                    </h3>

                    <p>
                      Your recent events will appear here
                    </p>

                  </div>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </section>

    </main>
  );
};

export default AdminDashboard;