import axios from 'axios';

// Cấu hình URL cho các API thanh toán
const API_URL = 'http://localhost:3001/api/pay'; // Cập nhật URL API nếu cần

const paymentService = {
  // Gửi yêu cầu thanh toán VNPay
  payWithVNPay: async (amount,bookingId) => {
    try {
      const response = await axios.post(`${API_URL}/vnpay`, { amount,bookingId });
      return response.data;
    } catch (error) {
      console.error('Error creating VNPay payment request:', error);
      throw error;
    }
  },

  // Gửi yêu cầu thanh toán MoMo
  payWithMoMo: async (amount, orderId) => {
    try {
      const response = await axios.post(`${API_URL}/momo`, { amount, orderId });
      return response.data;
    } catch (error) {
      console.error('Error creating MoMo payment request:', error);
      throw error;
    }
  },

  // Xử lý thông báo từ VNPay
  handleVnPayNotify: async (query) => {
    try {
      const response = await axios.post(`${API_URL}/vnpay/notify`, query);
      return response.data;
    } catch (error) {
      console.error('Error handling VNPay notification:', error);
      throw error;
    }
  },

  // Xử lý kết quả thanh toán từ VNPay
  handleVnPayReturn: async (query) => {
    try {
      const response = await axios.get(`${API_URL}/vnpay/return`, { params: query });
      return response.data;
    } catch (error) {
      console.error('Error handling VNPay return:', error);
      throw error;
    }
  },

  // Xử lý thông báo từ MoMo
  handleMoMoNotify: async (query) => {
    try {
      const response = await axios.post(`${API_URL}/momo/notify`, query);
      return response.data;
    } catch (error) {
      console.error('Error handling MoMo notification:', error);
      throw error;
    }
  },

  // Xử lý kết quả thanh toán từ MoMo
  handleMoMoReturn: async (query) => {
    try {
      const response = await axios.get(`${API_URL}/momo/return`, { params: query });
      return response.data;
    } catch (error) {
      console.error('Error handling MoMo return:', error);
      throw error;
    }
  }
};

export default paymentService;
