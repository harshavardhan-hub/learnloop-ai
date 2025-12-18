import mongoose from 'mongoose';

const learningLoopSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  originalAttemptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attempt',
    required: true
  },
  attempts: [{
    attemptNumber: Number,
    attemptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attempt'
    },
    score: Number,
    accuracy: Number,
    completedAt: Date
  }],
  // ✅ NEW: Track each AI practice session separately
  aiPracticeAttempts: [{
    attemptNumber: Number,
    completedAt: Date,
    totalQuestions: Number,
    correctAnswers: Number,
    wrongAnswers: Number,
    accuracy: Number,
    aiQuestionIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AIQuestion'
    }]
  }],
  currentAttempt: {
    type: Number,
    default: 0  // ✅ Changed to 0 (increments after each AI practice)
  },
  totalAIQuestions: {
    type: Number,
    default: 0
  },
  aiQuestions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AIQuestion'
  }],
  // ✅ NEW: Track last completed AI practice session
  lastAIPracticeAttempt: {
    type: Number,
    default: 0
  },
  mistakePatterns: [{
    topic: String,
    concept: String,
    errorCount: Number,
    improvementRate: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isMastered: {
    type: Boolean,
    default: false
  },
  masteryThreshold: {
    type: Number,
    default: 80 // 80% accuracy
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

const LearningLoop = mongoose.model('LearningLoop', learningLoopSchema);

export default LearningLoop;
