import Test from '../models/Test.js';
import Question from '../models/Question.js';
import User from '../models/User.js';
import Attempt from '../models/Attempt.js';
import LearningLoop from '../models/LearningLoop.js';
import AIQuestion from '../models/AIQuestion.js';

export const uploadTest = async (req, res) => {
  try {
    const { title, description, domain, difficulty, duration, totalMarks, passingMarks, instructions, questions } = req.body;

    if (!title || !domain || !difficulty || !duration || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create test
    const test = await Test.create({
      title,
      description,
      domain,
      difficulty,
      duration,
      totalMarks: totalMarks || questions.length,
      passingMarks: passingMarks || Math.ceil(questions.length * 0.4),
      instructions: instructions || [],
      createdBy: req.user._id
    });

    // Create questions
    const questionDocs = await Question.insertMany(
      questions.map(q => ({
        testId: test._id,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        marks: q.marks || 1,
        topic: q.topic,
        concept: q.concept,
        difficulty: q.difficulty || difficulty
      }))
    );

    // Update test with question IDs
    test.questions = questionDocs.map(q => q._id);
    await test.save();

    res.status(201).json({
      success: true,
      message: 'Test uploaded successfully',
      test
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload test',
      error: error.message
    });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
};

export const getStudentResults = async (req, res) => {
  try {
    const { testId, domain, minScore, maxScore, startDate, endDate } = req.query;

    let matchFilter = { isCompleted: true };

    const attempts = await Attempt.find(matchFilter)
      .populate('studentId', 'fullName email college branch interestedDomain')
      .populate('testId', 'title domain difficulty totalMarks')
      .sort({ completedAt: -1 });

    let results = attempts.map(att => ({
      studentName: att.studentId.fullName,
      studentEmail: att.studentId.email,
      college: att.studentId.college,
      branch: att.studentId.branch,
      domain: att.studentId.interestedDomain,
      testName: att.testId.title,
      testDomain: att.testId.domain,
      difficulty: att.testId.difficulty,
      score: att.score,
      totalMarks: att.testId.totalMarks,
      accuracy: att.accuracy,
      attemptNumber: att.attemptNumber,
      completedAt: att.completedAt
    }));

    // Apply filters
    if (testId) {
      results = results.filter(r => r.testId === testId);
    }
    if (domain) {
      results = results.filter(r => r.testDomain === domain || r.domain === domain);
    }
    if (minScore) {
      results = results.filter(r => r.score >= parseFloat(minScore));
    }
    if (maxScore) {
      results = results.filter(r => r.score <= parseFloat(maxScore));
    }
    if (startDate) {
      results = results.filter(r => new Date(r.completedAt) >= new Date(startDate));
    }
    if (endDate) {
      results = results.filter(r => new Date(r.completedAt) <= new Date(endDate));
    }

    res.status(200).json({
      success: true,
      count: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student results',
      error: error.message
    });
  }
};

export const getLearningLoopStats = async (req, res) => {
  try {
    const totalLoops = await LearningLoop.countDocuments();
    const activeLoops = await LearningLoop.countDocuments({ isActive: true });
    const masteredLoops = await LearningLoop.countDocuments({ isMastered: true });

    const loops = await LearningLoop.find()
      .populate('studentId', 'fullName email')
      .populate('testId', 'title domain')
      .sort({ createdAt: -1 });

    const stats = loops.map(loop => ({
      studentName: loop.studentId.fullName,
      studentEmail: loop.studentId.email,
      testName: loop.testId.title,
      domain: loop.testId.domain,
      currentAttempt: loop.currentAttempt,
      totalAIQuestions: loop.totalAIQuestions,
      isActive: loop.isActive,
      isMastered: loop.isMastered,
      startedAt: loop.startedAt
    }));

    res.status(200).json({
      success: true,
      summary: {
        totalLoops,
        activeLoops,
        masteredLoops
      },
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch learning loop stats',
      error: error.message
    });
  }
};

export const getAIUsageStats = async (req, res) => {
  try {
    const totalAIQuestions = await AIQuestion.countDocuments();
    const attemptedAIQuestions = await AIQuestion.countDocuments({ isAttempted: true });
    const correctAIAnswers = await AIQuestion.countDocuments({ isCorrect: true });

    const aiQuestionsByTest = await AIQuestion.aggregate([
      {
        $group: {
          _id: '$testId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'tests',
          localField: '_id',
          foreignField: '_id',
          as: 'test'
        }
      },
      {
        $unwind: '$test'
      },
      {
        $project: {
          testName: '$test.title',
          domain: '$test.domain',
          aiQuestionsGenerated: '$count'
        }
      },
      {
        $sort: { aiQuestionsGenerated: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      summary: {
        totalAIQuestions,
        attemptedAIQuestions,
        correctAIAnswers,
        accuracy: attemptedAIQuestions > 0 ? ((correctAIAnswers / attemptedAIQuestions) * 100).toFixed(2) : 0
      },
      byTest: aiQuestionsByTest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch AI usage stats',
      error: error.message
    });
  }
};

export const deleteTest = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    // Delete associated questions
    await Question.deleteMany({ testId });

    // Delete test
    await Test.findByIdAndDelete(testId);

    res.status(200).json({
      success: true,
      message: 'Test deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete test',
      error: error.message
    });
  }
};

export const toggleTestStatus = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    test.isActive = !test.isActive;
    await test.save();

    res.status(200).json({
      success: true,
      message: `Test ${test.isActive ? 'activated' : 'deactivated'} successfully`,
      test
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update test status',
      error: error.message
    });
  }
};
