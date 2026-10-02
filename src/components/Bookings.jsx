
import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import "../styles/Bookings.css";

// ===================================================
// USER BOOKING API
// ===================================================

const USER_BOOKING_API =
  "https://user-api-iota-six.vercel.app/booking/getbookingsfix";

const Bookings = () => {
  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ===================================================
  // FETCH BOOKINGS FROM USER API
  // ===================================================

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${USER_BOOKING_API}/getbookings`
      );

      console.log(
        "USER BOOKINGS RESPONSE:",
        response.data
      );

      // API response:
      // {
      //   success: true,
      //   bookings: [...]
      // }

      if (
        response.data &&
        Array.isArray(
          response.data.bookings
        )
      ) {
        setBookings(
          response.data.bookings
        );
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error(
        "Failed to fetch bookings:",
        error
      );

      setError(
        "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // LOAD BOOKINGS
  // ===================================================

  useEffect(() => {
    fetchBookings();
  }, []);

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="bookings-page">
        <div className="bookings-loading">
          Loading bookings...
        </div>
      </div>
    );
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <div className="bookings-page">

      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <div className="bookings-header">

        <div>
          <h1>
            Bookings
          </h1>

          <p>
            Manage event bookings
          </p>
        </div>

        <button
          className="sync-button"
          onClick={fetchBookings}
        >
          🔄 Refresh Bookings
        </button>

      </div>

      {/* ============================================= */}
      {/* ERROR */}
      {/* ============================================= */}

      {error && (
        <div className="booking-error">
          {error}
        </div>
      )}

      {/* ============================================= */}
      {/* STATS */}
      {/* ============================================= */}

      <div className="booking-stats">

        {/* TOTAL BOOKINGS */}

        <div className="booking-stat-card">

          <span>
            Total Bookings
          </span>

          <strong>
            {bookings.length}
          </strong>

        </div>

        {/* CONFIRMED BOOKINGS */}

        <div className="booking-stat-card">

          <span>
            Confirmed
          </span>

          <strong>
            {
              bookings.filter(
                (booking) =>
                  booking.status ===
                  "Confirmed"
              ).length
            }
          </strong>

        </div>

        {/* TOTAL REVENUE */}

        <div className="booking-stat-card">

          <span>
            Total Revenue
          </span>

          <strong>
            ₹
            {bookings.reduce(
              (total, booking) =>
                total +
                Number(
                  booking.totalAmount || 0
                ),
              0
            )}
          </strong>

        </div>

      </div>

      {/* ============================================= */}
      {/* BOOKING TABLE */}
      {/* ============================================= */}

      <div className="booking-table-container">

        <table className="booking-table">

          <thead>

            <tr>

              <th>
                #
              </th>

              <th>
                User
              </th>

              <th>
                Email
              </th>

              <th>
                Event
              </th>

              <th>
                Date
              </th>

              <th>
                Tickets
              </th>

              <th>
                Amount
              </th>

              <th>
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {/* ======================================= */}
            {/* NO BOOKINGS */}
            {/* ======================================= */}

            {bookings.length === 0 ? (

              <tr>

                <td
                  colSpan="8"
                  className="no-bookings"
                >
                  No bookings found
                </td>

              </tr>

            ) : (

              /* ===================================== */
              /* BOOKINGS */
              /* ===================================== */

              bookings.map(
                (booking, index) => (

                  <tr
                    key={
                      booking._id ||
                      booking.bookingId ||
                      index
                    }
                  >

                    {/* NUMBER */}

                    <td>
                      {index + 1}
                    </td>

                    {/* USER NAME */}

                    <td>
                      {booking.userName ||
                        "Unknown User"}
                    </td>

                    {/* USER EMAIL */}

                    <td>
                      {booking.userEmail ||
                        "-"}
                    </td>

                    {/* EVENT NAME */}

                    <td>
                      {booking.eventName ||
                        "Event"}
                    </td>

                    {/* EVENT DATE */}

                    <td>
                      {booking.eventDate
                        ? new Date(
                            booking.eventDate
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* NUMBER OF TICKETS */}

                    <td>
                      {booking.numberOfTickets ||
                        0}
                    </td>

                    {/* TOTAL AMOUNT */}

                    <td>
                      ₹
                      {booking.totalAmount ||
                        0}
                    </td>

                    {/* STATUS */}

                    <td>

                      <span
                        className={`booking-status ${
                          booking.status ===
                          "Confirmed"
                            ? "confirmed"
                            : "other"
                        }`}
                      >
                        {booking.status ||
                          "Confirmed"}
                      </span>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Bookings;

