import Attempt from '../models/Attempt.js';
import Result from '../models/Result.js';
import LearningLoop from '../models/LearningLoop.js';
import Test from '../models/Test.js';
import Question from '../models/Question.js';

export const getDashboardStats = async (req, res) => {
  try {
    const studentId = req.user._id;

    const totalAttempts = await Attempt.countDocuments({
      studentId,
      isCompleted: true
    });

    const attempts = await Attempt.find({
      studentId,
      isCompleted: true
    }).populate('testId');

    const totalScore = attempts.reduce((sum, att) => sum + att.score, 0);
    const totalPossibleMarks = attempts.reduce((sum, att) => sum + att.testId.totalMarks, 0);
    const averageScore = totalPossibleMarks > 0 ? ((totalScore / totalPossibleMarks) * 100).toFixed(2) : 0;

    const totalCorrect = attempts.reduce((sum, att) => sum + att.correctAnswers, 0);
    const totalQuestions = attempts.reduce((sum, att) => sum + att.totalQuestions, 0);
    const overallAccuracy = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(2) : 0;

    // Get weak areas
    const weakAreasMap = {};
    for (const attempt of attempts) {
      const test = await Test.findById(attempt.testId).populate('questions');
      attempt.answers.forEach((ans, idx) => {
        if (!ans.isCorrect && test.questions[idx]) {
          const topic = test.questions[idx].topic || 'General';
          weakAreasMap[topic] = (weakAreasMap[topic] || 0) + 1;
        }
      });
    }

    const weakAreas = Object.entries(weakAreasMap)
      .map(([topic, count]) => ({ topic, errorCount: count }))
      .sort((a, b) => b.errorCount - a.errorCount)
      .slice(0, 5);

    // ✅ UPDATED: Active learning loops - exclude mastered
    const activeLearningLoops = await LearningLoop.countDocuments({
      studentId,
      isActive: true,
      isMastered: false  // ✅ Exclude mastered loops
    });

    res.status(200).json({
      success: true,
      stats: {
        totalTestsAttempted: totalAttempts,
        averageScore: parseFloat(averageScore),
        overallAccuracy: parseFloat(overallAccuracy),
        weakAreas,
        activeLearningLoops
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};

export const getTestHistory = async (req, res) => {
  try {
    const studentId = req.user._id;

    const attempts = await Attempt.find({
      studentId,
      isCompleted: true
    })
      .populate('testId', 'title domain difficulty')
      .sort({ completedAt: -1 });

    const history = attempts.map(att => ({
      attemptId: att._id,
      testName: att.testId.title,
      domain: att.testId.domain,
      difficulty: att.testId.difficulty,
      date: att.completedAt,
      score: att.score,
      accuracy: att.accuracy,
      attemptNumber: att.attemptNumber
    }));

    res.status(200).json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test history',
      error: error.message
    });
  }
};

export const getAttemptResult = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const studentId = req.user._id;

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

    if (attempt.studentId.toString() !== studentId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    const test = attempt.testId;
    const mistakeBreakdown = [];

    attempt.answers.forEach((ans) => {
      if (!ans.isCorrect) {
        const question = test.questions.find(q => q._id.toString() === ans.questionId.toString());
        if (question) {
          mistakeBreakdown.push({
            questionId: question._id,
            questionText: question.questionText,
            studentAnswer: ans.selectedAnswer,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            topic: question.topic,
            concept: question.concept
          });
        }
      }
    });

    res.status(200).json({
      success: true,
      result: {
        attemptId: attempt._id,
        testName: test.title,
        score: attempt.score,
        totalMarks: test.totalMarks,
        correctAnswers: attempt.correctAnswers,
        wrongAnswers: attempt.wrongAnswers,
        accuracy: attempt.accuracy,
        timeTaken: attempt.timeTaken,
        completedAt: attempt.completedAt,
        mistakeBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch result',
      error: error.message
    });
  }
};

// ✅ UPDATED: Exclude mastered loops from active list
export const getActiveLearningLoops = async (req, res) => {
  try {
    const studentId = req.user._id;

    const loops = await LearningLoop.find({
      studentId,
      isActive: true,
      isMastered: false  // ✅ ADDED: Exclude mastered loops
    })
      .populate('testId', 'title domain difficulty')
      .sort({ createdAt: -1 });

    // ✅ Format response with more details
    const formattedLoops = loops.map(loop => ({
      _id: loop._id,
      testId: loop.testId._id,
      testTitle: loop.testId.title,
      domain: loop.testId.domain,
      difficulty: loop.testId.difficulty,
      totalAIQuestions: loop.totalAIQuestions,
      currentAttempt: loop.currentAttempt,
      createdAt: loop.createdAt,
      isActive: loop.isActive,
      isMastered: loop.isMastered
    }));

    res.status(200).json({
      success: true,
      count: formattedLoops.length,
      learningLoops: formattedLoops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch learning loops',
      error: error.message
    });
  }
};
