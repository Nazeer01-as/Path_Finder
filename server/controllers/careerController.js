const Career = require('../models/Career');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get all careers with filters & search
// @route   GET /api/careers
// @access  Public
exports.getCareers = asyncHandler(async (req, res) => {
  const { search, sector, educationLevel, page = 1, limit = 9 } = req.query;

  const query = { isActive: true };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { sector: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { jobRoles: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  if (sector && sector !== 'All') {
    query.sector = { $regex: sector, $options: 'i' };
  }

  if (educationLevel) {
    query.requiredEducation = { $in: [new RegExp(educationLevel, 'i')] };
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 9;
  const skip = (pageNum - 1) * limitNum;

  const total = await Career.countDocuments(query);
  const careers = await Career.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  return successResponse(
    res,
    200,
    'Careers fetched successfully',
    careers,
    {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  );
});

// @desc    Get single career by ID
// @route   GET /api/careers/:id
// @access  Public
exports.getCareerById = asyncHandler(async (req, res) => {
  const career = await Career.findById(req.params.id);
  if (!career) {
    return errorResponse(res, 404, 'Career not found');
  }
  return successResponse(res, 200, 'Career fetched successfully', career);
});

// @desc    Create new career
// @route   POST /api/careers
// @access  Private/Admin
exports.createCareer = asyncHandler(async (req, res) => {
  const career = await Career.create(req.body);
  return successResponse(res, 201, 'Career created successfully', career);
});

// @desc    Update career
// @route   PUT /api/careers/:id
// @access  Private/Admin
exports.updateCareer = asyncHandler(async (req, res) => {
  const career = await Career.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!career) {
    return errorResponse(res, 404, 'Career not found');
  }
  return successResponse(res, 200, 'Career updated successfully', career);
});

// @desc    Delete career
// @route   DELETE /api/careers/:id
// @access  Private/Admin
exports.deleteCareer = asyncHandler(async (req, res) => {
  const career = await Career.findByIdAndDelete(req.params.id);
  if (!career) {
    return errorResponse(res, 404, 'Career not found');
  }
  return successResponse(res, 200, 'Career deleted successfully');
});
