import axios from "axios";

// Thiết lập URL cơ sở cho tất cả các yêu cầu API
const API_URL = "http://localhost:3001/api/auth";

// Hàm đăng ký
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Registration Error:", error);
    throw error.response.data;
  }
};

// Hàm đăng nhập
const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error.response.data;
  }
};

// Hàm đăng xuất
const logout = async () => {
  try {
    const response = await axios.post(`${API_URL}/logout`);
    return response.data;
  } catch (error) {
    console.error("Logout Error:", error);
    throw error.response.data;
  }
};

const authService = {
    login,
    logout,
    register
}

export default authService;