import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import "../styles/Bookings.css";

const USER_API =
  "https://user-api-iota-six.vercel.app";

const ADMIN_API =
  "https://api-admin-rouge.vercel.app";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // STORE BOOKING IN ADMIN BACKEND
  // =====================================================

  const storeBooking = async (booking) => {
    try {
      console.log(
        "SENDING BOOKING TO ADMIN:",
        booking
      );

      const response = await axios.post(
        `${ADMIN_API}/bookings/store`,
        booking
      );

      console.log(
        "ADMIN STORE RESPONSE:",
        response.data
      );

      return response.data;

    } catch (error) {
      console.error(
        "ADMIN STORE ERROR:",
        error.response?.data ||
          error.message
      );

      return null;
    }
  };

  // =====================================================
  // FETCH USER BOOKINGS
  // =====================================================

  const fetchBookings = async () => {
    try {
      setLoading(true);

      console.log(
        "Fetching bookings from User Backend..."
      );

      // =================================================
      // GET BOOKINGS
      // =================================================

      const response = await axios.get(
        `${USER_API}/booking/getbookings`
      );

      console.log(
        "USER BOOKING RESPONSE:",
        response.data
      );

      // =================================================
      // GET BOOKINGS ARRAY
      // =================================================

      let bookingData = [];

      if (
        Array.isArray(response.data)
      ) {
        bookingData = response.data;
      } else if (
        Array.isArray(
          response.data.bookings
        )
      ) {
        bookingData =
          response.data.bookings;
      } else if (
        Array.isArray(
          response.data.data
        )
      ) {
        bookingData =
          response.data.data;
      }

      console.log(
        "BOOKINGS FROM USER BACKEND:",
        bookingData
      );

      // =================================================
      // PROCESS EACH BOOKING
      // =================================================

      const bookingsWithImages =
        await Promise.all(
          bookingData.map(
            async (booking) => {
              let eventData = null;
              let eventImage = "";

              // =================================================
              // USER NAME
              // =================================================

              let userName =
                booking.userName || "";

              // Old booking may not have userName
              if (
                !userName &&
                Array.isArray(
                  booking.attendees
                ) &&
                booking.attendees.length >
                  0
              ) {
                userName =
                  booking.attendees[0]
                    ?.name || "";
              }

              // If still empty
              if (!userName) {
                userName = "User";
              }

              // =================================================
              // GET EVENT DETAILS
              // =================================================

              if (booking.eventId) {
                try {
                  const eventResponse =
                    await axios.get(
                      `${USER_API}/events/get/${booking.eventId}`
                    );

                  console.log(
                    "EVENT RESPONSE:",
                    eventResponse.data
                  );

                  eventData =
                    eventResponse.data?.data;

                  // Get event image
                  eventImage =
                    eventData?.imageUrl ||
                    "";

                } catch (error) {
                  // =================================================
                  // EVENT NO LONGER EXISTS
                  // =================================================

                  console.log(
                    `Event ${booking.eventId} not found. Using booking data.`
                  );

                  eventData = null;

                  eventImage = "";
                }
              }

              // =================================================
              // FINAL BOOKING OBJECT
              // =================================================

              return {
                // User booking ID
                sourceBookingId:
                  booking._id,

                // User details
                userId:
                  booking.userId ||
                  null,

                userName:
                  userName,

                userEmail:
                  booking.userEmail ||
                  "",

                // Event details
                eventId:
                  booking.eventId ||
                  null,

                eventName:
                  booking.eventName ||
                  eventData?.name ||
                  "Event",

                eventDate:
                  booking.eventDate ||
                  eventData?.date ||
                  "",

                eventTime:
                  booking.eventTime ||
                  eventData?.time ||
                  "",

                eventLocation:
                  booking.eventLocation ||
                  eventData?.location ||
                  "",

                eventCategory:
                  booking.eventCategory ||
                  eventData?.category ||
                  "Event",

                // Event image
                eventImage:
                  eventImage,

                // Ticket details
                ticketPrice:
                  booking.ticketPrice ??
                  eventData?.ticketPrice ??
                  0,

                numberOfTickets:
                  booking.numberOfTickets ||
                  0,

                // Attendees
                attendees:
                  Array.isArray(
                    booking.attendees
                  )
                    ? booking.attendees
                    : [],

                // Amount
                totalAmount:
                  booking.totalAmount ??
                  0,

                // Booking details
                bookingDate:
                  booking.bookingDate ||
                  booking.createdAt ||
                  "",

                status:
                  booking.status ||
                  "Confirmed",
              };
            }
          )
        );

      console.log(
        "FINAL BOOKINGS:",
        bookingsWithImages
      );

      // =================================================
      // DISPLAY BOOKINGS
      // =================================================

      setBookings(
        bookingsWithImages
      );

      // =================================================
      // STORE IN ADMIN BACKEND
      // =================================================

      for (
        const booking of bookingsWithImages
      ) {
        await storeBooking(
          booking
        );
      }

    } catch (error) {
      console.error(
        "BOOKING FETCH ERROR:",
        error.response?.data ||
          error.message
      );

      setBookings([]);

    } finally {
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
  // MAIN UI
  // =====================================================

  return (
    <div className="bookings-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="bookings-header">
        <div>
          <h1>Bookings</h1>

          <p>
            Manage all event bookings
          </p>
        </div>

        <div className="booking-count">
          {bookings.length} Bookings
        </div>
      </div>

      {/* =================================================
          NO BOOKINGS
      ================================================= */}

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

        /* =================================================
           BOOKING GRID
        ================================================= */

        <div className="bookings-grid">

          {bookings.map(
            (booking) => (

              <div
                className="booking-card"
                key={
                  booking.sourceBookingId
                }
              >

                {/* =========================================
                    EVENT IMAGE
                ========================================= */}

                <div className="booking-image">

                  {booking.eventImage ? (

                    <img
                      src={
                        booking.eventImage
                      }
                      alt={
                        booking.eventName
                      }
                    />

                  ) : (

                    <div className="no-image">
                      No Image
                    </div>

                  )}

                </div>

                {/* =========================================
                    BOOKING CONTENT
                ========================================= */}

                <div className="booking-content">

                  {/* EVENT NAME */}

                  <h3>
                    {booking.eventName}
                  </h3>

                  {/* STATUS */}

                  <span
                    className={
                      booking.status ===
                      "Cancelled"
                        ? "booking-status cancelled"
                        : "booking-status confirmed"
                    }
                  >
                    {booking.status}
                  </span>

                  {/* =====================================
                      USER DETAILS
                  ===================================== */}

                  <div className="booking-section">

                    <h4>
                      User Details
                    </h4>

                    <p>
                      <strong>
                        Name:
                      </strong>{" "}
                      {booking.userName}
                    </p>

                    <p>
                      <strong>
                        Email:
                      </strong>{" "}
                      {booking.userEmail}
                    </p>

                  </div>

                  {/* =====================================
                      EVENT DETAILS
                  ===================================== */}

                  <div className="booking-section">

                    <h4>
                      Event Details
                    </h4>

                    <p>
                      <strong>
                        Date:
                      </strong>{" "}
                      {booking.eventDate
                        ? new Date(
                            booking.eventDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>

                    <p>
                      <strong>
                        Time:
                      </strong>{" "}
                      {booking.eventTime ||
                        "N/A"}
                    </p>

                    <p>
                      <strong>
                        Location:
                      </strong>{" "}
                      {booking.eventLocation ||
                        "N/A"}
                    </p>

                    <p>
                      <strong>
                        Category:
                      </strong>{" "}
                      {booking.eventCategory ||
                        "Event"}
                    </p>

                  </div>

                  {/* =====================================
                      TICKET DETAILS
                  ===================================== */}

                  <div className="booking-section">

                    <h4>
                      Ticket Details
                    </h4>

                    <p>
                      <strong>
                        Tickets:
                      </strong>{" "}
                      {
                        booking.numberOfTickets
                      }
                    </p>

                    <p>
                      <strong>
                        Ticket Price:
                      </strong>{" "}
                      ₹
                      {
                        booking.ticketPrice
                      }
                    </p>

                    <p>
                      <strong>
                        Total Amount:
                      </strong>{" "}
                      ₹
                      {
                        booking.totalAmount
                      }
                    </p>

                  </div>

                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}

export default Bookings;