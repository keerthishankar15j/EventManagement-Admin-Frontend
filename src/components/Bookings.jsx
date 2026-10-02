import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Bookings.css";

const USER_API = "https://user-api-iota-six.vercel.app";
const ADMIN_API = "https://api-admin-rouge.vercel.app";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // STORE BOOKING IN ADMIN BACKEND
  // =====================================================

  const storeBooking = async (booking) => {
    try {
      console.log("SENDING BOOKING TO ADMIN:", booking);

      const response = await axios.post(
        `${ADMIN_API}/bookings/store`,
        booking
      );

      console.log("ADMIN STORE RESPONSE:", response.data);

      return response.data;
    } catch (error) {
      console.error(
        "ADMIN STORE ERROR:",
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

      console.log("Fetching bookings from User Backend...");

      const response = await axios.get(
        `${USER_API}/booking/getbookings`
      );

      console.log("USER BOOKING RESPONSE:", response.data);

      let bookingData = [];

      // If response itself is an array
      if (Array.isArray(response.data)) {
        bookingData = response.data;
      }

      // If response is { bookings: [] }
      else if (Array.isArray(response.data.bookings)) {
        bookingData = response.data.bookings;
      }

      // If response is { data: [] }
      else if (Array.isArray(response.data.data)) {
        bookingData = response.data.data;
      }

      console.log(
        "BOOKINGS FROM USER BACKEND:",
        bookingData
      );

      // =====================================================
      // NORMALIZE BOOKING DATA
      // =====================================================

      const finalBookings = bookingData.map((booking) => {
        let userName = booking.userName || "";

        // Old booking may not have userName
        // So get name from first attendee
        if (
          !userName &&
          Array.isArray(booking.attendees) &&
          booking.attendees.length > 0
        ) {
          userName = booking.attendees[0]?.name || "";
        }

        // If still empty
        if (!userName) {
          userName = "User";
        }

        return {
          sourceBookingId: booking._id,

          userId: booking.userId || null,

          userName: userName,

          userEmail: booking.userEmail || "",

          eventId: booking.eventId || null,

          // EVENT DETAILS
          eventName: booking.eventName || "Event",

          eventDate: booking.eventDate || "",

          eventTime: booking.eventTime || "",

          eventLocation: booking.eventLocation || "",

          eventCategory:
            booking.eventCategory || "Event",

          // TICKET DETAILS
          ticketPrice: booking.ticketPrice ?? 0,

          numberOfTickets:
            booking.numberOfTickets || 0,

          attendees: Array.isArray(booking.attendees)
            ? booking.attendees
            : [],

          totalAmount: booking.totalAmount ?? 0,

          bookingDate:
            booking.bookingDate ||
            booking.createdAt ||
            "",

          status:
            booking.status || "Confirmed",
        };
      });

      console.log(
        "FINAL BOOKINGS:",
        finalBookings
      );

      // Display bookings in Admin Frontend
      setBookings(finalBookings);

      // =====================================================
      // STORE EACH BOOKING IN ADMIN DATABASE
      // =====================================================

      for (const booking of finalBookings) {
        await storeBooking(booking);
      }
    } catch (error) {
      console.error(
        "BOOKING FETCH ERROR:",
        error.response?.data || error.message
      );

      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD BOOKINGS WHEN PAGE OPENS
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

              {/* EVENT NAME */}

              <div className="booking-content">

                <div className="booking-title-row">

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
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>

                  <p>
                    <strong>Time:</strong>{" "}
                    {booking.eventTime || "N/A"}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {booking.eventLocation || "N/A"}
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

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Bookings;