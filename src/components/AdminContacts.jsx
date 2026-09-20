import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminContacts.css";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://api-admin-rouge.vercel.app"
).replace(/\/+$/, "");

const AdminContacts = () => {

  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [error, setError] = useState("");


  // =====================================================
  // FETCH CONTACTS
  // =====================================================

  const fetchContacts = async (isRefresh = false) => {

    try {

      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      console.log(
        "CONTACT PAGE: API CALL"
      );

      const response = await axios.get(
        `${API_URL}/user-contact/contacts`
      );

      console.log(
        "Contact API Response:",
        response.data
      );

      const receivedContacts =
        response.data?.data ||
        response.data?.data?.contacts ||
        response.data?.contacts ||
        [];

      console.log(
        "Contacts received:",
        receivedContacts
      );

      setContacts(
        Array.isArray(receivedContacts)
          ? receivedContacts
          : []
      );

    } catch (error) {

      console.error(
        "Contact Error:",
        error
      );

      console.error(
        "Server response:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
        "Unable to load contact requests"
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchContacts();

  }, []);


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredContacts =
    contacts.filter((contact) => {

      const searchText =
        search.toLowerCase();

      return (

        String(
          contact.name || ""
        )
          .toLowerCase()
          .includes(searchText)

        ||

        String(
          contact.email || ""
        )
          .toLowerCase()
          .includes(searchText)

        ||

        String(
          contact.phone ||
          contact.number ||
          ""
        )
          .toLowerCase()
          .includes(searchText)

        ||

        String(
          contact.message || ""
        )
          .toLowerCase()
          .includes(searchText)

      );

    });


  // =====================================================
  // DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="contacts-page">

        <div className="contacts-loading">

          <div className="contacts-loader"></div>

          <h3>
            Loading Contact Requests
          </h3>

          <p>
            Fetching contact details...
          </p>

        </div>

      </div>
    );

  }


  return (

    <div className="contacts-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="contacts-header">

        <div className="contacts-title-row">

          <div className="contacts-icon">
            📞
          </div>

          <div>

            <h1>
              Contact Requests
            </h1>

            <p>
              Manage contact requests received
              from event users.
            </p>

          </div>

        </div>


        <button
          className="contacts-refresh-btn"
          onClick={() =>
            fetchContacts(true)
          }
          disabled={refreshing}
        >

          <span
            className={
              refreshing
                ? "contact-refresh-spin"
                : ""
            }
          >
            ↻
          </span>

          {refreshing
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </div>


      {/* =================================================
          STATS
      ================================================= */}

      <div className="contacts-stats">

        <div className="contact-stat-card">

          <div className="contact-stat-icon">
            📞
          </div>

          <div>

            <span>
              Total Requests
            </span>

            <strong>
              {contacts.length}
            </strong>

          </div>

        </div>


        <div className="contact-stat-card">

          <div className="contact-stat-icon pending">
            ⏳
          </div>

          <div>

            <span>
              Pending
            </span>

            <strong>
              {
                contacts.filter(
                  (contact) =>
                    contact.status ===
                    "Pending"
                ).length
              }
            </strong>

          </div>

        </div>


        <div className="contact-stat-card">

          <div className="contact-stat-icon contacted">
            ✓
          </div>

          <div>

            <span>
              Contacted
            </span>

            <strong>
              {
                contacts.filter(
                  (contact) =>
                    contact.status ===
                    "Contacted"
                ).length
              }
            </strong>

          </div>

        </div>

      </div>


      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="contacts-toolbar">

        <div className="contacts-search">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search name, email or phone..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (

            <button
              onClick={() => setSearch("")}
              className="contact-clear-search"
            >
              ×
            </button>

          )}

        </div>

        <div className="contact-count">

          {filteredContacts.length} request
          {filteredContacts.length !== 1
            ? "s"
            : ""}

        </div>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="contacts-error">

          <span>
            ⚠️
          </span>

          <div>

            <strong>
              Unable to load contacts
            </strong>

            <p>
              {error}
            </p>

          </div>

        </div>

      )}


      {/* =================================================
          TABLE
      ================================================= */}

      <div className="contacts-table-container">

        {filteredContacts.length === 0 ? (

          <div className="contacts-empty">

            <div className="contact-empty-icon">
              📞
            </div>

            <h3>
              No Contact Requests
            </h3>

            <p>
              No contact requests are available
              right now.
            </p>

          </div>

        ) : (

          <table className="contacts-table">

            <thead>

              <tr>

                <th>
                  USER
                </th>

                <th>
                  PHONE
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

              {filteredContacts.map(
                (contact, index) => (

                  <tr
                    key={
                      contact._id ||
                      contact.id ||
                      index
                    }
                  >

                    {/* USER */}

                    <td>

                      <div className="contact-user">

                        <div className="contact-avatar">

                          {
                            (
                              contact.name ||
                              "U"
                            )
                              .charAt(0)
                              .toUpperCase()
                          }

                        </div>

                        <div>

                          <strong>
                            {contact.name ||
                              "Unknown User"}
                          </strong>

                          <span>
                            {contact.email ||
                              "No email"}
                          </span>

                        </div>

                      </div>

                    </td>


                    {/* PHONE */}

                    <td>

                      <span className="phone-text">

                        {contact.phone ||
                          contact.number ||
                          "No phone"}

                      </span>

                    </td>


                    {/* MESSAGE */}

                    <td>

                      <div className="contact-message-preview">

                        {contact.message ||
                          "No message"}

                      </div>

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={
                          contact.status ===
                          "Contacted"
                            ? "contact-status contacted-status"
                            : "contact-status pending-status"
                        }
                      >

                        <span>
                          ●
                        </span>

                        {contact.status ||
                          "Pending"}

                      </span>

                    </td>


                    {/* DATE */}

                    <td>

                      <span className="contact-date">

                        {formatDate(
                          contact.createdAt
                        )}

                      </span>

                    </td>


                    {/* ACTION */}

                    <td>

                      <button
                        className="view-contact-btn"
                        onClick={() =>
                          setSelectedContact(
                            contact
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

        )}

      </div>


      {/* =================================================
          CONTACT MODAL
      ================================================= */}

      {selectedContact && (

        <div
          className="contact-modal-overlay"
          onClick={() =>
            setSelectedContact(null)
          }
        >

          <div
            className="contact-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="contact-modal-header">

              <div>

                <span>
                  CONTACT REQUEST
                </span>

                <h2>
                  Contact Details
                </h2>

              </div>

              <button
                className="contact-modal-close"
                onClick={() =>
                  setSelectedContact(null)
                }
              >
                ×
              </button>

            </div>


            <div className="contact-user-large">

              <div className="contact-large-avatar">

                {
                  (
                    selectedContact.name ||
                    "U"
                  )
                    .charAt(0)
                    .toUpperCase()
                }

              </div>

              <div>

                <strong>
                  {selectedContact.name ||
                    "Unknown User"}
                </strong>

                <span>
                  {selectedContact.email ||
                    "No email"}
                </span>

              </div>

            </div>


            <div className="contact-info-grid">

              <div>

                <span>
                  PHONE NUMBER
                </span>

                <strong>
                  {selectedContact.phone ||
                    selectedContact.number ||
                    "No phone"}
                </strong>

              </div>


              <div>

                <span>
                  STATUS
                </span>

                <strong>
                  {selectedContact.status ||
                    "Pending"}
                </strong>

              </div>

            </div>


            <div className="contact-message-box">

              <span>
                MESSAGE
              </span>

              <p>
                {selectedContact.message ||
                  "No message provided."}
              </p>

            </div>


            <div className="contact-received">

              Received on{" "}

              <strong>
                {formatDate(
                  selectedContact.createdAt
                )}
              </strong>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default AdminContacts;