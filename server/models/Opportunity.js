const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an opportunity title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a description']
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        'Education',
        'Entrance Exams',
        'Competitive Exams',
        'Scholarships',
        'Internships',
        'Jobs',
        'Skill Development',
        'Certifications',
        'Fellowships',
        'Study Abroad',
        'Government Programs',
        'Private Opportunities',
        'Entrepreneurship',
        'Career Programs'
      ]
    },
    organization: {
      type: String,
      required: [true, 'Please provide conducting organization']
    },
    educationLevels: {
      type: [String],
      required: true,
      default: []
    },
    eligibility: {
      type: String,
      required: [true, 'Please specify eligibility criteria']
    },
    stream: {
      type: [String],
      default: []
    },
    location: {
      type: String,
      default: 'All India / Online'
    },
    deadline: {
      type: Date
    },
    applicationStartDate: {
      type: Date
    },
    opportunityType: {
      type: String,
      default: 'General'
    },
    officialWebsite: {
      type: String,
      required: [true, 'Please provide the official website URL']
    },
    tags: {
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

// Search text index (preserved)
opportunitySchema.index({ title: 'text', description: 'text', tags: 'text', organization: 'text' });

// Query optimization indexes
opportunitySchema.index({ isActive: 1, createdAt: -1 });
opportunitySchema.index({ deadline: 1 });
opportunitySchema.index({ educationLevels: 1 });
opportunitySchema.index({ location: 1 });

module.exports = mongoose.model('Opportunity', opportunitySchema);
