import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL + "/api" || "http://localhost:3001/api";

// Setup axios instance with auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Dashboard
export const getDashboardData = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/dashboard`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch dashboard data"
    );
  }
};

// Events
export const getAllEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/events`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch events");
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await axios.post(`${API_URL}/admin/events`, eventData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create event");
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/events/${id}`,
      eventData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update event");
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/admin/events/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete event");
  }
};

// Users
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create user");
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_URL}/admin/users/${id}`, userData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update user");
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/admin/users/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};

export const updateUserRole = async (id, roleId) => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/users/${id}/role`,
      { roleId },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update user role"
    );
  }
};

// Roles
export const getAllRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/roles`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch roles");
  }
};

export const createRole = async (roleData) => {
  try {
    const response = await axios.post(`${API_URL}/admin/roles`, roleData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create role");
  }
};

export const updateRole = async (id, roleData) => {
  try {
    const response = await axios.put(`${API_URL}/admin/roles/${id}`, roleData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update role");
  }
};

export const deleteRole = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/admin/roles/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete role");
  }
};

// Categories
export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/categories`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch categories"
    );
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/categories`,
      categoryData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create category"
    );
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/categories/${id}`,
      categoryData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update category"
    );
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/admin/categories/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete category"
    );
  }
};

// Bookings
export const getAllBookings = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/bookings`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch bookings"
    );
  }
};

// Tickets
export const getAllTickets = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/tickets`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch tickets");
  }
};

// Ticket Types
export const getAllTicketTypes = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/ticket-types`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch ticket types"
    );
  }
};

// Bills
export const getAllBills = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/bills`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch bills");
  }
};

export const getBillById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/admin/bills/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch bill details"
    );
  }
};

export const updateBillStatus = async (id, statusId) => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/bills/${id}/status`,
      { statusId },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update bill status"
    );
  }
};

export const deleteBill = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/admin/bills/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete bill");
  }
};

// Reports
export const getSalesReport = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_URL}/admin/reports/sales`, {
      params: { startDate, endDate },
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch sales report"
    );
  }
};

export const getEventsReport = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/reports/events`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch events report"
    );
  }
};

export const getBookingsByCity = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/reports/bookings-by-city`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch city report"
    );
  }
};

export const getBookingsByCategory = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/reports/bookings-by-category`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch category report"
    );
  }
};
