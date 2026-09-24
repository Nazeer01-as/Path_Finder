const Examination = require('../models/Examination');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');

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
    sortBy = 'applicationLastDate'
  } = req.query;

  const query = { isActive: true };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { conductingBody: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (category && category !== 'All') {
    query.category = category;
  }

  if (educationLevel) {
    query.educationLevels = { $in: [educationLevel] };
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 9;
  const skip = (pageNum - 1) * limitNum;

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
  const exam = await Examination.findById(req.params.id);
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
  return successResponse(res, 200, 'Examination updated successfully', exam);
});

// @desc    Delete examination
// @route   DELETE /api/exams/:id
// @access  Private/Admin
exports.deleteExamination = asyncHandler(async (req, res) => {
  const exam = await Examination.findByIdAndDelete(req.params.id);
  if (!exam) {
    return errorResponse(res, 404, 'Examination not found');
  }
  return successResponse(res, 200, 'Examination deleted successfully');
});
