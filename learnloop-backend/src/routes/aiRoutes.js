import express from 'express';
import {
  generateQuestionsFromMistakes,
  generateQuestionsFromAIPractice,
  getAIQuestions,
  submitAIQuestions,
  getAIPracticeResults,  // ✅ NEW
  endLearningLoop
} from '../controllers/aiController.js';
import { protect, studentOnly } from '../middleware/authMiddleware.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(protect);
router.use(studentOnly);

router.post('/generate/:attemptId', aiLimiter, generateQuestionsFromMistakes);
router.post('/generate-from-practice/:learningLoopId', aiLimiter, generateQuestionsFromAIPractice);
router.get('/questions/:learningLoopId', getAIQuestions);
router.post('/submit/:learningLoopId', submitAIQuestions);
router.get('/results/:learningLoopId', getAIPracticeResults);  // ✅ NEW
router.post('/end/:learningLoopId', endLearningLoop);

export default router;
