import api from './api';

export const adminService = {
  uploadTest: async (testData) => {
    const response = await api.post('/admin/test/upload', testData);
    return response;
  },

  getAllStudents: async () => {
    const response = await api.get('/admin/students');
    return response;
  },

  getStudentResults: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/admin/results?${params}`);
    return response;
  },

  getLearningLoopStats: async () => {
    const response = await api.get('/admin/learning-loops');
    return response;
  },

  getAIUsageStats: async () => {
    const response = await api.get('/admin/ai-usage');
    return response;
  },

  deleteTest: async (testId) => {
    const response = await api.delete(`/admin/test/${testId}`);
    return response;
  },

  toggleTestStatus: async (testId) => {
    const response = await api.patch(`/admin/test/${testId}/toggle`);
    return response;
  }
};
