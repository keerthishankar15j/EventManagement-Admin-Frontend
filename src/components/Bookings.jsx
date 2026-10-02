import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import "../styles/Bookings.css";

const ADMIN_BOOKING_API =
  "https://api-admin-rouge.vercel.app/bookings";

const Bookings = () => {
  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ===================================================
  // FETCH STORED BOOKINGS
  // ===================================================

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${ADMIN_BOOKING_API}/getbookings`
      );

      console.log(
        "ADMIN BOOKINGS RESPONSE:",
        response.data
      );

      if (
        response.data &&
        Array.isArray(response.data.data)
      ) {
        setBookings(response.data.data);
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
  // SYNC USER BOOKINGS
  // ===================================================

  const syncBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${ADMIN_BOOKING_API}/sync`
      );

      console.log(
        "BOOKINGS SYNC RESPONSE:",
        response.data
      );

      alert(
        `${response.data.count || 0} bookings synced successfully`
      );

      await fetchBookings();
    } catch (error) {
      console.error(
        "Booking sync failed:",
        error
      );

      setError(
        "Failed to sync bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // LOAD
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

      <div className="bookings-header">

        <div>
          <h1>Bookings</h1>

          <p>
            Manage event bookings
          </p>
        </div>

        <button
          className="sync-button"
          onClick={syncBookings}
        >
          🔄 Sync Bookings
        </button>

      </div>

      {error && (
        <div className="booking-error">
          {error}
        </div>
      )}

      <div className="booking-stats">

        <div className="booking-stat-card">
          <span>
            Total Bookings
          </span>

          <strong>
            {bookings.length}
          </strong>
        </div>

        <div className="booking-stat-card">
          <span>
            Confirmed
          </span>

          <strong>
            {
              bookings.filter(
                (booking) =>
                  booking.bookingStatus ===
                  "Confirmed"
              ).length
            }
          </strong>
        </div>

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

              bookings.map(
                (booking, index) => (

                  <tr
                    key={
                      booking._id ||
                      booking.bookingId ||
                      index
                    }
                  >

                    <td>
                      {index + 1}
                    </td>

                    <td>
                      {booking.name ||
                        "Unknown User"}
                    </td>

                    <td>
                      {booking.email ||
                        "-"}
                    </td>

                    <td>
                      {booking.eventName ||
                        "Event"}
                    </td>

                    <td>
                      {booking.eventDate ||
                        "-"}
                    </td>

                    <td>
                      {booking.quantity ||
                        1}
                    </td>

                    <td>
                      ₹
                      {booking.totalAmount ||
                        0}
                    </td>

                    <td>
                      <span
                        className={`booking-status ${
                          booking.bookingStatus ===
                          "Confirmed"
                            ? "confirmed"
                            : "other"
                        }`}
                      >
                        {
                          booking.bookingStatus ||
                          "Confirmed"
                        }
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