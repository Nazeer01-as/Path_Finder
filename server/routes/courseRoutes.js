const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { protect, optionalAuth, adminOnly } = require('../middleware/authMiddleware');
const { validateCourse } = require('../middleware/validators');

router
  .route('/')
  .get(optionalAuth, getCourses)
  .post(protect, adminOnly, validateCourse, createCourse);

router
  .route('/:id')
  .get(optionalAuth, getCourseById)
  .put(protect, adminOnly, validateCourse, updateCourse)
  .delete(protect, adminOnly, deleteCourse);

module.exports = router;

