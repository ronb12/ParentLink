#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Deploying ParentLink to Firebase...\n');

// Check if Firebase CLI is available
try {
  execSync('firebase --version', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ Firebase CLI not found. Please install it first:');
  console.log('npm install -g firebase-tools');
  process.exit(1);
}

// Check if user is logged in to Firebase
try {
  execSync('firebase projects:list', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ Not logged in to Firebase. Please login first:');
  console.log('firebase login');
  process.exit(1);
}

// Build the application
console.log('📦 Building application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Deploy Firestore rules
console.log('\n🔥 Deploying Firestore rules...');
try {
  execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
  console.log('✅ Firestore rules deployed');
} catch (error) {
  console.error('❌ Failed to deploy Firestore rules:', error.message);
}

// Deploy Firestore indexes
console.log('\n📊 Deploying Firestore indexes...');
try {
  execSync('firebase deploy --only firestore:indexes', { stdio: 'inherit' });
  console.log('✅ Firestore indexes deployed');
} catch (error) {
  console.error('❌ Failed to deploy Firestore indexes:', error.message);
}

// Deploy to hosting
console.log('\n🌐 Deploying to Firebase hosting...');
try {
  execSync('firebase deploy --only hosting', { stdio: 'inherit' });
  console.log('✅ Application deployed to Firebase hosting');
} catch (error) {
  console.error('❌ Failed to deploy to hosting:', error.message);
  process.exit(1);
}

console.log('\n🎉 Deployment completed successfully!');
console.log('Your ParentLink application is now live on Firebase hosting.');
console.log('\nNext steps:');
console.log('1. Set up test users using the test accounts');
console.log('2. Configure your Firebase project settings');
console.log('3. Test all features with the provided test accounts');
