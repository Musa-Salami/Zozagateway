# 🔥 Deploy Zoza Gateway Snacks to Firebase Hosting

## Prerequisites
1. Node.js installed (v18 or higher)
2. Google account
3. Firebase project created

## Step-by-Step Deployment Guide

### 1. Install Firebase CLI
Open PowerShell or Command Prompt and run:
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```
This will open your browser. Sign in with your Google account.

### 3. Initialize Firebase in Your Project
Navigate to your app folder:
```bash
cd "d:\VC_testing_project\Zozagateway\app"
```

Initialize Firebase:
```bash
firebase init hosting
```

When prompted:
- **"Are you ready to proceed?"** → Press Y
- **"What do you want to use as your public directory?"** → Type `.` (just a dot) and press Enter
- **"Configure as a single-page app?"** → Press Y
- **"Set up automatic builds and deploys with GitHub?"** → Press N
- **"File index.html already exists. Overwrite?"** → Press N (IMPORTANT!)

### 4. Deploy to Firebase
```bash
firebase deploy
```

Your site will be live at: `https://YOUR-PROJECT-ID.web.app`

## Quick Deployment Commands

After initial setup, future deployments are just:
```bash
cd "d:\VC_testing_project\Zozagateway\app"
firebase deploy
```

## Custom Domain (Optional)
1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow the instructions to connect your domain

## Common Issues

### Issue: "firebase: command not found"
**Solution:** 
1. Close and reopen your terminal
2. Or add to PATH: `C:\Users\YOUR_USERNAME\AppData\Roaming\npm`

### Issue: "Firebase CLI requires Node.js"
**Solution:** Install Node.js from https://nodejs.org

### Issue: Deployment is slow
**Solution:** Firebase is uploading your Logo.png. This is normal for first deployment.

## Project Structure for Firebase
```
d:\VC_testing_project\Zozagateway\app\
├── index.html          ← Your main file
├── Logo.png           ← Your logo
├── firebase.json      ← Created by firebase init
└── .firebaserc        ← Created by firebase init
```

## Important Notes
- Your site is STATIC (no backend database)
- Cart data saves in browser localStorage
- Products added via admin panel are temporary (page refresh resets)
- To persist data, you'd need Firebase Firestore (database)

## Useful Commands
```bash
firebase login                    # Login to Firebase
firebase logout                   # Logout
firebase projects:list            # List your projects
firebase hosting:channel:deploy preview  # Deploy to preview channel
firebase open hosting:site        # Open your live site
```

## Cost
Firebase Hosting free tier includes:
- 10 GB storage
- 360 MB/day bandwidth
- Free SSL certificate
- Custom domain support

Perfect for small to medium traffic websites!

---

**Quick Start After Node.js Installation:**
1. `npm install -g firebase-tools`
2. `firebase login`
3. `cd "d:\VC_testing_project\Zozagateway\app"`
4. `firebase init hosting`
5. `firebase deploy`

Done! 🎉
