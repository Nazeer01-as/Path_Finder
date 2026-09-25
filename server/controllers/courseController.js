const Course = require('../models/Course');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { sanitizePagination } = require('../utils/pagination');
const { logAudit } = require('../utils/auditLogger');

// @desc    Get all courses with filters & search
// @route   GET /api/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    educationLevel,
    page = 1,
    limit = 9,
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
        { skills: { $in: [new RegExp(search, 'i')] } },
        { careerOptions: { $in: [new RegExp(search, 'i')] } }
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
  const isAdmin = req.user && req.user.role === 'admin';
  const query = { _id: req.params.id };

  // Protect inactive records from public views
  if (!isAdmin) {
    query.isActive = true;
  }

  const course = await Course.findOne(query);
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

  if (req.user) {
    await logAudit({
      adminId: req.user._id,
      action: 'CREATE_COURSE',
      resource: 'Course',
      resourceId: course._id,
      details: { name: course.name, category: course.category }
    });
  }

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

  if (req.user) {
    await logAudit({
      adminId: req.user._id,
      action: 'UPDATE_COURSE',
      resource: 'Course',
      resourceId: course._id,
      details: { name: course.name, category: course.category }
    });
  }

  return successResponse(res, 200, 'Course updated successfully', course);
});

// @desc    Delete course (soft-delete by default, hard delete if requested)
// @route   DELETE /api/courses/:id
// @access  Private/Admin
exports.deleteCourse = asyncHandler(async (req, res) => {
  const hardDelete = req.query.hard === 'true';
  let course;

  if (hardDelete) {
    course = await Course.findByIdAndDelete(req.params.id);
  } else {
    course = await Course.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
  }

  if (!course) {
    return errorResponse(res, 404, 'Course not found');
  }

  if (req.user) {
    await logAudit({
      adminId: req.user._id,
      action: hardDelete ? 'HARD_DELETE_COURSE' : 'SOFT_DELETE_COURSE',
      resource: 'Course',
      resourceId: course._id,
      details: { name: course.name, hardDelete }
    });
  }

  return successResponse(res, 200, 'Course deleted successfully');
});

