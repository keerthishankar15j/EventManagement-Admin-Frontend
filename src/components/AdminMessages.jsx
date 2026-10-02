import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminMessages.css";

const API_URL =
  import.meta.env.VITE_API_URL || "https://api-admin-rouge.vercel.app";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [selectedMessage, setSelectedMessage] = useState(null);

  const [reply, setReply] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  // =====================================================
  // FETCH MESSAGES
  // =====================================================

  const fetchMessages = async () => {
    try {
      setError("");

      const response = await axios.get(
        `${API_URL}/user-contact/messages`
      );

      if (response.data.success) {
        setMessages(response.data.data || []);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Fetch messages error:", error);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMessages();
  };

  // =====================================================
  // VIEW MESSAGE
  // =====================================================

  const handleView = async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}/user-contact/messages/${id}`
      );

      if (response.data.success) {
        setSelectedMessage(response.data.data);
        setReply("");
      }
    } catch (error) {
      console.error("Get message error:", error);
      alert("Failed to load message");
    }
  };

  // =====================================================
  // SEND REPLY
  // =====================================================

  const sendReply = async () => {
    if (!reply.trim()) {
      alert("Please enter your reply");
      return;
    }

    if (!selectedMessage?._id) {
      alert("Message ID not found");
      return;
    }

    try {
      setReplyLoading(true);

      const response = await axios.post(
        `${API_URL}/user-contact/reply/${selectedMessage._id}`,
        {
          reply: reply.trim(),
        }
      );

      if (response.data.success) {
        alert("Reply sent successfully");

        setReply("");
        setSelectedMessage(null);

        fetchMessages();
      } else {
        alert(response.data.message || "Failed to send reply");
      }
    } catch (error) {
      console.error("Send reply error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to send reply"
      );
    } finally {
      setReplyLoading(false);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredMessages = messages.filter((item) => {
    const searchText = search.toLowerCase();

    return (
      item.name?.toLowerCase().includes(searchText) ||
      item.email?.toLowerCase().includes(searchText) ||
      item.subject?.toLowerCase().includes(searchText) ||
      item.message?.toLowerCase().includes(searchText)
    );
  });

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="messages-page">
        <div className="loading-box">
          Loading messages...
        </div>
      </div>
    );
  }

  return (
    <div className="messages-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="messages-header">

        <div>
          <h1>Messages</h1>

          <p>
            Manage user queries and send replies
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "↻ Refresh"}
        </button>

      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="messages-toolbar">

        <input
          type="text"
          placeholder="Search by name, email, subject or message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <span className="message-count">
          {filteredMessages.length} Messages
        </span>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="messages-table-container">

        <table className="messages-table">

          <thead>
            <tr>
              <th>USER</th>
              <th>SUBJECT</th>
              <th>MESSAGE</th>
              <th>STATUS</th>
              <th>DATE</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>

            {filteredMessages.length === 0 ? (

              <tr>
                <td colSpan="6" className="empty-message">
                  No messages found
                </td>
              </tr>

            ) : (

              filteredMessages.map((item) => (

                <tr key={item._id}>

                  <td>
                    <div className="user-info">

                      <strong>
                        {item.name || "Unknown User"}
                      </strong>

                      <span>
                        {item.email || "-"}
                      </span>

                    </div>
                  </td>

                  <td>
                    {item.subject || "No Subject"}
                  </td>

                  <td>
                    <div className="message-preview">
                      {item.message || "-"}
                    </div>
                  </td>

                  <td>

                    <span
                      className={`status-badge ${
                        item.replied
                          ? "replied"
                          : "pending"
                      }`}
                    >
                      {item.replied
                        ? "Replied"
                        : item.status || "Pending"}
                    </span>

                  </td>

                  <td>
                    {item.createdAt
                      ? new Date(
                          item.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </td>

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
          MESSAGE MODAL
      ===================================================== */}

      {selectedMessage && (

        <div
          className="modal-overlay"
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
                <h2>
                  {selectedMessage.subject ||
                    "User Message"}
                </h2>

                <p>
                  Message details
                </p>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setSelectedMessage(null)
                }
              >
                ×
              </button>

            </div>

            {/* USER */}

            <div className="detail-section">

              <h3>User Details</h3>

              <div className="detail-grid">

                <div>
                  <label>Name</label>
                  <p>
                    {selectedMessage.name ||
                      "-"}
                  </p>
                </div>

                <div>
                  <label>Email</label>
                  <p>
                    {selectedMessage.email ||
                      "-"}
                  </p>
                </div>

              </div>

            </div>

            {/* MESSAGE */}

            <div className="detail-section">

              <h3>User Message</h3>

              <div className="original-message">
                {selectedMessage.message ||
                  "No message"}
              </div>

            </div>

            {/* EXISTING REPLY */}

            {selectedMessage.adminReply && (

              <div className="detail-section">

                <h3>Previous Admin Reply</h3>

                <div className="previous-reply">
                  {selectedMessage.adminReply}
                </div>

              </div>

            )}

            {/* REPLY */}

            <div className="reply-section">

              <h3>Reply to User</h3>

              <textarea
                placeholder="Type your reply here..."
                value={reply}
                onChange={(e) =>
                  setReply(e.target.value)
                }
                rows="5"
              />

              <div className="reply-actions">

                <button
                  className="cancel-btn"
                  onClick={() =>
                    setSelectedMessage(null)
                  }
                >
                  Close
                </button>

                <button
                  className="send-reply-btn"
                  onClick={sendReply}
                  disabled={replyLoading}
                >
                  {replyLoading
                    ? "Sending..."
                    : "Send Reply"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminMessages;