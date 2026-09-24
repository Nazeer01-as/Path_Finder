const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Examination = require('../models/Examination');
const Scholarship = require('../models/Scholarship');
const Course = require('../models/Course');
const Career = require('../models/Career');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get dashboard metrics & summary counts for Admin
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    totalAdmins,
    totalOpportunities,
    totalExaminations,
    totalScholarships,
    totalCourses,
    totalCareers,
    upcomingExams,
    upcomingScholarships
  ] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'admin' }),
    Opportunity.countDocuments(),
    Examination.countDocuments(),
    Scholarship.countDocuments(),
    Course.countDocuments(),
    Career.countDocuments(),
    Examination.find({ applicationLastDate: { $gte: new Date() } })
      .sort({ applicationLastDate: 1 })
      .limit(5)
      .select('name conductingBody applicationLastDate'),
    Scholarship.find({ deadline: { $gte: new Date() } })
      .sort({ deadline: 1 })
      .limit(5)
      .select('name provider deadline')
  ]);

  return successResponse(res, 200, 'Admin statistics fetched successfully', {
    metrics: {
      totalStudents,
      totalAdmins,
      totalUsers: totalStudents + totalAdmins,
      totalOpportunities,
      totalExaminations,
      totalScholarships,
      totalCourses,
      totalCareers
    },
    upcomingDeadlines: {
      exams: upcomingExams,
      scholarships: upcomingScholarships
    }
  });
});

// @desc    Get all users for Admin
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const { search, role, page = 1, limit = 10 } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  if (role) {
    query.role = role;
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  return successResponse(res, 200, 'Users fetched successfully', users, {
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum)
  });
});

// @desc    Update user role or status
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['student', 'admin'].includes(role)) {
    return errorResponse(res, 400, 'Invalid role');
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select('-password');

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  return successResponse(res, 200, 'User role updated successfully', user);
});
