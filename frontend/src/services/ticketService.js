import axios from 'axios';

const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}/api/tickets`; // Cập nhật URL API nếu cần

const ticketService = {
  createTicket: async (ticketData) => {
    try {
      const response = await axios.post(REACT_APP_API_URL, ticketData);
      return response.data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  getAllTickets: async () => {
    try {
      const response = await axios.get(REACT_APP_API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all tickets:', error);
      throw error;
    }
  },

  getTicketById: async (ticketId) => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL}/${ticketId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ticket with ID ${ticketId}:`, error);
      throw error;
    }
  },

  updateTicket: async (ticketId, updatedData) => {
    try {
      const response = await axios.put(`${REACT_APP_API_URL}/${ticketId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating ticket with ID ${ticketId}:`, error);
      throw error;
    }
  },

  softDeleteTicket: async (ticketId) => {
    try {
      const response = await axios.patch(`${REACT_APP_API_URL}/${ticketId}/soft-delete`);
      return response.data;
    } catch (error) {
      console.error(`Error soft-deleting ticket with ID ${ticketId}:`, error);
      throw error;
    }
  },

  deleteTicket: async (ticketId) => {
    try {
      const response = await axios.delete(`${REACT_APP_API_URL}/${ticketId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting ticket with ID ${ticketId}:`, error);
      throw error;
    }
  },
};

export default ticketService;
