import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: baseURL ? `${baseURL.replace(/\/$/, '')}` : '',
  headers: { 'Content-Type': 'application/json' },
});

export const getTree = () => api.get('/api/tree');
export const insert = (values) => api.post('/api/insert', { values });
export const search = (value, mode) => api.post('/api/search', { value, mode });
export const remove = (values) => api.delete('/api/remove', { data: { values } });
export const clearHighlight = () => api.post('/api/clear-highlight');
export const clearTree = () => api.delete('/api/clear');
export const getInorder = () => api.get('/api/inorder');
export const getPreorder = () => api.get('/api/preorder');
export const getPostorder = () => api.get('/api/postorder');
export const getMin = () => api.get('/api/min');
export const getMax = () => api.get('/api/max');
export const getPredecessor = (value) => api.post('/api/predecessor', { value });
export const getSuccessor = (value) => api.post('/api/successor', { value });
export const selectK = (k) => api.post('/api/select', { k });
export const createEmpty = () => api.post('/api/create/empty');
export const createRandom = (n) => api.post('/api/create/random', { n });
export const createExamples = () => api.post('/api/create/examples');
export const highlightPath = (path) => api.post('/api/highlight', { path });

export default api;
