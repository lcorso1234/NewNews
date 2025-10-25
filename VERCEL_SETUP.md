# Vercel Deployment Setup Guide

## Environment Variables Required

Your application needs the following environment variable to be set in Vercel for the backend to work properly:

### MONGODB_URI

This is your MongoDB connection string. It should be added to your Vercel project's environment variables.

**Steps to add environment variables in Vercel:**

1. Go to your Vercel project dashboard
2. Click on **Settings**
3. Navigate to **Environment Variables** in the left sidebar
4. Add the following variable:
   - **Name**: `MONGODB_URI`
   - **Value**: Your MongoDB connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`)
   - **Environments**: Select all (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your application for the changes to take effect

## Common Issues and Solutions

### Issue: "Error creating content"

**Possible Causes:**

1. **Missing MONGODB_URI**: The environment variable is not set in Vercel
2. **Invalid MongoDB connection string**: The connection string is incorrect or the database is unreachable
3. **Network issues**: MongoDB Atlas may not be allowing connections from Vercel's IP addresses
4. **Validation errors**: Required fields are missing or data doesn't match the schema

**Solutions:**

1. **Check Environment Variables:**

   - Ensure `MONGODB_URI` is set in Vercel's Environment Variables settings
   - After adding or updating, trigger a new deployment

2. **Verify MongoDB Atlas Network Access:**

   - Go to MongoDB Atlas dashboard
   - Navigate to Network Access
   - Add `0.0.0.0/0` to allow all IP addresses (for serverless functions)
   - Or add Vercel's IP ranges specifically

3. **Check MongoDB Connection String:**

   - Ensure username and password are URL-encoded
   - Verify the cluster name and database name are correct
   - Test the connection string locally first

4. **Check Vercel Logs:**

   - Go to your Vercel project
   - Click on **Deployments**
   - Select the latest deployment
   - Click on **Functions** tab
   - Check the logs for detailed error messages

5. **Check Browser Console:**
   - Open browser developer tools (F12)
   - Go to the Console tab
   - The improved error handling will now show detailed error messages including validation errors

## Database Schema

The Content model requires the following fields:

### Required for all types:

- `type`: "blog", "podcast", or "video"
- `title`: String
- `description`: String
- `slug`: String (must be unique)

### Type-specific required fields:

- **Blog**: `content` (string)
- **Podcast**: `audioUrl` (string)
- **Video**: `videoUrl` (string)

### Optional fields:

- `imageUrl`: String
- `author`: String (defaults to "Admin")
- `published`: Boolean (defaults to false)
- `publishedAt`: Date
- `createdAt`: Date (auto-generated)
- `updatedAt`: Date (auto-generated)

## Testing the Deployment

After setting up environment variables and redeploying:

1. Try creating a new piece of content
2. If you get an error, check:
   - Browser console for detailed error messages
   - Vercel function logs for server-side errors
   - MongoDB Atlas monitoring for connection issues

## Debugging Steps

1. **Enable detailed logging:**

   - The updated API now logs errors to the console
   - Check Vercel function logs for these error messages

2. **Test locally first:**

   - Ensure your `.env.local` file has `MONGODB_URI`
   - Run `npm run dev` and test creating content locally
   - If it works locally but not on Vercel, it's likely an environment variable issue

3. **Verify MongoDB connection:**
   - Use MongoDB Compass or mongosh to test your connection string
   - Ensure your IP address is whitelisted in MongoDB Atlas

## Support

If you continue to experience issues after following this guide:

1. Check the error message displayed in the alert box
2. Look at the browser console for detailed error information
3. Review Vercel function logs for server-side errors
4. Verify all environment variables are correctly set
