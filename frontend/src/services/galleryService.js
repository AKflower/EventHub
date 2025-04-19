import axios from 'axios';

const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}/api/galleries`; // Cập nhật URL API nếu cần

const galleryService = {
  addImage: async (formData) => {
    try {
      const response = await axios.post(`${REACT_APP_API_URL}`, formData, {
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
      const response = await axios.get(`${REACT_APP_API_URL}/${imageId}`, {
        responseType: 'blob', // Để lấy dữ liệu nhị phân (image)
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching image with ID ${imageId}:`, error);
      throw error;
    }
  },

  getLinkImage:  (imageId) => {
    return `${REACT_APP_API_URL}/${imageId}`
  }
};

export default galleryService;
