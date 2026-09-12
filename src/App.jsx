import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet
} from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import AdminNavbar from "./components/Admin_navbar";

import AdminDashboard from "./components/Admin_dashboard";
import AdminEvents from "./components/Admin_Events";
import AdminUsers from "./components/Admin_users";
import EditEvent from "./components/EditEvent";
import Admin_Gallery from "./components/Admin_Gallery";
import EventDetails from "./components/EventDetails";


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
            ADMIN LAYOUT
        ================================================= */}
<Route path="/admin-login" element={<AdminLogin />} />
        <Route element={<AdminLayout />}>

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={<AdminDashboard />}
          />


          {/* EVENTS */}
          <Route
            path="/events"
            element={<AdminEvents />}
          />


          {/* SINGLE EVENT DETAILS */}
          <Route
            path="/events/details/:id"
            element={<EventDetails />}
          />


          {/* EDIT EVENT */}
          <Route
            path="/events/edit/:id"
            element={<EditEvent />}
          />


          {/* USERS */}
          <Route
            path="/users"
            element={<AdminUsers />}
          />


          {/* GALLERY */}
          <Route
            path="/gallery"
            element={<Admin_Gallery />}
          />

        </Route>


        {/* =================================================
            DEFAULT
        ================================================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />


        {/* =================================================
            UNKNOWN URL
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;