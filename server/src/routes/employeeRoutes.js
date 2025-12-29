const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Protected routes - all users can read
router.get('/', authMiddleware, employeeController.getAllEmployees);
router.get('/stats', authMiddleware, employeeController.getEmployeeStats);
router.get('/:id', authMiddleware, employeeController.getEmployeeById);

// Admin-only routes
router.post('/', authMiddleware, adminMiddleware, employeeController.createEmployee);
router.put('/:id', authMiddleware, adminMiddleware, employeeController.updateEmployee);
router.delete('/:id', authMiddleware, adminMiddleware, employeeController.deleteEmployee);

module.exports = router;
