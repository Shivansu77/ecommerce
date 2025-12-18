const express = require('express');
const { getAdminStats } = require('../controller/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', protect, authorize('admin'), getAdminStats);

module.exports = router;
