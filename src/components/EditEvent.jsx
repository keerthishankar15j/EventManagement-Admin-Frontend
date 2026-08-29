import "../styles/EditEvent.css";

import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

const EditEvent = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState(false);

  const [imagePreview, setImagePreview] =
    useState("");

  const [formData, setFormData] =
    useState({
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
  // GET EXISTING EVENT
  // =====================================================

  useEffect(() => {
    const getEvent = async () => {
      try {
        console.log(
          "GET EVENT ID:",
          id
        );

        const response =
          await axios.get(
            `http://localhost:9000/events/get/${id}`
          );

        console.log(
          "EVENT RESPONSE:",
          response.data
        );

        const event =
          response.data?.data ||
          response.data?.event ||
          response.data;

        if (!event) {
          alert("Event not found");
          navigate("/events");
          return;
        }

        setFormData({
          name: event.name || "",

          organizer:
            event.organizer || "",

          date: event.date || "",

          time: event.time || "",

          location:
            event.location || "",

          description:
            event.description || "",

          tickets:
            event.tickets ?? "",

          status:
            event.status || "Upcoming",

          image: null,
        });

        // Existing image
        if (event.image) {
          setImagePreview(
            event.image.startsWith("http")
              ? event.image
              : `http://localhost:9000/${event.image}`
          );
        }
      } catch (error) {
        console.log(
          "GET EVENT ERROR:",
          error.response?.data ||
            error.message
        );

        alert("Unable to load event");

        navigate("/events");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getEvent();
    }
  }, [id, navigate]);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData(
      (previousData) => ({
        ...previousData,
        [name]: value,
      })
    );
  };

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange = (e) => {
    const file =
      e.target.files[0];

    if (!file) {
      return;
    }

    setFormData(
      (previousData) => ({
        ...previousData,
        image: file,
      })
    );

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  // =====================================================
  // UPDATE EVENT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      const data =
        new FormData();

      data.append(
        "name",
        formData.name
      );

      data.append(
        "organizer",
        formData.organizer
      );

      data.append(
        "date",
        formData.date
      );

      data.append(
        "time",
        formData.time
      );

      data.append(
        "location",
        formData.location
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "tickets",
        Number(formData.tickets)
      );

      data.append(
        "status",
        formData.status
      );

      // New image only
      if (formData.image) {
        data.append(
          "image",
          formData.image
        );
      }

      // Debug
      console.log(
        "UPDATE ID:",
        id
      );

      for (
        const pair of data.entries()
      ) {
        console.log(
          pair[0],
          pair[1]
        );
      }

      const response =
        await axios.put(
          `http://localhost:9000/events/update/${id}`,
          data
        );

      console.log(
        "UPDATE RESPONSE:",
        response.data
      );

      alert(
        "Event updated successfully"
      );

      navigate("/events");
    } catch (error) {
      console.log(
        "UPDATE ERROR:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update event"
      );
    } finally {
      setUpdating(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="edit-event-page">
        <div className="edit-event-container">
          <h2>
            Loading event...
          </h2>
        </div>
      </div>
    );
  }

  // =====================================================
  // FORM
  // =====================================================

  return (
    <div className="edit-event-page">

      <div className="edit-event-container">

        {/* HEADER */}

        <div className="edit-event-header">

          <div>

            <h2>
              Edit Event
            </h2>

            <p>
              Update the existing
              event details
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/events")
            }
          >
            Back
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
        >

          {/* IMAGE */}

          <div className="form-group">

            <label>
              Event Image
            </label>

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={
                handleImageChange
              }
            />

            {imagePreview && (
              <div className="image-preview">

                <img
                  src={imagePreview}
                  alt="Event"
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
              value={
                formData.name
              }
              onChange={
                handleChange
              }
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
              value={
                formData.organizer
              }
              onChange={
                handleChange
              }
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
              value={
                formData.date
              }
              onChange={
                handleChange
              }
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
              value={
                formData.time
              }
              onChange={
                handleChange
              }
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
              value={
                formData.location
              }
              onChange={
                handleChange
              }
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
              value={
                formData.description
              }
              onChange={
                handleChange
              }
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
              value={
                formData.tickets
              }
              onChange={
                handleChange
              }
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
              value={
                formData.status
              }
              onChange={
                handleChange
              }
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

          {/* BUTTONS */}

          <div className="form-buttons">

            <button
              type="button"
              onClick={() =>
                navigate("/events")
              }
              disabled={updating}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updating}
            >
              {updating
                ? "Updating..."
                : "Update Event"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default EditEvent;