import mongoose from 'mongoose';

const aiQuestionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalQuestionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  learningLoopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningLoop',
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  explanation: {
    type: String
  },
  topic: {
    type: String,
    required: true
  },
  concept: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  isAttempted: {
    type: Boolean,
    default: false
  },
  studentAnswer: {
    type: String
  },
  isCorrect: {
    type: Boolean
  }
}, {
  timestamps: true
});

const AIQuestion = mongoose.model('AIQuestion', aiQuestionSchema);

export default AIQuestion;
