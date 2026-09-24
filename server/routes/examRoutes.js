const express = require('express');
const router = express.Router();
const {
  getExaminations,
  getExaminationById,
  createExamination,
  updateExamination,
  deleteExamination
} = require('../controllers/examController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getExaminations)
  .post(protect, adminOnly, createExamination);

router
  .route('/:id')
  .get(getExaminationById)
  .put(protect, adminOnly, updateExamination)
  .delete(protect, adminOnly, deleteExamination);

module.exports = router;
