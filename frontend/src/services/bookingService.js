import axios from 'axios';

const API_URL = 'http://localhost:3001/api/bookings'; // Cập nhật URL API nếu cần

const bookingService = {
  createBooking: async (bookingData) => {
    try {
      const response = await axios.post(`${API_URL}`, bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  getAllBookings: async () => {
    try {
      const response = await axios.get(`${API_URL}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw error;
    }
  },

  getBookingById: async (bookingId) => {
    try {
      const response = await axios.get(`${API_URL}/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching booking with ID ${bookingId}:`, error);
      throw error;
    }
  },

  getBookingsByDate: async (date) => {
    try {
      const response = await axios.get(`${API_URL}/date`, {
        params: { date },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings by date:', error);
      throw error;
    }
  },

  getTotalBookingsByMonth: async (month, year) => {
    try {
      const response = await axios.get(`${API_URL}/month-total`, {
        params: { month, year },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching total bookings by month:', error);
      throw error;
    }
  },

  updateBooking: async (bookingId, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/${bookingId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating booking with ID ${bookingId}:`, error);
      throw error;
    }
  },

  softDeleteBooking: async (bookingId) => {
    try {
      const response = await axios.patch(`${API_URL}/soft-delete/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error(`Error soft deleting booking with ID ${bookingId}:`, error);
      throw error;
    }
  },

  deleteBooking: async (bookingId) => {
    try {
      const response = await axios.delete(`${API_URL}/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting booking with ID ${bookingId}:`, error);
      throw error;
    }
  },
};

export default bookingService;
