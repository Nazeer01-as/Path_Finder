const express = require('express');
const router = express.Router();
const {
  getScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship
} = require('../controllers/scholarshipController');
const { protect, optionalAuth, adminOnly } = require('../middleware/authMiddleware');
const { validateScholarship } = require('../middleware/validators');

router
  .route('/')
  .get(optionalAuth, getScholarships)
  .post(protect, adminOnly, validateScholarship, createScholarship);

router
  .route('/:id')
  .get(optionalAuth, getScholarshipById)
  .put(protect, adminOnly, validateScholarship, updateScholarship)
  .delete(protect, adminOnly, deleteScholarship);

module.exports = router;

