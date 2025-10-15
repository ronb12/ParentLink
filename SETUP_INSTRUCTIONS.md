# ParentLink Setup Instructions

## 🔐 GitHub Secrets Configuration

### Required Secrets
Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

1. **FIREBASE_PRIVATE_KEY_ID** - From Firebase service account JSON
2. **FIREBASE_PRIVATE_KEY** - From Firebase service account JSON (include quotes and \n)
3. **FIREBASE_CLIENT_EMAIL** - From Firebase service account JSON
4. **FIREBASE_CLIENT_ID** - From Firebase service account JSON
5. **FIREBASE_TOKEN** - Get by running `firebase login:ci`

### How to Get Firebase Service Account Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: parentlink-2024-app
3. Go to Project Settings → Service Accounts
4. Click "Generate new private key"
5. Download the JSON file
6. Extract the required values from the JSON

### Security Notes

✅ **GitHub Secrets are encrypted by default:**
- Encrypted at rest using AES-256
- Encrypted in transit using TLS
- Automatically redacted from logs
- Only accessible to repository collaborators with write access

## 🧪 Testing with Sample Data

### Run Sample Data Setup
```bash
npm run setup:sample-data
```

### Test Users
- **Parent**: parent@test.com / password123
- **Teacher**: teacher@test.com / password123

### Sample Data Includes
- 3 students with progress reports
- Messages between parent and teacher
- Announcements and events
- File uploads and notifications

## 🚀 Deployment

### Manual Deployment
```bash
npm run build
npm run deploy
```

### Automated Deployment
Push to main branch triggers automatic deployment via GitHub Actions.

## 📱 PWA Features

- Installable on all devices
- Offline functionality
- Push notifications ready
- Cross-platform compatibility

## 🔧 Development

### Local Development
```bash
npm install
npm run dev
```

### Testing
```bash
npm test
```

## 📊 Monitoring

- Firebase Console: https://console.firebase.google.com/project/parentlink-2024-app
- GitHub Actions: Check repository Actions tab
- Live App: https://parentlink-2024-app.web.app