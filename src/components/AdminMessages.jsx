import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminMessages.css";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://api-admin-rouge.vercel.app"
).replace(/\/+$/, "");

const AdminMessages = () => {

  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [selectedMessage, setSelectedMessage] = useState(null);


  // =====================================================
  // FETCH MESSAGES
  // =====================================================

  const fetchMessages = async (isRefresh = false) => {

    try {

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      console.log("MESSAGES PAGE: API CALL");

      const response = await axios.get(
        `${API_URL}/user-contact/messages`
      );

      console.log(
        "Messages API Response:",
        response.data
      );


      const receivedMessages =
        Array.isArray(response.data?.data)
          ? response.data.data
          : [];


      setMessages(receivedMessages);

    } catch (error) {

      console.error(
        "Messages Error:",
        error
      );

      console.error(
        "Server response:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
        "Unable to fetch messages"
      );

      setMessages([]);

    } finally {

      setLoading(false);
      setRefreshing(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchMessages();

  }, []);


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredMessages = messages.filter((item) => {

    const searchText =
      search.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    return (

      String(item.name || "")
        .toLowerCase()
        .includes(searchText)

      ||

      String(item.email || "")
        .toLowerCase()
        .includes(searchText)

      ||

      String(item.subject || "")
        .toLowerCase()
        .includes(searchText)

      ||

      String(item.message || "")
        .toLowerCase()
        .includes(searchText)

    );

  });


  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "—";
    }

    const newDate = new Date(date);

    if (isNaN(newDate.getTime())) {
      return "—";
    }

    return newDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // =====================================================
  // MESSAGE PREVIEW
  // =====================================================

  const getMessagePreview = (message) => {

    if (!message) {
      return "No message";
    }

    if (message.length <= 70) {
      return message;
    }

    return message.substring(0, 70) + "...";

  };


  return (
    <div className="messages-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="messages-header">

        <div>

          <div className="page-badge">
            <span>✉</span>
            INBOX
          </div>

          <h1>
            User Messages
          </h1>

          <p>
            View and manage messages received
            from your users.
          </p>

        </div>


        <button
          className="refresh-btn"
          onClick={() => fetchMessages(true)}
          disabled={refreshing}
        >

          <span className={refreshing ? "spin" : ""}>
            ↻
          </span>

          {refreshing
            ? "Refreshing..."
            : "Refresh"
          }

        </button>

      </div>


      {/* =================================================
          STATS
      ================================================= */}

      <div className="message-stats">

        <div className="stat-card">

          <div className="stat-icon purple">
            ✉
          </div>

          <div>

            <span>
              Total Messages
            </span>

            <strong>
              {messages.length}
            </strong>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon orange">
            ●
          </div>

          <div>

            <span>
              Unread
            </span>

            <strong>
              {messages.filter(
                (item) =>
                  !item.status ||
                  item.status === "Unread"
              ).length}
            </strong>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon blue">
            ?
          </div>

          <div>

            <span>
              Queries
            </span>

            <strong>
              {messages.filter(
                (item) =>
                  item.subject
              ).length}
            </strong>

          </div>

        </div>

      </div>


      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="messages-toolbar">

        <div className="search-box">

          <span>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search by name, email, subject or message..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="clear-search"
            >
              ×
            </button>
          )}

        </div>

        <div className="result-count">
          {filteredMessages.length} message
          {filteredMessages.length !== 1
            ? "s"
            : ""
          }
        </div>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="message-error">

          <span>⚠</span>

          <div>

            <strong>
              Unable to load messages
            </strong>

            <p>
              {error}
            </p>

          </div>

          <button
            onClick={() => fetchMessages()}
          >
            Try Again
          </button>

        </div>

      )}


      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (

        <div className="message-loading">

          <div className="loader"></div>

          <p>
            Loading messages...
          </p>

        </div>

      ) : filteredMessages.length === 0 ? (

        /* ===============================================
           EMPTY
        =============================================== */

        <div className="empty-messages">

          <div className="empty-icon">
            ✉
          </div>

          <h2>
            No Messages Found
          </h2>

          <p>
            {search
              ? "No messages match your search."
              : "No user messages have been received yet."
            }
          </p>

        </div>

      ) : (

        /* ===============================================
           TABLE
        =============================================== */

        <div className="messages-table-wrapper">

          <table className="messages-table">

            <thead>

              <tr>

                <th>
                  USER
                </th>

                <th>
                  SUBJECT
                </th>

                <th>
                  MESSAGE
                </th>

                <th>
                  STATUS
                </th>

                <th>
                  DATE
                </th>

                <th>
                  ACTION
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredMessages.map(
                (item, index) => (

                  <tr
                    key={
                      item._id ||
                      item.id ||
                      index
                    }
                  >

                    {/* USER */}

                    <td>

                      <div className="user-cell">

                        <div className="user-avatar">
                          {(
                            item.name ||
                            "U"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <strong>
                            {item.name ||
                              "Unknown User"}
                          </strong>

                          <small>
                            {item.email ||
                              "No email"}
                          </small>

                        </div>

                      </div>

                    </td>


                    {/* SUBJECT */}

                    <td>

                      <span className="subject-text">
                        {item.subject ||
                          "General Query"}
                      </span>

                    </td>


                    {/* MESSAGE */}

                    <td>

                      <div className="message-preview">
                        {getMessagePreview(
                          item.message
                        )}
                      </div>

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={
                          item.status ===
                          "Read"
                            ? "status-badge read"
                            : "status-badge unread"
                        }
                      >

                        <span>
                          ●
                        </span>

                        {item.status ||
                          "Unread"}

                      </span>

                    </td>


                    {/* DATE */}

                    <td>

                      <span className="date-text">
                        {formatDate(
                          item.createdAt
                        )}
                      </span>

                    </td>


                    {/* ACTION */}

                    <td>

                      <button
                        className="view-btn"
                        onClick={() =>
                          setSelectedMessage(
                            item
                          )
                        }
                      >
                        View
                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}


      {/* =================================================
          VIEW MESSAGE MODAL
      ================================================= */}

      {selectedMessage && (

        <div
          className="message-modal-overlay"
          onClick={() =>
            setSelectedMessage(null)
          }
        >

          <div
            className="message-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <span className="modal-label">
                  USER MESSAGE
                </span>

                <h2>
                  {selectedMessage.subject ||
                    "Message Details"}
                </h2>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setSelectedMessage(null)
                }
              >
                ×
              </button>

            </div>


            <div className="modal-user">

              <div className="modal-avatar">
                {(
                  selectedMessage.name ||
                  "U"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>

                <strong>
                  {selectedMessage.name ||
                    "Unknown User"}
                </strong>

                <span>
                  {selectedMessage.email ||
                    "No email"}
                </span>

              </div>

            </div>


            <div className="modal-message">

              <label>
                MESSAGE
              </label>

              <p>
                {selectedMessage.message ||
                  "No message available."}
              </p>

            </div>


            <div className="modal-details">

              <div>

                <span>
                  Received
                </span>

                <strong>
                  {formatDate(
                    selectedMessage.createdAt
                  )}
                </strong>

              </div>


              <div>

                <span>
                  Status
                </span>

                <strong>
                  {selectedMessage.status ||
                    "Unread"}
                </strong>

              </div>

            </div>


            <button
              className="modal-done"
              onClick={() =>
                setSelectedMessage(null)
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminMessages;