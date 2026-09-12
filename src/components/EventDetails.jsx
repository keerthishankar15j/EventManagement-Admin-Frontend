import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/EventDetails.css";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://api-admin-rouge.vercel.app"
).replace(/\/+$/, "");


function EventDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


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
  // FETCH EVENT DETAILS
  // =====================================================

  useEffect(() => {

    const fetchEvent = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/events/get/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch event"
          );
        }

        // Backend may return event directly
        // or inside data.event
        const eventData =
          data.event ||
          data.data ||
          data;

        setEvent(eventData);

      } catch (err) {

        console.error(
          "Error fetching event:",
          err
        );

        setError(
          err.message ||
          "Unable to load event details"
        );

      } finally {

        setLoading(false);

      }

    };

    if (id) {
      fetchEvent();
    }

  }, [id]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="event-details-loading">

        <div className="loading-spinner"></div>

        <h2>Loading event details...</h2>

      </div>
    );

  }


  // =====================================================
  // ERROR / NOT FOUND
  // =====================================================

  if (error || !event) {

    return (
      <div className="event-not-found">

        <div className="not-found-icon">
          😕
        </div>

        <h2>Event Not Found</h2>

        <p>
          {error ||
            "The event you are looking for does not exist."}
        </p>

        <button
          className="details-back-btn"
          onClick={() => navigate("/events")}
        >
          ← Back to Events
        </button>

      </div>
    );

  }


  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (

    <div className="event-details-page">

      {/* =================================================
          BACK TO EVENTS
      ================================================= */}

      <button
        className="back-events-btn"
        onClick={() => navigate("/events")}
      >
        ← Back to Events
      </button>


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="event-details-header">

        <span className="details-label">
          EVENT DETAILS
        </span>

        <h1>
          {event.name || "Event Details"}
        </h1>

        <p>
          View complete information about this event.
        </p>

      </div>


      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div className="event-details-card">


        {/* =================================================
            IMAGE
        ================================================= */}

        <div className="event-details-image">

          {event.image ? (

            <img
              src={getImageUrl(event.image)}
              alt={event.name || "Event"}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

          ) : (

            <div className="details-no-image">

              🖼️

              <span>
                No Image Available
              </span>

            </div>

          )}


          {/* CATEGORY */}

          {event.category && (

            <div className="details-category">
              {event.category}
            </div>

          )}

        </div>


        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="event-details-content">

          <h2>
            {event.name || "Untitled Event"}
          </h2>


          {/* ORGANIZER */}

          <p className="details-organizer">

            Organized by{" "}

            <strong>
              {event.organizer || "Not specified"}
            </strong>

          </p>


          {/* =================================================
              INFORMATION GRID
          ================================================= */}

          <div className="details-info-grid">


            {/* DATE */}

            <div className="details-info-box">

              <div className="details-icon">
                📅
              </div>

              <div>

                <small>
                  DATE
                </small>

                <strong>
                  {event.date || "Not specified"}
                </strong>

              </div>

            </div>


            {/* TIME */}

            <div className="details-info-box">

              <div className="details-icon">
                ⏰
              </div>

              <div>

                <small>
                  TIME
                </small>

                <strong>
                  {event.time || "Not specified"}
                </strong>

              </div>

            </div>


            {/* LOCATION */}

            <div className="details-info-box">

              <div className="details-icon">
                📍
              </div>

              <div>

                <small>
                  LOCATION
                </small>

                <strong>
                  {event.location || "Not specified"}
                </strong>

              </div>

            </div>


            {/* CATEGORY */}

            <div className="details-info-box">

              <div className="details-icon">
                🎫
              </div>

              <div>

                <small>
                  CATEGORY
                </small>

                <strong>
                  {event.category || "Not specified"}
                </strong>

              </div>

            </div>


            {/* AVAILABLE TICKETS */}

            <div className="details-info-box">

              <div className="details-icon">
                👥
              </div>

              <div>

                <small>
                  AVAILABLE TICKETS
                </small>

                <strong>
                  {event.tickets !== undefined &&
                  event.tickets !== null
                    ? event.tickets
                    : "Not specified"}
                </strong>

              </div>

            </div>


            {/* TICKET PRICE */}

            <div className="details-info-box">

              <div className="details-icon">
                💰
              </div>

              <div>

                <small>
                  TICKET PRICE
                </small>

                <strong>

                  {event.ticketPrice !== undefined &&
                  event.ticketPrice !== null
                    ? `₹${event.ticketPrice}`
                    : "Not specified"}

                </strong>

              </div>

            </div>

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="details-description">

            <h3>
              Description
            </h3>

            <p>
              {event.description ||
                "No description available for this event."}
            </p>

          </div>


          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div className="details-actions">


            {/* BACK */}

            <button
              className="details-back-btn"
              onClick={() => navigate("/events")}
            >
              ← Back to Events
            </button>


            {/* EDIT */}

            <button
              className="details-edit-btn"
              onClick={() =>
                navigate(
                  `/events/edit/${event._id || event.id}`
                )
              }
            >
              ✏️ Edit Event
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

export default EventDetails;