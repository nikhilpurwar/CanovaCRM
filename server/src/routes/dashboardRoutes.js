const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware } = require('../middleware/auth');

// All routes protected
router.get('/stats', authMiddleware, dashboardController.getDashboardStats);
router.get('/activities', authMiddleware, dashboardController.getAllActivities);
router.get('/activities/recent', authMiddleware, dashboardController.getRecentActivities);
router.get('/performance', authMiddleware, dashboardController.getEmployeePerformance);

module.exports = router;
