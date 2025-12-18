import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
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
  attemptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attempt',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  wrongAnswers: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number // in seconds
  },
  isPassed: {
    type: Boolean,
    default: false
  },
  mistakeBreakdown: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    studentAnswer: String,
    correctAnswer: String,
    explanation: String,
    topic: String,
    concept: String
  }],
  weakAreas: [{
    topic: String,
    errorCount: Number
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Result = mongoose.model('Result', resultSchema);

export default Result;
