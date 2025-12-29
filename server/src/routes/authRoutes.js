const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/current-user', authMiddleware, authController.getCurrentUser);
router.put('/profile', authMiddleware, authController.updateProfile);
router.get('/all-users', authMiddleware, adminMiddleware, authController.getAllUsers);
router.get('/user/:id', authMiddleware, adminMiddleware, authController.getUserById);

module.exports = router;
