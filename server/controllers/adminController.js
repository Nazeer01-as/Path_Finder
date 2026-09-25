const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Examination = require('../models/Examination');
const Scholarship = require('../models/Scholarship');
const Course = require('../models/Course');
const Career = require('../models/Career');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { sanitizePagination } = require('../utils/pagination');
const { logAudit } = require('../utils/auditLogger');

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

  const { pageNum, limitNum, skip } = sanitizePagination(page, limit, 10, 100);

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
    return errorResponse(res, 400, 'Invalid role. Role must be student or admin.');
  }

  const targetUser = await User.findById(req.params.id);
  if (!targetUser) {
    return errorResponse(res, 404, 'User not found');
  }

  // Protection: prevent removing/demoting the last administrator or removing own only-admin access
  if (targetUser.role === 'admin' && role === 'student') {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount <= 1) {
      return errorResponse(
        res,
        400,
        'Action denied: Cannot remove or demote the last administrator in the system.'
      );
    }
    if (req.user && req.user._id.toString() === targetUser._id.toString() && adminCount <= 1) {
      return errorResponse(
        res,
        400,
        'Action denied: You cannot remove your own administrator access as the only administrator.'
      );
    }
  }

  targetUser.role = role;
  await targetUser.save();

  const userObj = targetUser.toObject();
  delete userObj.password;

  if (req.user) {
    await logAudit({
      adminId: req.user._id,
      action: 'CHANGE_USER_ROLE',
      resource: 'User',
      resourceId: targetUser._id,
      details: { targetEmail: targetUser.email, newRole: role }
    });
  }

  return successResponse(res, 200, 'User role updated successfully', userObj);
});

