import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const getAllBills = async () => {
  try {
    const response = await axios.get(`${API_URL}/bills`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bills:', error);
    throw error;
  }
};

const getBillById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/bills/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bill by ID:', error);
    throw error;
  }
};

const createBill = async (billData) => {
  try {
    const response = await axios.post(`${API_URL}/bills`, billData);
    return response.data;
  } catch (error) {
    console.error('Error creating bill:', error);
    throw error;
  }
};

const updateBill = async (id, billData) => {
  try {
    const response = await axios.put(`${API_URL}/bills/${id}`, billData);
    return response.data;
  } catch (error) {
    console.error('Error updating bill:', error);
    throw error;
  }
};

const softDeleteBill = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/bills/${id}/soft-delete`);
    return response.data;
  } catch (error) {
    console.error('Error soft deleting bill:', error);
    throw error;
  }
};

const deleteBill = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/bills/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting bill:', error);
    throw error;
  }
};

const getTotalRevenueByEvent = async () => {
  try {
    const response = await axios.get(`${API_URL}/bills/total-revenue`);
    return response.data;
  } catch (error) {
    console.error('Error fetching total revenue by event:', error);
    throw error;
  }
};

export default billService = {
  getAllBills,
  getBillById,
  createBill,
  updateBill,
  softDeleteBill,
  deleteBill,
  getTotalRevenueByEvent
};
