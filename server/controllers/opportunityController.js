const Opportunity = require('../models/Opportunity');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get all opportunities with filters & pagination
// @route   GET /api/opportunities
// @access  Public
exports.getOpportunities = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    educationLevel,
    state,
    opportunityType,
    page = 1,
    limit = 9,
    sortBy = 'createdAt'
  } = req.query;

  const query = { isActive: true };

  // Text search
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { organization: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  // Filters
  if (category) {
    query.category = category;
  }

  if (educationLevel) {
    query.educationLevels = { $in: [educationLevel] };
  }

  if (state && state !== 'All India') {
    query.$or = [
      { location: { $regex: state, $options: 'i' } },
      { location: /All India/i }
    ];
  }

  if (opportunityType) {
    query.opportunityType = opportunityType;
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 9;
  const skip = (pageNum - 1) * limitNum;

  const sortOptions = {};
  if (sortBy === 'deadline') {
    sortOptions.deadline = 1;
  } else {
    sortOptions.createdAt = -1;
  }

  const total = await Opportunity.countDocuments(query);
  const opportunities = await Opportunity.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum);

  return successResponse(
    res,
    200,
    'Opportunities fetched successfully',
    opportunities,
    {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  );
});

// @desc    Get single opportunity by ID
// @route   GET /api/opportunities/:id
// @access  Public
exports.getOpportunityById = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.id);
  if (!opportunity) {
    return errorResponse(res, 404, 'Opportunity not found');
  }
  return successResponse(res, 200, 'Opportunity fetched successfully', opportunity);
});

// @desc    Create new opportunity
// @route   POST /api/opportunities
// @access  Private/Admin
exports.createOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.create(req.body);
  return successResponse(res, 201, 'Opportunity created successfully', opportunity);
});

// @desc    Update opportunity
// @route   PUT /api/opportunities/:id
// @access  Private/Admin
exports.updateOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!opportunity) {
    return errorResponse(res, 404, 'Opportunity not found');
  }
  return successResponse(res, 200, 'Opportunity updated successfully', opportunity);
});

// @desc    Delete opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private/Admin
exports.deleteOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findByIdAndDelete(req.params.id);
  if (!opportunity) {
    return errorResponse(res, 404, 'Opportunity not found');
  }
  return successResponse(res, 200, 'Opportunity deleted successfully');
});
