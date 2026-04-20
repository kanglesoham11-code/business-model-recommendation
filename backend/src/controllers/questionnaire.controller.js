const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

// Validation schema for questionnaire
const questionnaireSchema = Joi.object({
  // Financial Parameters
  startupBudget: Joi.number().min(0).optional(),
  monthlyBurnTolerance: Joi.number().min(0).optional(),
  targetARR: Joi.number().min(0).optional(),
  timeToProfitability: Joi.number().min(1).max(60).optional(),
  existingRevenue: Joi.number().min(0).optional(),
  maxCAC: Joi.number().min(0).optional(),
  
  // Operational Parameters
  inventoryWillingness: Joi.number().min(1).max(5).optional(),
  logisticsCapability: Joi.number().min(1).max(5).optional(),
  teamSize: Joi.number().min(0).optional(),
  hoursPerWeek: Joi.number().min(1).max(168).optional(),
  supplierAccess: Joi.boolean().optional(),
  warehouseAvailability: Joi.boolean().optional(),
  
  // Market Parameters
  targetGeography: Joi.string().optional(),
  nicheType: Joi.string().optional(),
  businessType: Joi.string().valid('B2B', 'B2C', 'B2B2C').optional(),
  competitionLevel: Joi.number().min(1).max(5).optional(),
  existingAudienceSize: Joi.number().min(0).optional(),
  brandRecognition: Joi.number().min(1).max(5).optional(),
  
  // Skill Parameters
  techStackProficiency: Joi.number().min(1).max(5).optional(),
  contentCreationAbility: Joi.number().min(1).max(5).optional(),
  seoSemExperience: Joi.number().min(1).max(5).optional(),
  designSkills: Joi.number().min(1).max(5).optional(),
  salesExperience: Joi.number().min(1).max(5).optional(),
  dataAnalysisCapability: Joi.number().min(1).max(5).optional(),
  
  status: Joi.string().valid('in_progress', 'completed').optional()
});

// Create new questionnaire
exports.create = async (req, res, next) => {
  try {
    const { error, value } = questionnaireSchema.validate(req.body);
    if (error) throw error;

    const userId = req.user?.userId || null;

    const questionnaire = await prisma.questionnaire.create({
      data: {
        ...value,
        userId,
        status: 'in_progress'
      }
    });

    logger.info(`Questionnaire created: ${questionnaire.id}`);

    res.status(201).json({
      success: true,
      data: { questionnaire }
    });
  } catch (error) {
    next(error);
  }
};

// Get questionnaire by ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const questionnaire = await prisma.questionnaire.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        recommendations: true
      }
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

    res.json({
      success: true,
      data: { questionnaire }
    });
  } catch (error) {
    next(error);
  }
};

// Update questionnaire
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = questionnaireSchema.validate(req.body);
    if (error) throw error;

    // Check if questionnaire exists
    const existing = await prisma.questionnaire.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Questionnaire not found'
      });
    }

    // Check authorization
    if (existing.userId && req.user?.userId !== existing.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if all required fields are filled
    const allFieldsFilled = Object.keys(value).length >= 20; // Adjust based on required fields
    if (allFieldsFilled && value.status !== 'completed') {
      value.status = 'completed';
      value.completedAt = new Date();
    }

    const questionnaire = await prisma.questionnaire.update({
      where: { id },
      data: value
    });

    logger.info(`Questionnaire updated: ${id}`);

    res.json({
      success: true,
      data: { questionnaire }
    });
  } catch (error) {
    next(error);
  }
};

// Delete questionnaire
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const questionnaire = await prisma.questionnaire.findUnique({
      where: { id }
    });

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: 'Questionnaire not found'
      });
    }

    // Check authorization
    if (questionnaire.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await prisma.questionnaire.delete({
      where: { id }
    });

    logger.info(`Questionnaire deleted: ${id}`);

    res.json({
      success: true,
      message: 'Questionnaire deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get user's questionnaires
exports.getUserQuestionnaires = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const questionnaires = await prisma.questionnaire.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        recommendations: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    res.json({
      success: true,
      data: { questionnaires }
    });
  } catch (error) {
    next(error);
  }
};
