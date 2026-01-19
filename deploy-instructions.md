# Vercel Deployment Instructions

## Quick Setup

### Option 1: Via Vercel Dashboard (Easiest)
1. Go to https://vercel.com/dashboard
2. Select your project: **doozi**
3. Go to **Settings** → **Git**
4. Click **"Disconnect"** to unlink current repository
5. Click **"Connect Git Repository"**
6. Select this repository: **doozi-website**
7. Configure:
   - Framework: Next.js
   - Root Directory: ./
   - Build Command: npm run build
8. Go to **Settings** → **Environment Variables**
9. Add: `BASE_URL` = `https://doozi-app-463323.uc.r.appspot.com`
10. Click **Deploy**

### Option 2: Via Vercel CLI
1. Run: `vercel login`
2. Run: `vercel link`
   - Select: "Link to existing project"
   - Choose: "doozi"
3. Set environment variable:
   `vercel env add BASE_URL production`
   (Enter: https://doozi-app-463323.uc.r.appspot.com)
4. Deploy: `vercel --prod`

## Environment Variables Required
- `BASE_URL`: https://doozi-app-463323.uc.r.appspot.com

## Domains
Your project will be available at:
- www.doozi.app
- doozi-app.vercel.app
