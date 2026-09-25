const express = require('express');
const router = express.Router();
const {
  getExaminations,
  getExaminationById,
  createExamination,
  updateExamination,
  deleteExamination
} = require('../controllers/examController');
const { protect, optionalAuth, adminOnly } = require('../middleware/authMiddleware');
const { validateExamination } = require('../middleware/validators');

router
  .route('/')
  .get(optionalAuth, getExaminations)
  .post(protect, adminOnly, validateExamination, createExamination);

router
  .route('/:id')
  .get(optionalAuth, getExaminationById)
  .put(protect, adminOnly, validateExamination, updateExamination)
  .delete(protect, adminOnly, deleteExamination);

module.exports = router;

