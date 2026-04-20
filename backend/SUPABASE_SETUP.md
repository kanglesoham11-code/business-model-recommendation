# Quick Supabase Setup Guide

## 🚀 5-Minute Setup

### Step 1: Install Package
```bash
cd backend
npm install @supabase/supabase-js
```

### Step 2: Get Supabase Credentials

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: startup-planner
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you
5. Click **"Create new project"**
6. Wait ~2 minutes for setup
7. Go to **Settings** > **API**
8. Copy:
   - **Project URL** → This is your `SUPABASE_URL`
   - **anon public** key → This is your `SUPABASE_ANON_KEY`

### Step 3: Update .env File

Edit `backend/.env`:

```env
# Supabase Storage
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```

### Step 4: Initialize Storage

```bash
node src/scripts/initSupabase.js
```

You should see:
```
✅ Supabase Storage initialized successfully!
```

### Step 5: Verify in Dashboard

1. Go to your Supabase dashboard
2. Click **Storage** (left sidebar)
3. You should see a **reports** bucket
4. Click on it to verify it's public

## ✅ Done!

Your Supabase Storage is ready to use!

## 🧪 Test It

```bash
# Create a test file
echo "Test PDF content" > test.pdf

# Test upload (you'll need to create a test script or use the API)
curl -X POST http://localhost:5000/api/reports/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"recommendationId": "test-id"}'
```

## 📝 Environment Variables

```env
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Optional (if you want to use service role key for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 🔑 Key Differences from AWS S3

| AWS S3 | Supabase Storage |
|--------|------------------|
| AWS_ACCESS_KEY_ID | SUPABASE_URL |
| AWS_SECRET_ACCESS_KEY | SUPABASE_ANON_KEY |
| S3_BUCKET_NAME | Hardcoded: "reports" |
| AWS_REGION | Not needed |

## 💡 Tips

- **Free Tier**: 1GB storage (plenty for PDFs)
- **Public URLs**: Automatically generated
- **No Credit Card**: Required for free tier
- **Dashboard**: Easy file management

## 🆘 Common Issues

**"Invalid API key"**
- Make sure you copied the **anon/public** key, not service role key

**"Bucket not found"**
- Run the init script: `node src/scripts/initSupabase.js`

**"Storage API not enabled"**
- Wait a few minutes after project creation
- Check Settings > API in dashboard

## 📚 Learn More

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [JavaScript Client Reference](https://supabase.com/docs/reference/javascript/storage-from-upload)
