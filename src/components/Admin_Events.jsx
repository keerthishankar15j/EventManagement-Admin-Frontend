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

      console.log("ALL EVENTS:", response.data);

      const eventData =
        response.data?.data ||
        response.data?.events ||
        response.data;

      setEvents(
        Array.isArray(eventData)
          ? eventData
          : []
      );

    } catch (error) {

      console.error(
        "GET EVENTS ERROR:",
        error.response?.data ||
        error.message
      );

      setEvents([]);

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // VIEW DETAILS
  // =====================================================

  const handleViewDetails = (id) => {

    if (!id) {

      alert("Event ID not found");

      return;

    }

    navigate(`/events/details/${id}`);

  };


  // =====================================================
  // DELETE EVENT
  // =====================================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this event?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await axios.delete(
        `${API_URL}/events/delete/${id}`
      );

      alert("Event deleted successfully");

      getEvents();

    } catch (error) {

      console.error(
        "DELETE ERROR:",
        error.response?.data ||
        error.message
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


    // YOUR BACKEND SAVES BASE64 IMAGE
    if (image.startsWith("data:image/")) {
      return image;
    }


    // External image
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }


    // Fallback for old filename-based images
    if (image.startsWith("/")) {
      return `${API_URL}${image}`;
    }

    return `${API_URL}/${image}`;

  };


  // =====================================================
  // LOAD EVENTS
  // =====================================================

  useEffect(() => {

    getEvents();

  }, []);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <main className="main-content">

        <div className="events-loading">

          <h2>
            Loading Events...
          </h2>

        </div>

      </main>

    );

  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <main className="main-content">


      {/* PAGE HEADER */}

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
          onClick={() =>
            navigate("/events/add")
          }
        >
          + Add Event
        </button>

      </div>


      {/* EVENTS SECTION */}

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


        {/* EVENTS GRID */}

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

            events.map((item) => (

              <div
                className="event-card"
                key={item._id}
              >


                {/* IMAGE */}

                <div className="event-card-image">

                  {item.image ? (

                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name || "Event"}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
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


                {/* CONTENT */}

                <div className="event-card-content">

                  <h2 className="event-card-title">
                    {item.name}
                  </h2>


                  <p className="event-organizer">

                    Organized by{" "}

                    <strong>
                      {item.organizer ||
                        "Not specified"}
                    </strong>

                  </p>


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


                  {/* EVENT INFORMATION */}

                  <div className="event-details">


                    <div className="event-detail">

                      <span>📅</span>

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


                    <div className="event-detail">

                      <span>⏰</span>

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


                    <div className="event-detail">

                      <span>📍</span>

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


                    <div className="event-detail">

                      <span>🎟</span>

                      <div>

                        <small>
                          Tickets
                        </small>

                        <strong>
                          {item.tickets || 0}
                        </strong>

                      </div>

                    </div>


                    <div className="event-detail">

                      <span>💰</span>

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


                  {/* ACTION BUTTONS */}

                  <div className="event-card-actions">


                    {/* VIEW */}

                    <button
                      type="button"
                      className="view-details-btn"
                      onClick={() =>
                        handleViewDetails(
                          item._id
                        )
                      }
                    >
                      👁 View Details
                    </button>


                    {/* EDIT */}

                    <button
                      type="button"
                      className="edit-event-btn"
                      onClick={() =>
                        navigate(
                          `/events/edit/${item._id}`
                        )
                      }
                    >
                      ✏ Edit
                    </button>


                    {/* DELETE */}

                    <button
                      type="button"
                      className="delete-event-btn"
                      onClick={() =>
                        handleDelete(
                          item._id
                        )
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