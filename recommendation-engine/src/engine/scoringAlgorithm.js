const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Full model knowledge base — SLUGS MUST MATCH the database exactly.
 * DB slugs: d2c, subscription, affiliate, dropshipping, marketplace, social-commerce, digital-products, white-label
 */
const MODEL_KNOWLEDGE = {
  'dropshipping': {
    name: 'Dropshipping',
    description: 'Sell products without holding inventory. Supplier ships directly to customer.',
    startupCost: '$500-$2,000', timeToRevenue: '1-2 months', complexity: 2,
    idealFor: 'Low budget, minimal risk tolerance, no warehouse, marketing-focused founders',
    keyRequirements: 'Strong marketing skills, supplier relationships, customer service capability',
    riskFactors: 'Thin margins (15-30%), shipping delays, quality control issues, high competition'
  },
  'affiliate': {
    name: 'Affiliate Marketing',
    description: 'Earn commissions promoting third-party products through content and referral links.',
    startupCost: '$100-$1,000', timeToRevenue: '4-12 months', complexity: 2,
    idealFor: 'Content creators, bloggers, niche experts with existing audience',
    keyRequirements: 'SEO skills, content creation ability, patience for organic growth',
    riskFactors: 'Slow initial income, commission-dependent, no product control, algorithm changes'
  },
  'd2c': {
    name: 'Direct-to-Consumer (D2C)',
    description: 'Build your own brand and sell directly to end consumers, bypassing retailers.',
    startupCost: '$10,000-$50,000', timeToRevenue: '3-6 months', complexity: 4,
    idealFor: 'Brand builders with moderate budget, product vision, and marketing capability',
    keyRequirements: 'Brand development, inventory management, fulfillment logistics, customer acquisition',
    riskFactors: 'High upfront investment, inventory risk, requires strong brand differentiation'
  },
  'marketplace': {
    name: 'Marketplace Selling',
    description: 'Sell on platforms like Amazon, Etsy, eBay — leveraging their built-in traffic.',
    startupCost: '$1,000-$5,000', timeToRevenue: '1-3 months', complexity: 2,
    idealFor: 'Sellers wanting quick market access without building their own storefront',
    keyRequirements: 'Product sourcing, listing optimization, competitive pricing strategy',
    riskFactors: 'Platform fees eat margins, high competition, algorithm dependency, limited branding'
  },
  'white-label': {
    name: 'White Label / Private Label',
    description: 'Rebrand existing manufacturer products under your own brand name.',
    startupCost: '$5,000-$25,000', timeToRevenue: '3-6 months', complexity: 4,
    idealFor: 'Entrepreneurs with capital who want brand ownership without product development',
    keyRequirements: 'Supplier sourcing, brand development, quality control, inventory management',
    riskFactors: 'Significant upfront investment, MOQ requirements, inventory risk, brand building time'
  },
  'subscription': {
    name: 'Subscription Commerce',
    description: 'Curated recurring product deliveries on a subscription basis.',
    startupCost: '$5,000-$15,000', timeToRevenue: '2-4 months', complexity: 3,
    idealFor: 'Curators with niche knowledge, community builders, recurring revenue seekers',
    keyRequirements: 'Curation skills, supplier relationships, logistics capability, retention marketing',
    riskFactors: 'High churn risk, logistics complexity, cash flow management, sourcing consistency'
  },
  'digital-products': {
    name: 'Digital Products / SaaS',
    description: 'Sell software, courses, templates, ebooks, or digital downloads.',
    startupCost: '$500-$5,000', timeToRevenue: '2-5 months', complexity: 3,
    idealFor: 'Technical founders, educators, developers, designers with specialized knowledge',
    keyRequirements: 'Technical proficiency, content creation, domain expertise',
    riskFactors: 'Requires specialized skills, piracy concerns, ongoing maintenance, market saturation'
  },
  'social-commerce': {
    name: 'Social Commerce',
    description: 'Sell directly through social media platforms like Instagram, TikTok, Facebook Shops.',
    startupCost: '$500-$3,000', timeToRevenue: '1-3 months', complexity: 2,
    idealFor: 'Creators and influencers with strong social media presence and engagement',
    keyRequirements: 'Content creation, social media marketing, audience building, trend awareness',
    riskFactors: 'Platform dependency, algorithm changes, requires constant content, audience fatigue'
  }
};

const ALL_SLUGS = Object.keys(MODEL_KNOWLEDGE);

/**
 * Generate LLM-powered recommendation with deep contextual analysis.
 */
const generateRecommendation = async (questionnaire) => {
  const startTime = Date.now();

  const systemPrompt = `You are an elite E-Commerce Business Model Analyst powering a premium consulting platform.

## YOUR TASK
Analyze the user's complete business profile and score ALL 8 e-commerce models for fit.

## AVAILABLE BUSINESS MODELS — USE THESE EXACT SLUGS
${Object.entries(MODEL_KNOWLEDGE).map(([slug, m]) => 
  `### "${slug}"
  - ${m.name}: ${m.description}
  - Startup Cost: ${m.startupCost} | Time to Revenue: ${m.timeToRevenue} | Complexity: ${m.complexity}/5
  - Ideal For: ${m.idealFor}
  - Key Requirements: ${m.keyRequirements}
  - Risk Factors: ${m.riskFactors}`
).join('\n\n')}

## SCORING METHODOLOGY (apply rigorously)
For each model, compute a weighted composite score:
1. **Financial Fit (35%)**: Does their budget match the model's startup cost? Can they sustain the monthly burn? Is the time-to-profitability aligned with their tolerance?
2. **Operational Fit (25%)**: Do they have inventory willingness? Logistics capability? Enough time commitment? Supplier access and warehouse availability?
3. **Market Fit (25%)**: Does their target geography, business type (B2B/B2C), audience size, brand recognition, and niche align with the model's requirements?
4. **Skills Fit (15%)**: Do their tech, content, SEO, design, sales, and data analysis skills match what the model demands?

Apply STRICT differentiation — avoid giving similar scores to all models. The spread between #1 and #8 should be at least 30 points. Penalize models heavily when critical requirements are unmet.

## CRITICAL RULES
- The "model" field in your output MUST be one of these EXACT strings: ${ALL_SLUGS.map(s => `"${s}"`).join(', ')}
- Do NOT invent slugs. Do NOT use "affiliate-marketing", "direct-to-consumer", "subscription-box", "print-on-demand", or "retail-arbitrage" — those are WRONG.
- Reference the user's ACTUAL numbers in your reasoning — do NOT be generic.

## OUTPUT FORMAT (strict JSON)
{
  "topModels": [
    {
      "model": "<exact-slug-from-list-above>",
      "score": <number 0-100, precise to 1 decimal>,
      "confidence": <number 60-99>,
      "customReasoning": "<2-3 sentence personalized explanation referencing SPECIFIC data points from their profile>",
      "customPros": ["<specific advantage based on THEIR profile>", "<another>", "<another>"],
      "customCons": ["<specific risk based on THEIR weaknesses>", "<another>", "<another>"]
    }
  ],
  "allScores": {
    "<slug>": { "model": "<slug>", "score": <number>, "confidence": <number> }
  }
}

FINAL CHECK: "topModels" = exactly the top 3 sorted descending. "allScores" = entries for ALL 8 models using ONLY the slugs listed above.`;

  const userPrompt = `Analyze this entrepreneur's profile and generate the recommendation JSON:

### FINANCIAL PROFILE
- Startup Budget: $${questionnaire.startupBudget || 'Not specified'}
- Monthly Burn Tolerance: $${questionnaire.monthlyBurnTolerance || 'Not specified'}/month
- Target Annual Revenue: $${questionnaire.targetARR || 'Not specified'}
- Time to Profitability Goal: ${questionnaire.timeToProfitability || 'Not specified'} months
- Existing Revenue: $${questionnaire.existingRevenue || 0}
- Max Customer Acquisition Cost: $${questionnaire.maxCAC || 'Not specified'}

### OPERATIONAL READINESS
- Inventory Willingness: ${questionnaire.inventoryWillingness || 'Not specified'}/5
- Logistics Capability: ${questionnaire.logisticsCapability || 'Not specified'}/5
- Team Size: ${questionnaire.teamSize || 1} people
- Hours Per Week Available: ${questionnaire.hoursPerWeek || 'Not specified'}
- Supplier Access: ${questionnaire.supplierAccess ? 'Yes' : 'No'}
- Warehouse Available: ${questionnaire.warehouseAvailability ? 'Yes' : 'No'}

### MARKET POSITION
- Target Geography: ${questionnaire.targetGeography || 'Not specified'}
- Niche Type: ${questionnaire.nicheType || 'Not specified'}
- Business Type: ${questionnaire.businessType || 'Not specified'}
- Competition Level: ${questionnaire.competitionLevel || 'Not specified'}/5
- Existing Audience Size: ${questionnaire.existingAudienceSize || 0}
- Brand Recognition: ${questionnaire.brandRecognition || 'Not specified'}/5

### SKILL SET
- Tech Proficiency: ${questionnaire.techStackProficiency || 'Not specified'}/5
- Content Creation: ${questionnaire.contentCreationAbility || 'Not specified'}/5
- SEO/SEM Experience: ${questionnaire.seoSemExperience || 'Not specified'}/5
- Design Skills: ${questionnaire.designSkills || 'Not specified'}/5
- Sales Experience: ${questionnaire.salesExperience || 'Not specified'}/5
- Data Analysis: ${questionnaire.dataAnalysisCapability || 'Not specified'}/5`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.15,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    });

    const llmResponse = JSON.parse(completion.choices[0].message.content);

    // Safety: validate that returned slugs actually exist
    if (llmResponse.topModels) {
      llmResponse.topModels = llmResponse.topModels.filter(m => ALL_SLUGS.includes(m.model));
    }

    return {
      topModels: llmResponse.topModels,
      allScores: llmResponse.allScores,
      processingTime: Date.now() - startTime,
      engineVersion: '2.1.0-llm',
      metadata: {
        timestamp: new Date().toISOString(),
        provider: 'groq',
        model: 'llama-3.3-70b-versatile',
        tokensUsed: completion.usage?.total_tokens
      }
    };
  } catch (error) {
    console.error('LLM Generation Error:', error.message || error);
    throw new Error(`AI recommendation failed: ${error.message}`);
  }
};

module.exports = { generateRecommendation, MODEL_KNOWLEDGE };
