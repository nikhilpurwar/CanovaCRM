const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Get today's attendance
router.get('/today', attendanceController.getTodayAttendance);

// Get attendance for specific date (used by frontend)
router.get('/my', attendanceController.getMyAttendance);

// Check In
router.post('/check-in', attendanceController.checkIn);

// Check Out
router.post('/check-out', attendanceController.checkOut);

// Start Break
router.post('/break/start', attendanceController.startBreak);

// End Break
router.post('/break/end', attendanceController.endBreak);

// Get attendance history
router.get('/history', attendanceController.getAttendanceHistory);

module.exports = router;
