import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminOrganizerRequests.css";

const API_URL =
  import.meta.env.VITE_API_URL || "https://api-admin-rouge.vercel.app";

const AdminOrganizerRequests = () => {

  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [adminMessage, setAdminMessage] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState(false);

  // =====================================================
  // FETCH REQUESTS
  // =====================================================

  const fetchRequests = async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        `${API_URL}/organization/requests`
      );

      if (response.data.success) {

        setRequests(
          response.data.data || []
        );

      } else {

        setRequests([]);

      }

    } catch (error) {

      console.error(
        "Fetch organizer requests error:",
        error
      );

      alert("Failed to load organizer requests");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchRequests();

  }, []);

  // =====================================================
  // VIEW REQUEST
  // =====================================================

  const handleView = async (id) => {

    try {

      const response = await axios.get(
        `${API_URL}/organization/requests/${id}`
      );

      if (response.data.success) {

        setSelectedRequest(
          response.data.data
        );

        setAdminMessage(
          response.data.data.adminMessage || ""
        );

      }

    } catch (error) {

      console.error(
        "Get organizer request error:",
        error
      );

      alert("Failed to load request");

    }

  };

  // =====================================================
  // APPROVE / REJECT
  // =====================================================

  const updateRequestStatus = async (
    status
  ) => {

    if (!selectedRequest?._id) {

      alert("Request ID not found");

      return;

    }

    const confirmMessage =
      status === "Approved"
        ? "Are you sure you want to approve this request?"
        : "Are you sure you want to reject this request?";

    if (!window.confirm(confirmMessage)) {

      return;

    }

    try {

      setActionLoading(true);

      const response = await axios.put(
        `${API_URL}/organization/requests/${selectedRequest._id}/status`,
        {
          status: status,
          adminMessage: adminMessage.trim(),
        }
      );

      if (response.data.success) {

        alert(
          status === "Approved"
            ? "Request approved and email sent"
            : "Request rejected and email sent"
        );

        setSelectedRequest(null);

        setAdminMessage("");

        fetchRequests();

      } else {

        alert(
          response.data.message ||
            "Failed to update request"
        );

      }

    } catch (error) {

      console.error(
        "Update organizer request error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update request"
      );

    } finally {

      setActionLoading(false);

    }

  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {

    if (status === "Approved") {
      return "approved";
    }

    if (status === "Rejected") {
      return "rejected";
    }

    return "pending";

  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="organizer-page">

        <div className="loading-box">
          Loading organizer requests...
        </div>

      </div>
    );

  }

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="organizer-page">

      {/* HEADER */}

      <div className="organizer-header">

        <div>

          <h1>
            Organizer Requests
          </h1>

          <p>
            Review and manage event organization requests
          </p>

        </div>

        <button
          className="refresh-btn"
          onClick={fetchRequests}
        >
          ↻ Refresh
        </button>

      </div>

      {/* TABLE */}

      <div className="organizer-table-container">

        <table className="organizer-table">

          <thead>

            <tr>

              <th>USER</th>
              <th>EVENT</th>
              <th>CATEGORY</th>
              <th>DATE</th>
              <th>LOCATION</th>
              <th>STATUS</th>
              <th>ACTION</th>

            </tr>

          </thead>

          <tbody>

            {requests.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="empty-message"
                >
                  No organizer requests found
                </td>

              </tr>

            ) : (

              requests.map((item) => (

                <tr key={item._id}>

                  {/* USER */}

                  <td>

                    <div className="user-info">

                      <strong>
                        {item.name ||
                          "Unknown"}
                      </strong>

                      <span>
                        {item.email ||
                          "-"}
                      </span>

                    </div>

                  </td>

                  {/* EVENT */}

                  <td>

                    <strong>
                      {item.eventName ||
                        "-"}
                    </strong>

                  </td>

                  {/* CATEGORY */}

                  <td>

                    {item.eventCategory ||
                      "-"}

                  </td>

                  {/* DATE */}

                  <td>

                    {item.eventDate
                      ? new Date(
                          item.eventDate
                        ).toLocaleDateString()
                      : "-"}

                  </td>

                  {/* LOCATION */}

                  <td>

                    {item.location ||
                      "-"}

                  </td>

                  {/* STATUS */}

                  <td>

                    <span
                      className={`status-badge ${getStatusClass(
                        item.status
                      )}`}
                    >
                      {item.status ||
                        "Pending"}
                    </span>

                  </td>

                  {/* ACTION */}

                  <td>

                    <button
                      className="view-btn"
                      onClick={() =>
                        handleView(item._id)
                      }
                    >
                      View
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* =====================================================
          MODAL
      ===================================================== */}

      {selectedRequest && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedRequest(null)
          }
        >

          <div
            className="organizer-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <h2>
                  Organizer Request
                </h2>

                <p>
                  Review event details
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

            {/* USER DETAILS */}

            <div className="detail-section">

              <h3>
                Organizer Details
              </h3>

              <div className="detail-grid">

                <div>

                  <label>Name</label>

                  <p>
                    {selectedRequest.name ||
                      "-"}
                  </p>

                </div>

                <div>

                  <label>Email</label>

                  <p>
                    {selectedRequest.email ||
                      "-"}
                  </p>

                </div>

                <div>

                  <label>Phone</label>

                  <p>
                    {selectedRequest.phone ||
                      "-"}
                  </p>

                </div>

              </div>

            </div>

            {/* EVENT DETAILS */}

            <div className="detail-section">

              <h3>
                Event Details
              </h3>

              <div className="detail-grid">

                <div>

                  <label>Event Name</label>

                  <p>
                    {selectedRequest.eventName ||
                      "-"}
                  </p>

                </div>

                <div>

                  <label>Category</label>

                  <p>
                    {selectedRequest.eventCategory ||
                      "-"}
                  </p>

                </div>

                <div>

                  <label>Date</label>

                  <p>
                    {selectedRequest.eventDate
                      ? new Date(
                          selectedRequest.eventDate
                        ).toLocaleDateString()
                      : "-"}
                  </p>

                </div>

                <div>

                  <label>Time</label>

                  <p>
                    {selectedRequest.eventTime ||
                      "-"}
                  </p>

                </div>

                <div>

                  <label>Location</label>

                  <p>
                    {selectedRequest.location ||
                      "-"}
                  </p>

                </div>

                <div>

                  <label>Expected Participants</label>

                  <p>
                    {selectedRequest.expectedParticipants ||
                      "-"}
                  </p>

                </div>

              </div>

            </div>

            {/* DESCRIPTION */}

            <div className="detail-section">

              <h3>
                Description
              </h3>

              <div className="description-box">

                {selectedRequest.description ||
                  "No description provided"}

              </div>

            </div>

            {/* STATUS */}

            <div className="detail-section">

              <h3>
                Current Status
              </h3>

              <span
                className={`status-badge ${getStatusClass(
                  selectedRequest.status
                )}`}
              >
                {selectedRequest.status ||
                  "Pending"}
              </span>

            </div>

            {/* ADMIN MESSAGE */}

            <div className="admin-message-section">

              <h3>
                Message to Organizer
              </h3>

              <textarea
                rows="5"
                placeholder="Enter a message for the organizer..."
                value={adminMessage}
                onChange={(e) =>
                  setAdminMessage(
                    e.target.value
                  )
                }
              />

            </div>

            {/* ACTION BUTTONS */}

            <div className="modal-actions">

              <button
                className="reject-btn"
                onClick={() =>
                  updateRequestStatus(
                    "Rejected"
                  )
                }
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Processing..."
                  : "Reject"}
              </button>

              <button
                className="approve-btn"
                onClick={() =>
                  updateRequestStatus(
                    "Approved"
                  )
                }
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Processing..."
                  : "Approve"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default AdminOrganizerRequests;