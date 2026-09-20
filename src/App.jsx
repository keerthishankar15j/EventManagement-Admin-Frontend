import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} 
from "react-router-dom";

import AdminLogin from "./components/AdminLogin";
import AdminNavbar from "./components/Admin_navbar";
import AdminDashboard from "./components/Admin_dashboard";
import AdminEvents from "./components/Admin_Events";
import EditEvent from "./components/EditEvent";
import AddEvent from "./components/AddEvent";
import EventDetails from "./components/EventDetails";
import AdminMessages from "./components/AdminMessages";
import AdminContacts from "./components/AdminContacts";

// =====================================================
// USERS
// =====================================================

import Userlogin from "./components/Userslogin";

// =====================================================
// ADMIN LAYOUT
// =====================================================

const AdminLayout = () => {
  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <AdminNavbar />

      {/* PAGE CONTENT */}
      <div className="admin-page-content">
        <Outlet />
      </div>

    </div>
  );
};

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            LOGIN PAGE
        ================================================= */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* =================================================
            ADMIN LAYOUT
        ================================================= */}

        <Route element={<AdminLayout />}>

          {/* =================================================
              DASHBOARD
          ================================================= */}

          <Route
            path="/dashboard"
            element={<AdminDashboard />}
          />

          {/* =================================================
              ADMIN DASHBOARD
          ================================================= */}

          <Route
            path="/admin-dashboard"
            element={<AdminDashboard />}
          />

          {/* =================================================
              EVENTS
          ================================================= */}

          <Route
            path="/events"
            element={<AdminEvents />}
          />

          {/* =================================================
              ADD EVENT
          ================================================= */}

          <Route
            path="/events/add"
            element={<AddEvent />}
          />

          {/* =================================================
              EVENT DETAILS
          ================================================= */}

          <Route
            path="/events/details/:id"
            element={<EventDetails />}
          />

          {/* =================================================
              EDIT EVENT
          ================================================= */}

          <Route
            path="/events/edit/:id"
            element={<EditEvent />}
          />

          {/* =================================================
              USERS / LOGIN ACTIVITY
          ================================================= */}

          <Route
            path="/users"
            element={<Userlogin />}
          />

          

          {/* =================================================
              MESSAGES
          ================================================= */}

          <Route
            path="/admin-messages"
            element={<AdminMessages />}
          />

        </Route>
<Route
  path="/contacts"
  element={<AdminContacts />}
/>
        {/* =================================================
            FIRST OPEN → LOGIN
        ================================================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/admin-login"
              replace
            />
          }
        />

        {/* =================================================
            UNKNOWN URL → LOGIN
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/admin-login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;