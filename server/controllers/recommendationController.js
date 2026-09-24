const RecommendationEngine = require('../services/recommendationEngine');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');

// @desc    Get rule-based personalized recommendations for the logged-in student
// @route   GET /api/recommendations
// @access  Private
exports.getRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await RecommendationEngine.getRecommendations(req.user);
  return successResponse(
    res,
    200,
    'Personalized recommendations generated based on profile',
    recommendations
  );
});
