import React, { useState } from "react";
import "./Admin_Gallery.css";

function Admin_Gallery() {
  const [memories, setMemories] = useState([
    {
      id: 1,
      title: "Annual Tech Fest 2025",
      category: "Technology",
      date: "March 15, 2025",
      description:
        "A day filled with innovation, creativity, teamwork and unforgettable moments.",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    },
    {
      id: 2,
      title: "Music Night",
      category: "Music",
      date: "April 20, 2025",
      description:
        "An energetic evening filled with music, lights and wonderful memories.",
      image:
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800",
    },
    {
      id: 3,
      title: "Web Development Workshop",
      category: "Workshop",
      date: "May 10, 2025",
      description:
        "Learning, building and sharing ideas together during an exciting workshop.",
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
    },
    {
      id: 4,
      title: "Sports Day",
      category: "Sports",
      date: "June 05, 2025",
      description:
        "A memorable day of teamwork, competition, fun and sporting spirit.",
      image:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [newMemory, setNewMemory] = useState({
    title: "",
    category: "Technology",
    date: "",
    description: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewMemory({
      ...newMemory,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageURL = URL.createObjectURL(file);

      setNewMemory({
        ...newMemory,
        image: imageURL,
      });
    }
  };

  const addMemory = () => {
    if (
      !newMemory.title ||
      !newMemory.date ||
      !newMemory.description ||
      !newMemory.image
    ) {
      alert("Please fill all fields and select an image.");
      return;
    }

    const memory = {
      id: Date.now(),
      ...newMemory,
    };

    setMemories([memory, ...memories]);

    setNewMemory({
      title: "",
      category: "Technology",
      date: "",
      description: "",
      image: "",
    });

    setShowModal(false);
  };

  const deleteMemory = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this memory?"
    );

    if (confirmDelete) {
      setMemories(memories.filter((memory) => memory.id !== id));
    }
  };

  return (
    <main className="gallery-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="gallery-header">

        <div className="gallery-heading">

          <div className="gallery-label">
            <span className="gallery-dot"></span>
            EVENT GALLERY
          </div>

          <h1>Memories</h1>

          <p>
            Moments that happened once, but stay with us forever.
          </p>

        </div>

        <button
          className="add-memory-btn"
          onClick={() => setShowModal(true)}
        >
          <span>+</span>
          Add Memory
        </button>

      </div>


      {/* =========================================
          MEMORY INTRO
      ========================================= */}

      <section className="memory-banner">

        <div className="memory-banner-content">

          <div className="memory-icon">
            ✨
          </div>

          <div>
            <h2>Moments That Stay With Us</h2>

            <p>
              Every event creates a story. Capture the smiles,
              celebrations, achievements and special moments
              that made each event unforgettable.
            </p>
          </div>

        </div>

        <div className="memory-count">
          <strong>{memories.length}</strong>
          <span>Memories</span>
        </div>

      </section>


      {/* =========================================
          FILTER
      ========================================= */}

      <div className="gallery-toolbar">

        <div>
          <h2>Past Event Memories</h2>
          <p>
            A collection of moments from our memorable events.
          </p>
        </div>

        <div className="gallery-filter">
          <button className="active">All</button>
          <button>Music</button>
          <button>Workshop</button>
          <button>Technology</button>
          <button>Sports</button>
        </div>

      </div>


      {/* =========================================
          MEMORY CARDS
      ========================================= */}

      <section className="memory-grid">

        {memories.map((memory) => (

          <div className="memory-card" key={memory.id}>

            <div className="memory-image-wrapper">

              <img
                src={memory.image}
                alt={memory.title}
                className="memory-image"
              />

              <div className="memory-category">
                {memory.category}
              </div>

              <button
                className="delete-memory"
                onClick={() => deleteMemory(memory.id)}
                title="Delete Memory"
              >
                🗑
              </button>

              <div className="image-overlay">
                <span>View Memory</span>
              </div>

            </div>


            <div className="memory-content">

              <div className="memory-date">
                📅 {memory.date}
              </div>

              <h3>{memory.title}</h3>

              <p>
                {memory.description}
              </p>

              <div className="memory-footer">

                <span>
                  ✦ Event Memory
                </span>

                <span className="memory-arrow">
                  →
                </span>

              </div>

            </div>

          </div>

        ))}

      </section>


      {/* =========================================
          EMPTY STATE
      ========================================= */}

      {memories.length === 0 && (

        <div className="empty-gallery">

          <div className="empty-icon">
            📸
          </div>

          <h2>No Memories Yet</h2>

          <p>
            Add photos from your past events and create
            beautiful memories.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="empty-add-btn"
          >
            + Add First Memory
          </button>

        </div>

      )}


      {/* =========================================
          ADD MEMORY MODAL
      ========================================= */}

      {showModal && (

        <div className="gallery-modal-overlay">

          <div className="gallery-modal">

            <div className="modal-header">

              <div>
                <span>EVENT GALLERY</span>
                <h2>Add Event Memory</h2>
              </div>

              <button
                className="close-modal"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>

            </div>


            <div className="modal-body">

              {/* Event Name */}

              <div className="form-group">

                <label>Event Name</label>

                <input
                  type="text"
                  name="title"
                  value={newMemory.title}
                  onChange={handleChange}
                  placeholder="Enter event name"
                />

              </div>


              {/* Category */}

              <div className="form-row">

                <div className="form-group">

                  <label>Category</label>

                  <select
                    name="category"
                    value={newMemory.category}
                    onChange={handleChange}
                  >
                    <option value="Music">
                      Music
                    </option>

                    <option value="Conferences">
                      Conferences
                    </option>

                    <option value="Workshop">
                      Workshop
                    </option>

                    <option value="Sports">
                      Sports
                    </option>

                    <option value="Technology">
                      Technology
                    </option>

                    <option value="Education">
                      Education
                    </option>

                    <option value="Entertainment">
                      Entertainment
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>

                </div>


                {/* Date */}

                <div className="form-group">

                  <label>Event Date</label>

                  <input
                    type="date"
                    name="date"
                    value={newMemory.date}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* Description */}

              <div className="form-group">

                <label>Memory Description</label>

                <textarea
                  name="description"
                  value={newMemory.description}
                  onChange={handleChange}
                  placeholder="Write something about this memorable event..."
                  rows="4"
                />

              </div>


              {/* Image */}

              <div className="form-group">

                <label>Event Photo</label>

                <div className="upload-box">

                  {newMemory.image ? (

                    <img
                      src={newMemory.image}
                      alt="Preview"
                      className="image-preview"
                    />

                  ) : (

                    <div className="upload-content">

                      <div className="upload-icon">
                        📸
                      </div>

                      <strong>
                        Upload Event Photo
                      </strong>

                      <span>
                        PNG, JPG or JPEG
                      </span>

                    </div>

                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                </div>

              </div>

            </div>


            {/* Modal Footer */}

            <div className="modal-footer">

              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="save-memory-btn"
                onClick={addMemory}
              >
                Save Memory
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

export default Admin_Gallery;