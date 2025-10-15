# ParentLink - Educational Communication Platform

ParentLink is a comprehensive educational communication platform designed to bridge the gap between parents and teachers, fostering better collaboration for student success.

## Features

### 🔐 Authentication & User Management
- Secure user registration and login
- Role-based access (Parent/Teacher)
- User profile management
- Password protection
- Forgot password with email reset

### 💬 Real-time Messaging
- Direct communication between parents and teachers
- Real-time message delivery
- Message read status tracking
- Student context in conversations

### 📊 Progress Tracking
- Academic progress reports
- Behavior tracking
- Attendance monitoring
- Grade management
- Teacher comments and feedback

### 📢 Announcements
- School-wide announcements
- Priority-based notifications
- Rich text content support
- Author attribution

### 📅 Calendar & Events
- Interactive calendar view
- Event creation and management
- Different event types (exams, assignments, meetings, holidays)
- Date and time scheduling

### 📁 File Sharing
- Document upload and sharing
- Multiple file type support
- File organization
- Download tracking

### 👥 Student Management (Teachers)
- Class roster management
- Student information tracking
- Parent contact details
- Grade level organization

### 🔔 Notifications
- Real-time updates
- Priority-based alerts
- Push notifications support
- Email notifications (future enhancement)

### 📱 Progressive Web App (PWA)
- Install on any device (iOS, Android, Desktop)
- Offline functionality with service worker
- App shortcuts for quick access
- Native app-like experience
- Education-themed icons and branding

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **PWA**: Progressive Web App with offline support
- **Icons**: Lucide React + Custom Education-themed Icons
- **Date Handling**: date-fns
- **Notifications**: React Hot Toast + Push Notifications
- **Routing**: React Router DOM
- **Service Worker**: Custom offline-first implementation

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Firebase project setup
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ParentLink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication, Firestore Database, and Storage
   - Copy your Firebase config and update `src/firebase/config.js`

4. **Firestore Rules**
   - Deploy the Firestore rules from `firestore.rules`
   - Deploy the indexes from `firestore.indexes.json`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

### Firebase Setup

1. **Authentication**
   - Enable Email/Password authentication
   - Configure authorized domains

2. **Firestore Database**
   - Create database in production mode
   - Deploy security rules
   - Deploy indexes

3. **Storage**
   - Enable Cloud Storage
   - Configure storage rules

4. **Hosting**
   - Initialize Firebase hosting
   - Deploy the application

## Test Accounts

The application includes pre-configured test accounts for easy testing:

- **Parent Account**: `parent@test.com` / `password123`
- **Teacher Account**: `teacher@test.com` / `password123`

## Project Structure

```
ParentLink/
├── public/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts (Auth)
│   ├── firebase/           # Firebase configuration and services
│   ├── pages/              # Application pages
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
├── firebase.json           # Firebase configuration
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore indexes
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Deployment

### Firebase Hosting

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

### Environment Variables

Create a `.env` file for environment-specific configurations:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Security Features

- Firestore security rules for data protection
- Role-based access control
- Input validation and sanitization
- Secure file upload handling
- Authentication state management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact Bradley Virtual Solutions, LLC.

## Roadmap

- [ ] Push notifications
- [ ] Video calling integration
- [ ] Advanced analytics
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced file organization
- [ ] Integration with school management systems

---

**ParentLink** - Connecting parents and teachers for better student outcomes.
