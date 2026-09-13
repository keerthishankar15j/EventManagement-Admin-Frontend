import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiArrowRight,
  FiClock,
  FiBarChart2,
  FiZap,
  FiMapPin,
} from "react-icons/fi";

import "../styles/Admin_Dashboard.css";


const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://api-admin-rouge.vercel.app"
).replace(/\/+$/, "");


const Dashboard = () => {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);


  // =========================================
  // GET ALL EVENTS
  // =========================================

  const getEvents = async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        `${API_URL}/events/getevents`
      );

      console.log("DASHBOARD EVENTS:", response.data);


      const eventData = response.data?.data;


      if (Array.isArray(eventData)) {

        setEvents(eventData);

      } else {

        setEvents([]);

      }

    } catch (error) {

      console.error(
        "DASHBOARD EVENTS ERROR:",
        error.response?.data || error.message
      );

      setEvents([]);

    } finally {

      setLoading(false);

    }
  };


  // =========================================
  // LOAD EVENTS
  // =========================================

  useEffect(() => {

    getEvents();

  }, []);


  // =========================================
  // TOTAL EVENTS
  // =========================================

  const totalEvents = events.length;


  // =========================================
  // UPCOMING EVENTS
  // =========================================

  const today = new Date();
  today.setHours(0, 0, 0, 0);


  const upcomingEvents = events
    .filter((event) => {

      if (!event.date) {
        return false;
      }

      const eventDate = new Date(event.date);

      return !isNaN(eventDate.getTime()) &&
        eventDate >= today;

    })
    .sort((a, b) => {

      return new Date(a.date) - new Date(b.date);

    })
    .slice(0, 3);


  // =========================================
  // REVENUE
  // =========================================

  const totalRevenue = 0;


  // =========================================
  // IMAGE URL
  // Same logic as your Events page
  // =========================================

  const getImageUrl = (image) => {

    if (!image) {
      return "";
    }


    // Base64
    if (image.startsWith("data:image/")) {
      return image;
    }


    // Full URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }


    // Relative URL
    if (image.startsWith("/")) {
      return `${API_URL}${image}`;
    }


    return `${API_URL}/${image}`;

  };


  // =========================================
  // DATE FORMAT
  // =========================================

  const formatDate = (date) => {

    if (!date) {
      return "Date not available";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );

  };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <main className="dashboard-page">

        <div className="dashboard-loading">

          <div className="loading-spinner"></div>

          <p>Loading dashboard...</p>

        </div>

      </main>

    );

  }


  return (

    <main className="dashboard-page">


      {/* =====================================
          HEADER
      ====================================== */}

      <div className="dashboard-header">

        <div>

          <span className="dashboard-label">
            ADMIN PANEL
          </span>

          <h1>
            Dashboard
          </h1>

          <p>
            Welcome to your event management dashboard
          </p>

        </div>


        <div className="event-management-badge">

          <div className="badge-icon">
            <FiCalendar />
          </div>

          <div>

            <strong>
              Event Management
            </strong>

            <span>
              Organize • Manage • Grow
            </span>

          </div>

        </div>

      </div>



      {/* =====================================
          STAT CARDS
      ====================================== */}

      <div className="stats-grid">


        {/* TOTAL EVENTS */}

        <div className="stat-card purple-card">

          <div className="stat-icon purple-icon">
            <FiCalendar />
          </div>


          <div className="stat-content">

            <span>
              Total Events
            </span>

            <h2>
              {totalEvents}
            </h2>

            <div className="stat-growth">

              <FiTrendingUp />

              <b>
                +0%
              </b>

              <small>
                vs. last month
              </small>

            </div>

          </div>

        </div>



        {/* TOTAL REVENUE */}

        <div className="stat-card green-card">

          <div className="stat-icon green-icon">
            <FiDollarSign />
          </div>


          <div className="stat-content">

            <span>
              Total Revenue
            </span>

            <h2>
              ₹{totalRevenue}
            </h2>

            <div className="stat-growth">

              <FiTrendingUp />

              <b>
                +0%
              </b>

              <small>
                vs. last month
              </small>

            </div>

          </div>

        </div>

      </div>



      {/* =====================================
          DASHBOARD OVERVIEW
      ====================================== */}

      <section className="overview-section">


        {/* OVERVIEW HEADER */}

        <div className="overview-header">

          <div className="overview-title">

            <div className="overview-icon">
              <FiBarChart2 />
            </div>

            <div>

              <h2>
                Dashboard Overview
              </h2>

              <p>
                Quick insights about your events and revenue
              </p>

            </div>

          </div>


          <button className="date-filter">

            <FiCalendar />

            Last 7 Days

            <span>
             ⌄
            </span>

          </button>

        </div>



        {/* =================================
            OVERVIEW GRID
        ================================== */}

        <div className="overview-grid">


          {/* =================================
              UPCOMING EVENTS
          ================================== */}

          <div className="overview-card upcoming-card">


            <div className="card-heading">

              <div className="heading-left">

                <div className="small-icon purple-small">
                  <FiCalendar />
                </div>

                <div>

                  <h3>
                    Upcoming Events
                  </h3>

                  <p>
                    Your next scheduled events
                  </p>

                </div>

              </div>


              <button className="view-all-btn">
                View All
                <FiArrowRight />
              </button>

            </div>



            <div className="event-list">


              {upcomingEvents.length > 0 ? (

                upcomingEvents.map((event, index) => (

                  <div
                    className="event-item"
                    key={event._id || index}
                  >


                    {/* EVENT IMAGE */}

                    <div className="event-image">

                      {event.image ? (

                        <img
                          src={getImageUrl(event.image)}
                          alt={event.name || "Event"}
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />

                      ) : (

                        <FiCalendar />

                      )}

                    </div>



                    {/* EVENT INFO */}

                    <div className="event-info">

                      <h4>
                        {event.name || "Untitled Event"}
                      </h4>


                      <div className="event-meta">

                        <FiCalendar />

                        <span>
                          {formatDate(event.date)}
                        </span>


                        {event.time && (

                          <>

                            <span className="separator">
                              |
                            </span>

                            <FiClock />

                            <span>
                              {event.time}
                            </span>

                          </>

                        )}

                      </div>


                      <span className="upcoming-badge">
                        Upcoming
                      </span>

                    </div>


                    <FiArrowRight className="event-arrow" />

                  </div>

                ))

              ) : (

                <div className="empty-events">

                  <div className="empty-event-icon">
                    <FiCalendar />
                  </div>

                  <h4>
                    No Upcoming Events
                  </h4>

                  <p>
                    Your upcoming events will appear here
                  </p>

                </div>

              )}

            </div>

          </div>



          {/* =================================
              REVENUE TREND
          ================================== */}

          <div className="overview-card revenue-card">


            <div className="card-heading">

              <div className="heading-left">

                <div className="small-icon green-small">
                  <FiTrendingUp />
                </div>

                <div>

                  <h3>
                    Revenue Trend
                  </h3>

                  <p>
                    Total revenue from events
                  </p>

                </div>

              </div>

            </div>



            <div className="revenue-top">

              <h2>
                ₹0
              </h2>


              <div className="revenue-growth">

                <span>
                  <FiTrendingUp />
                  +0%
                </span>

                <small>
                  vs. last 7 days
                </small>

              </div>

            </div>



            {/* CHART */}

            <div className="chart">

              <div className="chart-y-axis">

                <span>₹8K</span>
                <span>₹6K</span>
                <span>₹4K</span>
                <span>₹2K</span>
                <span>₹0</span>

              </div>


              <div className="chart-area">


                <div className="chart-lines">

                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>

                </div>


                <div className="chart-line">

                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>

                </div>


                <div className="chart-dates">

                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>

                </div>

              </div>

            </div>

          </div>



          {/* =================================
              QUICK INSIGHTS
          ================================== */}

          <div className="overview-card insights-card">


            <div className="card-heading">

              <div className="heading-left">

                <div className="small-icon purple-small">
                  <FiZap />
                </div>

                <div>

                  <h3>
                    Quick Insights
                  </h3>

                  <p>
                    At a glance
                  </p>

                </div>

              </div>

            </div>



            {/* TOTAL EVENTS */}

            <div className="insight-item">

              <div className="insight-icon purple-insight">
                <FiCalendar />
              </div>


              <div className="insight-content">

                <strong>
                  Total Events
                </strong>

                <span>
                  Created & managed
                </span>

              </div>


              <div className="insight-value">

                <b>
                  {totalEvents}
                </b>

                <small>
                  ↗ +0%
                </small>

              </div>

            </div>



            {/* TOTAL REVENUE */}

            <div className="insight-item">

              <div className="insight-icon green-insight">
                <FiDollarSign />
              </div>


              <div className="insight-content">

                <strong>
                  Total Revenue
                </strong>

                <span>
                  From events
                </span>

              </div>


              <div className="insight-value">

                <b>
                  ₹0
                </b>

                <small>
                  ↗ +0%
                </small>

              </div>

            </div>



            {/* REGISTRATION */}

            <div className="insight-item">

              <div className="insight-icon pink-insight">
                <FiTrendingUp />
              </div>


              <div className="insight-content">

                <strong>
                  Avg. Registration Rate
                </strong>

                <span>
                  Per event
                </span>

              </div>


              <div className="insight-value">

                <b>
                  0%
                </b>

                <small>
                  ↗ +0%
                </small>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>

  );

};


export default Dashboard;