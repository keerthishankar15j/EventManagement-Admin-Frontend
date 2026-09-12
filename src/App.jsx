import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import AdminDashboard from "./components/Admin_dashboard";
import AdminEvents from "./components/Admin_Events";
import AdminUsers from "./components/Admin_users";
import EditEvent from "./components/EditEvent";
import Admin_Gallery from "./components/Admin_Gallery";
import EventDetails from "./components/EventDetails";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<AdminDashboard />}
        />


        {/* Events */}
        <Route
          path="/events"
          element={<AdminEvents />}
        />


        {/* Single Event Details */}
        <Route
          path="/events/details/:id"
          element={<EventDetails />}
        />


        {/* Edit Event */}
        <Route
          path="/events/edit/:id"
          element={<EditEvent />}
        />


        {/* Users */}
        <Route
          path="/users"
          element={<AdminUsers />}
        />


        {/* Gallery */}
        <Route
          path="/gallery"
          element={<Admin_Gallery />}
        />


        {/* Default */}
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />


        {/* Unknown URL - MUST BE LAST */}
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