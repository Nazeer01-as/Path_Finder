const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// Generate JWT Helper
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is missing.');
  }
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role, educationLevel } = req.body;

  if (!name || !email || !password) {
    return errorResponse(res, 400, 'Please provide name, email and password');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return errorResponse(res, 409, 'An account with this email already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Public registration strictly creates student roles (prevents privilege escalation)
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'student',
    educationLevel: educationLevel || '',
    onboardingCompleted: false
  });

  const token = generateToken(user._id);

  const userObj = user.toObject();
  delete userObj.password;

  return successResponse(res, 201, 'User registered successfully', {
    token,
    user: userObj
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(res, 400, 'Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return errorResponse(res, 401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return errorResponse(res, 401, 'Invalid email or password');
  }

  const token = generateToken(user._id);

  const userObj = user.toObject();
  delete userObj.password;

  return successResponse(res, 200, 'Logged in successfully', {
    token,
    user: userObj
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  return successResponse(res, 200, 'User profile fetched', user);
});

// @desc    Update user profile & onboarding info
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    'name',
    'educationLevel',
    'classYear',
    'stream',
    'boardOrUniversity',
    'percentageOrCgpa',
    'state',
    'preferredStudyLocation',
    'interests',
    'skills',
    'careerInterests',
    'onboardingCompleted'
  ];

  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true
  });

  return successResponse(res, 200, 'Profile updated successfully', updatedUser);
});
