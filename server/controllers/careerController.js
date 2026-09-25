const Career = require('../models/Career');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { sanitizePagination } = require('../utils/pagination');
const { logAudit } = require('../utils/auditLogger');

// @desc    Get all careers with filters & search
// @route   GET /api/careers
// @access  Public
exports.getCareers = asyncHandler(async (req, res) => {
  const { search, sector, educationLevel, page = 1, limit = 9, includeInactive } = req.query;

  const isAdmin = req.user && req.user.role === 'admin';
  const andConditions = [];

  // Protect inactive records from public views
  if (!isAdmin || includeInactive !== 'true') {
    andConditions.push({ isActive: true });
  }

  if (search) {
    andConditions.push({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { sector: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { jobRoles: { $in: [new RegExp(search, 'i')] } }
      ]
    });
  }

  if (sector && sector !== 'All') {
    andConditions.push({ sector: { $regex: sector, $options: 'i' } });
  }

  if (educationLevel) {
    andConditions.push({ requiredEducation: { $in: [new RegExp(educationLevel, 'i')] } });
  }

  const query = andConditions.length > 1 ? { $and: andConditions } : (andConditions[0] || {});

  const { pageNum, limitNum, skip } = sanitizePagination(
    page,
    limit,
    9,
    isAdmin ? 100 : 50
  );

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
  const isAdmin = req.user && req.user.role === 'admin';
  const query = { _id: req.params.id };

  // Protect inactive records from public views
  if (!isAdmin) {
    query.isActive = true;
  }

  const career = await Career.findOne(query);
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

  if (req.user) {
    await logAudit({
      adminId: req.user._id,
      action: 'CREATE_CAREER',
      resource: 'Career',
      resourceId: career._id,
      details: { title: career.title, sector: career.sector }
    });
  }

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

  if (req.user) {
    await logAudit({
      adminId: req.user._id,
      action: 'UPDATE_CAREER',
      resource: 'Career',
      resourceId: career._id,
      details: { title: career.title, sector: career.sector }
    });
  }

  return successResponse(res, 200, 'Career updated successfully', career);
});

// @desc    Delete career (soft-delete by default, hard delete if requested)
// @route   DELETE /api/careers/:id
// @access  Private/Admin
exports.deleteCareer = asyncHandler(async (req, res) => {
  const hardDelete = req.query.hard === 'true';
  let career;

  if (hardDelete) {
    career = await Career.findByIdAndDelete(req.params.id);
  } else {
    career = await Career.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
  }

  if (!career) {
    return errorResponse(res, 404, 'Career not found');
  }

  if (req.user) {
    await logAudit({
      adminId: req.user._id,
      action: hardDelete ? 'HARD_DELETE_CAREER' : 'SOFT_DELETE_CAREER',
      resource: 'Career',
      resourceId: career._id,
      details: { title: career.title, hardDelete }
    });
  }

  return successResponse(res, 200, 'Career deleted successfully');
});

