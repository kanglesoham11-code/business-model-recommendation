const { PrismaClient } = require('@prisma/client');
const { uploadPDF } = require('../utils/supabaseStorage');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

/**
 * Generate and upload PDF report
 * This is a placeholder implementation - actual PDF generation would use jsPDF or similar
 */
exports.generateReport = async (req, res, next) => {
  try {
    const { recommendationId } = req.body;
    const userId = req.user?.userId || null;

    if (!recommendationId) {
      return res.status(400).json({
        success: false,
        message: 'Recommendation ID is required'
      });
    }

    // Get recommendation data
    const recommendation = await prisma.recommendation.findUnique({
      where: { id: recommendationId },
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
    if (recommendation.userId && userId !== recommendation.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Generate PDF content (placeholder - would use jsPDF in real implementation)
    const pdfContent = generatePDFContent(recommendation);
    const pdfBuffer = Buffer.from(pdfContent, 'utf-8');

    // Create unique filename
    const fileName = `report-${recommendationId}-${Date.now()}.pdf`;

    // Upload to Supabase Storage
    const uploadResult = await uploadPDF(pdfBuffer, fileName);

    if (!uploadResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload report',
        error: uploadResult.error
      });
    }

    // Save report record to database
    const report = await prisma.report.create({
      data: {
        userId: recommendation.userId,
        recommendationId: recommendation.id,
        format: 'pdf',
        s3Key: uploadResult.path, // Store the path for reference
        s3Url: uploadResult.url,
        fileSize: pdfBuffer.length
      }
    });

    logger.info(`Report generated and uploaded: ${report.id}`);

    res.status(201).json({
      success: true,
      data: {
        report: {
          id: report.id,
          url: report.s3Url,
          fileName: fileName,
          fileSize: report.fileSize,
          createdAt: report.createdAt
        }
      }
    });
  } catch (error) {
    logger.error('Generate report error:', error);
    next(error);
  }
};

/**
 * Get report by ID
 */
exports.getReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || null;

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        recommendation: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check authorization
    if (report.userId && userId !== report.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { report }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all reports for authenticated user
 */
exports.getUserReports = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const reports = await prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        recommendation: {
          select: {
            id: true,
            topModels: true,
            createdAt: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: { reports }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to generate PDF content
 * This is a placeholder - in production, use jsPDF or similar library
 */
function generatePDFContent(recommendation) {
  const content = `
    STARTUP MODEL PLANNER - RECOMMENDATION REPORT
    ============================================
    
    Generated: ${new Date().toISOString()}
    Recommendation ID: ${recommendation.id}
    
    TOP RECOMMENDATIONS:
    ${JSON.stringify(recommendation.topModels, null, 2)}
    
    QUESTIONNAIRE DATA:
    ${JSON.stringify(recommendation.questionnaire, null, 2)}
    
    ---
    This is a placeholder PDF. In production, use jsPDF or similar library.
  `;

  return content;
}

module.exports = exports;
