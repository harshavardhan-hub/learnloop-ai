export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateTestJSON = (testData) => {
  const required = ['title', 'domain', 'difficulty', 'duration', 'questions'];
  
  for (const field of required) {
    if (!testData[field]) {
      return { valid: false, message: `${field} is required` };
    }
  }

  if (!Array.isArray(testData.questions) || testData.questions.length === 0) {
    return { valid: false, message: 'Questions array is required and must not be empty' };
  }

  for (const question of testData.questions) {
    if (!question.questionText || !question.options || !question.correctAnswer) {
      return { valid: false, message: 'Each question must have questionText, options, and correctAnswer' };
    }

    if (!Array.isArray(question.options) || question.options.length < 2) {
      return { valid: false, message: 'Each question must have at least 2 options' };
    }
  }

  return { valid: true };
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};
