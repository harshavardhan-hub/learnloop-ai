export const DOMAINS = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Other'
];

export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];

export const USER_ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin'
};

export const TEST_STATUS = {
  ACTIVE: true,
  INACTIVE: false
};

export const MASTERY_THRESHOLD = 80; // 80% accuracy

export const DEFAULT_TEST_DURATION = 30; // minutes

export const MAX_AI_QUESTIONS_PER_MISTAKE = 3;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Access denied. Please login.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Invalid input data.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  EMAIL_EXISTS: 'Email already registered.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  TOKEN_EXPIRED: 'Session expired. Please login again.',
  TEST_NOT_FOUND: 'Test not found.',
  ATTEMPT_NOT_FOUND: 'Attempt not found.',
  AI_GENERATION_FAILED: 'Failed to generate AI questions. Please try again.'
};

export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: 'Registration successful.',
  LOGIN_SUCCESS: 'Login successful.',
  TEST_UPLOADED: 'Test uploaded successfully.',
  TEST_STARTED: 'Test started successfully.',
  TEST_SUBMITTED: 'Test submitted successfully.',
  AI_QUESTIONS_GENERATED: 'AI questions generated successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.'
};
