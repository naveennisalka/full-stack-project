import api from './axiosConfig';

export const getMicroJobs = (params) => api.get('/microjobs', { params });
export const createMicroJob = (data) => api.post('/microjobs', data);
export const getMicroJob = (id) => api.get(`/microjobs/${id}`);
export const applyForJob = (id, data) => api.post(`/microjobs/${id}/apply`, data);
export const getJobApplications = (id) => api.get(`/microjobs/${id}/applications`);
export const updateApplicationStatus = (jobId, appId, data) => api.put(`/microjobs/${jobId}/applications/${appId}`, data);
export const completeJob = (id, data) => api.put(`/microjobs/${id}/complete`, data);
export const getMyApplications = () => api.get('/microjobs/my-applications');
