import api from './axiosConfig';

export const getOrgProfile = (id) => api.get(`/organizations/${id}`);
export const updateOrgProfile = (id, data) => api.put(`/organizations/${id}`, data);
export const followOrg = (id) => api.post(`/organizations/${id}/follow`);
export const unfollowOrg = (id) => api.delete(`/organizations/${id}/follow`);
export const searchOrgs = (query) => api.get(`/organizations/search?q=${query}`);
