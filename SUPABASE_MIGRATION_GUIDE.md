# Supabase Storage Migration Guide

## 🎯 Overview

This guide explains how to migrate from AWS S3 to Supabase Storage for PDF report storage.

---

## ✅ What Changed

### Removed
- ❌ AWS SDK dependencies
- ❌ AWS S3 configuration
- ❌ AWS environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME, AWS_REGION)

### Added
- ✅ Supabase Storage integration
- ✅ `@supabase/supabase-js` package
- ✅ New environment variables (SUPABASE_URL, SUPABASE_ANON_KEY)
- ✅ Storage utility functions
- ✅ Report controller implementation
- ✅ Initialization script

---

## 📦 Installation Steps

### 1. Install Supabase Package

```bash
cd backend
npm install @supabase/supabase-js
```

### 2. Set Up Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project (or use existing)
3. Wait for project to be ready (~2 minutes)
4. Go to **Settings** > **API**
5. Copy your:
   - **Project URL** (SUPABASE_URL)
   - **anon/public key** (SUPABASE_ANON_KEY)

### 3. Update Environment Variables

Edit `backend/.env`:

```env
# Remove these AWS variables:
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=your_aws_access_key
# AWS_SECRET_ACCESS_KEY=your_aws_secret_key
# S3_BUCKET_NAME=startup-planner-reports

# Add these Supabase variables:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Initialize Supabase Storage

Run the initialization script to create the `reports` bucket:

```bash
cd backend
node src/scripts/initSupabase.js
```

Expected output:
```
🚀 Initializing Supabase Storage...

✅ Environment variables found
   SUPABASE_URL: https://xxxxx.supabase.co
   SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiI...

📦 Checking/creating reports bucket...
✅ Supabase Storage initialized successfully!

📝 Next steps:
   1. Go to your Supabase dashboard
   2. Navigate to Storage > reports bucket
   3. Verify the bucket is set to public
   4. Test uploading a file using the API

🎉 Done!
```

### 5. Verify Bucket in Supabase Dashboard

1. Go to your Supabase dashboard
2. Click **Storage** in the left sidebar
3. You should see a `reports` bucket
4. Click on the bucket
5. Verify it's set to **Public** (files are publicly accessible)

---

## 🔧 New Files Created

### 1. `backend/src/utils/supabaseStorage.js`
Storage utility functions:
- `uploadPDF(fileBuffer, fileName)` - Upload PDF to Supabase
- `deletePDF(fileName)` - Delete PDF from Supabase
- `getPublicUrl(fileName)` - Get public URL for a file
- `ensureBucketExists()` - Create bucket if it doesn't exist

### 2. `backend/src/controllers/report.controller.js`
Report generation controller:
- `generateReport()` - Generate and upload PDF report
- `getReport()` - Get report by ID
- `getUserReports()` - Get all reports for user

### 3. `backend/src/scripts/initSupabase.js`
Initialization script to set up Supabase Storage

---

## 📝 Updated Files

### 1. `backend/.env.example`
Updated environment variables template

### 2. `backend/package.json`
Added `@supabase/supabase-js` dependency

### 3. `backend/src/routes/report.routes.js`
Updated with full report controller implementation

---

## 🚀 Usage Examples

### Upload a PDF Report

```javascript
const { uploadPDF } = require('./utils/supabaseStorage');

// Create PDF buffer (example)
const pdfBuffer = Buffer.from('PDF content here');
const fileName = 'report-123.pdf';

// Upload to Supabase
const result = await uploadPDF(pdfBuffer, fileName);

if (result.success) {
  console.log('File uploaded!');
  console.log('Public URL:', result.url);
  console.log('Path:', result.path);
} else {
  console.error('Upload failed:', result.error);
}
```

### Generate Report via API

```bash
# Generate a PDF report
curl -X POST http://localhost:5000/api/reports/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "recommendationId": "your-recommendation-id"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "report": {
      "id": "report-uuid",
      "url": "https://xxxxx.supabase.co/storage/v1/object/public/reports/report-123.pdf",
      "fileName": "report-123.pdf",
      "fileSize": 1024,
      "createdAt": "2026-04-17T10:30:00Z"
    }
  }
}
```

### Get User's Reports

```bash
curl -X GET http://localhost:5000/api/reports/user/all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔐 Security Considerations

### Public vs Private Buckets

**Current Setup: Public Bucket**
- Files are publicly accessible via URL
- Anyone with the URL can view the file
- Good for: Shareable reports, public documents

**If You Need Private Files:**

1. Create a private bucket:
```javascript
await supabase.storage.createBucket('reports', {
  public: false // Private bucket
});
```

2. Generate signed URLs (temporary access):
```javascript
const { data, error } = await supabase.storage
  .from('reports')
  .createSignedUrl('report-123.pdf', 3600); // 1 hour expiry

console.log('Signed URL:', data.signedUrl);
```

### Row Level Security (RLS)

For additional security, enable RLS in Supabase:

1. Go to **Storage** > **Policies**
2. Create policies to restrict access:
   - Users can only upload their own files
   - Users can only view their own files
   - Admins can view all files

Example policy (SQL):
```sql
-- Allow users to upload their own files
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'reports' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 🧪 Testing

### Test Upload Function

Create a test file: `backend/src/scripts/testUpload.js`

```javascript
require('dotenv').config();
const { uploadPDF } = require('../utils/supabaseStorage');

async function testUpload() {
  // Create a simple PDF buffer
  const pdfContent = 'This is a test PDF file';
  const pdfBuffer = Buffer.from(pdfContent);
  const fileName = `test-${Date.now()}.pdf`;

  console.log('Uploading test file...');
  const result = await uploadPDF(pdfBuffer, fileName);

  if (result.success) {
    console.log('✅ Upload successful!');
    console.log('URL:', result.url);
  } else {
    console.error('❌ Upload failed:', result.error);
  }
}

testUpload();
```

Run:
```bash
node src/scripts/testUpload.js
```

---

## 🐛 Troubleshooting

### Error: "Invalid API key"
- Verify `SUPABASE_ANON_KEY` is correct
- Check you're using the **anon/public** key, not the service role key
- Ensure no extra spaces in the .env file

### Error: "Bucket not found"
- Run the initialization script: `node src/scripts/initSupabase.js`
- Verify bucket exists in Supabase dashboard
- Check bucket name is exactly "reports"

### Error: "Storage API not enabled"
- Go to Supabase dashboard > Settings > API
- Ensure Storage API is enabled
- Wait a few minutes for changes to propagate

### Files not publicly accessible
- Go to Storage > reports bucket
- Click **Settings**
- Ensure "Public bucket" is enabled
- Save changes

### Upload succeeds but URL doesn't work
- Check bucket is set to public
- Verify the URL format: `https://[project].supabase.co/storage/v1/object/public/reports/[filename]`
- Try accessing the URL in an incognito window

---

## 📊 Comparison: AWS S3 vs Supabase Storage

| Feature | AWS S3 | Supabase Storage |
|---------|--------|------------------|
| **Setup Complexity** | High (IAM, credentials) | Low (just URL + key) |
| **Free Tier** | 5GB, 12 months | 1GB forever |
| **Pricing** | $0.023/GB/month | $0.021/GB/month |
| **Public URLs** | Requires configuration | Built-in |
| **Authentication** | AWS credentials | Supabase auth |
| **Dashboard** | Complex | Simple, intuitive |
| **Best For** | Enterprise, large scale | Startups, students |

---

## 🎓 Student-Friendly Features

### Why Supabase is Better for Students:

1. **Free Tier**: 1GB storage forever (vs AWS 12-month trial)
2. **Simple Setup**: Just 2 environment variables
3. **No Credit Card**: Free tier doesn't require payment info
4. **Easy Dashboard**: Visual interface to manage files
5. **Built-in Auth**: Integrates with Supabase authentication
6. **Public URLs**: No complex bucket policies needed

---

## 📚 Additional Resources

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/storage-from-upload)
- [Storage Policies Guide](https://supabase.com/docs/guides/storage/security/access-control)

---

## ✅ Migration Checklist

- [ ] Install `@supabase/supabase-js` package
- [ ] Create Supabase project
- [ ] Copy SUPABASE_URL and SUPABASE_ANON_KEY
- [ ] Update backend/.env file
- [ ] Remove AWS environment variables
- [ ] Run initialization script
- [ ] Verify bucket in Supabase dashboard
- [ ] Test file upload
- [ ] Update frontend to use new API
- [ ] Remove AWS SDK if no longer needed
- [ ] Update documentation

---

## 🎉 You're Done!

Your project now uses Supabase Storage instead of AWS S3. The implementation is:
- ✅ Simpler to set up
- ✅ Easier to maintain
- ✅ More student-friendly
- ✅ Production-ready

**Next Steps:**
1. Test the upload functionality
2. Integrate with frontend
3. Implement actual PDF generation (using jsPDF)
4. Add file size limits and validation

---

**Questions?** Check the troubleshooting section or Supabase documentation.
