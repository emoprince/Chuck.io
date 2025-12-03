<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1hg_Umvx1k7fe-V9LufEXnt9rh7XFaWjd

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages (custom domain)

This repo is set for the custom domain `chuckonbase.io` via the `public/CNAME` file.

1) Build: `npm run build`
2) Publish `dist/` to GitHub Pages (e.g., via a `gh-pages` branch, GitHub Actions, or your preferred workflow).
3) In the repo settings, enable Pages for the branch/folder you publish (commonly `gh-pages` / root).
4) Set the custom domain in Pages settings to `chuckonbase.io` (SSL will be auto-managed by GitHub).
