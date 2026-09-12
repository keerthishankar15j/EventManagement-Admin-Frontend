import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/Admin_Events.css";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://api-admin-rouge.vercel.app"
).replace(/\/+$/, "");

const EVENTS_CACHE = "admin_events_cache";

const AdminEvents = () => {
  const navigate = useNavigate();

  // Get cached events first
  const getCachedEvents = () => {
    try {
      const saved = sessionStorage.getItem(EVENTS_CACHE);

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("CACHE ERROR:", error);
      return [];
    }
  };

  const [events, setEvents] = useState(getCachedEvents);

  // =====================================================
  // GET ALL EVENTS
  // =====================================================

  const getEvents = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/events/getevents`
      );

      console.log("ALL EVENTS:", response.data);

      const eventData =
        response.data?.data ||
        response.data?.events ||
        response.data;

      const finalEvents = Array.isArray(eventData)
        ? eventData
        : [];

      setEvents(finalEvents);

      // Save latest events
      sessionStorage.setItem(
        EVENTS_CACHE,
        JSON.stringify(finalEvents)
      );

    } catch (error) {
      console.error(
        "GET EVENTS ERROR:",
        error.response?.data || error.message
      );

      // Don't replace existing cached events with empty data
      if (events.length === 0) {
        setEvents([]);
      }
    }
  };

  // =====================================================
  // VIEW DETAILS
  // =====================================================

  const handleViewDetails = (event) => {
    const id = event?._id || event?.id;

    if (!id) {
      alert("Event ID not found");
      return;
    }

    // Send event object along with route
    // EventDetails can display it immediately
    navigate(`/events/details/${id}`, {
      state: {
        event: event,
      },
    });
  };

  // =====================================================
  // EDIT EVENT
  // =====================================================

  const handleEdit = (id) => {
    if (!id) {
      alert("Event ID not found");
      return;
    }

    navigate(`/events/edit/${id}`);
  };

  // =====================================================
  // DELETE EVENT
  // =====================================================

  const handleDelete = async (id) => {
    if (!id) {
      alert("Event ID not found");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/events/delete/${id}`
      );

      // Remove immediately from screen
      const updatedEvents = events.filter(
        (item) => (item._id || item.id) !== id
      );

      setEvents(updatedEvents);

      // Update cache
      sessionStorage.setItem(
        EVENTS_CACHE,
        JSON.stringify(updatedEvents)
      );

      alert("Event deleted successfully");

    } catch (error) {
      console.error(
        "DELETE ERROR:",
        error.response?.data || error.message
      );

      alert("Failed to delete event");
    }
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    // Base64 image
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

    // Relative path
    if (image.startsWith("/")) {
      return `${API_URL}${image}`;
    }

    return `${API_URL}/${image}`;
  };

  // =====================================================
  // LOAD EVENTS IN BACKGROUND
  // =====================================================

  useEffect(() => {
    getEvents();
  }, []);

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="main-content">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="page-header">

        <div>
          <h1 className="page-title">
            Events
          </h1>

          <p className="page-description">
            Manage and organize all your events
          </p>
        </div>

        <button
          className="add-event-btn"
          type="button"
          onClick={() => navigate("/events/add")}
        >
          + Add Event
        </button>

      </div>


      {/* =================================================
          EVENTS SECTION
      ================================================= */}

      <section className="events-card">

        <div className="event-toolbar">

          <div>
            <h2 className="event-count-title">
              All Events
            </h2>

            <span className="event-count-number">
              {events.length} Events
            </span>
          </div>

        </div>


        {/* =================================================
            EVENTS GRID
        ================================================= */}

        <div className="events-card-grid">

          {events.length === 0 ? (

            <div className="no-events">

              <h3>
                No Events Found
              </h3>

              <p>
                Add your first event to get started.
              </p>

            </div>

          ) : (

            events.map((item, index) => {

              const eventId =
                item._id ||
                item.id ||
                `event-${index}`;

              return (

                <div
                  className="event-card"
                  key={eventId}
                >

                  {/* =================================================
                      IMAGE
                  ================================================= */}

                  <div className="event-card-image">

                    {item.image ? (

                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name || "Event"}
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />

                    ) : (

                      <div className="no-image">
                        📷
                      </div>

                    )}

                    <span className="card-status">
                      {item.category || "Other"}
                    </span>

                  </div>


                  {/* =================================================
                      CONTENT
                  ================================================= */}

                  <div className="event-card-content">

                    <h2 className="event-card-title">
                      {item.name || "Untitled Event"}
                    </h2>


                    <p className="event-organizer">

                      Organized by{" "}

                      <strong>
                        {item.organizer || "Not specified"}
                      </strong>

                    </p>


                    <p className="event-description">

                      {item.description
                        ? item.description.length > 100
                          ? item.description.substring(0, 100) + "..."
                          : item.description
                        : "No description available."
                      }

                    </p>


                    {/* =================================================
                        EVENT INFORMATION
                    ================================================= */}

                    <div className="event-details">


                      {/* DATE */}

                      <div className="event-detail">

                        <span>
                          📅
                        </span>

                        <div>

                          <small>
                            Date
                          </small>

                          <strong>
                            {item.date || "Not specified"}
                          </strong>

                        </div>

                      </div>


                      {/* TIME */}

                      <div className="event-detail">

                        <span>
                          ⏰
                        </span>

                        <div>

                          <small>
                            Time
                          </small>

                          <strong>
                            {item.time || "Not specified"}
                          </strong>

                        </div>

                      </div>


                      {/* LOCATION */}

                      <div className="event-detail">

                        <span>
                          📍
                        </span>

                        <div>

                          <small>
                            Location
                          </small>

                          <strong>
                            {item.location || "Not specified"}
                          </strong>

                        </div>

                      </div>


                      {/* TICKETS */}

                      <div className="event-detail">

                        <span>
                          🎟
                        </span>

                        <div>

                          <small>
                            Tickets
                          </small>

                          <strong>
                            {item.tickets || 0}
                          </strong>

                        </div>

                      </div>


                      {/* PRICE */}

                      <div className="event-detail">

                        <span>
                          💰
                        </span>

                        <div>

                          <small>
                            Price
                          </small>

                          <strong>
                            ₹{item.ticketPrice || 0}
                          </strong>

                        </div>

                      </div>

                    </div>


                    {/* =================================================
                        ACTION BUTTONS
                    ================================================= */}

                    <div className="event-card-actions">


                      {/* VIEW DETAILS */}

                      <button
                        type="button"
                        className="view-details-btn"
                        onClick={() =>
                          handleViewDetails(item)
                        }
                      >
                        👁 View Details
                      </button>


                      {/* EDIT */}

                      <button
                        type="button"
                        className="edit-event-btn"
                        onClick={() =>
                          handleEdit(eventId)
                        }
                      >
                        ✏ Edit
                      </button>


                      {/* DELETE */}

                      <button
                        type="button"
                        className="delete-event-btn"
                        onClick={() =>
                          handleDelete(eventId)
                        }
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </div>

                </div>

              );

            })

          )}

        </div>

      </section>

    </main>
  );
};

export default AdminEvents;