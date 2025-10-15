# 📊 Sample Data Setup Instructions

## 🎯 **Purpose**
This sample data is specifically designed for **test users only** to demonstrate ParentLink features during testing and development.

## 🔒 **Test Users**
- **Parent**: `parent@test.com` / `password123`
- **Teacher**: `teacher@test.com` / `password123`

## 📋 **Sample Data Includes**

### 👥 **Students (3)**
- Emma Johnson (3rd Grade)
- Liam Smith (3rd Grade) 
- Sophia Davis (3rd Grade)

### 💬 **Messages (3)**
- Progress update from teacher
- Question from parent
- Response from teacher

### 📊 **Progress Reports (3)**
- Mathematics: A (95%)
- English: B+ (88%)
- Science: A- (92%)

### 📢 **Announcements (3)**
- Parent-Teacher Conference Week
- Science Fair Project Guidelines
- Spring Break Reminder

### 📅 **Events (3)**
- Math Test - Multiplication
- Science Fair
- Field Trip - Natural History Museum

### 📁 **Files (3)**
- Math Homework PDF
- Science Project Guidelines
- Student Project Image

### 🔔 **Notifications (3)**
- New message alerts
- Progress report notifications
- File upload notifications

## 🚀 **How to Import Sample Data**

### Method 1: Firebase Console (Recommended)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/project/parentlink-2024-app/firestore/data

2. **Import Each Collection**
   - Click on each collection (students, messages, progress, announcements, events, files, notifications)
   - Click "Import JSON" or "Add document"
   - Copy the relevant section from `sample-data.json`
   - Paste and save

3. **Verify Data**
   - Check that all documents have `isTestData: true`
   - Verify user IDs match test users:
     - Parent: `jxpPcwosGXV8HeRR4ZrFOjeNv4i1`
     - Teacher: `cSrXlu92HWVGFrx5MBEMOjNSyw03`

### Method 2: Firebase CLI

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Import data (if you have the Firebase CLI configured)
firebase firestore:import sample-data.json
```

### Method 3: Manual Document Creation

1. **For each collection in Firebase Console:**
   - Click "Start collection"
   - Use the document ID from `sample-data.json`
   - Add all fields from the JSON object
   - Save the document

## 🔒 **Security Notes**

### ✅ **Data Isolation**
- All sample data is marked with `isTestData: true`
- Data is only linked to test user IDs
- Regular users will not see this data

### 🛡️ **Access Control**
- Students are only visible to test parent and teacher
- Messages are only between test users
- Files are only shared with test users
- All data is properly scoped to test user IDs

## 🧪 **Testing with Sample Data**

### **Parent Login** (`parent@test.com`)
- ✅ Can see 3 students (Emma, Liam, Sophia)
- ✅ Can see messages from teacher
- ✅ Can view progress reports
- ✅ Can see announcements
- ✅ Can view calendar events
- ✅ Can access shared files
- ❌ Cannot access Students page (teacher-only)

### **Teacher Login** (`teacher@test.com`)
- ✅ Can see all parent features
- ✅ Can access Students page
- ✅ Can see all 3 students
- ✅ Can view all messages
- ✅ Can see all progress reports
- ✅ Can create announcements
- ✅ Can create events
- ✅ Can upload files

## 🎯 **Expected Test Results**

When running comprehensive tests, you should see:
- **Dashboard**: Shows welcome message and recent activity
- **Messages**: 3 sample messages between parent and teacher
- **Progress**: 3 progress reports for Emma Johnson
- **Announcements**: 3 school announcements
- **Calendar**: 3 upcoming events
- **Files**: 3 shared files
- **Students**: 3 students (teacher only)

## 🚨 **Important Notes**

1. **Test Data Only**: This data is specifically for testing and should not be used in production
2. **User Isolation**: Regular users who register will not see this test data
3. **Data Cleanup**: Test data can be easily identified and removed using the `isTestData` flag
4. **Privacy**: All test data uses fictional names and information

## 🔧 **Troubleshooting**

### **Data Not Showing**
- Verify user IDs match exactly
- Check that `isTestData: true` is set
- Ensure proper collection names
- Verify Firestore security rules allow access

### **Access Issues**
- Confirm test users are properly authenticated
- Check role-based access controls
- Verify user data has correct role assignments

## 📞 **Support**

If you encounter issues with sample data setup:
1. Check Firebase Console for data presence
2. Verify test user authentication
3. Review Firestore security rules
4. Check browser console for errors

---

**Remember**: This sample data is only for testing purposes and should not be used in production environments! 🎓✨
