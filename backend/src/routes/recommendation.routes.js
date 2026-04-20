const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendation.controller');
const { optionalAuth } = require('../middleware/auth');

// Generate recommendation
router.post('/generate', optionalAuth, recommendationController.generate);
router.post('/simulate', optionalAuth, recommendationController.simulate);

// Get recommendation by ID
router.get('/:id', optionalAuth, recommendationController.getById);

// Get business models
router.get('/models/all', recommendationController.getAllModels);
router.get('/models/:slug', recommendationController.getModelBySlug);

module.exports = router;
