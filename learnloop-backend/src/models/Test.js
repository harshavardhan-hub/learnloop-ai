import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Test title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  domain: {
    type: String,
    required: [true, 'Domain is required'],
    enum: [
      'Frontend Developer',
      'Backend Developer',
      'Full Stack Developer',
      'DevOps Engineer',
      'General',
      'Other'
    ]
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['Easy', 'Medium', 'Hard']
  },
  duration: {
    type: Number,
    required: [true, 'Test duration is required'],
    min: 1 // in minutes
  },
  totalMarks: {
    type: Number,
    required: true
  },
  passingMarks: {
    type: Number,
    required: true
  },
  instructions: {
    type: [String],
    default: []
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Test = mongoose.model('Test', testSchema);

export default Test;
