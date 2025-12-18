import express from 'express';
import {
  getDashboardStats,
  getTestHistory,
  getAttemptResult,
  getActiveLearningLoops
} from '../controllers/studentController.js';
import { protect, studentOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(studentOnly);

router.get('/dashboard', getDashboardStats);
router.get('/history', getTestHistory);
router.get('/result/:attemptId', getAttemptResult);
router.get('/learning-loops', getActiveLearningLoops);

export default router;
