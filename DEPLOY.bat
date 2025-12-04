@echo off
REM ShoreSquad - Deployment Guide for Windows
setlocal enabledelayedexpansion

:menu
cls
echo.
echo ╔════════════════════════════════════════╗
echo ║  🌊 ShoreSquad - Deployment Guide     ║
echo ╚════════════════════════════════════════╝
echo.
echo Choose your deployment option:
echo.
echo [1] Netlify (RECOMMENDED - Easiest Setup)
echo [2] GitHub Pages (FREE - Simple)
echo [3] Vercel (Fast CDN)
echo [4] Firebase Hosting
echo [5] First Time: Push to GitHub
echo [0] Exit
echo.
set /p choice="Enter number (0-5): "

if "%choice%"=="1" goto netlify
if "%choice%"=="2" goto github_pages
if "%choice%"=="3" goto vercel
if "%choice%"=="4" goto firebase
if "%choice%"=="5" goto github_push
if "%choice%"=="0" goto end
goto menu

:netlify
cls
echo.
echo 🚀 NETLIFY DEPLOYMENT (3 Minutes)
echo ═════════════════════════════════════════
echo.
echo STEP 1: Go to https://netlify.com
echo STEP 2: Click "Sign up" or "Login"
echo STEP 3: Click "New site from Git"
echo STEP 4: Connect with GitHub
echo STEP 5: Select "shoresquad" repository
echo STEP 6: Leave build settings empty
echo STEP 7: Click "Deploy site"
echo.
echo ✅ Your site will be LIVE in 1-2 minutes!
echo.
echo Your URL will look like:
echo   https://shoresquad-xxx.netlify.app
echo.
echo 💡 To add a custom domain:
echo   Go to Site settings → Domain management
echo.
pause
goto menu

:github_pages
cls
echo.
echo 🐙 GITHUB PAGES DEPLOYMENT (Free)
echo ═════════════════════════════════════════
echo.
echo STEP 1: Go to your GitHub repository
echo STEP 2: Click "Settings"
echo STEP 3: Click "Pages" (left sidebar)
echo STEP 4: Under "Build and deployment"
echo STEP 5: Select "Deploy from a branch"
echo STEP 6: Choose "main" branch
echo STEP 7: Click "Save"
echo.
echo ✅ Your site will be LIVE in 1-2 minutes!
echo.
echo Your URL will be:
echo   https://YOUR_USERNAME.github.io/shoresquad
echo.
pause
goto menu

:vercel
cls
echo.
echo ⚡ VERCEL DEPLOYMENT (Fast)
echo ═════════════════════════════════════════
echo.
echo STEP 1: Go to https://vercel.com
echo STEP 2: Click "Sign up"
echo STEP 3: Choose "Continue with GitHub"
echo STEP 4: Click "Import Project"
echo STEP 5: Select "shoresquad" repository
echo STEP 6: Click "Deploy"
echo.
echo ✅ Your site will be LIVE in 1-2 minutes!
echo.
echo Your URL will look like:
echo   https://shoresquad-xxx.vercel.app
echo.
echo 💡 Vercel is SUPER FAST due to CDN
echo.
pause
goto menu

:firebase
cls
echo.
echo 🔥 FIREBASE HOSTING DEPLOYMENT
echo ═════════════════════════════════════════
echo.
echo STEP 1: Go to https://console.firebase.google.com
echo STEP 2: Create a new project
echo STEP 3: Open PowerShell/CMD in your project folder
echo.
echo STEP 4: Run these commands:
echo   npm install -g firebase-tools
echo   firebase login
echo   firebase init hosting
echo   firebase deploy
echo.
echo When prompted:
echo   - Select your Firebase project
echo   - Public directory: . (current directory)
echo   - Single page app: N
echo   - Overwrite: N
echo.
echo ✅ Your site will be LIVE!
echo.
echo Your URL will be:
echo   https://yourproject.web.app
echo.
pause
goto menu

:github_push
cls
echo.
echo 📤 FIRST TIME: PUSH TO GITHUB
echo ═════════════════════════════════════════
echo.
echo STEP 1: Create a GitHub account
echo   Go to https://github.com
echo.
echo STEP 2: Create a new repository called "shoresquad"
echo   Click "+" → New repository
echo.
echo STEP 3: Open PowerShell in ShoreSquad folder
echo.
echo STEP 4: Run these commands:
echo.
echo   git remote add origin https://github.com/YOUR_USERNAME/shoresquad.git
echo   git branch -M main
echo   git push -u origin main
echo.
echo Replace YOUR_USERNAME with your actual GitHub username!
echo.
echo STEP 5: When done, come back and choose Netlify, GitHub Pages, or Vercel!
echo.
pause
goto menu

:end
cls
echo.
echo 👋 Good luck with ShoreSquad!
echo.
echo 🌊 Questions? Check DEPLOYMENT.md or README.md
echo.
pause
