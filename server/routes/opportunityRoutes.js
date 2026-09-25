const express = require('express');
const router = express.Router();
const {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity
} = require('../controllers/opportunityController');
const { protect, optionalAuth, adminOnly } = require('../middleware/authMiddleware');
const { validateOpportunity } = require('../middleware/validators');

router
  .route('/')
  .get(optionalAuth, getOpportunities)
  .post(protect, adminOnly, validateOpportunity, createOpportunity);

router
  .route('/:id')
  .get(optionalAuth, getOpportunityById)
  .put(protect, adminOnly, validateOpportunity, updateOpportunity)
  .delete(protect, adminOnly, deleteOpportunity);

module.exports = router;

