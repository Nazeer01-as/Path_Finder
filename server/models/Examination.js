const mongoose = require('mongoose');

const examinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the examination name'],
      trim: true
    },
    conductingBody: {
      type: String,
      required: [true, 'Please provide conducting body']
    },
    category: {
      type: String,
      required: true,
      enum: [
        'School-Level',
        'Engineering',
        'Medical',
        'Law',
        'Management',
        'Government / Competitive',
        'Defence',
        'Other'
      ]
    },
    description: {
      type: String,
      required: true
    },
    eligibility: {
      type: String,
      required: true
    },
    ageLimit: {
      type: String,
      default: 'Refer official notification'
    },
    educationLevels: {
      type: [String],
      default: []
    },
    stream: {
      type: [String],
      default: []
    },
    applicationStartDate: {
      type: Date
    },
    applicationLastDate: {
      type: Date
    },
    examDate: {
      type: Date
    },
    fee: {
      type: String,
      default: 'Refer official notification'
    },
    examPattern: {
      type: String,
      default: ''
    },
    syllabus: {
      type: String,
      default: ''
    },
    officialWebsite: {
      type: String,
      required: [true, 'Please provide official website link']
    },
    importantLinks: [
      {
        title: String,
        url: String
      }
    ],
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

examinationSchema.index({ name: 'text', conductingBody: 'text', description: 'text' });

module.exports = mongoose.model('Examination', examinationSchema);
