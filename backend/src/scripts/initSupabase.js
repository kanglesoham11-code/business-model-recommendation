/**
 * Initialize Supabase Storage
 * Run this script once to create the reports bucket
 * 
 * Usage: node src/scripts/initSupabase.js
 */

require('dotenv').config();
const { ensureBucketExists } = require('../utils/supabaseStorage');
const logger = require('../utils/logger');

async function initializeSupabase() {
  console.log('🚀 Initializing Supabase Storage...\n');

  // Check environment variables
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file');
    process.exit(1);
  }

  console.log('✅ Environment variables found');
  console.log(`   SUPABASE_URL: ${process.env.SUPABASE_URL}`);
  console.log(`   SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY.substring(0, 20)}...`);
  console.log('');

  // Ensure bucket exists
  console.log('📦 Checking/creating reports bucket...');
  const result = await ensureBucketExists();

  if (result.success) {
    console.log('✅ Supabase Storage initialized successfully!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('   1. Go to your Supabase dashboard');
    console.log('   2. Navigate to Storage > reports bucket');
    console.log('   3. Verify the bucket is set to public');
    console.log('   4. Test uploading a file using the API');
    console.log('');
  } else {
    console.error('❌ Failed to initialize Supabase Storage');
    console.error(`   Error: ${result.error}`);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('   1. Verify your Supabase credentials are correct');
    console.log('   2. Check that your Supabase project is active');
    console.log('   3. Ensure you have storage permissions in your project');
    console.log('');
    process.exit(1);
  }
}

// Run initialization
initializeSupabase()
  .then(() => {
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
