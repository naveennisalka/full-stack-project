import api from './axiosConfig';

export const getConversations = () => api.get('/chat/conversations');
export const createOrGetConversation = (data) => api.post('/chat/conversations', data);
export const getMessages = (convId) => api.get(`/chat/conversations/${convId}/messages`);
export const sendMessage = (convId, data) => api.post(`/chat/conversations/${convId}/messages`, data);
export const createGroupConversation = (data) => api.post('/chat/conversations/group', data);
