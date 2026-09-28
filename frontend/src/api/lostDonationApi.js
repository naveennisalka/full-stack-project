import api from './axiosConfig';

export const getLostItems = (params) => api.get('/lost-donation/lost', { params });
export const createLostItem = (data) => api.post('/lost-donation/lost', data);
export const resolveLostItem = (id) => api.put(`/lost-donation/lost/${id}/resolve`);
export const getDonations = () => api.get('/lost-donation/donations');
export const createDonation = (data) => api.post('/lost-donation/donations', data);
export const getDonation = (id) => api.get(`/lost-donation/donations/${id}`);
export const donate = (id, data) => api.post(`/lost-donation/donations/${id}/donate`, data);
