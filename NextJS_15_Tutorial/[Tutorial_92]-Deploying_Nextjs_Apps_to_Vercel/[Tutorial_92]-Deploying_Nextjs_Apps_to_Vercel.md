## Deploying Next.js Apps to Vercel

Vercel, created by the Next.js team, provides seamless deployment for Next.js applications. This guide covers deploying with GitHub and Vercel.

### Prerequisites

- A Next.js application pushed to a GitHub repository
- A Vercel account (sign up at vercel.com)

### Step 1: Push Code to GitHub

Ensure your code is committed and pushed to a GitHub repository:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Import Project to Vercel

1. Log in to [vercel.com](https://vercel.com) using your GitHub account.
2. Click **Add New > Project**.
3. Install the Vercel GitHub app if prompted.
4. Select your GitHub account and find your repository.
5. Click **Import**.

### Step 3: Configure Project

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Root Directory | Select the project folder (e.g., `authentication-demo`) |
| Build Command | `next build` (auto-detected) |
| Output Directory | `.next` (auto-detected) |

### Step 4: Add Environment Variables

Expand the **Environment Variables** section and add the variables from your project's `.env.local`:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_xxxxxxxxxx` |
| `CLERK_SECRET_KEY` | `sk_test_xxxxxxxxxx` |
| (other Clerk variables) | (corresponding values) |

Vercel automatically suggests environment variable names based on your repository.

### Step 5: Deploy

Click **Deploy**. Vercel will build and deploy your application. The process typically takes 1-2 minutes.

### Post-Deployment

After deployment completes, you will receive a preview URL:

```
https://nextjs-15-tutorial.vercel.app
```

### Custom Domain

To use a custom domain:

1. Go to your project in the Vercel Dashboard.
2. Navigate to **Settings > Domains**.
3. Add your domain and follow the DNS configuration instructions.

### Production Checklist

- [ ] Environment variables are configured in Vercel
- [ ] Clerk application is configured with the production URL
- [ ] Database (if any) is accessible from Vercel's network
- [ ] API rate limits are sufficient for production traffic
- [ ] Error monitoring is set up (e.g., Sentry)

### Updating Deployments

Vercel automatically deploys when changes are pushed to the connected branch:

```bash
git push origin main
```

Each push triggers a new deployment with preview URLs for pull requests.

### Deployment Diagram

```
GitHub Repository
     |
     v
Vercel Import + Configure
     |
     v
Build (next build) + Environment Variables
     |
     v
Deploy to Vercel Edge Network
     |
     v
Production URL: https://your-app.vercel.app
```
