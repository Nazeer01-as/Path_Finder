const Scholarship = require('../models/Scholarship');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { sanitizePagination } = require('../utils/pagination');
const { logAudit } = require('../utils/auditLogger');

// @desc    Get all scholarships with filters & search
// @route   GET /api/scholarships
// @access  Public
exports.getScholarships = asyncHandler(async (req, res) => {
  const {
    search,
    educationLevel,
    state,
    categoryCriteria,
    page = 1,
    limit = 9,
    sortBy = 'deadline',
    includeInactive
  } = req.query;

  const isAdmin = req.user && req.user.role === 'admin';
  const andConditions = [];

  // Protect inactive records from public requests
  if (!isAdmin || includeInactive !== 'true') {
    andConditions.push({ isActive: true });
  }

  // Text search
  if (search) {
    andConditions.push({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { provider: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    });
  }

  if (educationLevel) {
    andConditions.push({ educationLevels: { $in: [educationLevel] } });
  }

  // State filtering combined properly without overwriting search $or
  if (state && state !== 'All India') {
    andConditions.push({
      $or: [
        { state: { $regex: state, $options: 'i' } },
        { state: /All India/i }
      ]
    });
  }

  if (categoryCriteria) {
    andConditions.push({ categoryCriteria });
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

  const total = await Scholarship.countDocuments(query);
  const scholarships = await Scholarship.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum);

  return successResponse(
    res,
    200,
    'Scholarships fetched successfully',
    scholarships,
    {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  );
});

// @desc    Get single scholarship by ID
// @route   GET /api/scholarships/:id
// @access  Public
exports.getScholarshipById = asyncHandler(async (req, res) => {
  const isAdmin = req.user && req.user.role === 'admin';
  const query = { _id: req.params.id };

  // Protect inactive records from public requests
  if (!isAdmin) {
    query.isActive = true;
  }

  const scholarship = await Scholarship.findOne(query);
  if (!scholarship) {
    return errorResponse(res, 404, 'Scholarship not found');
  }
  return successResponse(res, 200, 'Scholarship fetched successfully', scholarship);
});

// @desc    Create new scholarship
// @route   POST /api/scholarships
// @access  Private/Admin
exports.createScholarship = asyncHandler(async (req, res) => {
  const scholarship = await Scholarship.create(req.body);

  if (req.user) {
    await logAudit({
      adminId: req.user._id,
      action: 'CREATE_SCHOLARSHIP',
      resource: 'Scholarship',
      resourceId: scholarship._id,
      details: { name: scholarship.name, provider: scholarship.provider }
    });
  }

  return successResponse(res, 201, 'Scholarship created successfully', scholarship);
});

// @desc    Update scholarship
// @route   PUT /api/scholarships/:id
// @access  Private/Admin
exports.updateScholarship = asyncHandler(async (req, res) => {
  const scholarship = await Scholarship.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!scholarship) {
    return errorResponse(res, 404, 'Scholarship not found');
  }

  if (req.user) {
    await logAudit({
      adminId: req.user._id,
      action: 'UPDATE_SCHOLARSHIP',
      resource: 'Scholarship',
      resourceId: scholarship._id,
      details: { name: scholarship.name, provider: scholarship.provider }
    });
  }

  return successResponse(res, 200, 'Scholarship updated successfully', scholarship);
});

// @desc    Delete scholarship (soft-delete by default, hard delete if requested)
// @route   DELETE /api/scholarships/:id
// @access  Private/Admin
exports.deleteScholarship = asyncHandler(async (req, res) => {
  const hardDelete = req.query.hard === 'true';
  let scholarship;

  if (hardDelete) {
    scholarship = await Scholarship.findByIdAndDelete(req.params.id);
  } else {
    scholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
  }

  if (!scholarship) {
    return errorResponse(res, 404, 'Scholarship not found');
  }

  if (req.user) {
    await logAudit({
      adminId: req.user._id,
      action: hardDelete ? 'HARD_DELETE_SCHOLARSHIP' : 'SOFT_DELETE_SCHOLARSHIP',
      resource: 'Scholarship',
      resourceId: scholarship._id,
      details: { name: scholarship.name, hardDelete }
    });
  }

  return successResponse(res, 200, 'Scholarship deleted successfully');
});

