import api from './api';

export const testService = {
  getAllTests: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/tests?${params}`);
    return response;
  },

  getTestById: async (testId) => {
    const response = await api.get(`/tests/${testId}`);
    return response;
  },

  getTestQuestions: async (testId) => {
    const response = await api.get(`/tests/${testId}/questions`);
    return response;
  },

  startTest: async (testId) => {
    const response = await api.post(`/tests/${testId}/start`);
    return response;
  },

  submitTest: async (attemptId, answers, timeTaken) => {
    const response = await api.post(`/tests/attempt/${attemptId}/submit`, {
      answers,
      timeTaken
    });
    return response;
  },

  getDashboardStats: async () => {
    const response = await api.get('/student/dashboard');
    return response;
  },

  getTestHistory: async () => {
    const response = await api.get('/student/history');
    return response;
  },

  getAttemptResult: async (attemptId) => {
    const response = await api.get(`/student/result/${attemptId}`);
    return response;
  },

  getActiveLearningLoops: async () => {
    const response = await api.get('/student/learning-loops');
    return response;
  }
};
