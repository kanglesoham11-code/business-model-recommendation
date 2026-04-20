const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const businessModels = [
  {
    slug: 'd2c',
    name: 'Direct-to-Consumer (D2C)',
    description: 'Brand owns the full customer journey',
    icon: '🛒',
    startupCost: '$$$',
    timeToRevenue: '3-6 months',
    complexityIndex: 4,
    marginPotential: 5,
    scalabilityScore: 5,
    pros: [
      'Highest brand control & margins',
      'Direct customer relationships',
      'Full data ownership',
      'Premium pricing potential'
    ],
    cons: [
      'Requires own marketing funnel',
      'High initial investment',
      'Complex logistics',
      'Customer acquisition costs'
    ],
    bestFor: [
      'Branded physical products',
      'Premium positioning',
      'Long-term brand building'
    ],
    platforms: ['Shopify', 'WooCommerce', 'BigCommerce', 'Custom']
  },
  {
    slug: 'subscription',
    name: 'Subscription Commerce',
    description: 'Recurring revenue with curated delivery',
    icon: '🔄',
    startupCost: '$$',
    timeToRevenue: '1-3 months',
    complexityIndex: 3,
    marginPotential: 5,
    scalabilityScore: 5,
    pros: [
      'Predictable MRR/ARR revenue',
      'High customer lifetime value',
      'Strong retention metrics',
      'Scalable model'
    ],
    cons: [
      'Churn management critical',
      'Requires consistent value delivery',
      'Inventory planning complexity',
      'Customer acquisition focus'
    ],
    bestFor: [
      'Niche consumer products',
      'Curated experiences',
      'Consumable goods'
    ],
    platforms: ['Cratejoy', 'Subbly', 'Shopify', 'ReCharge']
  },
  {
    slug: 'affiliate',
    name: 'Affiliate Marketing',
    description: 'Commission-based promotion of third-party products',
    icon: '🤝',
    startupCost: '$',
    timeToRevenue: '4-12 months',
    complexityIndex: 2,
    marginPotential: 3,
    scalabilityScore: 4,
    pros: [
      'Zero inventory risk',
      'Passive income potential',
      'Low startup costs',
      'Flexible work model'
    ],
    cons: [
      'No product control',
      'Commission-dependent income',
      'High competition',
      'Long ramp-up time'
    ],
    bestFor: [
      'Content creators',
      'Bloggers & influencers',
      'Niche experts'
    ],
    platforms: ['Amazon Associates', 'ShareASale', 'CJ Affiliate', 'Impact']
  },
  {
    slug: 'dropshipping',
    name: 'Dropshipping',
    description: 'Sell without holding inventory',
    icon: '📦',
    startupCost: '$',
    timeToRevenue: '1-2 months',
    complexityIndex: 2,
    marginPotential: 2,
    scalabilityScore: 3,
    pros: [
      'Low barrier to entry',
      'No inventory management',
      'Quick to launch',
      'Test products easily'
    ],
    cons: [
      'Thin profit margins',
      'High competition',
      'Limited quality control',
      'Supplier dependency'
    ],
    bestFor: [
      'Product testers',
      'Low-budget starts',
      'Market validation'
    ],
    platforms: ['Shopify + Oberlo', 'WooCommerce + AliDropship', 'DSers']
  },
  {
    slug: 'marketplace',
    name: 'Marketplace Selling',
    description: 'Sell on Amazon, Flipkart, Etsy, etc.',
    icon: '🏪',
    startupCost: '$$',
    timeToRevenue: '2-4 months',
    complexityIndex: 3,
    marginPotential: 3,
    scalabilityScore: 4,
    pros: [
      'Built-in customer base',
      'Established trust',
      'Lower marketing costs',
      'Quick market access'
    ],
    cons: [
      'Platform fees reduce margins',
      'Limited brand control',
      'Competition within platform',
      'Policy restrictions'
    ],
    bestFor: [
      'Commodity goods',
      'Handcrafted products',
      'Quick market entry'
    ],
    platforms: ['Amazon', 'Flipkart', 'Etsy', 'eBay', 'Meesho']
  },
  {
    slug: 'social-commerce',
    name: 'Social Commerce',
    description: 'Selling directly via social media platforms',
    icon: '📱',
    startupCost: '$',
    timeToRevenue: '1-3 months',
    complexityIndex: 2,
    marginPotential: 4,
    scalabilityScore: 4,
    pros: [
      'Leverages existing audience',
      'Native shopping experience',
      'Low startup costs',
      'Viral potential'
    ],
    cons: [
      'Platform algorithm dependency',
      'Limited customization',
      'Audience building required',
      'Platform policy changes'
    ],
    bestFor: [
      'Influencers',
      'Lifestyle brands',
      'Visual products'
    ],
    platforms: ['Instagram Shopping', 'TikTok Shop', 'Facebook Shops', 'Pinterest']
  },
  {
    slug: 'digital-products',
    name: 'Digital Products / SaaS',
    description: 'Software, courses, templates, downloads',
    icon: '🎓',
    startupCost: '$$',
    timeToRevenue: '2-5 months',
    complexityIndex: 3,
    marginPotential: 5,
    scalabilityScore: 5,
    pros: [
      '100% digital - no inventory',
      'Extremely high margins',
      'Instant delivery',
      'Global reach'
    ],
    cons: [
      'Requires specialized skills',
      'Content creation intensive',
      'Piracy concerns',
      'Market saturation'
    ],
    bestFor: [
      'Educators',
      'Developers',
      'Designers & creators'
    ],
    platforms: ['Gumroad', 'Teachable', 'Podia', 'Stripe', 'Custom']
  },
  {
    slug: 'white-label',
    name: 'White Label / Private Label',
    description: 'Brand generic products as your own',
    icon: '🏭',
    startupCost: '$$$',
    timeToRevenue: '4-8 months',
    complexityIndex: 4,
    marginPotential: 4,
    scalabilityScore: 4,
    pros: [
      'Fast path to branded inventory',
      'Quality control possible',
      'Brand ownership',
      'Competitive differentiation'
    ],
    cons: [
      'Moderate upfront investment',
      'MOQ requirements',
      'Supplier relationship critical',
      'Longer time to market'
    ],
    bestFor: [
      'Category-focused entrepreneurs',
      'Brand builders',
      'Quality-focused sellers'
    ],
    platforms: ['Alibaba', 'Amazon FBA', 'Shopify', 'Custom']
  }
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.businessModel.deleteMany();
  console.log('✅ Cleared existing business models');

  // Seed business models
  for (const model of businessModels) {
    await prisma.businessModel.create({
      data: model
    });
  }
  console.log(`✅ Seeded ${businessModels.length} business models`);

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
