const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { authenticate, optionalAuth } = require('../middleware/auth');

// Generate PDF report
router.post('/generate', optionalAuth, reportController.generateReport);

// Get report by ID
router.get('/:id', optionalAuth, reportController.getReport);

// Get all reports for authenticated user
router.get('/user/all', authenticate, reportController.getUserReports);

module.exports = router;
