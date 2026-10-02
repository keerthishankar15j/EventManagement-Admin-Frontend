
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/Admin_Events.css";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://api-admin-rouge.vercel.app"
).replace(/\/+$/, "");

const AdminEvents = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // GET ALL EVENTS
  // =====================================================

  const getEvents = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/events/getevents`
      );

      console.log("=================================");
      console.log("ALL EVENTS:", response.data);
      console.log("=================================");

      const eventData = response.data?.data;

      if (Array.isArray(eventData)) {
        console.log("EVENT ARRAY:", eventData);
        console.log("EVENT COUNT:", eventData.length);

        setEvents(eventData);
      } else {
        console.log("EVENT DATA IS NOT ARRAY:", eventData);
        setEvents([]);
      }
    } catch (error) {
      console.error(
        "GET EVENTS ERROR:",
        error.response?.data || error.message
      );

      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CHECK EVENTS STATE
  // =====================================================

  useEffect(() => {
    console.log("EVENTS STATE:", events);
    console.log("EVENTS STATE COUNT:", events.length);
  }, [events]);

  // =====================================================
  // LOAD EVENTS
  // =====================================================

  useEffect(() => {
    getEvents();
  }, []);

  // =====================================================
  // VIEW DETAILS
  // =====================================================

  const handleViewDetails = (event) => {
    const id = event?._id;

    if (!id) {
      alert("Event ID not found");
      return;
    }

    navigate(`/events/details/${id}`, {
      state: {
        event: event,
      },
    });
  };

  // =====================================================
  // EDIT EVENT
  // =====================================================

  const handleEdit = (id) => {
    if (!id) {
      alert("Event ID not found");
      return;
    }

    navigate(`/events/edit/${id}`);
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
      await axios.delete(
        `${API_URL}/events/delete/${id}`
      );

      setEvents((previousEvents) =>
        previousEvents.filter(
          (item) => item._id !== id
        )
      );

      alert("Event deleted successfully");
    } catch (error) {
      console.error(
        "DELETE EVENT ERROR:",
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

  const getImageUrl = (item) => {
    if (!item) {
      return "";
    }

    // ===================================================
    // NEW API IMAGE URL
    // Backend sends imageUrl
    // ===================================================

    if (item.imageUrl) {
      return item.imageUrl.replace(
        "http://",
        "https://"
      );
    }

    // ===================================================
    // OLD IMAGE SUPPORT
    // ===================================================

    if (item.image) {

      // Base64 image
      if (
        item.image.startsWith("data:image/")
      ) {
        return item.image;
      }

      // Full URL
      if (
        item.image.startsWith("http://") ||
        item.image.startsWith("https://")
      ) {
        return item.image.replace(
          "http://",
          "https://"
        );
      }

      // Relative URL
      if (item.image.startsWith("/")) {
        return `${API_URL}${item.image}`;
      }

      return `${API_URL}/${item.image}`;
    }

    return "";
  };

  // =====================================================
  // ADD EVENT
  // =====================================================

  const handleAddEvent = () => {
    console.log("ADD EVENT CLICKED");
    navigate("/events/add");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="main-content">

        <div className="page-header">

          <div>

            <h1 className="page-title">
              Events

