// Simple in-memory cache for AI responses
const cache = new Map();
const CACHE_TTL = 3600000; // 1 hour

export const getCachedAIResponse = (key) => {
  const cached = cache.get(key);
  
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
};

export const setCachedAIResponse = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

export const clearCache = () => {
  cache.clear();
};

export const generateCacheKey = (questionId, studentId) => {
  return `ai_${questionId}_${studentId}`;
};
