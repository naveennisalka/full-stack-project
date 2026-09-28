import api from './axiosConfig';

export const getFeed = (page = 1) => api.get(`/posts?page=${page}`);
export const createPost = (data) => api.post('/posts', data); // FormData for images
export const getPost = (id) => api.get(`/posts/${id}`);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const likePost = (id) => api.post(`/posts/${id}/like`);
export const commentPost = (id, data) => api.post(`/posts/${id}/comment`, data);
export const getUserPosts = (userId) => api.get(`/posts/user/${userId}`);
