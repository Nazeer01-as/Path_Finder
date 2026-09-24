const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    },
    educationLevel: {
      type: String,
      default: ''
    },
    classYear: {
      type: String,
      default: ''
    },
    stream: {
      type: String,
      default: ''
    },
    boardOrUniversity: {
      type: String,
      default: ''
    },
    percentageOrCgpa: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    preferredStudyLocation: {
      type: String,
      default: ''
    },
    interests: {
      type: [String],
      default: []
    },
    skills: {
      type: [String],
      default: []
    },
    careerInterests: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
