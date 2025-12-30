const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Admin-only: Recalculate employee stats (must come before /:id)
router.post('/admin/recalculate-stats', authMiddleware, adminMiddleware, employeeController.recalculateStats);

// Admin-only: Fix lead violations (must come before /:id)
router.post('/admin/fix-violations', authMiddleware, adminMiddleware, employeeController.fixLeadViolations);

// Protected routes - all users can read
router.get('/', authMiddleware, employeeController.getAllEmployees);
router.get('/stats', authMiddleware, employeeController.getEmployeeStats);
router.get('/:id', authMiddleware, employeeController.getEmployeeById);

// Admin-only routes
router.post('/', authMiddleware, adminMiddleware, employeeController.createEmployee);
router.put('/:id', authMiddleware, adminMiddleware, employeeController.updateEmployee);
router.delete('/:id', authMiddleware, adminMiddleware, employeeController.deleteEmployee);

module.exports = router;
