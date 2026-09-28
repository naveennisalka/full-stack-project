import api from './axiosConfig';

export const bookTicket = (data) => api.post('/tickets/book', data);
export const getMyTickets = () => api.get('/tickets/my');
export const getTicket = (id) => api.get(`/tickets/${id}`);
export const cancelTicket = (id) => api.delete(`/tickets/${id}`);
