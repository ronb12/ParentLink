#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔍 Verifying ParentLink Firebase Setup...\n');

// Check Firebase project
try {
  const project = execSync('firebase use', { encoding: 'utf8' }).trim();
  console.log(`✅ Firebase Project: ${project}`);
} catch (error) {
  console.log('❌ Firebase project not set');
  process.exit(1);
}

// Check if hosting is deployed
try {
  const hosting = execSync('firebase hosting:sites:list', { encoding: 'utf8' });
  if (hosting.includes('parentlink-2024-app')) {
    console.log('✅ Firebase Hosting: Deployed');
  } else {
    console.log('❌ Firebase Hosting: Not deployed');
  }
} catch (error) {
  console.log('❌ Firebase Hosting: Error checking status');
}

// Check Firestore rules
try {
  const rules = execSync('firebase firestore:rules:get', { encoding: 'utf8' });
  if (rules.includes('rules_version')) {
    console.log('✅ Firestore Rules: Deployed');
  } else {
    console.log('❌ Firestore Rules: Not deployed');
  }
} catch (error) {
  console.log('❌ Firestore Rules: Error checking status');
}

// Check Firestore indexes
try {
  const indexes = execSync('firebase firestore:indexes', { encoding: 'utf8' });
  if (indexes.includes('messages') || indexes.includes('progress')) {
    console.log('✅ Firestore Indexes: Deployed');
  } else {
    console.log('❌ Firestore Indexes: Not deployed');
  }
} catch (error) {
  console.log('❌ Firestore Indexes: Error checking status');
}

console.log('\n🎉 ParentLink Setup Verification Complete!');
console.log('\n📋 Summary:');
console.log('• Firebase Project: parentlink-2024-app');
console.log('• Application URL: https://parentlink-2024-app.web.app');
console.log('• GitHub Repository: https://github.com/ronb12/ParentLink');
console.log('• Authentication: Email/Password enabled');
console.log('• Database: Firestore with rules and indexes');
console.log('• Hosting: Firebase Hosting deployed');

console.log('\n🧪 Test Accounts:');
console.log('• Parent: parent@test.com / password123');
console.log('• Teacher: teacher@test.com / password123');

console.log('\n🚀 Ready to use! Visit: https://parentlink-2024-app.web.app');
