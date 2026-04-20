/**
 * Weight Matrix Configuration
 * 
 * Defines the relative importance of each input parameter category
 * in the final recommendation score.
 */

module.exports = {
  // Category weights (must sum to 1.0)
  categoryWeights: {
    financial: 0.35,    // 35% - Most important
    operational: 0.25,  // 25% - Second most important
    market: 0.25,       // 25% - Second most important
    skills: 0.15        // 15% - Supporting factor
  },
  
  // Individual parameter weights within each category
  financial: {
    startupBudget: 2.0,
    monthlyBurnTolerance: 1.5,
    targetARR: 1.0,
    timeToProfitability: 1.5,
    existingRevenue: 1.0,
    maxCAC: 1.0
  },
  
  operational: {
    inventoryWillingness: 2.0,
    logisticsCapability: 1.5,
    teamSize: 1.0,
    hoursPerWeek: 1.5,
    supplierAccess: 1.0,
    warehouseAvailability: 1.0
  },
  
  market: {
    targetGeography: 1.0,
    nicheType: 1.0,
    businessType: 1.5,
    competitionLevel: 1.5,
    existingAudienceSize: 2.0,
    brandRecognition: 1.5
  },
  
  skills: {
    techStackProficiency: 1.5,
    contentCreationAbility: 2.0,
    seoSemExperience: 2.0,
    designSkills: 1.5,
    salesExperience: 1.5,
    dataAnalysisCapability: 1.0
  }
};
