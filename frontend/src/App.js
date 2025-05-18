import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter,
  Route,
  Link,
  Routes,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login/login";
import SignUp from "./pages/SignUp/signUp";
import Header from "./components/header/header";
import Home from "./pages/Home/home";
import Events from "./pages/Events/events";
import EventDetail from "./pages/EventDetail/eventDetail";
import { UserProvider, useUserContext } from "./context/UserContext";
import Booking from "./pages/Booking/booking";
import Payment from "./pages/Payment/payment";
import Cart from "./pages/Cart/cart";
import Profile from "./pages/Profile/profile";
import Organizer from "./pages/Organizer/organizer";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/footer/footer";

// Admin imports
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import AdminEvents from "./pages/Admin/Events";
import AdminUsers from "./pages/Admin/Users";
import AdminBookings from "./pages/Admin/Bookings";
import AdminReports from "./pages/Admin/Reports";
import AdminTickets from "./pages/Admin/Tickets";
import AdminTicketTypes from "./pages/Admin/TicketTypes";
import AdminBills from "./pages/Admin/Bills";
import ViewEvent from "./pages/Admin/ViewEvent";
function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        {/* Main App Routes */}
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="tickets" element={<AdminTickets />} />
            <Route path="ticket-types" element={<AdminTicketTypes />} />
            <Route path="bills" element={<AdminBills />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="events/:eventId/view" element={<ViewEvent />} />
          </Route>

          {/* User Routes with Header and Footer */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <Home />
                <Footer />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Header />
                <Login />
                <Footer />
              </>
            }
          />
          <Route
            path="/sign-up"
            element={
              <>
                <Header />
                <SignUp />
                <Footer />
              </>
            }
          />
          <Route
            path="/events/detail/:eventId"
            element={
              <>
                <Header />
                <EventDetail />
                <Footer />
              </>
            }
          />
          <Route
            path="/events/:category"
            element={
              <>
                <Header />
                <Events />
                <Footer />
              </>
            }
          />
          <Route
            path="/booking/:bookingId"
            element={
              <>
                <Header />
                <Booking />
                <Footer />
              </>
            }
          />
          <Route
            path="/booking/:bookingId/payment"
            element={
              <>
                <Header />
                <Payment />
                <Footer />
              </>
            }
          />
          <Route
            path="/booking/:bookingId/payment-success"
            element={
              <>
                <Header />
                <Payment status={1} />
                <Footer />
              </>
            }
          />
          <Route
            path="/my-tickets"
            element={
              <>
                <Header />
                <Cart />
                <Footer />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Header />
                <Profile />
                <Footer />
              </>
            }
          />
          <Route
            path="/organizer"
            element={
              <>
                <Header />
                <Organizer />
                <Footer />
              </>
            }
          />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
