import axios from 'axios';

const API_URL = 'http://localhost:3001/api/tickettypes'; // Cập nhật URL API nếu cần

const ticketTypeService = {
  createTicketType: async (ticketTypeData) => {
    try {
      const response = await axios.post(API_URL, ticketTypeData);
      return response.data;
    } catch (error) {
      console.error('Error creating ticket type:', error);
      throw error;
    }
  },

  getAllTicketTypes: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all ticket types:', error);
      throw error;
    }
  },

  getTicketTypeById: async (ticketTypeId) => {
    try {
      const response = await axios.get(`${API_URL}/${ticketTypeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ticket type with ID ${ticketTypeId}:`, error);
      throw error;
    }
  },

  getTicketTypesByEventId: async (eventId) => {
    try {
      const response = await axios.get(`${API_URL}/event/${eventId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ticket types for event ID ${eventId}:`, error);
      throw error;
    }
  },

  updateTicketType: async (ticketTypeId, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/${ticketTypeId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating ticket type with ID ${ticketTypeId}:`, error);
      throw error;
    }
  },

  softDeleteTicketType: async (ticketTypeId) => {
    try {
      const response = await axios.patch(`${API_URL}/${ticketTypeId}/soft-delete`);
      return response.data;
    } catch (error) {
      console.error(`Error soft-deleting ticket type with ID ${ticketTypeId}:`, error);
      throw error;
    }
  },

  deleteTicketType: async (ticketTypeId) => {
    try {
      const response = await axios.delete(`${API_URL}/${ticketTypeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting ticket type with ID ${ticketTypeId}:`, error);
      throw error;
    }
  },
};

export default ticketTypeService;
