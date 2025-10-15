#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up ParentLink...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed:', nodeVersion);

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Check if Firebase CLI is installed
console.log('\n🔥 Checking Firebase CLI...');
try {
  execSync('firebase --version', { stdio: 'pipe' });
  console.log('✅ Firebase CLI is installed');
} catch (error) {
  console.log('⚠️  Firebase CLI not found. Installing...');
  try {
    execSync('npm install -g firebase-tools', { stdio: 'inherit' });
    console.log('✅ Firebase CLI installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install Firebase CLI:', installError.message);
    console.log('Please install Firebase CLI manually: npm install -g firebase-tools');
  }
}

// Create environment file template
console.log('\n📝 Creating environment file template...');
const envTemplate = `# Firebase Configuration
# Replace these values with your actual Firebase project configuration

VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
`;

if (!fs.existsSync('.env')) {
  fs.writeFileSync('.env', envTemplate);
  console.log('✅ Created .env file template');
  console.log('⚠️  Please update .env with your Firebase configuration');
} else {
  console.log('✅ .env file already exists');
}

// Update Firebase config to use environment variables
console.log('\n🔧 Updating Firebase configuration...');
const firebaseConfigPath = 'src/firebase/config.js';
const firebaseConfigContent = `import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
`;

fs.writeFileSync(firebaseConfigPath, firebaseConfigContent);
console.log('✅ Updated Firebase configuration to use environment variables');

// Create setup instructions
console.log('\n📋 Setup Instructions:');
console.log('1. Create a Firebase project at https://console.firebase.google.com');
console.log('2. Enable Authentication (Email/Password)');
console.log('3. Create a Firestore database');
console.log('4. Enable Cloud Storage');
console.log('5. Update .env file with your Firebase configuration');
console.log('6. Deploy Firestore rules: firebase deploy --only firestore:rules');
console.log('7. Deploy Firestore indexes: firebase deploy --only firestore:indexes');
console.log('8. Start development server: npm run dev');

console.log('\n🎉 ParentLink setup completed!');
console.log('\nTest accounts will be available after Firebase configuration:');
console.log('- Parent: parent@test.com / password123');
console.log('- Teacher: teacher@test.com / password123');
