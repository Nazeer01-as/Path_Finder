const express = require('express');
const router = express.Router();
const {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity
} = require('../controllers/opportunityController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getOpportunities)
  .post(protect, adminOnly, createOpportunity);

router
  .route('/:id')
  .get(getOpportunityById)
  .put(protect, adminOnly, updateOpportunity)
  .delete(protect, adminOnly, deleteOpportunity);

module.exports = router;
