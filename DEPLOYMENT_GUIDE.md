# ParentLink Deployment Guide

This guide will help you deploy ParentLink to Firebase hosting with all features working.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **Firebase CLI** (`npm install -g firebase-tools`)
3. **Firebase Account** (free tier available)

## Step 1: Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `parentlink-app` (or your preferred name)
4. Enable Google Analytics (optional)
5. Create the project

## Step 2: Enable Firebase Services

### Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Save changes

### Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location (choose closest to your users)
5. Create database

### Cloud Storage
1. Go to "Storage"
2. Click "Get started"
3. Choose "Start in production mode"
4. Select same location as Firestore
5. Create storage bucket

## Step 3: Configure Firebase Project

1. In Firebase Console, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web app" icon (`</>`)
4. Register app with name: `ParentLink`
5. Copy the Firebase configuration object

## Step 4: Update Environment Variables

1. In your ParentLink project, create `.env` file:
```bash
cp .env.example .env
```

2. Update `.env` with your Firebase config:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

## Step 5: Initialize Firebase in Your Project

1. Login to Firebase CLI:
```bash
firebase login
```

2. Initialize Firebase in your project:
```bash
firebase init
```

3. Select the following services:
   - ✅ Firestore: Configure security rules and indexes files
   - ✅ Hosting: Configure files for Firebase Hosting

4. Use existing configuration files (select "Yes" when prompted)

## Step 6: Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## Step 7: Build and Deploy Application

```bash
npm run build
firebase deploy --only hosting
```

## Step 8: Set Up Test Users

After deployment, you can create test users manually or use the provided test accounts:

### Test Accounts
- **Parent**: `parent@test.com` / `password123`
- **Teacher**: `teacher@test.com` / `password123`

### Manual User Creation
1. Go to your deployed app
2. Click "Sign Up"
3. Create accounts with the test credentials above
4. Or create new accounts with your own credentials

## Step 9: Verify Deployment

1. Visit your deployed app URL
2. Test user registration and login
3. Test all features:
   - ✅ Messaging between parents and teachers
   - ✅ Progress reports
   - ✅ Announcements
   - ✅ Calendar events
   - ✅ File sharing
   - ✅ Student management

## Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check Firebase config in `.env`
   - Verify Email/Password is enabled in Firebase Console

2. **Firestore permission denied**
   - Deploy Firestore rules: `firebase deploy --only firestore:rules`
   - Check rules in `firestore.rules`

3. **File upload not working**
   - Check Storage rules in Firebase Console
   - Verify Storage is enabled

4. **Build errors**
   - Check Node.js version (v16+)
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Firebase Console URLs

- **Authentication**: https://console.firebase.google.com/project/YOUR_PROJECT_ID/authentication
- **Firestore**: https://console.firebase.google.com/project/YOUR_PROJECT_ID/firestore
- **Storage**: https://console.firebase.google.com/project/YOUR_PROJECT_ID/storage
- **Hosting**: https://console.firebase.google.com/project/YOUR_PROJECT_ID/hosting

## Production Considerations

1. **Security Rules**: Review and customize Firestore rules for your needs
2. **Domain**: Set up custom domain in Firebase Hosting
3. **SSL**: Firebase provides free SSL certificates
4. **Monitoring**: Enable Firebase Performance Monitoring
5. **Backup**: Set up Firestore backup schedules

## Support

For deployment issues:
1. Check Firebase Console for error logs
2. Review browser console for client-side errors
3. Check Firebase CLI output for deployment errors

## Next Steps

After successful deployment:
1. Create your first teacher account
2. Add students to the system
3. Invite parents to register
4. Test all communication features
5. Customize the app for your school's needs

---

**ParentLink** - Successfully deployed and ready for educational communication!
