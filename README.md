# NewNews (Full Stack)

An editorial-style Next.js site with a lightweight Node.js backend. Editors can log in, create or update stories, podcasts, and videos, and publish them live. Content persists in MongoDB, making the project production-ready for deployments on Vercel.

## Features

- Admin dashboard with create/edit/delete flows for multiple content types
- Password-protected login backed by environment-configurable credentials
- MongoDB persistence via Mongoose with connection pooling for serverless environments
- Media upload endpoint (writes to `public/uploads/` locally; swap in a cloud provider for production)
- Tailwind CSS styling, animated layout transitions, and a newspaper-inspired front page

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables by creating `.env.local`:

   ```bash
   MONGODB_URI="your MongoDB connection string"
   ADMIN_USERNAME="admin"              # optional override
   ADMIN_PASSWORD_HASH="bcrypt-hash"   # optional override
   ```

   > Default credentials (`admin` / `admin123`) are bundled for convenience. Set your own values before going live.

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Visit:
   - `http://localhost:3000` for the public site
   - `http://localhost:3000/admin/login` for the editor dashboard

## Project Structure

- `lib/mongodb.js` — MongoDB connection helper tuned for serverless
- `lib/models/Content.js` — Mongoose schema for articles, podcasts, and videos
- `pages/api/` — Serverless API routes (auth, content CRUD, media upload)
- `pages/admin/` — Dashboard, login, and content authoring interfaces
- `pages/` — Public pages that read data from the API
- `components/` — Shared layout elements and the rich-text editor wrapper

## Deploying to Vercel

1. Push the project to a Git provider (GitHub, GitLab, Bitbucket).
2. Create a new Vercel project and import the repository.
3. In **Project Settings → Environment Variables**, add:
   - `MONGODB_URI`
   - `ADMIN_USERNAME` (optional, defaults to `admin`)
   - `ADMIN_PASSWORD_HASH` (optional, defaults to a hash of `admin123`)
4. Redeploy the project. Serverless API routes will connect to MongoDB automatically.

### Generating a Password Hash

Run this locally and paste the output into `ADMIN_PASSWORD_HASH`:

```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
```

## Notes on File Uploads

The included `/api/upload` route stores files on the local filesystem, which is ideal for development but ephemeral on Vercel. For production, integrate Cloudinary, AWS S3, Vercel Blob, or another persistent storage provider and update the route accordingly.
