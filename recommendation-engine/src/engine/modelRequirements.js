/**
 * Model Requirements Matrix
 * 
 * Defines the ideal requirements and thresholds for each business model.
 * These values are calibrated based on domain expert input.
 */

module.exports = {
  'd2c': {
    name: 'Direct-to-Consumer (D2C)',
    minBudget: 70, // Normalized: ~$15,000+
    minMonthlyBurn: 60, // Normalized: ~$2,000+
    idealTimeToProfit: 50, // Normalized: 4-6 months
    inventoryRequired: 70, // High willingness needed
    logisticsRequired: 70, // High capability needed
    minHoursPerWeek: 60, // ~30+ hours
    minAudienceSize: 30, // Some audience helpful
    minBrandRecognition: 40, // Some brand awareness
    businessTypes: ['B2C', 'B2B2C'],
    techWeight: 1.5,
    contentWeight: 2.0,
    marketingWeight: 2.5,
    designWeight: 2.0,
    salesWeight: 1.5
  },
  
  'subscription': {
    name: 'Subscription Commerce',
    minBudget: 50, // Normalized: ~$8,000+
    minMonthlyBurn: 50, // Normalized: ~$1,500+
    idealTimeToProfit: 30, // Normalized: 2-3 months
    inventoryRequired: 60, // Moderate-high willingness
    logisticsRequired: 60, // Moderate-high capability
    minHoursPerWeek: 50, // ~25+ hours
    minAudienceSize: 40, // Audience important for subscriptions
    minBrandRecognition: 50, // Brand trust critical
    businessTypes: ['B2C', 'B2B'],
    techWeight: 1.5,
    contentWeight: 2.5,
    marketingWeight: 2.0,
    designWeight: 1.5,
    salesWeight: 1.5
  },
  
  'affiliate': {
    name: 'Affiliate Marketing',
    minBudget: 10, // Normalized: ~$500+
    minMonthlyBurn: 10, // Normalized: ~$200+
    idealTimeToProfit: 70, // Normalized: 8-12 months
    inventoryRequired: 0, // No inventory needed
    logisticsRequired: 0, // No logistics needed
    minHoursPerWeek: 30, // ~15+ hours
    minAudienceSize: 50, // Audience critical
    minBrandRecognition: 30, // Some recognition helpful
    businessTypes: ['B2C', 'B2B'],
    techWeight: 2.0,
    contentWeight: 3.0,
    marketingWeight: 3.0,
    designWeight: 1.5,
    salesWeight: 1.0
  },
  
  'dropshipping': {
    name: 'Dropshipping',
    minBudget: 15, // Normalized: ~$1,000+
    minMonthlyBurn: 20, // Normalized: ~$500+
    idealTimeToProfit: 20, // Normalized: 1-2 months
    inventoryRequired: 0, // No inventory needed
    logisticsRequired: 20, // Minimal logistics
    minHoursPerWeek: 40, // ~20+ hours
    minAudienceSize: 20, // Small audience okay
    minBrandRecognition: 10, // Brand not critical
    businessTypes: ['B2C'],
    techWeight: 2.0,
    contentWeight: 1.5,
    marketingWeight: 2.5,
    designWeight: 1.5,
    salesWeight: 2.0
  },
  
  'marketplace': {
    name: 'Marketplace Selling',
    minBudget: 40, // Normalized: ~$5,000+
    minMonthlyBurn: 40, // Normalized: ~$1,000+
    idealTimeToProfit: 40, // Normalized: 3-4 months
    inventoryRequired: 50, // Moderate willingness
    logisticsRequired: 50, // Moderate capability
    minHoursPerWeek: 45, // ~22+ hours
    minAudienceSize: 10, // Marketplace provides audience
    minBrandRecognition: 20, // Less critical on marketplaces
    businessTypes: ['B2C', 'B2B'],
    techWeight: 1.0,
    contentWeight: 1.5,
    marketingWeight: 1.5,
    designWeight: 1.5,
    salesWeight: 2.0
  },
  
  'social-commerce': {
    name: 'Social Commerce',
    minBudget: 20, // Normalized: ~$2,000+
    minMonthlyBurn: 25, // Normalized: ~$600+
    idealTimeToProfit: 30, // Normalized: 2-3 months
    inventoryRequired: 30, // Low-moderate willingness
    logisticsRequired: 30, // Low-moderate capability
    minHoursPerWeek: 50, // ~25+ hours (content creation)
    minAudienceSize: 60, // Audience critical
    minBrandRecognition: 40, // Brand presence important
    businessTypes: ['B2C'],
    techWeight: 2.0,
    contentWeight: 3.0,
    marketingWeight: 2.5,
    designWeight: 2.5,
    salesWeight: 1.5
  },
  
  'digital-products': {
    name: 'Digital Products / SaaS',
    minBudget: 35, // Normalized: ~$4,000+
    minMonthlyBurn: 30, // Normalized: ~$800+
    idealTimeToProfit: 45, // Normalized: 3-5 months
    inventoryRequired: 0, // No physical inventory
    logisticsRequired: 0, // No logistics
    minHoursPerWeek: 55, // ~28+ hours
    minAudienceSize: 40, // Audience helpful
    minBrandRecognition: 35, // Some recognition helpful
    businessTypes: ['B2C', 'B2B'],
    techWeight: 3.0,
    contentWeight: 2.5,
    marketingWeight: 2.0,
    designWeight: 2.5,
    salesWeight: 1.5
  },
  
  'white-label': {
    name: 'White Label / Private Label',
    minBudget: 75, // Normalized: ~$20,000+
    minMonthlyBurn: 65, // Normalized: ~$2,500+
    idealTimeToProfit: 60, // Normalized: 5-8 months
    inventoryRequired: 80, // High willingness needed
    logisticsRequired: 75, // High capability needed
    minHoursPerWeek: 60, // ~30+ hours
    minAudienceSize: 25, // Some audience helpful
    minBrandRecognition: 45, // Brand building important
    businessTypes: ['B2C', 'B2B'],
    techWeight: 1.0,
    contentWeight: 1.5,
    marketingWeight: 2.5,
    designWeight: 2.0,
    salesWeight: 2.5
  }
};
