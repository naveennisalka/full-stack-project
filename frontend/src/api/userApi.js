import api from './axiosConfig';

export const getUserProfile = (id) => api.get(`/users/${id}`);
export const updateUserProfile = (id, data) => api.put(`/users/${id}`, data);
export const followUser = (id) => api.post(`/users/${id}/follow`);
export const unfollowUser = (id) => api.delete(`/users/${id}/follow`);
export const searchUsers = (query) => api.get(`/users/search?q=${query}`);
