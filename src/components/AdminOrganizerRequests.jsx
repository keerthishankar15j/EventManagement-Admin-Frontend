import React, { useEffect, useState } from "react";
import "../styles/AdminOrganizerRequests.css";
const API_URL =
  "https://api-admin-rouge.vercel.app";

const AdminOrganizerRequests = () => {

  const [requests, setRequests] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  // =====================================================
  // GET ALL REQUESTS
  // =====================================================

  const fetchRequests = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/organization/requests`
      );

      const result =
        await response.json();

      console.log(
        "ORGANIZER REQUESTS:",
        result
      );

      if (!response.ok) {

        throw new Error(
          result.message ||
          "Failed to fetch organizer requests"
        );
      }

      setRequests(
        Array.isArray(result.data)
          ? result.data
          : []
      );

    } catch (error) {

      console.error(
        "Organizer request error:",
        error
      );

      setError(
        error.message
      );

    } finally {

      setLoading(false);
    }
  };

  // =====================================================
  // GET SINGLE REQUEST
  // =====================================================

  const viewRequest = async (id) => {

    try {

      setDetailsLoading(true);

      const response = await fetch(
        `${API_URL}/organization/requests/${id}`
      );

      const result =
        await response.json();

      console.log(
        "SINGLE ORGANIZER REQUEST:",
        result
      );

      if (!response.ok) {

        throw new Error(
          result.message ||
          "Failed to fetch request"
        );
      }

      setSelectedRequest(
        result.data
      );

    } catch (error) {

      console.error(
        "Single request error:",
        error
      );

      alert(
        error.message
      );

    } finally {

      setDetailsLoading(false);
    }
  };

  // =====================================================
  // LOAD REQUESTS
  // =====================================================

  useEffect(() => {

    fetchRequests();

  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="organizer-page">

        <div className="organizer-loading">

          <h2>
            Loading Organizer Requests...
          </h2>

        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
      <div className="organizer-page">

        <div className="organizer-error">

          <h2>
            Unable to Load Requests
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={fetchRequests}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="organizer-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="organizer-header">

        <div>

          <h1>
            Organizer Requests
          </h1>

          <p>
            Review event organization
            requests submitted by users.
          </p>

        </div>

        <div className="request-count">

          {requests.length}

          <span>
            Requests
          </span>

        </div>

      </div>

      {/* =================================================
          REQUEST TABLE
      ================================================= */}

      {requests.length === 0 ? (

        <div className="no-requests">

          <h2>
            No Organizer Requests
          </h2>

          <p>
            There are no organizer requests
            at the moment.
          </p>

        </div>

      ) : (

        <div className="request-table-wrapper">

          <table className="request-table">

            <thead>

              <tr>

                <th>
                  User
                </th>

                <th>
                  Event
                </th>

                <th>
                  Category
                </th>

                <th>
                  Date
                </th>

                <th>
                  Location
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {requests.map(
                (request) => {

                  const id =
                    request._id ||
                    request.id;

                  return (
                    <tr key={id}>

                      {/* USER */}

                      <td>

                        <div className="user-info">

                          <strong>
                            {request.name ||
                              request.userName ||
                              "Unknown"}
                          </strong>

                          <span>
                            {request.email ||
                              "No email"}
                          </span>

                        </div>

                      </td>

                      {/* EVENT */}

                      <td>
                        {request.eventName ||
                          request.event ||
                          "N/A"}
                      </td>

                      {/* CATEGORY */}

                      <td>
                        {request.eventCategory ||
                          request.category ||
                          "N/A"}
                      </td>

                      {/* DATE */}

                      <td>
                        {request.eventDate ||
                          request.date ||
                          "N/A"}
                      </td>

                      {/* LOCATION */}

                      <td>
                        {request.location ||
                          "N/A"}
                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={
                            `status ${
                              (
                                request.status ||
                                "Pending"
                              ).toLowerCase()
                            }`
                          }
                        >

                          {request.status ||
                            "Pending"}

                        </span>

                      </td>

                      {/* ACTION */}

                      <td>

                        <button
                          className="view-btn"
                          onClick={() =>
                            viewRequest(id)
                          }
                        >
                          View
                        </button>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>
      )}

      {/* =================================================
          DETAILS MODAL
      ================================================= */}

      {selectedRequest && (

        <div className="organizer-modal-overlay">

          <div className="organizer-modal">

            <div className="modal-header">

              <div>

                <h2>
                  Organizer Request
                </h2>

                <p>
                  Complete request details
                </p>

              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setSelectedRequest(null)
                }
              >
                ×
              </button>

            </div>

            <div className="modal-content">

              <div className="detail-section">

                <h3>
                  User Details
                </h3>

                <p>
                  <strong>Name:</strong>{" "}
                  {selectedRequest.name ||
                    selectedRequest.userName ||
                    "N/A"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {selectedRequest.email ||
                    "N/A"}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {selectedRequest.phone ||
                    "N/A"}
                </p>

              </div>

              <div className="detail-section">

                <h3>
                  Event Details
                </h3>

                <p>
                  <strong>Event:</strong>{" "}
                  {selectedRequest.eventName ||
                    selectedRequest.event ||
                    "N/A"}
                </p>

                <p>
                  <strong>Category:</strong>{" "}
                  {selectedRequest.eventCategory ||
                    selectedRequest.category ||
                    "N/A"}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {selectedRequest.eventDate ||
                    selectedRequest.date ||
                    "N/A"}
                </p>

                <p>
                  <strong>Time:</strong>{" "}
                  {selectedRequest.eventTime ||
                    selectedRequest.time ||
                    "N/A"}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {selectedRequest.location ||
                    "N/A"}
                </p>

                <p>
                  <strong>Participants:</strong>{" "}
                  {selectedRequest.expectedParticipants ||
                    selectedRequest.participants ||
                    "N/A"}
                </p>

              </div>

              <div className="detail-section">

                <h3>
                  Description
                </h3>

                <p>
                  {selectedRequest.description ||
                    "No description provided."}
                </p>

              </div>

              <div className="detail-section">

                <h3>
                  Status
                </h3>

                <span
                  className={
                    `status ${
                      (
                        selectedRequest.status ||
                        "Pending"
                      ).toLowerCase()
                    }`
                  }
                >

                  {selectedRequest.status ||
                    "Pending"}

                </span>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminOrganizerRequests;