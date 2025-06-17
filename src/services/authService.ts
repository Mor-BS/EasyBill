import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

export const register = async (
  email: string,
  password: string,
  first_name: string,
  last_name: string,
  phone_number?: string,
  user_type?: string
) => {
  const response = await axios.post(`${API_URL}/register`, {
    email,
    password,
    first_name,
    last_name,
    phone_number,
    user_type
  });
  return response.data;
};
export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};