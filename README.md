# 🌊 ShoreSquad - Beach Cleanup Community Platform

**Rally your crew, track weather, and hit the next beach cleanup with our dope map app!**

## 📋 Quick Start

### Local Development

```bash
# Install Live Server extension in VS Code
# Right-click index.html → "Open with Live Server"
# Site runs on http://localhost:5500
```

### Features
- 🗺️ **Interactive Google Maps** - View cleanup locations with pins
- 🌤️ **Live Weather** - 4-day forecast powered by NEA (Singapore)
- 👥 **Crew Management** - Rally your friends for cleanups
- 📱 **Fully Responsive** - Works on mobile, tablet, desktop
- ♿ **Accessible** - WCAG 2.1 AA compliant
- ⚡ **Fast** - Optimized with lazy loading and caching

## 🚀 Deployment Options

### Option 1: GitHub Pages (Recommended - Free)

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/shoresquad.git
   git branch -M main
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Select "Deploy from a branch"
   - Choose "main" branch
   - Site goes live at: `https://YOUR_USERNAME.github.io/shoresquad`

3. **Custom Domain** (Optional)
   - Add CNAME file with your domain
   - Configure DNS records

---

### Option 2: Netlify (Recommended - Easy Deploys)

1. **Sign Up & Connect Repository**
   - Go to https://netlify.com
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Build command: (leave empty for static site)
   - Publish directory: `.` (root directory)
   - Node version: 18 or higher

3. **Deploy**
   - Netlify auto-deploys on every git push
   - Live URL: `https://shoresquad-xxx.netlify.app`

4. **Custom Domain**
   - Add domain in Netlify settings
   - Update DNS at your domain registrar

---

### Option 3: Vercel (Easy & Fast)

1. **Sign Up**
   - Go to https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Import Project"
   - Select your shoresquad repository
   - Settings: No build command needed

3. **Deploy**
   - Live URL: `https://shoresquad-xxx.vercel.app`
   - Auto-deploys on every push

---

### Option 4: Traditional Hosting (Bluehost, Hostinger, etc.)

1. **Purchase Hosting Plan**
   - Look for "Static Hosting" or basic web hosting
   - Cost: ~$2-5/month

2. **Upload Files via FTP**
   - Download FileZilla or use cPanel File Manager
   - Upload `index.html`, `css/`, `js/`, `assets/` to `public_html/`

3. **Access Your Site**
   - Domain: `https://yourdomain.com`

---

### Option 5: Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase**
   ```bash
   firebase init hosting
   # Select your Firebase project
   # Public directory: . (current directory)
   # Configure as single-page app: N
   ```

3. **Deploy**
   ```bash
   firebase deploy
   ```
   Live at: `https://yourproject.web.app`

---

## 📊 Deployment Comparison

| Platform | Cost | Setup Time | Custom Domain | Auto Deploy | Best For |
|----------|------|-----------|---|---|---|
| **GitHub Pages** | Free | 5 min | Yes | Yes | Quick personal projects |
| **Netlify** | Free/Paid | 3 min | Yes | Yes | Production apps |
| **Vercel** | Free/Paid | 3 min | Yes | Yes | High performance |
| **Firebase** | Free/Paid | 5 min | Yes | Yes | Google ecosystem |
| **Traditional** | $2-5/mo | 15 min | Yes | No | Legacy hosting |

---

## 🔐 Environment & Security

### Live Server Rate Limits
- NEA Weather API: Free tier with request limits
- No API keys exposed in code
- All data from government endpoints

### Before Going Live
1. ✅ Test on mobile devices
2. ✅ Check weather API responses
3. ✅ Verify Google Maps loads correctly
4. ✅ Test accessibility with screen readers
5. ✅ Run Lighthouse audit

---

## 🏃 Performance

- **Lighthouse Score**: 90+ (aim for green)
- **Core Web Vitals**: All optimized
- **Cache**: 1-hour weather data caching
- **Lazy Loading**: Images load on-demand
- **Minification**: Ready for production

---

## 📱 Browser Support

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🛠️ Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern layouts (Grid, Flexbox)
- **Vanilla JavaScript** - No frameworks needed
- **APIs Used**:
  - Google Maps Embed
  - NEA 4-Day Weather Forecast
- **Hosting**: Static site (no backend required)

---

## 📝 Project Structure

```
shoresquad/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styling
├── js/
│   └── app.js          # All JavaScript
├── assets/             # Images, icons, etc.
├── .gitignore          # Git ignore rules
├── .liveserverrc       # Live Server config
└── README.md           # This file
```

---

## 🤝 Contributing

Fork this project and submit a pull request!

---

## 📄 License

MIT License - Free for personal and commercial use

---

## 📞 Support

- Check the docs at https://data.gov.sg for weather API
- Google Maps documentation: https://developers.google.com/maps
- Issues? Create a GitHub issue!

---

**Made with 🌊 for beach cleanup heroes!**
