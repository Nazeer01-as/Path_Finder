const express = require('express');
const router = express.Router();
const {
  getCareers,
  getCareerById,
  createCareer,
  updateCareer,
  deleteCareer
} = require('../controllers/careerController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getCareers)
  .post(protect, adminOnly, createCareer);

router
  .route('/:id')
  .get(getCareerById)
  .put(protect, adminOnly, updateCareer)
  .delete(protect, adminOnly, deleteCareer);

module.exports = router;
