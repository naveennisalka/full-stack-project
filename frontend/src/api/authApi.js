import api from './axiosConfig';

export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register/user', data);
export const registerOrg = (data) => api.post('/auth/register/org', data);
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');
