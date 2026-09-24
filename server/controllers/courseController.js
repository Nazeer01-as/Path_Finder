const Course = require('../models/Course');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get all courses with filters & search
// @route   GET /api/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    educationLevel,
    page = 1,
    limit = 9
  } = req.query;

  const query = { isActive: true };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { skills: { $in: [new RegExp(search, 'i')] } },
      { careerOptions: { $in: [new RegExp(search, 'i')] } }
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

  const total = await Course.countDocuments(query);
  const courses = await Course.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  return successResponse(
    res,
    200,
    'Courses fetched successfully',
    courses,
    {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  );
});

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return errorResponse(res, 404, 'Course not found');
  }
  return successResponse(res, 200, 'Course fetched successfully', course);
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Admin
exports.createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create(req.body);
  return successResponse(res, 201, 'Course created successfully', course);
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
exports.updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!course) {
    return errorResponse(res, 404, 'Course not found');
  }
  return successResponse(res, 200, 'Course updated successfully', course);
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
exports.deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    return errorResponse(res, 404, 'Course not found');
  }
  return successResponse(res, 200, 'Course deleted successfully');
});
