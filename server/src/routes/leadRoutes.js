const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Admin-only bulk create route - MUST come before /:id to avoid route conflict
router.post('/bulk-create', authMiddleware, adminMiddleware, leadController.bulkCreateLeads);

// Protected routes - all users can read
router.get('/', authMiddleware, leadController.getAllLeads);
router.get('/stats', authMiddleware, leadController.getLeadStats);
router.get('/:id', authMiddleware, leadController.getLeadById);

// All authenticated users can update lead type/status/schedule
router.put('/:id', authMiddleware, leadController.updateLead);

// Admin-only routes
router.post('/', authMiddleware, adminMiddleware, leadController.createLead);
router.put('/:id/assign', authMiddleware, adminMiddleware, leadController.assignLead);
router.delete('/:id', authMiddleware, adminMiddleware, leadController.deleteLead);

module.exports = router;
