import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL + "/api" || "http://localhost:3001/api";

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Dashboard data
export const getDashboardData = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/dashboard`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Event management
export const getAllEvents = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/events`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/events`,
      eventData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/events/${id}`,
      eventData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/admin/events/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// User management
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/users`, getAuthHeader());
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/users/${id}`,
      userData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/admin/users/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const updateUserRole = async (id, roleId) => {
  try {
    // Ensure roleId is a number for the API
    const numericRoleId =
      typeof roleId === "string" ? parseInt(roleId, 10) : roleId;

    console.log("Sending role update with:", {
      userId: id,
      roleId: numericRoleId,
      originalType: typeof roleId,
    });

    const response = await axios.put(
      `${API_URL}/admin/users/${id}/role`,
      { roleId: numericRoleId },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Booking management
export const getAllBookings = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/bookings`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Ticket management
export const getAllTickets = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/tickets`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Ticket Types management
export const getAllTicketTypes = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/ticket-types`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Bill management
export const getAllBills = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/bills`, getAuthHeader());
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getBillById = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/bills/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const updateBillStatus = async (id, statusId) => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/bills/${id}/status`,
      { statusId },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const deleteBill = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/admin/bills/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Category management
export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/categories`,
      categoryData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/categories/${id}`,
      categoryData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/admin/categories/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/categories/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Get options
export const getBillStatuses = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/bill-statuses`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getPaymentMethods = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/payment-methods`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getAllRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/roles`, getAuthHeader());
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getAllCategories = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/categories`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Reports
export const getSalesReport = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/reports/sales?startDate=${startDate}&endDate=${endDate}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getEventsReport = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/reports/events`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getBookingsByCity = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/reports/bookings-by-city`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getBookingsByCategory = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/reports/bookings-by-category`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Error handling
const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code outside the 2xx range
    console.error("API Error Response:", error.response.data);
    console.error("Status Code:", error.response.status);

    // Redirect to login if unauthorized
    if (error.response.status === 401 || error.response.status === 403) {
      window.location.href = "/admin/login";
    }

    throw {
      message:
        error.response.data.message || "An error occurred with the API request",
      status: error.response.status,
    };
  } else if (error.request) {
    // The request was made but no response was received
    console.error("API Error Request:", error.request);
    throw { message: "No response received from server" };
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("API Error:", error.message);
    throw { message: error.message || "Unknown error occurred" };
  }
};

export default {
  getDashboardData,
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getAllUsers,
  updateUser,
  deleteUser,
  updateUserRole,
  getAllBookings,
  getAllTickets,
  getAllTicketTypes,
  getAllBills,
  getBillById,
  updateBillStatus,
  deleteBill,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getBillStatuses,
  getPaymentMethods,
  getAllRoles,
  getAllCategories,
  getSalesReport,
  getEventsReport,
  getBookingsByCity,
  getBookingsByCategory,
};
