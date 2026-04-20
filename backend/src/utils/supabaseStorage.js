const { createClient } = require('@supabase/supabase-js');
const logger = require('./logger');

// Initialize Supabase client only if properly configured
let supabase = null;
const BUCKET_NAME = 'reports';

try {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && 
      process.env.SUPABASE_URL !== 'your_supabase_project_url' &&
      process.env.SUPABASE_URL !== 'https://dummy.supabase.co') {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    logger.info('Supabase client initialized successfully');
  } else {
    logger.warn('Supabase not configured - PDF storage will be disabled');
  }
} catch (error) {
  logger.error('Failed to initialize Supabase client:', error.message);
}

/**
 * Upload a PDF file to Supabase Storage
 * @param {Buffer} fileBuffer - PDF file buffer
 * @param {string} fileName - Name for the file (e.g., 'report-uuid.pdf')
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
async function uploadPDF(fileBuffer, fileName) {
  try {
    if (!supabase) {
      logger.warn('Supabase not configured - cannot upload PDF');
      return {
        success: false,
        error: 'PDF storage not configured'
      };
    }

    // Ensure fileName has .pdf extension
    if (!fileName.endsWith('.pdf')) {
      fileName = `${fileName}.pdf`;
    }

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileBuffer, {
        contentType: 'application/pdf',
        upsert: false // Don't overwrite existing files
      });

    if (error) {
      logger.error('Supabase upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    // Get public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    logger.info(`PDF uploaded successfully: ${fileName}`);

    return {
      success: true,
      url: publicUrlData.publicUrl,
      path: data.path
    };
  } catch (error) {
    logger.error('Upload PDF error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Delete a PDF file from Supabase Storage
 * @param {string} fileName - Name of the file to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function deletePDF(fileName) {
  try {
    if (!supabase) {
      logger.warn('Supabase not configured - cannot delete PDF');
      return {
        success: false,
        error: 'PDF storage not configured'
      };
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (error) {
      logger.error('Supabase delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    logger.info(`PDF deleted successfully: ${fileName}`);

    return {
      success: true
    };
  } catch (error) {
    logger.error('Delete PDF error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get public URL for an existing file
 * @param {string} fileName - Name of the file
 * @returns {string} Public URL
 */
function getPublicUrl(fileName) {
  if (!supabase) {
    logger.warn('Supabase not configured - cannot get public URL');
    return null;
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return data.publicUrl;
}

/**
 * Check if the reports bucket exists, create if it doesn't
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function ensureBucketExists() {
  try {
    if (!supabase) {
      logger.warn('Supabase not configured - cannot ensure bucket exists');
      return {
        success: false,
        error: 'PDF storage not configured'
      };
    }

    // List all buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      logger.error('Error listing buckets:', listError);
      return {
        success: false,
        error: listError.message
      };
    }

    // Check if reports bucket exists
    const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);

    if (!bucketExists) {
      // Create the bucket
      const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true, // Make files publicly accessible
        fileSizeLimit: 10485760 // 10MB limit
      });

      if (createError) {
        logger.error('Error creating bucket:', createError);
        return {
          success: false,
          error: createError.message
        };
      }

      logger.info(`Bucket '${BUCKET_NAME}' created successfully`);
    } else {
      logger.info(`Bucket '${BUCKET_NAME}' already exists`);
    }

    return {
      success: true
    };
  } catch (error) {
    logger.error('Ensure bucket exists error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  uploadPDF,
  deletePDF,
  getPublicUrl,
  ensureBucketExists
};
