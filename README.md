This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## GitHub Actions + Vercel

This repo includes a workflow at `.github/workflows/vercel.yml` that:

- Runs `npm ci` and `npm run build` on pushes and pull requests to `main`
- Creates a Vercel Preview deployment for pull requests
- Creates a Vercel Production deployment for pushes to `main`

### Required GitHub Secrets

Add these repository secrets in GitHub: `Settings -> Secrets and variables -> Actions`:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### How to get Vercel values

1. Install and login to Vercel CLI:
   - `npm i -g vercel`
   - `vercel login`
2. Link this project:
   - `vercel link`
3. Open `.vercel/project.json` and copy:
   - `orgId` -> `VERCEL_ORG_ID`
   - `projectId` -> `VERCEL_PROJECT_ID`
4. Create `VERCEL_TOKEN` from Vercel dashboard:
   - `https://vercel.com/account/tokens`

### Important

Your runtime app environment variables (from `.env.local`) should be added in Vercel Project Settings (`Settings -> Environment Variables`), not in GitHub Actions secrets.
