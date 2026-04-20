const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const logger = require('../utils/logger');

const prisma = new PrismaClient();
const RECOMMENDATION_ENGINE_URL = process.env.RECOMMENDATION_ENGINE_URL || 'http://localhost:5001';

// Generate recommendation
exports.generate = async (req, res, next) => {
  try {
    const { questionnaireId } = req.body;

    if (!questionnaireId) {
      return res.status(400).json({
        success: false,
        message: 'Questionnaire ID required'
      });
    }

    // Get questionnaire
    const questionnaire = await prisma.questionnaire.findUnique({
      where: { id: questionnaireId }
    });

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: 'Questionnaire not found'
      });
    }

    // Check authorization
    if (questionnaire.userId && req.user?.userId !== questionnaire.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Call recommendation engine
    const engineResponse = await axios.post(
      `${RECOMMENDATION_ENGINE_URL}/api/recommend`,
      questionnaire,
      { timeout: 10000 }
    );

    const { topModels, allScores, processingTime, engineVersion } = engineResponse.data.data;

    // Save recommendation
    const recommendation = await prisma.recommendation.create({
      data: {
        userId: questionnaire.userId,
        questionnaireId: questionnaire.id,
        topModels,
        allScores,
        processingTime,
        engineVersion
      }
    });

    logger.info(`Recommendation generated: ${recommendation.id}`);

    res.status(201).json({
      success: true,
      data: {
        recommendation: {
          id: recommendation.id,
          topModels,
          allScores,
          processingTime,
          engineVersion,
          createdAt: recommendation.createdAt
        }
      }
    });
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      logger.error('Recommendation engine unavailable');
      return res.status(503).json({
        success: false,
        message: 'Recommendation engine temporarily unavailable'
      });
    }
    next(error);
  }
};

// Simulate recommendation for a specific model (Direct Analysis via LLM)
exports.simulate = async (req, res, next) => {
  try {
    const { slug } = req.body;
    
    if (!slug) {
      return res.status(400).json({ success: false, message: 'Model slug required' });
    }

    const model = await prisma.businessModel.findUnique({ where: { slug } });
    if (!model) {
      return res.status(404).json({ success: false, message: 'Model not found' });
    }

    // Create a completed questionnaire record
    const questionnaire = await prisma.questionnaire.create({
      data: {
        userId: req.user?.userId || null,
        status: 'completed',
        completedAt: new Date()
      }
    });

    // Build a profile that represents someone interested in this specific model
    const simulatedProfile = {
      targetModel: slug,
      modelName: model.name,
      modelDescription: model.description,
      startupBudget: null,
      monthlyBurnTolerance: null,
      hoursPerWeek: 30,
      teamSize: 1,
      businessType: 'B2C',
      targetGeography: 'domestic',
      nicheType: 'general',
      techStackProficiency: 3,
      contentCreationAbility: 3,
      seoSemExperience: 3,
      designSkills: 3,
      salesExperience: 3,
      dataAnalysisCapability: 3
    };

    // Call the recommendation engine with the simulated profile
    const engineResponse = await axios.post(
      `${RECOMMENDATION_ENGINE_URL}/api/recommend`,
      simulatedProfile,
      { timeout: 30000 }
    );

    const { topModels, allScores, processingTime, engineVersion } = engineResponse.data.data;

    // Save the LLM-generated recommendation 
    const recommendation = await prisma.recommendation.create({
      data: {
        userId: req.user?.userId || null,
        questionnaireId: questionnaire.id,
        topModels,
        allScores,
        processingTime,
        engineVersion
      }
    });

    logger.info(`Simulated recommendation generated for ${slug}: ${recommendation.id}`);

    res.status(201).json({
      success: true,
      data: { recommendation }
    });
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      logger.error('Recommendation engine unavailable for simulate');
      return res.status(503).json({
        success: false,
        message: 'Recommendation engine temporarily unavailable. Please try again.'
      });
    }
    next(error);
  }
};

// Get recommendation by ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const recommendation = await prisma.recommendation.findUnique({
      where: { id },
      include: {
        questionnaire: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found'
      });
    }

    // Check authorization
    if (recommendation.userId && req.user?.userId !== recommendation.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { recommendation }
    });
  } catch (error) {
    next(error);
  }
};

// Get all business models
exports.getAllModels = async (req, res, next) => {
  try {
    const models = await prisma.businessModel.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: { models }
    });
  } catch (error) {
    next(error);
  }
};

// Get business model by slug
exports.getModelBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const model = await prisma.businessModel.findUnique({
      where: { slug }
    });

    if (!model) {
      return res.status(404).json({
        success: false,
        message: 'Business model not found'
      });
    }

    res.json({
      success: true,
      data: { model }
    });
  } catch (error) {
    next(error);
  }
};
