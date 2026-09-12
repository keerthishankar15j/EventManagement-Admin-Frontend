import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import "../styles/EventsDetails.css";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://api-admin-rouge.vercel.app"
).replace(/\/+$/, "");


const EventDetails = () => {

  // GET ID FROM URL

  const { id } = useParams();

  const navigate = useNavigate();


  // EVENT STATE

  const [event, setEvent] = useState(null);

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // GET SINGLE EVENT
  // =====================================================

  useEffect(() => {

    const getEventById = async () => {

      try {

        console.log(
          "Getting Event ID:",
          id
        );

        const response = await axios.get(
          `${API_URL}/events/get/${id}`
        );

        console.log(
          "Single Event Response:",
          response.data
        );


        // HANDLE DIFFERENT RESPONSE FORMATS

        const eventData =
          response.data?.data ||
          response.data?.event ||
          response.data;


        setEvent(eventData);

      } catch (error) {

        console.error(
          "GET SINGLE EVENT ERROR:",
          error.response?.data ||
          error.message
        );

        setEvent(null);

      } finally {

        setLoading(false);

      }

    };


    if (id) {

      getEventById();

    }

  }, [id]);


  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {

    if (!image) {

      return "";

    }


    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {

      return image;

    }


    return `${API_URL}/${image.replace(
      /^\/+/,
      ""
    )}`;

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <main className="main-content">

        <div className="event-details-loading">

          <div className="loading-spinner"></div>

          <h2>
            Loading Event Details...
          </h2>

        </div>

      </main>

    );

  }


  // =====================================================
  // EVENT NOT FOUND
  // =====================================================

  if (!event) {

    return (

      <main className="main-content">

        <div className="event-not-found">

          <div className="not-found-icon">
            ⚠
          </div>

          <h2>
            Event Not Found
          </h2>

          <p>
            The event you're looking for
            does not exist.
          </p>

          <button
            className="back-events-btn"
            onClick={() =>
              navigate("/events")
            }
          >
            ← Back to Events
          </button>

        </div>

      </main>

    );

  }


  // =====================================================
  // EVENT DETAILS PAGE
  // =====================================================

  return (

    <main className="main-content event-details-page">


      {/* BACK BUTTON */}

      <button
        className="back-events-btn"
        onClick={() =>
          navigate("/events")
        }
      >
        ← Back to Events
      </button>


      {/* HEADER */}

      <div className="event-details-header">

        <span className="details-label">
          EVENT DETAILS
        </span>

        <h1>
          {event.name}
        </h1>

        <p>
          Complete information about this event
        </p>

      </div>


      {/* MAIN CARD */}

      <div className="event-details-card">


        {/* EVENT IMAGE */}

        <div className="event-details-image">

          {event.image ? (

            <img
              src={getImageUrl(event.image)}
              alt={event.name}
            />

          ) : (

            <div className="details-no-image">
              📷
              <span>
                No Image Available
              </span>
            </div>

          )}


          {/* CATEGORY */}

          <span className="details-category">

            {event.category ||
              "Other"}

          </span>

        </div>


        {/* EVENT CONTENT */}

        <div className="event-details-content">


          {/* TITLE */}

          <h2>
            {event.name}
          </h2>


          {/* ORGANIZER */}

          <p className="details-organizer">

            Organized by{" "}

            <strong>
              {event.organizer ||
                "Not specified"}
            </strong>

          </p>


          {/* EVENT INFORMATION */}

          <div className="details-info-grid">


            {/* DATE */}

            <div className="details-info-box">

              <span className="details-icon">
                📅
              </span>

              <div>

                <small>
                  Date
                </small>

                <strong>
                  {event.date ||
                    "Not specified"}
                </strong>

              </div>

            </div>


            {/* TIME */}

            <div className="details-info-box">

              <span className="details-icon">
                ⏰
              </span>

              <div>

                <small>
                  Time
                </small>

                <strong>
                  {event.time ||
                    "Not specified"}
                </strong>

              </div>

            </div>


            {/* LOCATION */}

            <div className="details-info-box">

              <span className="details-icon">
                📍
              </span>

              <div>

                <small>
                  Location
                </small>

                <strong>
                  {event.location ||
                    "Not specified"}
                </strong>

              </div>

            </div>


            {/* CATEGORY */}

            <div className="details-info-box">

              <span className="details-icon">
                🏷
              </span>

              <div>

                <small>
                  Category
                </small>

                <strong>
                  {event.category ||
                    "Other"}
                </strong>

              </div>

            </div>


            {/* TICKETS */}

            <div className="details-info-box">

              <span className="details-icon">
                🎟
              </span>

              <div>

                <small>
                  Available Tickets
                </small>

                <strong>
                  {event.tickets || 0}
                </strong>

              </div>

            </div>


            {/* PRICE */}

            <div className="details-info-box">

              <span className="details-icon">
                💰
              </span>

              <div>

                <small>
                  Ticket Price
                </small>

                <strong>
                  ₹{event.ticketPrice || 0}
                </strong>

              </div>

            </div>

          </div>


          {/* DESCRIPTION */}

          <div className="details-description">

            <h3>
              About This Event
            </h3>

            <p>
              {event.description ||
                "No description available."}
            </p>

          </div>


          {/* ACTION */}

          <div className="details-actions">

            <button
              className="details-back-btn"
              onClick={() =>
                navigate("/events")
              }
            >
              ← Back to Events
            </button>


            <button
              className="details-edit-btn"
              onClick={() =>
                navigate(
                  `/events/edit/${event._id}`
                )
              }
            >
              ✏ Edit Event
            </button>

          </div>

        </div>

      </div>

    </main>

  );

};


export default EventDetails;