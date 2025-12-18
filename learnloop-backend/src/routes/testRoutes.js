import express from 'express';
import {
  getAllTests,
  getTestById,
  getTestQuestions,
  startTest,
  submitTest
} from '../controllers/testController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllTests);
router.get('/:testId', getTestById);
router.get('/:testId/questions', getTestQuestions);
router.post('/:testId/start', startTest);
router.post('/attempt/:attemptId/submit', submitTest);

export default router;
