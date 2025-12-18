import api from './api';

export const aiService = {
  generateQuestions: async (attemptId) => {
    const response = await api.post(`/ai/generate/${attemptId}`);
    return response;
  },

  generateQuestionsFromPractice: async (learningLoopId) => {
    const response = await api.post(`/ai/generate-from-practice/${learningLoopId}`);
    return response;
  },

  getAIQuestions: async (learningLoopId) => {
    const response = await api.get(`/ai/questions/${learningLoopId}`);
    return response;
  },

  submitAIQuestions: async (learningLoopId, answers) => {
    const response = await api.post(`/ai/submit/${learningLoopId}`, { answers });
    return response;
  },

  // ✅ NEW: Get detailed results
  getAIPracticeResults: async (learningLoopId) => {
    const response = await api.get(`/ai/results/${learningLoopId}`);
    return response;
  },

  endLearningLoop: async (learningLoopId) => {
    const response = await api.post(`/ai/end/${learningLoopId}`);
    return response;
  }
};
