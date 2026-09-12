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


        {/* IMPORTANT: EDIT ROUTE */}
        <Route
          path="/events/edit/:id"
          element={<EditEvent />}
        />


        {/* Users */}
        <Route
          path="/users"
          element={<AdminUsers />}
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
<Route path="/gallery" element={<Admin_Gallery />} />
      </Routes>

<Route
  path="/events/details/:id"
  element={<EventDetails />}
/>
    </BrowserRouter>

  );

}

export default App;