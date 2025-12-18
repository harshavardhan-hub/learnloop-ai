export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

export const calculatePercentage = (obtained, total) => {
  if (total === 0) return 0;
  return ((obtained / total) * 100).toFixed(2);
};

export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const paginate = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  return {
    data: array.slice(startIndex, endIndex),
    currentPage: page,
    totalPages: Math.ceil(array.length / limit),
    totalItems: array.length
  };
};
