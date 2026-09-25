const { body, validationResult } = require('express-validator');

/**
 * Validate that a URL is a secure web URL (http or https)
 * Rejects dangerous schemes like javascript:, data:, vbscript:
 */
const isSafeUrl = (value) => {
  if (!value) return false;
  if (typeof value !== 'string') return false;
  const trimmed = value.trim().toLowerCase();
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:') ||
    trimmed.startsWith('file:')
  ) {
    return false;
  }
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Middleware runner that inspects express-validator results
 */
const validate = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg }))
    });
  };
};

// 1. Auth Validations
const validateRegister = validate([
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
]);

const validateLogin = validate([
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
]);

// 2. Profile Validations
const validateProfile = validate([
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('educationLevel').optional().trim(),
  body('classYear').optional().trim(),
  body('stream').optional().trim(),
  body('boardOrUniversity').optional().trim(),
  body('percentageOrCgpa').optional().trim(),
  body('state').optional().trim(),
  body('preferredStudyLocation').optional().trim(),
  body('interests').optional().isArray().withMessage('Interests must be an array of strings'),
  body('skills').optional().isArray().withMessage('Skills must be an array of strings'),
  body('careerInterests').optional().isArray().withMessage('Career interests must be an array of strings')
]);

// 3. Admin-created Data Validations with URL safety
const validateOpportunity = validate([
  body('title').trim().notEmpty().withMessage('Opportunity title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('organization').trim().notEmpty().withMessage('Conducting organization is required'),
  body('eligibility').trim().notEmpty().withMessage('Eligibility criteria is required'),
  body('officialWebsite')
    .trim()
    .notEmpty()
    .withMessage('Official website URL is required')
    .custom((val) => {
      if (!isSafeUrl(val)) {
        throw new Error('Official website must be a valid HTTP or HTTPS URL (unsafe schemes rejected)');
      }
      return true;
    })
]);

const validateExamination = validate([
  body('name').trim().notEmpty().withMessage('Examination name is required'),
  body('conductingBody').trim().notEmpty().withMessage('Conducting body is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('eligibility').trim().notEmpty().withMessage('Eligibility criteria is required'),
  body('officialWebsite')
    .trim()
    .notEmpty()
    .withMessage('Official website URL is required')
    .custom((val) => {
      if (!isSafeUrl(val)) {
        throw new Error('Official website must be a valid HTTP or HTTPS URL (unsafe schemes rejected)');
      }
      return true;
    }),
  body('importantLinks.*.url')
    .optional()
    .custom((val) => {
      if (val && !isSafeUrl(val)) {
        throw new Error('Important link URLs must be valid HTTP or HTTPS URLs');
      }
      return true;
    })
]);

const validateScholarship = validate([
  body('name').trim().notEmpty().withMessage('Scholarship name is required'),
  body('provider').trim().notEmpty().withMessage('Provider is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('eligibility').trim().notEmpty().withMessage('Eligibility criteria is required'),
  body('benefits').trim().notEmpty().withMessage('Benefits information is required'),
  body('officialWebsite')
    .trim()
    .notEmpty()
    .withMessage('Official website URL is required')
    .custom((val) => {
      if (!isSafeUrl(val)) {
        throw new Error('Official website must be a valid HTTP or HTTPS URL (unsafe schemes rejected)');
      }
      return true;
    })
]);

const validateCourse = validate([
  body('name').trim().notEmpty().withMessage('Course name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
  body('eligibility').trim().notEmpty().withMessage('Eligibility criteria is required')
]);

const validateCareer = validate([
  body('title').trim().notEmpty().withMessage('Career title is required'),
  body('sector').trim().notEmpty().withMessage('Sector is required'),
  body('description').trim().notEmpty().withMessage('Description is required')
]);

module.exports = {
  isSafeUrl,
  validateRegister,
  validateLogin,
  validateProfile,
  validateOpportunity,
  validateExamination,
  validateScholarship,
  validateCourse,
  validateCareer
};
