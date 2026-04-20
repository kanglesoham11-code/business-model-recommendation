require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generateRecommendation } = require('./engine/scoringAlgorithm');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'recommendation-engine',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Generate recommendation
app.post('/api/recommend', async (req, res) => {
  try {
    const questionnaire = req.body;

    if (!questionnaire || typeof questionnaire !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid questionnaire data'
      });
    }

    const recommendation = await generateRecommendation(questionnaire);

    res.json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get engine info
app.get('/api/info', (req, res) => {
  res.json({
    success: true,
    data: {
      engineVersion: '1.0.0',
      modelsSupported: 8,
      parametersEvaluated: 24,
      algorithmType: 'weighted-scoring',
      categoryWeights: {
        financial: '35%',
        operational: '25%',
        market: '25%',
        skills: '15%'
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`🧠 Recommendation Engine running on port ${PORT}`);
  console.log(`📊 Algorithm version: 1.0.0`);
});

module.exports = app;
