const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getUsers,
  updateUserRole
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
