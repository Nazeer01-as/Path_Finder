const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide course name'],
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Engineering',
        'Computer Science',
        'AI & ML',
        'Data Science',
        'Medicine',
        'Pharmacy',
        'Law',
        'Commerce',
        'Management',
        'Arts',
        'Design',
        'Agriculture',
        'Vocational',
        'ITI',
        'Diploma',
        'Certification'
      ]
    },
    duration: {
      type: String,
      required: true
    },
    eligibility: {
      type: String,
      required: true
    },
    educationLevels: {
      type: [String],
      default: []
    },
    stream: {
      type: [String],
      default: []
    },
    skills: {
      type: [String],
      default: []
    },
    careerOptions: {
      type: [String],
      default: []
    },
    higherEducationOptions: {
      type: [String],
      default: []
    },
    entranceExams: {
      type: [String],
      default: []
    },
    relatedJobs: {
      type: [String],
      default: []
    },
    isDemo: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Text search index (preserved)
courseSchema.index({ name: 'text', category: 'text' });

// Query optimization indexes
courseSchema.index({ isActive: 1, createdAt: -1 });
courseSchema.index({ educationLevels: 1 });
courseSchema.index({ category: 1 });

module.exports = mongoose.model('Course', courseSchema);
