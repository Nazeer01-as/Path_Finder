const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide scholarship name'],
      trim: true
    },
    provider: {
      type: String,
      required: [true, 'Please provide scholarship provider']
    },
    description: {
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
    incomeCriteria: {
      type: String,
      default: 'No strict limit / Refer guidelines'
    },
    categoryCriteria: {
      type: String,
      default: 'All Categories'
    },
    benefits: {
      type: String,
      required: true
    },
    applicationStartDate: {
      type: Date
    },
    deadline: {
      type: Date
    },
    requiredDocuments: {
      type: [String],
      default: []
    },
    applicationProcess: {
      type: String,
      default: 'Apply online via the official portal.'
    },
    officialWebsite: {
      type: String,
      required: true
    },
    state: {
      type: String,
      default: 'All India'
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
scholarshipSchema.index({ name: 'text', provider: 'text', description: 'text' });

// Query optimization indexes
scholarshipSchema.index({ isActive: 1, createdAt: -1 });
scholarshipSchema.index({ deadline: 1 });
scholarshipSchema.index({ state: 1 });
scholarshipSchema.index({ educationLevels: 1 });

module.exports = mongoose.model('Scholarship', scholarshipSchema);
