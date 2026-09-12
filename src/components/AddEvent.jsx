
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/EditEvent.css";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://api-admin-rouge.vercel.app"
).replace(/\/+$/, "");

const AddEvent = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    organizer: "",
    date: "",
    time: "",
    location: "",
    description: "",
    category: "",
    tickets: "",
    ticketPrice: "",
    image: null,
  });

  // ================================
  // INPUT CHANGE
  // ================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // ================================
  // IMAGE CHANGE
  // ================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setFormData((previousData) => ({
      ...previousData,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  // ================================
  // CREATE EVENT
  // ================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("organizer", formData.organizer);
      data.append("date", formData.date);
      data.append("time", formData.time);
      data.append("location", formData.location);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("tickets", Number(formData.tickets));
      data.append("ticketPrice", Number(formData.ticketPrice));

      if (formData.image) {
        data.append("image", formData.image);
      }

      console.log("CREATING EVENT...");

      const response = await axios.post(
        `${API_URL}/events/create`,
        data
      );

      console.log(
        "CREATE EVENT RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        alert("Event created successfully");

        navigate("/events");
      } else {
        alert(
          response.data?.message ||
          "Failed to create event"
        );
      }
    } catch (error) {
      console.error(
        "CREATE EVENT ERROR:",
        error.response?.data ||
        error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to create event"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // PAGE
  // ================================

  return (
    <div className="edit-event-page">

      <div className="edit-event-container">

        {/* HEADER */}

        <div className="edit-event-header">

          <div>
            <h2>
              Add Event
            </h2>

            <p>
              Create a new event
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/events")}
            disabled={loading}
          >
            Back
          </button>

        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit}>

          {/* IMAGE */}

          <div className="form-group">

            <label>
              Event Image
            </label>

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />

            {imagePreview && (
              <div className="image-preview">

                <img
                  src={imagePreview}
                  alt="Event Preview"
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
              value={formData.name}
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
              value={formData.organizer}
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
              value={formData.date}
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
              value={formData.time}
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
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter event location"
              required
            />

          </div>

          {/* CATEGORY */}

          <div className="form-group">

            <label>
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >

              <option value="">
                Select Category
              </option>

              <option value="Technology">
                Technology
              </option>

              <option value="Education">
                Education
              </option>

              <option value="Workshop">
                Workshop
              </option>

              <option value="Conference">
                Conference
              </option>

              <option value="Cultural">
                Cultural
              </option>

              <option value="Sports">
                Sports
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
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
              value={formData.tickets}
              onChange={handleChange}
              min="1"
              placeholder="Enter number of tickets"
              required
            />

          </div>

          {/* TICKET PRICE */}

          <div className="form-group">

            <label>
              Ticket Price
            </label>

            <input
              type="number"
              name="ticketPrice"
              value={formData.ticketPrice}
              onChange={handleChange}
              min="0"
              placeholder="Enter ticket price"
              required
            />

          </div>

          {/* BUTTONS */}

          <div className="form-buttons">

            <button
              type="button"
              onClick={() => navigate("/events")}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Event"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddEvent;

