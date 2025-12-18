import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema({
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
  attemptNumber: {
    type: Number,
    default: 1
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    selectedAnswer: {
      type: String
    },
    isCorrect: {
      type: Boolean
    },
    marksObtained: {
      type: Number,
      default: 0
    }
  }],
  score: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  wrongAnswers: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  },
  timeTaken: {
    type: Number, // in seconds
    default: 0
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Attempt = mongoose.model('Attempt', attemptSchema);

export default Attempt;
