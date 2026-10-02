import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Bookings.css";

const USER_API = "https://user-api-iota-six.vercel.app";
const ADMIN_API = "https://api-admin-rouge.vercel.app";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // STORE ONE BOOKING IN ADMIN BACKEND
  // =====================================================

  const storeBooking = async (booking) => {
    try {
      console.log(
        "SENDING BOOKING TO ADMIN:",
        booking.sourceBookingId
      );

      const response = await axios.post(
        `${ADMIN_API}/bookings/store`,
        booking
      );

      console.log(
        "ADMIN STORE RESPONSE:",
        booking.sourceBookingId,
        response.data
      );

      return response.data;
    } catch (error) {
      console.error(
        "ADMIN STORE ERROR:",
        booking.sourceBookingId,
        error.response?.data || error.message
      );

      return null;
    }
  };

  // =====================================================
  // FETCH BOOKINGS FROM USER BACKEND
  // =====================================================

  const fetchBookings = async () => {
    try {
      setLoading(true);

      console.log(
        "Fetching bookings from User Backend..."
      );

      // -------------------------------------------------
      // GET BOOKINGS
      // -------------------------------------------------

      const response = await axios.get(
        `${USER_API}/booking/getbookings`
      );

      console.log(
        "USER BOOKING RESPONSE:",
        response.data
      );

      let bookingData = [];

      if (Array.isArray(response.data)) {
        bookingData = response.data;
      } else if (
        Array.isArray(response.data.bookings)
      ) {
        bookingData = response.data.bookings;
      } else if (
        Array.isArray(response.data.data)
      ) {
        bookingData = response.data.data;
      }

      console.log(
        "BOOKINGS FROM USER BACKEND:",
        bookingData
      );

      // =================================================
      // PREPARE BOOKINGS
      // =================================================

      const finalBookings = bookingData.map(
        (booking) => {
          let userName = booking.userName || "";

          // Old booking may not have userName
          if (
            !userName &&
            Array.isArray(booking.attendees) &&
            booking.attendees.length > 0
          ) {
            userName =
              booking.attendees[0]?.name || "";
          }

          if (!userName) {
            userName = "User";
          }

          return {
            sourceBookingId: booking._id,

            userId: booking.userId || null,

            userName: userName,

            userEmail: booking.userEmail || "",

            eventId: booking.eventId || null,

            eventName:
              booking.eventName || "Event",

            eventDate:
              booking.eventDate || "",

            eventTime:
              booking.eventTime || "",

            eventLocation:
              booking.eventLocation || "",

            eventCategory:
              booking.eventCategory || "Event",

            ticketPrice:
              booking.ticketPrice ?? 0,

            numberOfTickets:
              booking.numberOfTickets || 0,

            attendees:
              Array.isArray(booking.attendees)
                ? booking.attendees
                : [],

            totalAmount:
              booking.totalAmount ?? 0,

            bookingDate:
              booking.bookingDate ||
              booking.createdAt ||
              "",

            status:
              booking.status || "Confirmed",
          };
        }
      );

      console.log(
        "FINAL BOOKINGS:",
        finalBookings
      );

      // =================================================
      // IMPORTANT:
      // DISPLAY IMMEDIATELY
      // =================================================

      setBookings(finalBookings);

      setLoading(false);

      // =================================================
      // STORE IN ADMIN BACKEND
      // DO NOT WAIT ONE BY ONE
      // =================================================

      console.log(
        "Starting Admin DB sync..."
      );

      Promise.all(
        finalBookings.map((booking) =>
          storeBooking(booking)
        )
      )
        .then(() => {
          console.log(
            "All bookings synced to Admin Backend."
          );
        })
        .catch((error) => {
          console.error(
            "ADMIN SYNC ERROR:",
            error
          );
        });
    } catch (error) {
      console.error(
        "BOOKING FETCH ERROR:",
        error.response?.data || error.message
      );

      setBookings([]);
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD BOOKINGS
  // =====================================================

  useEffect(() => {
    fetchBookings();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="bookings-page">
        <div className="bookings-loading">
          Loading bookings...
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="bookings-page">

      {/* HEADER */}

      <div className="bookings-header">

        <div>
          <h1>Bookings</h1>

          <p>
            View all event bookings
          </p>
        </div>

        <div className="booking-count">
          {bookings.length} Bookings
        </div>

      </div>

      {/* NO BOOKINGS */}

      {bookings.length === 0 ? (
        <div className="no-bookings">

          <h3>
            No bookings found
          </h3>

          <p>
            There are no bookings available.
          </p>

        </div>
      ) : (

        /* BOOKINGS */

        <div className="bookings-grid">

          {bookings.map((booking) => (

            <div
              className="booking-card"
              key={booking.sourceBookingId}
            >

              {/* CARD HEADER */}

              <div className="booking-card-header">

                <h3>
                  {booking.eventName}
                </h3>

                <span
                  className={
                    booking.status === "Cancelled"
                      ? "booking-status cancelled"
                      : "booking-status confirmed"
                  }
                >
                  {booking.status}
                </span>

              </div>

              {/* USER DETAILS */}

              <div className="booking-section">

                <h4>
                  User Details
                </h4>

                <p>
                  <strong>Name:</strong>{" "}
                  {booking.userName}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {booking.userEmail}
                </p>

              </div>

              {/* EVENT DETAILS */}

              <div className="booking-section">

                <h4>
                  Event Details
                </h4>

                <p>
                  <strong>Event:</strong>{" "}
                  {booking.eventName}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {booking.eventDate
                    ? new Date(
                        booking.eventDate
                      ).toLocaleDateString(
                        "en-IN"
                      )
                    : "N/A"}
                </p>

                <p>
                  <strong>Time:</strong>{" "}
                  {booking.eventTime || "N/A"}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {booking.eventLocation ||
                    "N/A"}
                </p>

              </div>

              {/* TICKET DETAILS */}

              <div className="booking-section">

                <h4>
                  Ticket Details
                </h4>

                <p>
                  <strong>
                    Number of Tickets:
                  </strong>{" "}
                  {booking.numberOfTickets}
                </p>

                <p>
                  <strong>
                    Ticket Price:
                  </strong>{" "}
                  ₹{booking.ticketPrice}
                </p>

                <p>
                  <strong>
                    Total Amount:
                  </strong>{" "}
                  ₹{booking.totalAmount}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Bookings;