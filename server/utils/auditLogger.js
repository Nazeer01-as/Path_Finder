const AuditLog = require('../models/AuditLog');

/**
 * Log an administrative action to the AuditLog collection
 * Non-blocking: catches and logs errors internally to preserve main API response.
 */
const logAudit = async ({ adminId, action, resource, resourceId, details = {} }) => {
  try {
    if (!adminId) return;
    await AuditLog.create({
      adminId,
      action,
      resource,
      resourceId: String(resourceId),
      details
    });
  } catch (error) {
    console.error('[AuditLog Error] Failed to write audit record:', error.message);
  }
};

module.exports = {
  logAudit
};
