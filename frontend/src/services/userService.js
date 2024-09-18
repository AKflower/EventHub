import axios from "axios";

// Thiết lập URL cơ sở cho tất cả các yêu cầu API
const API_URL = "http://localhost:3001/api/users"; // Cập nhật URL này theo backend của bạn

// Hàm tạo user
const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}`, userData);
    return response.data;
  } catch (error) {
    console.error("Create User Error:", error);
    throw error.response.data;
  }
};

// Hàm lấy tất cả user
const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    console.error("Get All Users Error:", error);
    throw error.response.data;
  }
};

// Hàm thay đổi mật khẩu
const changePassword = async (id, passwordData) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/change-password`, passwordData);
    return response.data;
  } catch (error) {
    console.error("Change Password Error:", error);
    throw error.response.data;
  }
};

// Hàm lấy thông tin user theo ID
const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get User By ID Error:", error);
    throw error.response.data;
  }
};

// Hàm cập nhật thông tin user
const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Update User Error:", error);
    throw error.response.data;
  }
};

// Hàm soft delete user
const softDeleteUser = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/soft-delete`);
    return response.data;
  } catch (error) {
    console.error("Soft Delete User Error:", error);
    throw error.response.data;
  }
};

// Hàm xóa user hoàn toàn
const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete User Error:", error);
    throw error.response.data;
  }
};

// Tạo đối tượng userService chứa tất cả các hàm
const userService = {
  createUser,
  getAllUsers,
  changePassword,
  getUserById,
  updateUser,
  softDeleteUser,
  deleteUser,
};

// Export userService để sử dụng trong các file khác
export default userService;
