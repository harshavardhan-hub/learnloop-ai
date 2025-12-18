import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: [{
    text: {
      type: String,
      required: true
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    trim: true
  },
  marks: {
    type: Number,
    default: 1
  },
  topic: {
    type: String,
    trim: true
  },
  concept: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  }
}, {
  timestamps: true
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
