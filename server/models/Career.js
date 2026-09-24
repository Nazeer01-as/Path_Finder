const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide career title'],
      trim: true
    },
    sector: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    requiredEducation: {
      type: [String],
      default: []
    },
    requiredSkills: {
      type: [String],
      default: []
    },
    careerPath: [
      {
        stepNumber: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, default: '' },
        typicalDuration: { type: String, default: '' }
      }
    ],
    relatedCourses: {
      type: [String],
      default: []
    },
    relatedExams: {
      type: [String],
      default: []
    },
    jobRoles: {
      type: [String],
      default: []
    },
    averageSalaryRange: {
      type: String,
      default: 'Competitive'
    },
    growthProspects: {
      type: String,
      default: 'High Demand'
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

careerSchema.index({ title: 'text', sector: 'text', description: 'text' });

module.exports = mongoose.model('Career', careerSchema);
