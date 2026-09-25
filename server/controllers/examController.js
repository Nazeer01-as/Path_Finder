const Examination = require('../models/Examination');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { sanitizePagination } = require('../utils/pagination');
const { logAudit } = require('../utils/auditLogger');

// @desc    Get all examinations with filters & search
// @route   GET /api/exams
// @access  Public
exports.getExaminations = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    educationLevel,
    page = 1,
    limit = 9,
    sortBy = 'applicationLastDate',
    includeInactive
  } = req.query;

  const isAdmin = req.user && req.user.role === 'admin';
  const andConditions = [];

  // Protect inactive records from public views
  if (!isAdmin || includeInactive !== 'true') {
    andConditions.push({ isActive: true });
  }

  if (search) {
    andConditions.push({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { conductingBody: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    });
  }

  if (category && category !== 'All') {
    andConditions.push({ category });
  }

  if (educationLevel) {
    andConditions.push({ educationLevels: { $in: [educationLevel] } });
  }

  const query = andConditions.length > 1 ? { $and: andConditions } : (andConditions[0] || {});

  const { pageNum, limitNum, skip } = sanitizePagination(
    page,
    limit,
    9,
    isAdmin ? 100 : 50
  );

  const sortOptions = {};
  if (sortBy === 'applicationLastDate') {
    sortOptions.applicationLastDate = 1;
  } else if (sortBy === 'examDate') {
    sortOptions.examDate = 1;
  } else {
    sortOptions.createdAt = -1;
  }

  const total = await Examination.countDocuments(query);
  const examinations = await Examination.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum);

  return successResponse(
    res,
    200,
    'Examinations fetched successfully',
    examinations,
    {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  );
});

// @desc    Get single examination by ID
// @route   GET /api/exams/:id
// @access  Public
exports.getExaminationById = asyncHandler(async (req, res) => {
  const isAdmin = req.user && req.user.role === 'admin';
  const query = { _id: req.params.id };

  // Protect inactive records from public views
  if (!isAdmin) {
    query.isActive = true;
  }

  const exam = await Examination.findOne(query);
  if (!exam) {
    return errorResponse(res, 404, 'Examination not found');
  }
  return successResponse(res, 200, 'Examination fetched successfully', exam);
});

// @desc    Create new examination
// @route   POST /api/exams
// @access  Private/Admin
exports.createExamination = asyncHandler(async (req, res) => {
  const exam = await Examination.create(req.body);

  if (req.user) {
    await logAudit({
      adminId: req.user._id,
      action: 'CREATE_EXAM',
      resource: 'Examination',
      resourceId: exam._id,
      details: { name: exam.name, conductingBody: exam.conductingBody }
    });
  }

  return successResponse(res, 201, 'Examination created successfully', exam);
});

// @desc    Update examination
// @route   PUT /api/exams/:id
// @access  Private/Admin
exports.updateExamination = asyncHandler(async (req, res) => {
  const exam = await Examination.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!exam) {
    return errorResponse(res, 404, 'Examination not found');
  }

  if (req.user) {
    await logAudit({
      adminId: req.user._id,
      action: 'UPDATE_EXAM',
      resource: 'Examination',
      resourceId: exam._id,
      details: { name: exam.name, conductingBody: exam.conductingBody }
    });
  }

  return successResponse(res, 200, 'Examination updated successfully', exam);
});

// @desc    Delete examination (soft-delete by default, hard delete if requested)
// @route   DELETE /api/exams/:id
// @access  Private/Admin
exports.deleteExamination = asyncHandler(async (req, res) => {
  const hardDelete = req.query.hard === 'true';
  let exam;

  if (hardDelete) {
    exam = await Examination.findByIdAndDelete(req.params.id);
  } else {
    exam = await Examination.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
  }

  if (!exam) {
    return errorResponse(res, 404, 'Examination not found');
  }

  if (req.user) {
    await logAudit({
      adminId: req.user._id,
      action: hardDelete ? 'HARD_DELETE_EXAM' : 'SOFT_DELETE_EXAM',
      resource: 'Examination',
      resourceId: exam._id,
      details: { name: exam.name, hardDelete }
    });
  }

  return successResponse(res, 200, 'Examination deleted successfully');
});

