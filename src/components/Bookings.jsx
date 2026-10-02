
import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import styles from "../styles/Bookings.css"
const USER_API =
  "https://user-api-iota-six.vercel.app";

const ADMIN_API =
  "https://api-admin-rouge.vercel.app";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH USER BOOKINGS
  // =====================================================

  const fetchBookings = async () => {
    try {
      setLoading(true);

      console.log(
        "Fetching bookings from User Backend..."
      );

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
      // GET EVENT IMAGE
      // =================================================

      const bookingsWithImages =
        await Promise.all(
          bookingData.map(
            async (booking) => {

              let eventImage = "";

              let eventData = null;

              // =========================================
              // GET EVENT DETAILS
              // =========================================

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

                  eventImage =
                    eventData?.imageUrl ||
                    "";

                } catch (error) {
                  console.error(
                    `EVENT FETCH ERROR FOR ${booking.eventId}:`,
                    error.response?.data ||
                    error.message
                  );
                }
              }

              // =========================================
              // CREATE FINAL BOOKING OBJECT
              // =========================================

              return {
                // User booking ID
                sourceBookingId:
                  booking._id,

                // User details
                userId:
                  booking.userId,

                userName:
                  booking.userName ||
                  "",

                userEmail:
                  booking.userEmail ||
                  "",

                // Event details
                eventId:
                  booking.eventId,

                eventName:
                  booking.eventName ||
                  eventData?.name ||
                  "",

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
                  booking.numberOfTickets,

                // Attendees
                attendees:
                  booking.attendees || [],

                // Amount
                totalAmount:
                  booking.totalAmount ?? 0,

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
      // STORE BOOKINGS IN ADMIN BACKEND
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
  // STORE BOOKING IN ADMIN BACKEND
  // =====================================================

  const storeBooking = async (
    booking
  ) => {

    try {

      console.log(
        "SENDING BOOKING TO ADMIN:",
        booking
      );

      const response =
        await axios.post(
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
      <div>
        Loading bookings...
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div>

      <h1>Bookings</h1>

      {bookings.length === 0 ? (

        <p>
          No bookings found.
        </p>

      ) : (

        bookings.map(
          (booking) => (

            <div
              key={booking._id}
              style={{
                border:
                  "1px solid #ddd",
                padding: "20px",
                marginBottom: "20px",
              }}
            >

              {/* =====================================
                  EVENT IMAGE
              ===================================== */}

              {booking.eventImage && (
                <img
                  src={
                    booking.eventImage
                  }
                  alt={
                    booking.eventName
                  }
                  width="200"
                  style={{
                    display:
                      "block",
                    marginBottom:
                      "15px",
                  }}
                />
              )}

              {/* =====================================
                  EVENT NAME
              ===================================== */}

              <h3>
                {booking.eventName}
              </h3>

              {/* =====================================
                  USER
              ===================================== */}

              <p>
                <strong>
                  User:
                </strong>{" "}
                {booking.userName}
              </p>

              <p>
                <strong>
                  Email:
                </strong>{" "}
                {booking.userEmail}
              </p>

              {/* =====================================
                  EVENT DETAILS
              ===================================== */}

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

              {/* =====================================
                  TICKETS
              ===================================== */}

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

              {/* =====================================
                  STATUS
              ===================================== */}

              <p>
                <strong>
                  Status:
                </strong>{" "}
                {booking.status}
              </p>

            </div>
          )
        )
      )}

    </div>
  );
}

export default Bookings;