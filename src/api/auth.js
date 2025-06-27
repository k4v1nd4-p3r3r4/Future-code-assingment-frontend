import axios from 'axios'

const API_URL = 'http://localhost:8000/api/auth'

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData)
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData)
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

const logout = () => {
  localStorage.removeItem('user')
}

const getAllProducts = async () => {
  console.log('Fetching products...');
  const response = await axios.get(`${API_URL}/all`);
  console.log('Products:', response.data);
  return response.data;
}

const authService = {
  register,
  login,
  logout,
  getAllProducts
}

export default authService