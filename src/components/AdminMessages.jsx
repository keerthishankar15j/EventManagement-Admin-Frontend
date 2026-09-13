import React, { useState } from "react";
import "../styles/AdminMessages.css";

const AdminMessages = () => {

  const [activeTab, setActiveTab] = useState("messages");
  const [selectedItem, setSelectedItem] = useState(null);
  const [reply, setReply] = useState("");


  // ==============================
  // MESSAGES
  // ==============================

  const messages = [
    {
      id: 1,
      name: "Priya Sharma",
      email: "priya@gmail.com",
      phone: "+91 98765 43210",
      subject: "Ticket Booking",
      message:
        "Hi, I have a question about the ticket booking process. Can you please guide me through the booking process?",
      date: "12 Sep 2026",
      time: "10:24 AM"
    },
    {
      id: 2,
      name: "Rahul Kumar",
      email: "rahul@gmail.com",
      phone: "+91 91234 56789",
      subject: "Event Location",
      message:
        "Can you please share the event location details? I would like to know the exact venue and parking availability.",
      date: "12 Sep 2026",
      time: "04:15 PM"
    },
    {
      id: 3,
      name: "Vikram Singh",
      email: "vikram@gmail.com",
      phone: "+91 99887 66554",
      subject: "Event Feedback",
      message:
        "Thanks for organizing the event. It was really helpful and informative. I enjoyed attending the event.",
      date: "11 Sep 2026",
      time: "11:45 AM"
    }
  ];


  // ==============================
  // QUERIES
  // ==============================

  const queries = [
    {
      id: 1,
      name: "Sneha Patel",
      email: "sneha@gmail.com",
      phone: "+91 98765 12345",
      subject: "Registration Query",
      message:
        "I want to register for the tech conference. How can I complete my registration?",
      date: "12 Sep 2026",
      time: "02:20 PM"
    },
    {
      id: 2,
      name: "Ananya Reddy",
      email: "ananya@gmail.com",
      phone: "+91 91234 56780",
      subject: "Payment Query",
      message:
        "I completed the payment but I have not received my confirmation email yet.",
      date: "11 Sep 2026",
      time: "09:30 AM"
    }
  ];


  // ==============================
  // CONTACT REQUESTS
  // ==============================

  const contacts = [
    {
      id: 1,
      name: "Arjun Kumar",
      phone: "+91 98765 11111",
      email: "arjun@gmail.com",
      time: "10:30 AM",
      date: "12 Sep 2026",
      location: "Chennai, Tamil Nadu",
      details:
        "I would like to contact the event management team regarding the upcoming event."
    },
    {
      id: 2,
      name: "Meena Raj",
      phone: "+91 91234 22222",
      email: "meena@gmail.com",
      time: "01:15 PM",
      date: "12 Sep 2026",
      location: "Coimbatore, Tamil Nadu",
      details:
        "Please contact me regarding the event registration and available seats."
    },
    {
      id: 3,
      name: "Karthik S",
      phone: "+91 99887 33333",
      email: "karthik@gmail.com",
      time: "04:45 PM",
      date: "11 Sep 2026",
      location: "Madurai, Tamil Nadu",
      details:
        "I need some information about the upcoming events and ticket availability."
    }
  ];


  // ==============================
  // CURRENT DATA
  // ==============================

  const currentData =
    activeTab === "messages"
      ? messages
      : activeTab === "queries"
      ? queries
      : contacts;


  // ==============================
  // TAB CHANGE
  // ==============================

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedItem(null);
    setReply("");
  };


  // ==============================
  // SELECT
  // ==============================

  const handleSelect = (item) => {
    setSelectedItem(item);
    setReply("");
  };


  // ==============================
  // REPLY
  // ==============================

  const handleReply = () => {

    if (!reply.trim()) {
      alert("Please enter your reply");
      return;
    }

    alert(`Reply sent to ${selectedItem.name}`);

    setReply("");
  };


  return (

    <div className="messages-page">

      {/* =================================
          HEADER
      ================================= */}

      <div className="messages-header">

        <div>
          <p className="page-label">
            ADMIN PANEL
          </p>

          <h1>
            Messages & Communication
          </h1>

          <p className="page-description">
            Manage messages, queries and contact requests
          </p>
        </div>

      </div>


      {/* =================================
          TABS
      ================================= */}

      <div className="message-tabs">

        <button
          className={
            activeTab === "messages"
              ? "message-tab active"
              : "message-tab"
          }
          onClick={() => handleTabChange("messages")}
        >
          ✉ Messages

          <span>
            {messages.length}
          </span>
        </button>


        <button
          className={
            activeTab === "queries"
              ? "message-tab active"
              : "message-tab"
          }
          onClick={() => handleTabChange("queries")}
        >
          ❓ Queries

          <span>
            {queries.length}
          </span>
        </button>


        <button
          className={
            activeTab === "contact"
              ? "message-tab active"
              : "message-tab"
          }
          onClick={() => handleTabChange("contact")}
        >
          ☎ Contact

          <span>
            {contacts.length}
          </span>
        </button>

      </div>


      {/* =================================
          MAIN CONTENT
      ================================= */}

      <div className="communication-container">


        {/* =================================
            LEFT LIST
        ================================= */}

        <div className="communication-list">

          <div className="list-header">

            <div>
              <h2>
                {activeTab === "messages"
                  ? "All Messages"
                  : activeTab === "queries"
                  ? "User Queries"
                  : "Contact Requests"}
              </h2>

              <p>
                {currentData.length} items
              </p>
            </div>

          </div>


          {/* LIST */}

          <div className="list-items">

            {currentData.map((item) => (

              <div
                key={item.id}
                className={
                  selectedItem?.id === item.id
                    ? "communication-card selected"
                    : "communication-card"
                }
                onClick={() => handleSelect(item)}
              >

                <div className="communication-avatar">

                  {item.name
                    .charAt(0)
                    .toUpperCase()}

                </div>


                <div className="communication-preview">

                  <div className="preview-top">

                    <h3>
                      {item.name}
                    </h3>

                    <span>
                      {item.time}
                    </span>

                  </div>


                  {activeTab !== "contact" && (

                    <>

                      <p className="preview-subject">
                        {item.subject}
                      </p>

                      <p className="preview-message">
                        {item.message}
                      </p>

                    </>

                  )}


                  {activeTab === "contact" && (

                    <>

                      <p className="preview-phone">
                        📞 {item.phone}
                      </p>

                      <p className="preview-location">
                        📍 {item.location}
                      </p>

                    </>

                  )}

                </div>

              </div>

            ))}

          </div>

        </div>


        {/* =================================
            RIGHT DETAILS
        ================================= */}

        <div className="communication-details">


          {!selectedItem ? (

            <div className="details-empty">

              <div className="empty-icon">

                {activeTab === "contact"
                  ? "☎"
                  : "✉"}

              </div>

              <h2>
                Select an item
              </h2>

              <p>
                Select a {activeTab === "messages"
                  ? "message"
                  : activeTab === "queries"
                  ? "query"
                  : "contact request"}{" "}
                from the left to view the complete details.
              </p>

            </div>

          ) : (

            <>

              {/* DETAILS HEADER */}

              <div className="details-top">

                <div className="details-person">

                  <div className="details-avatar">

                    {selectedItem.name
                      .charAt(0)
                      .toUpperCase()}

                  </div>


                  <div>

                    <h2>
                      {selectedItem.name}
                    </h2>

                    <p>
                      {selectedItem.email}
                    </p>

                  </div>

                </div>


                <span className="detail-type">

                  {activeTab === "messages"
                    ? "MESSAGE"
                    : activeTab === "queries"
                    ? "QUERY"
                    : "CONTACT"}

                </span>

              </div>


              {/* CONTACT INFORMATION */}

              <div className="person-info">

                <div className="info-item">

                  <span>
                    EMAIL
                  </span>

                  <strong>
                    {selectedItem.email}
                  </strong>

                </div>


                <div className="info-item">

                  <span>
                    PHONE
                  </span>

                  <strong>
                    {selectedItem.phone}
                  </strong>

                </div>


                <div className="info-item">

                  <span>
                    DATE
                  </span>

                  <strong>
                    {selectedItem.date}
                  </strong>

                </div>


                <div className="info-item">

                  <span>
                    TIME
                  </span>

                  <strong>
                    {selectedItem.time}
                  </strong>

                </div>


                {activeTab === "contact" && (

                  <div className="info-item location-item">

                    <span>
                      LOCATION
                    </span>

                    <strong>
                      📍 {selectedItem.location}
                    </strong>

                  </div>

                )}

              </div>


              {/* =================================
                  MESSAGE / QUERY
              ================================= */}

              {activeTab !== "contact" && (

                <>

                  <div className="full-message">

                    <span>
                      SUBJECT
                    </span>

                    <h3>
                      {selectedItem.subject}
                    </h3>


                    <span>
                      MESSAGE
                    </span>

                    <div className="message-content">

                      {selectedItem.message}

                    </div>

                  </div>


                  {/* REPLY */}

                  <div className="reply-box">

                    <h3>
                      Reply to {selectedItem.name}
                    </h3>

                    <textarea
                      value={reply}
                      onChange={(e) =>
                        setReply(e.target.value)
                      }
                      placeholder="Write your reply here..."
                    />

                    <div className="reply-actions">

                      <button
                        onClick={handleReply}
                        className="reply-button"
                      >
                        Send Reply →
                      </button>

                    </div>

                  </div>

                </>

              )}


              {/* =================================
                  CONTACT DETAILS
              ================================= */}

              {activeTab === "contact" && (

                <div className="contact-details">

                  <span>
                    CONTACT DETAILS
                  </span>

                  <div className="contact-message">

                    {selectedItem.details}

                  </div>


                  {/* CALL BUTTON */}

                  <a
                    href={`tel:${selectedItem.phone}`}
                    className="call-button"
                  >
                    📞 Call {selectedItem.name}
                  </a>

                </div>

              )}

            </>

          )}

        </div>

      </div>

    </div>
  );
};

export default AdminMessages;