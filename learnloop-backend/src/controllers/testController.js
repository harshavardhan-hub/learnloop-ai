import Test from '../models/Test.js';
import Question from '../models/Question.js';
import Attempt from '../models/Attempt.js';

export const getAllTests = async (req, res) => {
  try {
    const { domain, difficulty, isActive } = req.query;
    
    let filter = {};
    if (domain) filter.domain = domain;
    if (difficulty) filter.difficulty = difficulty;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const tests = await Test.find(filter)
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tests.length,
      tests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tests',
      error: error.message
    });
  }
};

export const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId)
      .populate('questions')
      .populate('createdBy', 'fullName email');

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    res.status(200).json({
      success: true,
      test
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test',
      error: error.message
    });
  }
};

export const getTestQuestions = async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId).populate('questions');

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    // Remove correct answers and explanations for students
    const questions = test.questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options.map(opt => ({ text: opt.text })),
      marks: q.marks,
      topic: q.topic
    }));

    res.status(200).json({
      success: true,
      test: {
        _id: test._id,
        title: test.title,
        description: test.description,
        duration: test.duration,
        totalMarks: test.totalMarks,
        instructions: test.instructions
      },
      questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questions',
      error: error.message
    });
  }
};

export const startTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const studentId = req.user._id;

    const test = await Test.findById(testId).populate('questions');

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    if (!test.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Test is not active'
      });
    }

    // Count previous attempts
    const previousAttempts = await Attempt.countDocuments({
      studentId,
      testId,
      isCompleted: true
    });

    // Create new attempt
    const attempt = await Attempt.create({
      studentId,
      testId,
      attemptNumber: previousAttempts + 1,
      totalQuestions: test.questions.length,
      startedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Test started successfully',
      attemptId: attempt._id,
      test: {
        _id: test._id,
        title: test.title,
        duration: test.duration,
        totalMarks: test.totalMarks,
        totalQuestions: test.questions.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to start test',
      error: error.message
    });
  }
};

export const submitTest = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers, timeTaken } = req.body;

    const attempt = await Attempt.findById(attemptId)
      .populate({
        path: 'testId',
        populate: { path: 'questions' }
      });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Attempt not found'
      });
    }

    if (attempt.isCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Test already submitted'
      });
    }

    // Verify ownership
    if (attempt.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const test = attempt.testId;
    let score = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    const processedAnswers = [];

    // Evaluate answers
    test.questions.forEach((question) => {
      const studentAnswer = answers[question._id.toString()];
      const isCorrect = studentAnswer === question.correctAnswer;

      if (isCorrect) {
        correctAnswers++;
        score += question.marks;
      } else {
        wrongAnswers++;
      }

      processedAnswers.push({
        questionId: question._id,
        selectedAnswer: studentAnswer || 'Not Answered',
        isCorrect,
        marksObtained: isCorrect ? question.marks : 0
      });
    });

    const accuracy = ((correctAnswers / test.questions.length) * 100).toFixed(2);

    // Update attempt
    attempt.answers = processedAnswers;
    attempt.score = score;
    attempt.correctAnswers = correctAnswers;
    attempt.wrongAnswers = wrongAnswers;
    attempt.accuracy = accuracy;
    attempt.timeTaken = timeTaken;
    attempt.completedAt = new Date();
    attempt.isCompleted = true;

    await attempt.save();

    res.status(200).json({
      success: true,
      message: 'Test submitted successfully',
      result: {
        attemptId: attempt._id,
        score,
        totalMarks: test.totalMarks,
        correctAnswers,
        wrongAnswers,
        accuracy,
        timeTaken
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit test',
      error: error.message
    });
  }
};
