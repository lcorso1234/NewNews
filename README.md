# News Site with Custom Backend

A Next.js application with a custom backend for uploading and editing content.

## Features

- Content management system for blog posts, podcasts, and videos
- Admin dashboard for creating and editing content
- File upload support for images, audio, and video
- Authentication system
- MongoDB database integration

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up MongoDB:

   - Install MongoDB locally or use a cloud service like MongoDB Atlas
   - Update `MONGODB_URI` in `.env.local`

3. Configure environment variables:

   - Copy `.env.local` and update the values
   - Generate a hashed password for admin:
     ```bash
     node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
     ```
   - Update `ADMIN_PASSWORD` with the hashed value

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Access the admin panel at `/admin/login`

## API Endpoints

- `GET/POST /api/content` - List and create content
- `GET/PUT/DELETE /api/content/[id]` - Get, update, delete specific content
- `POST /api/upload` - Upload files
- `/api/auth/[...nextauth]` - Authentication

## Usage

1. Log in to the admin panel
2. Create new content using the form
3. Upload images or media files
4. Publish content to make it visible on the site
5. Edit or delete existing content as needed

## Content Types

- **Blog**: Text content with optional images
- **Podcast**: Audio files with descriptions
- **Video**: Video files with descriptions

- `package.json` — scripts and dependencies
- `pages/_app.js` — imports global styles
- `pages/index.js` — example page
- `styles/globals.css` — Tailwind directives
- `tailwind.config.js` — Tailwind config
- `postcss.config.js` — PostCSS config

Edit `pages/index.js` to start developing.
