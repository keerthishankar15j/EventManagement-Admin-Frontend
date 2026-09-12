import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "../styles/EditEvent.css";


const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://api-admin-rouge.vercel.app"
).replace(/\/+$/, "");


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
      category: "",
      tickets: "",
      ticketPrice: "",
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
            `${API_URL}/events/get/${id}`
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

          alert(
            "Event not found"
          );

          navigate("/events");

          return;
        }


        // =================================================
        // SET FORM DATA
        // =================================================

        setFormData({

          name:
            event.name || "",

          organizer:
            event.organizer || "",

          date:
            event.date || "",

          time:
            event.time || "",

          location:
            event.location || "",

          description:
            event.description || "",

          category:
            event.category || "",

          tickets:
            event.tickets ?? "",

          ticketPrice:
            event.ticketPrice ?? "",

          image:
            null,

        });


        // =================================================
        // EXISTING IMAGE
        // =================================================

        if (event.image) {

          if (
            event.image.startsWith(
              "data:image/"
            )
          ) {

            setImagePreview(
              event.image
            );

          } else if (
            event.image.startsWith(
              "http://"
            ) ||
            event.image.startsWith(
              "https://"
            )
          ) {

            setImagePreview(
              event.image
            );

          } else if (
            event.image.startsWith("/")
          ) {

            setImagePreview(
              `${API_URL}${event.image}`
            );

          } else {

            setImagePreview(
              `${API_URL}/${event.image}`
            );

          }

        }

      } catch (error) {

        console.error(
          "GET EVENT ERROR:",
          error.response?.data ||
            error.message
        );


        alert(
          error.response?.data?.message ||
            "Unable to load event"
        );


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
        "category",
        formData.category
      );


      data.append(
        "tickets",
        Number(formData.tickets)
      );


      data.append(
        "ticketPrice",
        Number(formData.ticketPrice)
      );


      // =================================================
      // NEW IMAGE
      // =================================================

      if (formData.image) {

        data.append(
          "image",
          formData.image
        );

      }


      // =================================================
      // DEBUG
      // =================================================

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


      // =================================================
      // UPDATE API
      // =================================================

      const response =
        await axios.put(
          `${API_URL}/events/update/${id}`,
          data
        );


      console.log(
        "UPDATE RESPONSE:",
        response.data
      );


      if (
        response.data?.success
      ) {

        alert(
          "Event updated successfully"
        );

        navigate("/events");

      } else {

        alert(
          response.data?.message ||
            "Failed to update event"
        );

      }

    } catch (error) {

      console.error(
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


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="edit-event-header">

          <div>

            <h2>
              Edit Event
            </h2>

            <p>
              Update the existing event details
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


        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
        >


          {/* =================================================
              IMAGE
          ================================================= */}

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


          {/* =================================================
              EVENT NAME
          ================================================= */}

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


          {/* =================================================
              ORGANIZER
          ================================================= */}

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


          {/* =================================================
              DATE
          ================================================= */}

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


          {/* =================================================
              TIME
          ================================================= */}

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


          {/* =================================================
              LOCATION
          ================================================= */}

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


          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="form-group">

            <label>
              Category
            </label>


            <select
              name="category"
              value={
                formData.category
              }
              onChange={
                handleChange
              }
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


          {/* =================================================
              DESCRIPTION
          ================================================= */}

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


          {/* =================================================
              TICKETS
          ================================================= */}

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


          {/* =================================================
              TICKET PRICE
          ================================================= */}

          <div className="form-group">

            <label>
              Ticket Price
            </label>


            <input
              type="number"
              name="ticketPrice"
              value={
                formData.ticketPrice
              }
              onChange={
                handleChange
              }
              min="0"
              required
            />

          </div>


          {/* =================================================
              BUTTONS
          ================================================= */}

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