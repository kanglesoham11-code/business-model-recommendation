const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const prisma = new PrismaClient();

// Track analytics event
router.post('/track', async (req, res, next) => {
  try {
    const { eventType, eventData } = req.body;
    const userId = req.user?.userId || null;

    await prisma.analyticsEvent.create({
      data: {
        userId,
        eventType,
        eventData,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip
      }
    });

    res.json({
      success: true,
      message: 'Event tracked'
    });
  } catch (error) {
    next(error);
  }
});

// Admin: Get analytics dashboard data
router.get('/dashboard', authenticate, async (req, res, next) => {
  try {
    // This would be admin-only in production
    const totalUsers = await prisma.user.count();
    const totalQuestionnaires = await prisma.questionnaire.count();
    const completedQuestionnaires = await prisma.questionnaire.count({
      where: { status: 'completed' }
    });
    const totalRecommendations = await prisma.recommendation.count();

    res.json({
      success: true,
      data: {
        totalUsers,
        totalQuestionnaires,
        completedQuestionnaires,
        completionRate: totalQuestionnaires > 0 
          ? (completedQuestionnaires / totalQuestionnaires * 100).toFixed(2)
          : 0,
        totalRecommendations
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
