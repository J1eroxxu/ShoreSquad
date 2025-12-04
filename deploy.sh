#!/bin/bash
# ShoreSquad - One-Click Deployment Scripts

# =========================================
# OPTION 1: NETLIFY (Recommended)
# =========================================
deploy_netlify() {
    echo "🚀 Deploying to Netlify..."
    echo ""
    echo "Steps:"
    echo "1. Go to https://netlify.com"
    echo "2. Sign up / Login with GitHub"
    echo "3. Click 'New site from Git'"
    echo "4. Connect your GitHub account"
    echo "5. Select 'shoresquad' repository"
    echo "6. Leave build settings empty"
    echo "7. Click 'Deploy site'"
    echo ""
    echo "✅ Your site will be live in 1-2 minutes!"
    echo "📍 URL format: https://shoresquad-xxx.netlify.app"
}

# =========================================
# OPTION 2: GITHUB PAGES (Free & Simple)
# =========================================
deploy_github_pages() {
    echo "🐙 Deploying to GitHub Pages..."
    echo ""
    echo "Steps:"
    echo "1. Go to your repository on GitHub.com"
    echo "2. Click Settings → Pages"
    echo "3. Under 'Build and deployment'"
    echo "4. Select 'Deploy from a branch'"
    echo "5. Choose 'main' branch"
    echo "6. Click Save"
    echo ""
    echo "✅ Your site will be live in 1-2 minutes!"
    echo "📍 URL: https://YOUR_USERNAME.github.io/shoresquad"
}

# =========================================
# OPTION 3: VERCEL (Fast CDN)
# =========================================
deploy_vercel() {
    echo "⚡ Deploying to Vercel..."
    echo ""
    echo "Steps:"
    echo "1. Go to https://vercel.com"
    echo "2. Click 'Sign Up' → GitHub"
    echo "3. Click 'Import Project'"
    echo "4. Select 'shoresquad' repo"
    echo "5. Click 'Deploy'"
    echo ""
    echo "✅ Your site will be live in 1-2 minutes!"
    echo "📍 URL format: https://shoresquad-xxx.vercel.app"
}

# =========================================
# OPTION 4: FIREBASE HOSTING
# =========================================
deploy_firebase() {
    echo "🔥 Deploying to Firebase..."
    echo ""
    echo "Commands to run:"
    echo ""
    echo "npm install -g firebase-tools"
    echo "firebase login"
    echo "firebase init hosting"
    echo "firebase deploy"
    echo ""
    echo "✅ Your site will be live!"
    echo "📍 URL format: https://yourproject.web.app"
}

# =========================================
# FIRST TIME: PUSH TO GITHUB
# =========================================
push_to_github() {
    echo "📤 Pushing code to GitHub..."
    echo ""
    echo "Run these commands:"
    echo ""
    echo "git remote add origin https://github.com/YOUR_USERNAME/shoresquad.git"
    echo "git branch -M main"
    echo "git push -u origin main"
    echo ""
    echo "Then choose your hosting platform above!"
}

# =========================================
# MAIN MENU
# =========================================
echo ""
echo "╔════════════════════════════════════════╗"
echo "║  🌊 ShoreSquad - Deployment Helper    ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "Choose deployment option:"
echo ""
echo "[1] Netlify (Recommended - Easiest)"
echo "[2] GitHub Pages (Free - Simple)"
echo "[3] Vercel (Fast CDN)"
echo "[4] Firebase Hosting"
echo "[5] First: Push code to GitHub"
echo ""
echo "Enter number (1-5):"
read -r choice

case $choice in
    1) deploy_netlify ;;
    2) deploy_github_pages ;;
    3) deploy_vercel ;;
    4) deploy_firebase ;;
    5) push_to_github ;;
    *) echo "Invalid option" ;;
esac
