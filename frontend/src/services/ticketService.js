import axios from 'axios';

const API_URL = 'http://localhost:3001/api/tickets'; // Cập nhật URL API nếu cần

const ticketService = {
  createTicket: async (ticketData) => {
    try {
      const response = await axios.post(API_URL, ticketData);
      return response.data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  getAllTickets: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all tickets:', error);
      throw error;
    }
  },

  getTicketById: async (ticketId) => {
    try {
      const response = await axios.get(`${API_URL}/${ticketId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ticket with ID ${ticketId}:`, error);
      throw error;
    }
  },

  updateTicket: async (ticketId, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/${ticketId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating ticket with ID ${ticketId}:`, error);
      throw error;
    }
  },

  softDeleteTicket: async (ticketId) => {
    try {
      const response = await axios.patch(`${API_URL}/${ticketId}/soft-delete`);
      return response.data;
    } catch (error) {
      console.error(`Error soft-deleting ticket with ID ${ticketId}:`, error);
      throw error;
    }
  },

  deleteTicket: async (ticketId) => {
    try {
      const response = await axios.delete(`${API_URL}/${ticketId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting ticket with ID ${ticketId}:`, error);
      throw error;
    }
  },
};

export default ticketService;
