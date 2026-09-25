const Opportunity = require('../models/Opportunity');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { sanitizePagination } = require('../utils/pagination');
const { logAudit } = require('../utils/auditLogger');

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
    sortBy = 'createdAt',
    includeInactive
  } = req.query;

  const isAdmin = req.user && req.user.role === 'admin';
  const andConditions = [];

  // Protect inactive records from public views
  if (!isAdmin || includeInactive !== 'true') {
    andConditions.push({ isActive: true });
  }

  // Text search
  if (search) {
    andConditions.push({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    });
  }

  // Filters
  if (category) {
    andConditions.push({ category });
  }

  if (educationLevel) {
    andConditions.push({ educationLevels: { $in: [educationLevel] } });
  }

  // State filtering combined properly without overwriting search $or
  if (state && state !== 'All India') {
    andConditions.push({
      $or: [
        { location: { $regex: state, $options: 'i' } },
        { location: /All India/i }
      ]
    });
  }

  if (opportunityType) {
    andConditions.push({ opportunityType });
  }

  const query = andConditions.length > 1 ? { $and: andConditions } : (andConditions[0] || {});

  const { pageNum, limitNum, skip } = sanitizePagination(
    page,
    limit,
    9,
    isAdmin ? 100 : 50
  );

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
  const isAdmin = req.user && req.user.role === 'admin';
  const query = { _id: req.params.id };

  // Protect inactive records from public requests
  if (!isAdmin) {
    query.isActive = true;
  }

  const opportunity = await Opportunity.findOne(query);
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

  if (req.user) {
    await logAudit({
      adminId: req.user._id,
      action: 'CREATE_OPPORTUNITY',
      resource: 'Opportunity',
      resourceId: opportunity._id,
      details: { title: opportunity.title, category: opportunity.category }
    });
  }

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

  if (req.user) {
    await logAudit({
      adminId: req.user._id,
      action: 'UPDATE_OPPORTUNITY',
      resource: 'Opportunity',
      resourceId: opportunity._id,
      details: { title: opportunity.title, category: opportunity.category }
    });
  }

  return successResponse(res, 200, 'Opportunity updated successfully', opportunity);
});

// @desc    Delete opportunity (soft-delete by default, hard delete if requested)
// @route   DELETE /api/opportunities/:id
// @access  Private/Admin
exports.deleteOpportunity = asyncHandler(async (req, res) => {
  const hardDelete = req.query.hard === 'true';
  let opportunity;

  if (hardDelete) {
    opportunity = await Opportunity.findByIdAndDelete(req.params.id);
  } else {
    opportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
  }

  if (!opportunity) {
    return errorResponse(res, 404, 'Opportunity not found');
  }

  if (req.user) {
    await logAudit({
      adminId: req.user._id,
      action: hardDelete ? 'HARD_DELETE_OPPORTUNITY' : 'SOFT_DELETE_OPPORTUNITY',
      resource: 'Opportunity',
      resourceId: opportunity._id,
      details: { title: opportunity.title, hardDelete }
    });
  }

  return successResponse(res, 200, 'Opportunity deleted successfully');
});

