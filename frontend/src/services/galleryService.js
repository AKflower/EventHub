import axios from 'axios';

const API_URL = 'http://localhost:3001/api/galleries'; // Cập nhật URL API nếu cần

const galleryService = {
  addImage: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding image:', error);
      throw error;
    }
  },

  getImageById: async (imageId) => {
    try {
      const response = await axios.get(`${API_URL}/${imageId}`, {
        responseType: 'blob', // Để lấy dữ liệu nhị phân (image)
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching image with ID ${imageId}:`, error);
      throw error;
    }
  },

  getLinkImage:  (imageId) => {
    return `${API_URL}/${imageId}`
  }
};

export default galleryService;
