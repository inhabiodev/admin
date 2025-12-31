# DigitalOcean Spaces Setup Guide

This application now uses DigitalOcean Spaces for file storage instead of local uploads folder.

## Prerequisites

- A DigitalOcean account
- Access to create Spaces and API keys

## Step 1: Create a DigitalOcean Space

1. Log in to your DigitalOcean account
2. Navigate to **Spaces** in the left sidebar
3. Click **Create a Space**
4. Choose a datacenter region (e.g., `nyc3`, `sfo3`, `ams3`)
5. Enable **CDN** (optional but recommended for better performance)
6. Choose a unique name for your Space (e.g., `my-blog-storage`)
7. Select **Public** or **Private** file listing (choose Public for easier access)
8. Click **Create Space**

## Step 2: Generate Spaces Access Keys

1. Navigate to **API** in the left sidebar
2. Scroll down to **Spaces access keys**
3. Click **Generate New Key**
4. Give it a name (e.g., `blog-api-key`)
5. **Important:** Copy both the **Access Key** and **Secret Key** immediately (the secret key won't be shown again)

## Step 3: Configure Environment Variables

1. Open your `.env` file in the project root
2. Add the following variables with your actual credentials:

```env
# DigitalOcean Spaces Configuration
DO_SPACES_ENDPOINT=nyc3.digitaloceanspaces.com
DO_SPACES_KEY=your_spaces_access_key_here
DO_SPACES_SECRET=your_spaces_secret_key_here
DO_SPACES_BUCKET=your_bucket_name_here
DO_SPACES_REGION=nyc3
```

### Important Notes:

- **DO_SPACES_ENDPOINT**: Replace `nyc3` with your chosen region (e.g., `sfo3.digitaloceanspaces.com`)
- **DO_SPACES_KEY**: Your Spaces access key from Step 2
- **DO_SPACES_SECRET**: Your Spaces secret key from Step 2
- **DO_SPACES_BUCKET**: The name of your Space (e.g., `my-blog-storage`)
- **DO_SPACES_REGION**: The region code (e.g., `nyc3`, `sfo3`, `ams3`)

## Step 4: Set File Permissions (Optional)

If you created a Private Space, you may need to configure CORS settings:

1. Go to your Space in the DigitalOcean dashboard
2. Click on **Settings**
3. Scroll to **CORS Configurations**
4. Add a CORS rule:
   - **Origin**: `*` (or your specific domain)
   - **Allowed Methods**: GET, PUT, POST, DELETE, HEAD
   - **Allowed Headers**: `*`

## Step 5: Test the Configuration

1. Restart your server:
```bash
npm start
```

2. Try uploading a blog post with an image through your admin panel

3. Verify the file appears in your DigitalOcean Space:
   - Go to your Space in the dashboard
   - Check the `blog-images/` folder
   - Files should be named like: `blog-1234567890-987654321.jpg`

## File URLs

After uploading, files will be accessible via URLs like:
- **Without CDN**: `https://your-bucket-name.nyc3.digitaloceanspaces.com/blog-images/blog-123456.jpg`
- **With CDN**: `https://your-bucket-name.nyc3.cdn.digitaloceanspaces.com/blog-images/blog-123456.jpg`

The application automatically stores the full URL in the database.

## Migration from Local Uploads

If you have existing files in the local `uploads/` folder that you want to migrate to Spaces:

1. Use the DigitalOcean Spaces web interface to manually upload existing files
2. Update the database records to point to the new URLs
3. You can use a migration script or manually update the `image` field in your MongoDB documents

## Troubleshooting

### "Access Denied" errors
- Verify your access keys are correct in `.env`
- Check that the Space name matches exactly
- Ensure the endpoint region matches your Space's region

### Files not appearing
- Check the Space's file listing settings (Public vs Private)
- Verify CORS settings if accessing from a web browser
- Check server logs for detailed error messages

### "Invalid region" errors
- Make sure `DO_SPACES_REGION` matches your Space's region
- Common regions: `nyc3`, `sfo3`, `ams3`, `sgp1`, `fra1`

## Cost Considerations

DigitalOcean Spaces pricing (as of 2024):
- $5/month for 250 GB storage
- 1 TB outbound transfer included
- $0.01 per GB over the included transfer

## Security Best Practices

1. Never commit your `.env` file to version control
2. Use separate Spaces for development and production
3. Rotate your access keys periodically
4. Use restricted access keys with minimal permissions if possible
5. Enable CDN for better performance and reduced costs
