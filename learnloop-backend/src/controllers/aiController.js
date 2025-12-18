import AIQuestion from '../models/AIQuestion.js';
import LearningLoop from '../models/LearningLoop.js';
import Question from '../models/Question.js';
import Test from '../models/Test.js';
import Attempt from '../models/Attempt.js';
import { generateAIQuestions } from '../config/openrouter.js';

const cleanAIResponse = (response) => {
  let cleaned = response.trim();
  const backtick = String.fromCharCode(96);
  const codeBlockJson = backtick + backtick + backtick + 'json';
  const codeBlock = backtick + backtick + backtick;

  if (cleaned.startsWith(codeBlockJson)) {
    cleaned = cleaned.slice(codeBlockJson.length);
  } else if (cleaned.startsWith(codeBlock)) {
    cleaned = cleaned.slice(codeBlock.length);
  }

  if (cleaned.endsWith(codeBlock)) {
    cleaned = cleaned.slice(0, -codeBlock.length);
  }

  return cleaned.trim();
};

export const generateQuestionsFromMistakes = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const studentId = req.user._id;

    console.log('🤖 ========== GENERATING AI QUESTIONS ==========');
    console.log('📝 Attempt ID:', attemptId);
    console.log('👤 Student ID:', studentId);

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

    if (!attempt.isCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Test not completed yet'
      });
    }

    const wrongAnswers = attempt.answers.filter(ans => !ans.isCorrect);
    
    console.log('❌ Wrong answers count:', wrongAnswers.length);

    // ✅ UPDATED: Don't create loop if perfect score
    if (wrongAnswers.length === 0) {
      console.log('🎉 Perfect score! No learning loop needed.');
      return res.status(200).json({
        success: true,
        message: 'Perfect score! No learning loop needed. Great job! 🎉',
        learningLoopId: null,
        aiQuestions: []
      });
    }

    let learningLoop = await LearningLoop.findOne({
      studentId,
      testId: attempt.testId._id,
      isActive: true
    });

    if (learningLoop) {
      console.log('🔄 Found existing learning loop, resetting AI questions...');
      
      await AIQuestion.updateMany(
        {
          learningLoopId: learningLoop._id,
          studentId,
          isAttempted: false
        },
        {
          $set: { isAttempted: true }
        }
      );
      
      console.log('✅ Old AI questions marked as attempted');

      learningLoop.aiQuestions = [];
      learningLoop.totalAIQuestions = 0;
      learningLoop.aiPracticeAttempts = [];  // ✅ Reset practice attempts
      learningLoop.currentAttempt = 0;
      learningLoop.lastAIPracticeAttempt = 0;
      learningLoop.isMastered = false;
      await learningLoop.save();
      
      console.log('✅ Learning loop reset for new attempt');
    } else {
      console.log('🆕 Creating new learning loop...');
      learningLoop = await LearningLoop.create({
        studentId,
        testId: attempt.testId._id,
        originalAttemptId: attemptId,
        attempts: [{
          attemptNumber: 1,
          attemptId: attemptId,
          score: attempt.score,
          accuracy: attempt.accuracy,
          completedAt: attempt.completedAt
        }],
        aiPracticeAttempts: [],  // ✅ Initialize empty
        currentAttempt: 0,
        lastAIPracticeAttempt: 0
      });
      console.log('✅ New learning loop created');
    }

    const test = attempt.testId;
    const generatedQuestions = [];

    console.log('🔄 Starting AI question generation for', wrongAnswers.length, 'wrong answers...');

    for (const wrongAnswer of wrongAnswers) {
      const originalQuestion = test.questions.find(
        q => q._id.toString() === wrongAnswer.questionId.toString()
      );

      if (!originalQuestion) {
        console.log('⚠️ Original question not found for:', wrongAnswer.questionId);
        continue;
      }

      console.log('📝 Generating AI questions for:', originalQuestion.questionText.substring(0, 50) + '...');

      const prompt = `Generate 2 similar multiple-choice questions based on the following:

Topic: ${originalQuestion.topic || 'General'}
Concept: ${originalQuestion.concept || 'Core concept'}
Difficulty: ${originalQuestion.difficulty}
Domain: ${test.domain}

Original Question: ${originalQuestion.questionText}
Correct Answer: ${originalQuestion.correctAnswer}

Requirements:
1. Generate 2 NEW questions testing the SAME concept
2. Same difficulty level
3. Four options each
4. Include brief explanation for correct answer
5. Return ONLY valid JSON array format, no markdown

IMPORTANT: Return raw JSON array only.

Format:
[
  {
    "questionText": "Question text here?",
    "options": [
      {"text": "Option A", "isCorrect": false},
      {"text": "Option B", "isCorrect": true},
      {"text": "Option C", "isCorrect": false},
      {"text": "Option D", "isCorrect": false}
    ],
    "correctAnswer": "Option B",
    "explanation": "Brief explanation"
  }
]`;

      try {
        const aiResponse = await generateAIQuestions(prompt);
        let aiQuestions;

        try {
          const cleanedResponse = cleanAIResponse(aiResponse);
          aiQuestions = JSON.parse(cleanedResponse);
        } catch (parseError) {
          console.error('❌ Parse error:', parseError.message);
          continue;
        }

        if (!Array.isArray(aiQuestions)) {
          console.error('❌ AI response is not an array');
          continue;
        }

        for (const aiQ of aiQuestions) {
          if (!aiQ.questionText || !aiQ.options || !aiQ.correctAnswer) {
            console.log('⚠️ Skipping invalid AI question');
            continue;
          }

          const aiQuestion = await AIQuestion.create({
            studentId,
            originalQuestionId: originalQuestion._id,
            testId: test._id,
            learningLoopId: learningLoop._id,
            questionText: aiQ.questionText,
            options: aiQ.options,
            correctAnswer: aiQ.correctAnswer,
            explanation: aiQ.explanation,
            topic: originalQuestion.topic,
            concept: originalQuestion.concept,
            difficulty: originalQuestion.difficulty
          });

          generatedQuestions.push(aiQuestion);
        }
      } catch (aiError) {
        console.error('❌ AI generation error:', aiError.message);
      }
    }

    learningLoop.totalAIQuestions = generatedQuestions.length;
    learningLoop.aiQuestions = generatedQuestions.map(q => q._id);
    await learningLoop.save();

    console.log('✅ Generated', generatedQuestions.length, 'AI questions');
    console.log('📊 Expected:', wrongAnswers.length * 2);
    console.log('========================================');

    res.status(201).json({
      success: true,
      message: `Generated ${generatedQuestions.length} AI questions`,
      learningLoopId: learningLoop._id,
      aiQuestions: generatedQuestions
    });
  } catch (error) {
    console.error('❌ AI question generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI questions',
      error: error.message
    });
  }
};

// ✅ FIXED: Generate AI questions from AI practice mistakes - ONLY FROM CURRENT SESSION
export const generateQuestionsFromAIPractice = async (req, res) => {
  try {
    const { learningLoopId } = req.params;
    const studentId = req.user._id;

    console.log('🔄 ========== GENERATING FROM AI PRACTICE MISTAKES ==========');
    console.log('🔗 Learning Loop ID:', learningLoopId);

    const learningLoop = await LearningLoop.findById(learningLoopId);

    if (!learningLoop) {
      return res.status(404).json({
        success: false,
        message: 'Learning loop not found'
      });
    }

    if (learningLoop.studentId.toString() !== studentId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    // ✅ CRITICAL FIX: Get ONLY questions from learning loop's aiQuestions array (current session)
    const currentSessionQuestionIds = learningLoop.aiQuestions;
    
    console.log('📋 Current session has', currentSessionQuestionIds.length, 'questions');

    // ✅ Find wrong questions ONLY from current session
    const wrongAIQuestions = await AIQuestion.find({
      _id: { $in: currentSessionQuestionIds },
      learningLoopId,
      studentId,
      isAttempted: true,
      isCorrect: false
    });

    console.log('❌ Wrong AI questions from CURRENT session:', wrongAIQuestions.length);

    if (wrongAIQuestions.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No mistakes found. Great job!',
        learningLoopId: learningLoop._id,
        aiQuestions: []
      });
    }

    // ✅ Mark ALL previous unattempted questions as attempted (clean slate)
    const markedResult = await AIQuestion.updateMany(
      {
        learningLoopId,
        studentId,
        isAttempted: false
      },
      {
        $set: { isAttempted: true }
      }
    );

    console.log('🧹 Marked', markedResult.modifiedCount, 'old unattempted questions as attempted');

    // ✅ Generate NEW questions ONLY from current session's wrong answers
    const generatedQuestions = [];

    console.log('🔄 Starting AI question generation for', wrongAIQuestions.length, 'wrong AI questions...');

    for (const wrongAIQuestion of wrongAIQuestions) {
      console.log('📝 Generating AI questions for:', wrongAIQuestion.questionText.substring(0, 50) + '...');

      const prompt = `Generate 2 similar multiple-choice questions based on the following:

Topic: ${wrongAIQuestion.topic || 'General'}
Concept: ${wrongAIQuestion.concept || 'Core concept'}
Difficulty: ${wrongAIQuestion.difficulty}

Original Question: ${wrongAIQuestion.questionText}
Correct Answer: ${wrongAIQuestion.correctAnswer}

Requirements:
1. Generate 2 NEW questions testing the SAME concept
2. Same difficulty level
3. Four options each
4. Include brief explanation for correct answer
5. Return ONLY valid JSON array format, no markdown

IMPORTANT: Return raw JSON array only.

Format:
[
  {
    "questionText": "Question text here?",
    "options": [
      {"text": "Option A", "isCorrect": false},
      {"text": "Option B", "isCorrect": true},
      {"text": "Option C", "isCorrect": false},
      {"text": "Option D", "isCorrect": false}
    ],
    "correctAnswer": "Option B",
    "explanation": "Brief explanation"
  }
]`;

      try {
        const aiResponse = await generateAIQuestions(prompt);
        let aiQuestions;

        try {
          const cleanedResponse = cleanAIResponse(aiResponse);
          aiQuestions = JSON.parse(cleanedResponse);
        } catch (parseError) {
          console.error('❌ Parse error:', parseError.message);
          continue;
        }

        if (!Array.isArray(aiQuestions)) {
          console.error('❌ AI response is not an array');
          continue;
        }

        for (const aiQ of aiQuestions) {
          if (!aiQ.questionText || !aiQ.options || !aiQ.correctAnswer) {
            console.log('⚠️ Skipping invalid AI question');
            continue;
          }

          const aiQuestion = await AIQuestion.create({
            studentId,
            originalQuestionId: wrongAIQuestion.originalQuestionId,
            testId: learningLoop.testId,
            learningLoopId: learningLoop._id,
            questionText: aiQ.questionText,
            options: aiQ.options,
            correctAnswer: aiQ.correctAnswer,
            explanation: aiQ.explanation,
            topic: wrongAIQuestion.topic,
            concept: wrongAIQuestion.concept,
            difficulty: wrongAIQuestion.difficulty,
            isAttempted: false
          });

          generatedQuestions.push(aiQuestion);
        }
      } catch (aiError) {
        console.error('❌ AI generation error:', aiError.message);
      }
    }

    // ✅ Update learning loop - REPLACE not append
    learningLoop.totalAIQuestions = generatedQuestions.length;
    learningLoop.aiQuestions = generatedQuestions.map(q => q._id);
    await learningLoop.save();

    console.log('✅ Generated', generatedQuestions.length, 'NEW AI questions');
    console.log('📊 Expected:', wrongAIQuestions.length * 2);
    console.log('🔢 ONLY', generatedQuestions.length, 'NEW questions will be shown');
    console.log('========================================');

    res.status(201).json({
      success: true,
      message: `Generated ${generatedQuestions.length} AI questions`,
      learningLoopId: learningLoop._id,
      aiQuestions: generatedQuestions
    });
  } catch (error) {
    console.error('❌ AI question generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI questions',
      error: error.message
    });
  }
};

// ✅ UPDATED: Get AI practice results from LAST completed session
export const getAIPracticeResults = async (req, res) => {
  try {
    const { learningLoopId } = req.params;
    const studentId = req.user._id;

    console.log('📊 ========== GET AI PRACTICE RESULTS ==========');
    console.log('🔗 Learning Loop ID:', learningLoopId);

    const learningLoop = await LearningLoop.findById(learningLoopId);

    if (!learningLoop) {
      return res.status(404).json({
        success: false,
        message: 'Learning loop not found'
      });
    }

    if (learningLoop.studentId.toString() !== studentId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    // ✅ Check if there are any AI practice attempts recorded
    if (!learningLoop.aiPracticeAttempts || learningLoop.aiPracticeAttempts.length === 0) {
      console.log('⚠️ No AI practice attempts found, fetching from current session questions');
      
      // Fallback: Get from current session questions
      const currentSessionQuestionIds = learningLoop.aiQuestions;
      
      const attemptedQuestions = await AIQuestion.find({
        _id: { $in: currentSessionQuestionIds },
        learningLoopId,
        studentId,
        isAttempted: true
      });

      const mistakes = attemptedQuestions
        .filter(q => !q.isCorrect)
        .map(q => ({
          questionText: q.questionText,
          studentAnswer: q.studentAnswer || 'Not Answered',
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          topic: q.topic
        }));

      const correctCount = attemptedQuestions.filter(q => q.isCorrect).length;
      const wrongCount = mistakes.length;
      const totalCount = attemptedQuestions.length;
      const accuracy = totalCount > 0 ? ((correctCount / totalCount) * 100).toFixed(2) : 0;

      return res.status(200).json({
        success: true,
        result: {
          correctAnswers: correctCount,
          wrongCount: wrongCount,
          totalQuestions: totalCount,
          accuracy: parseFloat(accuracy),
          isMastered: learningLoop.isMastered,
          attemptNumber: learningLoop.currentAttempt,
          mistakes: mistakes
        }
      });
    }

    // ✅ Get LAST AI practice session
    const lastPracticeSession = learningLoop.aiPracticeAttempts[learningLoop.aiPracticeAttempts.length - 1];

    console.log('📋 Last practice session:', {
      attemptNumber: lastPracticeSession.attemptNumber,
      accuracy: lastPracticeSession.accuracy,
      questions: lastPracticeSession.aiQuestionIds.length
    });

    // ✅ Get questions from last session only
    const sessionQuestions = await AIQuestion.find({
      _id: { $in: lastPracticeSession.aiQuestionIds },
      learningLoopId,
      studentId,
      isAttempted: true
    });

    const mistakes = sessionQuestions
      .filter(q => !q.isCorrect)
      .map(q => ({
        questionText: q.questionText,
        studentAnswer: q.studentAnswer || 'Not Answered',
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        topic: q.topic
      }));

    console.log('📊 Session Results:', {
      correct: lastPracticeSession.correctAnswers,
      wrong: lastPracticeSession.wrongAnswers,
      total: lastPracticeSession.totalQuestions,
      accuracy: lastPracticeSession.accuracy + '%'
    });
    console.log('========================================');

    res.status(200).json({
      success: true,
      result: {
        correctAnswers: lastPracticeSession.correctAnswers,
        wrongCount: lastPracticeSession.wrongAnswers,
        totalQuestions: lastPracticeSession.totalQuestions,
        accuracy: lastPracticeSession.accuracy,
        isMastered: learningLoop.isMastered,
        attemptNumber: lastPracticeSession.attemptNumber,
        mistakes: mistakes
      }
    });
  } catch (error) {
    console.error('❌ Error getting AI practice results:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI practice results',
      error: error.message
    });
  }
};

export const getAIQuestions = async (req, res) => {
  try {
    const { learningLoopId } = req.params;
    const studentId = req.user._id;

    console.log('🔍 ========== GET AI QUESTIONS DEBUG ==========');
    console.log('🔗 Learning Loop ID:', learningLoopId);
    console.log('👤 Student ID:', studentId);

    const learningLoop = await LearningLoop.findById(learningLoopId);

    if (!learningLoop) {
      console.log('❌ Learning loop not found');
      return res.status(404).json({
        success: false,
        message: 'Learning loop not found'
      });
    }

    console.log('📊 Learning Loop Details:', {
      _id: learningLoop._id,
      testId: learningLoop.testId,
      totalAIQuestions: learningLoop.totalAIQuestions,
      isActive: learningLoop.isActive,
      isMastered: learningLoop.isMastered
    });

    if (learningLoop.studentId.toString() !== studentId.toString()) {
      console.log('❌ Unauthorized access - student ID mismatch');
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    const aiQuestions = await AIQuestion.find({
      learningLoopId,
      studentId,
      isAttempted: false
    });

    console.log('📦 Total AI Questions (isAttempted: false):', aiQuestions.length);
    console.log('📋 AI Question IDs:', aiQuestions.map(q => q._id.toString()));
    
    if (aiQuestions.length > 0) {
      console.log('📝 Sample Question 1:', {
        id: aiQuestions[0]._id,
        text: aiQuestions[0].questionText.substring(0, 50) + '...',
        isAttempted: aiQuestions[0].isAttempted
      });
    }

    const allAIQuestions = await AIQuestion.find({
      learningLoopId,
      studentId
    });
    console.log('🔢 Total AI Questions (including attempted):', allAIQuestions.length);
    console.log('✅ Attempted:', allAIQuestions.filter(q => q.isAttempted).length);
    console.log('⏳ Unattempted:', allAIQuestions.filter(q => !q.isAttempted).length);
    console.log('========================================');

    res.status(200).json({
      success: true,
      count: aiQuestions.length,
      aiQuestions: aiQuestions.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options.map(opt => ({ text: opt.text })),
        topic: q.topic
      }))
    });
  } catch (error) {
    console.error('❌ Error in getAIQuestions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch AI questions',
      error: error.message
    });
  }
};

// ✅ UPDATED: Track AI practice sessions
export const submitAIQuestions = async (req, res) => {
  try {
    const { learningLoopId } = req.params;
    const { answers } = req.body;
    const studentId = req.user._id;

    console.log('📝 ========== SUBMITTING AI QUESTIONS ==========');
    console.log('🔗 Learning Loop ID:', learningLoopId);
    console.log('📊 Answers count:', Object.keys(answers).length);

    const learningLoop = await LearningLoop.findById(learningLoopId);

    if (!learningLoop) {
      return res.status(404).json({
        success: false,
        message: 'Learning loop not found'
      });
    }

    if (learningLoop.studentId.toString() !== studentId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    let correctCount = 0;
    let wrongCount = 0;
    let totalCount = 0;
    const submittedQuestionIds = [];

    for (const [questionId, answer] of Object.entries(answers)) {
      const aiQuestion = await AIQuestion.findById(questionId);

      if (!aiQuestion) continue;

      const isCorrect = answer === aiQuestion.correctAnswer;

      aiQuestion.studentAnswer = answer;
      aiQuestion.isCorrect = isCorrect;
      aiQuestion.isAttempted = true;
      await aiQuestion.save();

      submittedQuestionIds.push(aiQuestion._id);

      if (isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }
      totalCount++;
    }

    const accuracy = totalCount > 0 ? ((correctCount / totalCount) * 100).toFixed(2) : 0;

    console.log('✅ Correct:', correctCount, '/', totalCount);
    console.log('❌ Wrong:', wrongCount);
    console.log('📊 Accuracy:', accuracy + '%');

    // ✅ NEW: Record this AI practice session
    const attemptNumber = learningLoop.currentAttempt + 1;
    
    // Initialize aiPracticeAttempts if it doesn't exist
    if (!learningLoop.aiPracticeAttempts) {
      learningLoop.aiPracticeAttempts = [];
    }
    
    learningLoop.aiPracticeAttempts.push({
      attemptNumber: attemptNumber,
      completedAt: new Date(),
      totalQuestions: totalCount,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      accuracy: parseFloat(accuracy),
      aiQuestionIds: submittedQuestionIds
    });

    learningLoop.currentAttempt = attemptNumber;
    learningLoop.lastAIPracticeAttempt = attemptNumber;

    // ✅ Check for mastery
    if (accuracy >= learningLoop.masteryThreshold) {
      learningLoop.isMastered = true;
      learningLoop.isActive = false;
      learningLoop.completedAt = new Date();
      console.log('🎉 Learning loop mastered!');
    }

    await learningLoop.save();
    console.log('📝 Recorded AI practice attempt #', attemptNumber);
    console.log('========================================');

    res.status(200).json({
      success: true,
      message: 'AI questions submitted successfully',
      result: {
        correctAnswers: correctCount,
        wrongCount: wrongCount,
        totalQuestions: totalCount,
        accuracy: parseFloat(accuracy),
        isMastered: learningLoop.isMastered,
        attemptNumber: attemptNumber
      }
    });
  } catch (error) {
    console.error('❌ Error submitting AI questions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit AI questions',
      error: error.message
    });
  }
};

export const endLearningLoop = async (req, res) => {
  try {
    const { learningLoopId } = req.params;
    const studentId = req.user._id;

    const learningLoop = await LearningLoop.findById(learningLoopId);

    if (!learningLoop) {
      return res.status(404).json({
        success: false,
        message: 'Learning loop not found'
      });
    }

    if (learningLoop.studentId.toString() !== studentId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    learningLoop.isActive = false;
    learningLoop.completedAt = new Date();
    await learningLoop.save();

    res.status(200).json({
      success: true,
      message: 'Learning loop ended successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to end learning loop',
      error: error.message
    });
  }
};
