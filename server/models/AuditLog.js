const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    action: {
      type: String,
      required: true,
      enum: [
        'CREATE_OPPORTUNITY',
        'UPDATE_OPPORTUNITY',
        'SOFT_DELETE_OPPORTUNITY',
        'HARD_DELETE_OPPORTUNITY',
        'CREATE_EXAM',
        'UPDATE_EXAM',
        'SOFT_DELETE_EXAM',
        'HARD_DELETE_EXAM',
        'CREATE_SCHOLARSHIP',
        'UPDATE_SCHOLARSHIP',
        'SOFT_DELETE_SCHOLARSHIP',
        'HARD_DELETE_SCHOLARSHIP',
        'CREATE_COURSE',
        'UPDATE_COURSE',
        'SOFT_DELETE_COURSE',
        'HARD_DELETE_COURSE',
        'CREATE_CAREER',
        'UPDATE_CAREER',
        'SOFT_DELETE_CAREER',
        'HARD_DELETE_CAREER',
        'CHANGE_USER_ROLE'
      ]
    },
    resource: {
      type: String,
      required: true,
      enum: ['Opportunity', 'Examination', 'Scholarship', 'Course', 'Career', 'User']
    },
    resourceId: {
      type: String,
      required: true
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

auditLogSchema.index({ adminId: 1, createdAt: -1 });
auditLogSchema.index({ resource: 1, resourceId: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
