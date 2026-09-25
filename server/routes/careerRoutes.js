const express = require('express');
const router = express.Router();
const {
  getCareers,
  getCareerById,
  createCareer,
  updateCareer,
  deleteCareer
} = require('../controllers/careerController');
const { protect, optionalAuth, adminOnly } = require('../middleware/authMiddleware');
const { validateCareer } = require('../middleware/validators');

router
  .route('/')
  .get(optionalAuth, getCareers)
  .post(protect, adminOnly, validateCareer, createCareer);

router
  .route('/:id')
  .get(optionalAuth, getCareerById)
  .put(protect, adminOnly, validateCareer, updateCareer)
  .delete(protect, adminOnly, deleteCareer);

module.exports = router;

