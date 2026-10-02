
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
  "https://user-api-iota-six.vercel.app/booking";

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

      // =================================================
      // HANDLE DIFFERENT API RESPONSE FORMATS
      // =================================================

      if (
        response.data &&
        Array.isArray(response.data.bookings)
      ) {
        setBookings(
          response.data.bookings
        );
      } else if (
        response.data &&
        Array.isArray(response.data.data)
      ) {
        setBookings(
          response.data.data
        );
      } else if (
        Array.isArray(response.data)
      ) {
        setBookings(
          response.data
        );
      } else {
        setBookings([]);
      }

    } catch (error) {
      console.error(
        "Failed to fetch bookings:",
        error
      );

      console.error(
        "API Error Response:",
        error.response?.data
      );

      setBookings([]);

      setError(
        "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // LOAD BOOKINGS WHEN PAGE OPENS
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
  // CONFIRMED BOOKINGS COUNT
  // ===================================================

  const confirmedBookings =
    bookings.filter(
      (booking) =>
        booking.status === "Confirmed" ||
        booking.bookingStatus === "Confirmed"
    ).length;

  // ===================================================
  // TOTAL REVENUE
  // ===================================================

  const totalRevenue =
    bookings.reduce(
      (total, booking) => {

        const amount =
          Number(
            booking.totalAmount ||
            booking.totalPrice ||
            booking.amount ||
            0
          );

        return total + amount;
      },
      0
    );

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
            {confirmedBookings}
          </strong>

        </div>

        {/* TOTAL REVENUE */}

        <div className="booking-stat-card">

          <span>
            Total Revenue
          </span>

          <strong>
            ₹{totalRevenue}
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
                (booking, index) => {

                  // -------------------------------
                  // USER NAME
                  // -------------------------------

                  const userName =
                    booking.userName ||
                    booking.name ||
                    booking.username ||
                    booking.user?.name ||
                    "Unknown User";

                  // -------------------------------
                  // USER EMAIL
                  // -------------------------------

                  const userEmail =
                    booking.userEmail ||
                    booking.email ||
                    booking.user?.email ||
                    "-";

                  // -------------------------------
                  // EVENT NAME
                  // -------------------------------

                  const eventName =
                    booking.eventName ||
                    booking.event?.name ||
                    booking.event?.eventName ||
                    booking.event?.title ||
                    "Event";

                  // -------------------------------
                  // EVENT DATE
                  // -------------------------------

                  const eventDate =
                    booking.eventDate ||
                    booking.event?.date ||
                    booking.date;

                  // -------------------------------
                  // NUMBER OF TICKETS
                  // -------------------------------

                  const numberOfTickets =
                    booking.numberOfTickets ||
                    booking.quantity ||
                    booking.ticketQuantity ||
                    booking.tickets ||
                    0;

                  // -------------------------------
                  // TOTAL AMOUNT
                  // -------------------------------

                  const totalAmount =
                    booking.totalAmount ||
                    booking.totalPrice ||
                    booking.amount ||
                    0;

                  // -------------------------------
                  // STATUS
                  // -------------------------------

                  const status =
                    booking.status ||
                    booking.bookingStatus ||
                    "Confirmed";

                  return (
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
                        {userName}
                      </td>

                      {/* USER EMAIL */}

                      <td>
                        {userEmail}
                      </td>

                      {/* EVENT NAME */}

                      <td>
                        {eventName}
                      </td>

                      {/* EVENT DATE */}

                      <td>

                        {eventDate
                          ? new Date(
                              eventDate
                            ).toLocaleDateString()
                          : "-"}

                      </td>

                      {/* NUMBER OF TICKETS */}

                      <td>
                        {numberOfTickets}
                      </td>

                      {/* TOTAL AMOUNT */}

                      <td>
                        ₹{totalAmount}
                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`booking-status ${
                            status === "Confirmed"
                              ? "confirmed"
                              : "other"
                          }`}
                        >
                          {status}
                        </span>

                      </td>

                    </tr>
                  );
                }
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Bookings;
