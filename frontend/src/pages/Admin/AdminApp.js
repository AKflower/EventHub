import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import Dashboard from "./Dashboard";
import Events from "./Events";
import ViewEvent from "./ViewEvent";
import Users from "./Users";
import Categories from "./Categories";
import Bookings from "./Bookings";
import Bills from "./Bills";
import Tickets from "./Tickets";
import TicketTypes from "./TicketTypes";
import Reports from "./Reports";
import AdminLogin from "./AdminLogin";

const AdminApp = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin/dashboard"
        element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/events"
        element={
          <AdminLayout>
            <Events />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/events/:id/view"
        element={
          <AdminLayout>
            <ViewEvent />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminLayout>
            <Users />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/categories"
        element={
          <AdminLayout>
            <Categories />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/bookings"
        element={
          <AdminLayout>
            <Bookings />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/bills"
        element={
          <AdminLayout>
            <Bills />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/tickets"
        element={
          <AdminLayout>
            <Tickets />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/ticket-types"
        element={
          <AdminLayout>
            <TicketTypes />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <AdminLayout>
            <Reports />
          </AdminLayout>
        }
      />

      {/* Redirect /admin to /admin/dashboard */}
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
    </Routes>
  );
};

export default AdminApp;
