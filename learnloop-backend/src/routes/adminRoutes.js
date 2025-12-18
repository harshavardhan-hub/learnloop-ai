import express from 'express';
import {
  uploadTest,
  getAllStudents,
  getStudentResults,
  getLearningLoopStats,
  getAIUsageStats,
  deleteTest,
  toggleTestStatus
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { testOpenRouterConnection } from '../config/openrouter.js';  // ADD THIS

const router = express.Router();

router.use(protect);
router.use(adminOnly);

// ADD THIS TEST ENDPOINT
router.get('/test-openrouter', async (req, res) => {
  try {
    const result = await testOpenRouterConnection();
    res.json({
      success: result,
      message: result ? 'OpenRouter API is working!' : 'OpenRouter API test failed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/test/upload', uploadTest);
router.get('/students', getAllStudents);
router.get('/results', getStudentResults);
router.get('/learning-loops', getLearningLoopStats);
router.get('/ai-usage', getAIUsageStats);
router.delete('/test/:testId', deleteTest);
router.patch('/test/:testId/toggle', toggleTestStatus);

export default router;
