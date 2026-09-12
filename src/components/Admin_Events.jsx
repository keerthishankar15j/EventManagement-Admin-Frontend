import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/Admin_Events.css";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://api-admin-rouge.vercel.app"
).replace(/\/+$/, "");

const AdminEvents = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // GET ALL EVENTS
  // =====================================================

  const getEvents = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/events/getevents`
      );

      console.log("=================================");
      console.log("ALL EVENTS:", response.data);
      console.log("=================================");

      const eventData = response.data?.data;

      if (Array.isArray(eventData)) {
        console.log("EVENT ARRAY:", eventData);
        console.log("EVENT COUNT:", eventData.length);

        setEvents(eventData);
      } else {
        console.log("EVENT DATA IS NOT ARRAY:", eventData);
        setEvents([]);
      }
    } catch (error) {
      console.error(
        "GET EVENTS ERROR:",
        error.response?.data || error.message
      );

      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CHECK EVENTS STATE
  // =====================================================

  useEffect(() => {
    console.log("EVENTS STATE:", events);
    console.log("EVENTS STATE COUNT:", events.length);
  }, [events]);

  // =====================================================
  // LOAD EVENTS
  // =====================================================

  useEffect(() => {
    getEvents();
  }, []);

  // =====================================================
  // VIEW DETAILS
  // =====================================================

  const handleViewDetails = (event) => {
    const id = event?._id;

    if (!id) {
      alert("Event ID not found");
      return;
    }

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

      setEvents((previousEvents) =>
        previousEvents.filter(
          (item) => item._id !== id
        )
      );

      alert("Event deleted successfully");
    } catch (error) {
      console.error(
        "DELETE EVENT ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete event"
      );
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

    // Relative URL
    if (image.startsWith("/")) {
      return `${API_URL}${image}`;
    }

    return `${API_URL}/${image}`;
  };

  // =====================================================
  // ADD EVENT
  // =====================================================

  const handleAddEvent = () => {
    console.log("ADD EVENT CLICKED");
    navigate("/events/add");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="main-content">
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
            type="button"
            className="add-event-btn"
            onClick={handleAddEvent}
          >
            <span>+</span>
            Add Event
          </button>
        </div>

        <section className="events-card">
          <div className="events-loading">
            Loading events...
          </div>
        </section>
      </main>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="main-content">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="page-header">

        <div className="page-title-area">

          <h1 className="page-title">
            Events
          </h1>

          <p className="page-description">
            Manage and organize all your events
          </p>

        </div>

        <button
          type="button"
          className="add-event-btn"
          onClick={handleAddEvent}
        >
          <span className="add-icon">
            +
          </span>

          Add Event

          <span className="arrow-icon">
            →
          </span>
        </button>

      </div>


      {/* =================================================
          EVENTS CONTAINER
      ================================================= */}

      <section className="events-card">

        {/* =================================================
            TOOLBAR
        ================================================= */}

        <div className="event-toolbar">

          <div className="event-count">

            <h2 className="event-count-title">
              All Events
            </h2>

            <span className="event-count-number">
              {events.length} Events
            </span>

          </div>

        </div>


        {/* =================================================
            EVENT GRID
        ================================================= */}

        <div className="events-card-grid">

          {events.length === 0 ? (

            <div className="no-events">

              <div className="no-events-icon">
                📅
              </div>

              <h3>
                No Events Found
              </h3>

              <p>
                Add your first event to get started.
              </p>

            </div>

          ) : (

            events.map((item) => (

              <div
                className="event-card"
                key={item._id}
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

                      <span>
                        📷
                      </span>

                      <p>
                        No Image
                      </p>

                    </div>

                  )}

                  {/* CATEGORY */}

                  <span className="card-status">
                    {item.category || "Other"}
                  </span>

                </div>


                {/* =================================================
                    CARD CONTENT
                ================================================= */}

                <div className="event-card-content">

                  {/* EVENT NAME */}

                  <h2 className="event-card-title">
                    {item.name || "Untitled Event"}
                  </h2>


                  {/* ORGANIZER */}

                  <p className="event-organizer">

                    Organized by{" "}

                    <strong>
                      {item.organizer || "Not specified"}
                    </strong>

                  </p>


                  {/* DESCRIPTION */}

                  <p className="event-description">

                    {item.description
                      ? item.description.length > 100
                        ? item.description.substring(
                            0,
                            100
                          ) + "..."
                        : item.description
                      : "No description available."}

                  </p>


                  {/* =================================================
                      EVENT DETAILS
                  ================================================= */}

                  <div className="event-details">

                    {/* DATE */}

                    <div className="event-detail">

                      <span className="detail-icon">
                        📅
                      </span>

                      <div>

                        <small>
                          Date
                        </small>

                        <strong>
                          {item.date ||
                            "Not specified"}
                        </strong>

                      </div>

                    </div>


                    {/* TIME */}

                    <div className="event-detail">

                      <span className="detail-icon">
                        ⏰
                      </span>

                      <div>

                        <small>
                          Time
                        </small>

                        <strong>
                          {item.time ||
                            "Not specified"}
                        </strong>

                      </div>

                    </div>


                    {/* LOCATION */}

                    <div className="event-detail">

                      <span className="detail-icon">
                        📍
                      </span>

                      <div>

                        <small>
                          Location
                        </small>

                        <strong>
                          {item.location ||
                            "Not specified"}
                        </strong>

                      </div>

                    </div>


                    {/* TICKETS */}

                    <div className="event-detail">

                      <span className="detail-icon">
                        🎟
                      </span>

                      <div>

                        <small>
                          Tickets
                        </small>

                        <strong>
                          {item.tickets ?? 0}
                        </strong>

                      </div>

                    </div>


                    {/* PRICE */}

                    <div className="event-detail">

                      <span className="detail-icon">
                        💰
                      </span>

                      <div>

                        <small>
                          Price
                        </small>

                        <strong>
                          ₹{item.ticketPrice ?? 0}
                        </strong>

                      </div>

                    </div>

                  </div>


                  {/* =================================================
                      ACTION BUTTONS
                  ================================================= */}

                  <div className="event-card-actions">

                    {/* VIEW */}

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
                        handleEdit(item._id)
                      }
                    >
                      ✏ Edit
                    </button>


                    {/* DELETE */}

                    <button
                      type="button"
                      className="delete-event-btn"
                      onClick={() =>
                        handleDelete(item._id)
                      }
                    >
                      🗑 Delete
                    </button>

                  </div>

                </div>

              </div>

            ))

          )}

        </div>

      </section>

    </main>
  );
};

export default AdminEvents;