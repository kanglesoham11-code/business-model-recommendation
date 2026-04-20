const express = require('express');
const router = express.Router();
const questionnaireController = require('../controllers/questionnaire.controller');
const { authenticate, optionalAuth } = require('../middleware/auth');

// Questionnaire CRUD
router.post('/', optionalAuth, questionnaireController.create);
router.get('/:id', optionalAuth, questionnaireController.getById);
router.put('/:id', optionalAuth, questionnaireController.update);
router.delete('/:id', authenticate, questionnaireController.delete);

// User's questionnaires
router.get('/user/all', authenticate, questionnaireController.getUserQuestionnaires);

module.exports = router;
