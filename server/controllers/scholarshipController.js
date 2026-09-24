const Scholarship = require('../models/Scholarship');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');

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
    sortBy = 'deadline'
  } = req.query;

  const query = { isActive: true };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { provider: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (educationLevel) {
    query.educationLevels = { $in: [educationLevel] };
  }

  if (state && state !== 'All India') {
    query.$or = [
      { state: { $regex: state, $options: 'i' } },
      { state: /All India/i }
    ];
  }

  if (categoryCriteria) {
    query.categoryCriteria = categoryCriteria;
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
  const scholarship = await Scholarship.findById(req.params.id);
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
  return successResponse(res, 200, 'Scholarship updated successfully', scholarship);
});

// @desc    Delete scholarship
// @route   DELETE /api/scholarships/:id
// @access  Private/Admin
exports.deleteScholarship = asyncHandler(async (req, res) => {
  const scholarship = await Scholarship.findByIdAndDelete(req.params.id);
  if (!scholarship) {
    return errorResponse(res, 404, 'Scholarship not found');
  }
  return successResponse(res, 200, 'Scholarship deleted successfully');
});
