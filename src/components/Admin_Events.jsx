import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/Admin_Events.css";
import AdminNavbar from "../components/Admin_navbar";

// =====================================================
// API URL
// =====================================================

// Vercel Environment Variable:
// VITE_API_URL=https://api-admin-rouge.vercel.app

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://api-admin-rouge.vercel.app"
).replace(/\/+$/, "");

console.log("=================================");
console.log("API URL:", API_URL);
console.log("=================================");

function Events() {
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [events, setEvents] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [imagePreview, setImagePreview] =
    useState("");

  const [event, setEvent] = useState({
    name: "",
    organizer: "",
    date: "",
    time: "",
    location: "",
    description: "",
    tickets: "",
    status: "Upcoming",
    image: null,
  });

  // =====================================================
  // GET ALL EVENTS
  // =====================================================

  const getEvents = async () => {
    try {
      console.log(
        "GET EVENTS URL:",
        `${API_URL}/events/getevents`
      );

      const response = await axios.get(
        `${API_URL}/events/getevents`
      );

      console.log(
        "GET EVENTS RESPONSE:",
        response.data
      );

      if (Array.isArray(response.data?.data)) {
        setEvents(response.data.data);
      } else if (
        Array.isArray(response.data?.events)
      ) {
        setEvents(response.data.events);
      } else if (Array.isArray(response.data)) {
        setEvents(response.data);
      } else {
        console.log(
          "Unexpected events response:",
          response.data
        );

        setEvents([]);
      }
    } catch (error) {
      console.log(
        "GET EVENTS ERROR:",
        error.response?.data || error.message
      );

      setEvents([]);
    }
  };

  // =====================================================
  // LOAD EVENTS
  // =====================================================

  useEffect(() => {
    getEvents();
  }, []);

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) {
      return "Not specified";
    }

    const parts = time.split(":");

    if (parts.length < 2) {
      return time;
    }

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes)
    ) {
      return time;
    }

    const period = hours >= 12 ? "PM" : "AM";

    let formattedHours = hours % 12;

    if (formattedHours === 0) {
      formattedHours = 12;
    }

    return `${formattedHours}:${String(
      minutes
    ).padStart(2, "0")} ${period}`;
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEvent((previousEvent) => ({
      ...previousEvent,
      [name]: value,
    }));
  };

  // =====================================================
  // HANDLE IMAGE
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setEvent((previousEvent) => ({
      ...previousEvent,
      image: file,
    }));

    const previewURL = URL.createObjectURL(file);

    setImagePreview(previewURL);
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setEvent({
      name: "",
      organizer: "",
      date: "",
      time: "",
      location: "",
      description: "",
      tickets: "",
      status: "Upcoming",
      image: null,
    });

    setImagePreview("");
  };

  // =====================================================
  // ADD EVENT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!event.image) {
      alert("Please select an event image");
      return;
    }

    try {
      const formData = new FormData();

      formData.append(
        "name",
        event.name.trim()
      );

      formData.append(
        "organizer",
        event.organizer.trim()
      );

      formData.append(
        "date",
        event.date
      );

      formData.append(
        "time",
        event.time
      );

      formData.append(
        "location",
        event.location.trim()
      );

      formData.append(
        "description",
        event.description.trim()
      );

      formData.append(
        "tickets",
        Number(event.tickets)
      );

      formData.append(
        "status",
        event.status
      );

      formData.append(
        "image",
        event.image
      );

      console.log(
        "CREATE EVENT URL:",
        `${API_URL}/events/create`
      );

      console.log("SENDING EVENT");

      const response = await axios.post(
        `${API_URL}/events/create`,
        formData
      );

      console.log(
        "CREATE EVENT RESPONSE:",
        response.data
      );

      alert("Event added successfully");

      resetForm();

      setShowForm(false);

      await getEvents();
    } catch (error) {
      console.log(
        "CREATE EVENT ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to add event"
      );
    }
  };

  // =====================================================
  // DELETE EVENT
  // =====================================================

  const handleDelete = async (id) => {
    if (!id) {
      alert("Event ID not found");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      console.log(
        "DELETE EVENT URL:",
        `${API_URL}/events/delete/${id}`
      );

      const response = await axios.delete(
        `${API_URL}/events/delete/${id}`
      );

      console.log(
        "DELETE RESPONSE:",
        response.data
      );

      alert("Event deleted successfully");

      setEvents((previousEvents) =>
        previousEvents.filter(
          (item) => item._id !== id
        )
      );
    } catch (error) {
      console.log(
        "DELETE ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete event"
      );
    }
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image || typeof image !== "string") {
      return "";
    }

    const trimmedImage = image.trim();

    if (!trimmedImage) {
      return "";
    }

    // Backend already returned a full URL
    if (
      trimmedImage.startsWith("http://") ||
      trimmedImage.startsWith("https://")
    ) {
      return trimmedImage;
    }

    // Remove leading slash
    const cleanImage =
      trimmedImage.replace(/^\/+/, "");

    const imageUrl =
      `${API_URL}/${cleanImage}`;

    console.log(
      "IMAGE URL:",
      imageUrl
    );

    return imageUrl;
  };

  // =====================================================
  // IMAGE ERROR
  // =====================================================

  const handleImageError = (e) => {
    console.log(
      "IMAGE NOT FOUND:",
      e.target.src
    );

    e.target.style.display = "none";

    const parent = e.target.parentElement;

    if (parent) {
      parent.classList.add("image-error");

      parent.innerHTML =
        "<span>Image unavailable</span>";
    }
  };

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredEvents = events.filter((item) => {
    const searchText =
      search.toLowerCase().trim();

    const name =
      item.name?.toLowerCase() || "";

    const organizer =
      item.organizer?.toLowerCase() || "";

    const location =
      item.location?.toLowerCase() || "";

    const matchesSearch =
      name.includes(searchText) ||
      organizer.includes(searchText) ||
      location.includes(searchText);

    const matchesStatus =
      statusFilter === "All Status" ||
      item.status === statusFilter;

    return (
      matchesSearch &&
      matchesStatus
    );
  });

  // =====================================================
  // JSX
  // =====================================================

  return (
    <>
      <AdminNavbar />

      <main className="main-content">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="page-header">

          <div className="page-title-area">

            <h1 className="page-title">
              Events
            </h1>

            <p className="page-description">
              Manage and organize all your events
            </p>

          </div>

          <button
            type="button"
            className="add-event-btn"
            onClick={() =>
              setShowForm(true)
            }
          >
            <span className="add-icon">
              +
            </span>

            <span>
              Add Event
            </span>

            <span className="arrow-icon">
              →
            </span>
          </button>

        </div>

        {/* =====================================================
            EVENTS CARD
        ===================================================== */}

        <section className="events-card">

          <div className="event-toolbar">

            <div className="event-count">

              <div className="event-count-title">
                Events
              </div>

              <span className="event-count-number">
                {filteredEvents.length} Events
              </span>

            </div>

            <div className="event-filters">

              <div className="search-box">

                <span className="search-icon">
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search events..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

              </div>

              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
              >

                <option value="All Status">
                  All Status
                </option>

                <option value="Upcoming">
                  Upcoming
                </option>

                <option value="Ongoing">
                  Ongoing
                </option>

                <option value="Completed">
                  Completed
                </option>

              </select>

            </div>

          </div>

          {/* =====================================================
              EVENTS GRID
          ===================================================== */}

          <div className="events-card-grid">

            {filteredEvents.length === 0 ? (

              <div className="no-events">

                <div className="no-events-icon">
                  📅
                </div>

                <h3>
                  No Events Found
                </h3>

                <p>
                  Add a new event to see it here.
                </p>

              </div>

            ) : (

              filteredEvents.map((item) => (

                <div
                  className="event-card"
                  key={item._id}
                >

                  {/* =====================================================
                      EVENT IMAGE
                  ===================================================== */}

                  <div className="event-card-image">

                    {item.image ? (

                      <img
                        src={getImageUrl(
                          item.image
                        )}
                        alt={
                          item.name ||
                          "Event"
                        }
                        onError={
                          handleImageError
                        }
                      />

                    ) : (

                      <div className="no-image">

                        <span>
                          📷
                        </span>

                        <p>
                          No Image
                        </p>

                      </div>

                    )}

                    <span
                      className={`card-status ${
                        item.status
                          ?.toLowerCase()
                          .replace(
                            /\s+/g,
                            "-"
                          )
                      }`}
                    >
                      {item.status}
                    </span>

                  </div>

                  {/* =====================================================
                      EVENT CONTENT
                  ===================================================== */}

                  <div className="event-card-content">

                    <h2 className="event-card-title">
                      {item.name}
                    </h2>

                    <p className="event-organizer">

                      Organized by{" "}

                      <strong>
                        {item.organizer ||
                          "Not specified"}
                      </strong>

                    </p>

                    <p className="event-description">

                      {item.description ||
                        "No description available."}

                    </p>

                    {/* =====================================================
                        EVENT DETAILS
                    ===================================================== */}

                    <div className="event-details">

                      <div className="event-detail">

                        <span className="detail-icon">
                          📅
                        </span>

                        <div>

                          <small>
                            Date
                          </small>

                          <strong>
                            {item.date ||
                              "Not specified"}
                          </strong>

                        </div>

                      </div>

                      <div className="event-detail">

                        <span className="detail-icon">
                          ⏰
                        </span>

                        <div>

                          <small>
                            Time
                          </small>

                          <strong>
                            {formatTime(
                              item.time
                            )}
                          </strong>

                        </div>

                      </div>

                      <div className="event-detail">

                        <span className="detail-icon">
                          📍
                        </span>

                        <div>

                          <small>
                            Location
                          </small>

                          <strong>
                            {item.location ||
                              "Not specified"}
                          </strong>

                        </div>

                      </div>

                      <div className="event-detail">

                        <span className="detail-icon">
                          🎟
                        </span>

                        <div>

                          <small>
                            Tickets
                          </small>

                          <strong>
                            {item.tickets || 0}
                          </strong>

                        </div>

                      </div>

                    </div>

                    {/* =====================================================
                        ACTIONS
                    ===================================================== */}

                    <div className="event-card-actions">

                      <button
                        type="button"
                        className="card-edit-btn"
                        onClick={() =>
                          navigate(
                            `/events/edit/${item._id}`
                          )
                        }
                      >
                        ✏ Edit
                      </button>

                      <button
                        type="button"
                        className="card-delete-btn"
                        onClick={() =>
                          handleDelete(
                            item._id
                          )
                        }
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))

            )}

          </div>

        </section>

        {/* =====================================================
            ADD EVENT FORM
        ===================================================== */}

        {showForm && (

          <div className="event-form-overlay">

            <div className="event-form-card">

              {/* =====================================================
                  FORM HEADER
              ===================================================== */}

              <div className="event-form-header">

                <div>

                  <h2>
                    Add Event
                  </h2>

                  <p>
                    Enter the event details
                  </p>

                </div>

                <button
                  type="button"
                  className="close-btn"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                >
                  ×
                </button>

              </div>

              {/* =====================================================
                  FORM
              ===================================================== */}

              <form onSubmit={handleSubmit}>

                {/* EVENT IMAGE */}

                <div className="form-group">

                  <label>
                    Event Image
                  </label>

                  <input
                    type="file"
                    name="image"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={
                      handleImageChange
                    }
                    required
                  />

                  {imagePreview && (

                    <div className="event-image-preview">

                      <img
                        src={imagePreview}
                        alt="Preview"
                      />

                    </div>

                  )}

                </div>

                {/* EVENT NAME */}

                <div className="form-group">

                  <label>
                    Event Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={event.name}
                    onChange={handleChange}
                    placeholder="Enter event name"
                    required
                  />

                </div>

                {/* ORGANIZER */}

                <div className="form-group">

                  <label>
                    Organizer Name
                  </label>

                  <input
                    type="text"
                    name="organizer"
                    value={event.organizer}
                    onChange={handleChange}
                    placeholder="Enter organizer name"
                    required
                  />

                </div>

                {/* DATE */}

                <div className="form-group">

                  <label>
                    Date
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={event.date}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* TIME */}

                <div className="form-group">

                  <label>
                    Time
                  </label>

                  <input
                    type="time"
                    name="time"
                    value={event.time}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* LOCATION */}

                <div className="form-group">

                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={event.location}
                    onChange={handleChange}
                    placeholder="Enter location"
                    required
                  />

                </div>

                {/* DESCRIPTION */}

                <div className="form-group">

                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={event.description}
                    onChange={handleChange}
                    placeholder="Enter event description"
                    rows="5"
                    required
                  />

                </div>

                {/* TICKETS */}

                <div className="form-group">

                  <label>
                    Tickets
                  </label>

                  <input
                    type="number"
                    name="tickets"
                    value={event.tickets}
                    onChange={handleChange}
                    placeholder="Enter number of tickets"
                    min="1"
                    required
                  />

                </div>

                {/* STATUS */}

                <div className="form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={event.status}
                    onChange={handleChange}
                    required
                  >

                    <option value="Upcoming">
                      Upcoming
                    </option>

                    <option value="Ongoing">
                      Ongoing
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                  </select>

                </div>

                {/* FORM BUTTONS */}

                <div className="form-buttons">

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      resetForm();
                      setShowForm(false);
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-btn"
                  >
                    Add Event
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </main>
    </>
  );
}

export default Events;