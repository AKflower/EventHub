import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/events"; // Base URL cho API của bạn

// Tạo sự kiện mới
const createEvent = async (eventData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, eventData);
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

// Lấy tất cả sự kiện
const getAllEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all events:", error);
    throw error;
  }
};

// Lấy sự kiện theo ID
const getEventById = async (eventId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${eventId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    throw error;
  }
};

const getEventsByCreatedById = async (createdById) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/created-by/${createdById}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    throw error;
  }
};

// Lọc sự kiện theo danh mục và trạng thái miễn phí
const getEventsByCategoryAndIsFree = async (categories, isFree, city) => {
  try {
    const params = {
      categories,
      isFree,
      city,
    };
    const response = await axios.get(`${API_BASE_URL}/filter`, { params });
    return response.data;
  } catch (error) {
    console.error("Error filtering events:", error);
    throw error;
  }
};

// Tìm kiếm sự kiện theo tên
const searchEventsByName = async (name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { name },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching events by name:", error);
    throw error;
  }
};

const patchEventIsActive = async (id, isActive) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${id}/active`, { isActive });
    return response.data;
  } catch (error) {
    console.error('Error patching event isActive:', error);
    throw error;
  }
};

// Cập nhật sự kiện
const updateEvent = async (eventId, eventData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

// Xóa mềm sự kiện
const softDeleteEvent = async (eventId) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/soft-delete/${eventId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error soft deleting event:", error);
    throw error;
  }
};

// Xóa sự kiện
const deleteEvent = async (eventId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${eventId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

const eventService = {
  createEvent,
  getAllEvents,
  getEventById,
  getEventsByCategoryAndIsFree,
  getEventsByCreatedById,
  searchEventsByName,
  patchEventIsActive,
  updateEvent,
  softDeleteEvent,
  deleteEvent,
};

export default eventService;
