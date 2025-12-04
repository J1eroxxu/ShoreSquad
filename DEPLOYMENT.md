# 🚀 DEPLOYMENT GUIDE - Quick Reference

## ⚡ Fastest Way (Netlify - 3 minutes)

### Step 1: Create GitHub Account
1. Go to https://github.com
2. Sign up (if not already done)

### Step 2: Push Your Code to GitHub
```bash
# In terminal/PowerShell:
git remote add origin https://github.com/YOUR_USERNAME/shoresquad.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Netlify
1. Go to https://netlify.com
2. Click "Sign up" → Connect with GitHub
3. Click "New site from Git"
4. Select your `shoresquad` repository
5. Leave build settings as default (no build command)
6. Click "Deploy site"
7. **✅ Live in 1 minute!** Check the URL provided

---

## 🐙 GitHub Pages (Also Free)

1. **Enable GitHub Pages**
   - Go to your repository on GitHub.com
   - Settings → Pages
   - Select "main" branch
   - Click Save
   - **✅ Live at:** `https://YOUR_USERNAME.github.io/shoresquad`

---

## ☁️ Vercel (Fast CDN)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Import Project"
4. Select `shoresquad` repository
5. Click "Deploy"
6. **✅ Live URL:** `https://shoresquad-xxx.vercel.app`

---

## 🔥 Firebase Hosting

```bash
# Install Firebase
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting
# Choose your Firebase project
# Publish directory: . (current)
# Single page app: N

# Deploy
firebase deploy

# ✅ Live at: https://yourproject.web.app
```

---

## 📋 Testing Checklist Before Going Live

- [ ] Test on mobile phone
- [ ] Click "Get Forecast" - verify weather loads
- [ ] Check Google Maps displays correctly
- [ ] Test all buttons and links
- [ ] Verify no console errors (F12 → Console)
- [ ] Run Lighthouse audit (F12 → Lighthouse)

---

## 💬 Troubleshooting

**Weather not loading?**
- Check internet connection
- Verify NEA API is accessible: `https://api.data.gov.sg/v1/environment/4-day-weather-forecast`
- Check browser console for errors (F12)

**Map not showing?**
- Verify Google Maps iframe is loading
- Check for mixed content warnings

**Site not deploying?**
- Ensure .gitignore is correct
- Verify all files are committed: `git status`
- Check deployment logs on platform

---

## 📊 Recommended: Netlify

✅ Easiest setup  
✅ Automatic deploys on every push  
✅ Free SSL certificate  
✅ Great performance  
✅ Easy custom domain  
✅ Excellent documentation

---

**Your site will be LIVE in minutes! 🎉**
