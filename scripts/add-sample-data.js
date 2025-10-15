const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: "service_account",
  project_id: "parentlink-2024-app",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
};

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'parentlink-2024-app'
});

const db = admin.firestore();

class SampleDataManager {
  constructor() {
    this.testUsers = {
      parent: {
        uid: 'jxpPcwosGXV8HeRR4ZrFOjeNv4i1',
        email: 'parent@test.com',
        name: 'Test Parent',
        role: 'parent'
      },
      teacher: {
        uid: 'cSrXlu92HWVGFrx5MBEMOjNSyw03',
        email: 'teacher@test.com',
        name: 'Test Teacher',
        role: 'teacher'
      }
    };
  }

  async addSampleData() {
    console.log('🚀 Adding sample data to ParentLink test users...\n');

    try {
      // Add sample students for teacher
      await this.addSampleStudents();
      
      // Add sample messages
      await this.addSampleMessages();
      
      // Add sample progress reports
      await this.addSampleProgress();
      
      // Add sample announcements
      await this.addSampleAnnouncements();
      
      // Add sample events
      await this.addSampleEvents();
      
      // Add sample files
      await this.addSampleFiles();
      
      // Add sample notifications
      await this.addSampleNotifications();
      
      console.log('✅ All sample data added successfully!');
      
    } catch (error) {
      console.error('❌ Error adding sample data:', error);
    }
  }

  async addSampleStudents() {
    console.log('👥 Adding sample students...');
    
    const students = [
      {
        id: 'student1',
        name: 'Emma Johnson',
        grade: '3rd Grade',
        parentId: this.testUsers.parent.uid,
        teacherId: this.testUsers.teacher.uid,
        subjects: ['Mathematics', 'English', 'Science'],
        avatar: '👧',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'student2',
        name: 'Liam Smith',
        grade: '3rd Grade',
        parentId: this.testUsers.parent.uid,
        teacherId: this.testUsers.teacher.uid,
        subjects: ['Mathematics', 'English', 'Science'],
        avatar: '👦',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'student3',
        name: 'Sophia Davis',
        grade: '3rd Grade',
        parentId: this.testUsers.parent.uid,
        teacherId: this.testUsers.teacher.uid,
        subjects: ['Mathematics', 'English', 'Science'],
        avatar: '👧',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const student of students) {
      await db.collection('students').doc(student.id).set(student);
      console.log(`  ✅ Added student: ${student.name}`);
    }
  }

  async addSampleMessages() {
    console.log('💬 Adding sample messages...');
    
    const messages = [
      {
        id: 'msg1',
        from: this.testUsers.teacher.uid,
        to: this.testUsers.parent.uid,
        fromName: 'Test Teacher',
        toName: 'Test Parent',
        subject: 'Emma\'s Progress Update',
        content: 'Hi! I wanted to update you on Emma\'s excellent progress in mathematics. She has been showing great improvement in problem-solving skills.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        read: false,
        type: 'progress_update'
      },
      {
        id: 'msg2',
        from: this.testUsers.parent.uid,
        to: this.testUsers.teacher.uid,
        fromName: 'Test Parent',
        toName: 'Test Teacher',
        subject: 'Question about Homework',
        content: 'Thank you for the update! Emma mentioned she\'s having some difficulty with the science homework. Could you provide some additional guidance?',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
        type: 'question'
      },
      {
        id: 'msg3',
        from: this.testUsers.teacher.uid,
        to: this.testUsers.parent.uid,
        fromName: 'Test Teacher',
        toName: 'Test Parent',
        subject: 'Science Homework Help',
        content: 'Of course! I\'ll provide Emma with some additional resources and schedule a brief one-on-one session to help her understand the concepts better.',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        read: false,
        type: 'response'
      }
    ];

    for (const message of messages) {
      await db.collection('messages').doc(message.id).set(message);
      console.log(`  ✅ Added message: ${message.subject}`);
    }
  }

  async addSampleProgress() {
    console.log('📊 Adding sample progress reports...');
    
    const progressReports = [
      {
        id: 'progress1',
        studentId: 'student1',
        studentName: 'Emma Johnson',
        teacherId: this.testUsers.teacher.uid,
        parentId: this.testUsers.parent.uid,
        subject: 'Mathematics',
        grade: 'A',
        score: 95,
        comments: 'Excellent work! Emma shows strong understanding of multiplication and division concepts.',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        createdAt: new Date()
      },
      {
        id: 'progress2',
        studentId: 'student1',
        studentName: 'Emma Johnson',
        teacherId: this.testUsers.teacher.uid,
        parentId: this.testUsers.parent.uid,
        subject: 'English',
        grade: 'B+',
        score: 88,
        comments: 'Good progress in reading comprehension. Continue practicing vocabulary.',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        createdAt: new Date()
      },
      {
        id: 'progress3',
        studentId: 'student1',
        studentName: 'Emma Johnson',
        teacherId: this.testUsers.teacher.uid,
        parentId: this.testUsers.parent.uid,
        subject: 'Science',
        grade: 'A-',
        score: 92,
        comments: 'Great understanding of plant life cycles. Keep up the excellent work!',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        createdAt: new Date()
      }
    ];

    for (const progress of progressReports) {
      await db.collection('progress').doc(progress.id).set(progress);
      console.log(`  ✅ Added progress report: ${progress.studentName} - ${progress.subject}`);
    }
  }

  async addSampleAnnouncements() {
    console.log('📢 Adding sample announcements...');
    
    const announcements = [
      {
        id: 'announcement1',
        title: 'Parent-Teacher Conference Week',
        content: 'Parent-Teacher conferences will be held from March 15-19. Please schedule your appointment through the ParentLink app.',
        author: this.testUsers.teacher.uid,
        authorName: 'Test Teacher',
        priority: 'high',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        createdAt: new Date(),
        readBy: []
      },
      {
        id: 'announcement2',
        title: 'Science Fair Project Guidelines',
        content: 'Science fair projects are due on March 25th. Please review the guidelines and start working on your projects early.',
        author: this.testUsers.teacher.uid,
        authorName: 'Test Teacher',
        priority: 'medium',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        createdAt: new Date(),
        readBy: []
      },
      {
        id: 'announcement3',
        title: 'Spring Break Reminder',
        content: 'Spring break will be from April 5-9. No classes will be held during this time.',
        author: this.testUsers.teacher.uid,
        authorName: 'Test Teacher',
        priority: 'low',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
        createdAt: new Date(),
        readBy: []
      }
    ];

    for (const announcement of announcements) {
      await db.collection('announcements').doc(announcement.id).set(announcement);
      console.log(`  ✅ Added announcement: ${announcement.title}`);
    }
  }

  async addSampleEvents() {
    console.log('📅 Adding sample events...');
    
    const events = [
      {
        id: 'event1',
        title: 'Math Test - Multiplication',
        description: 'Unit test on multiplication tables and word problems',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        time: '10:00 AM',
        location: 'Classroom 3A',
        type: 'test',
        createdBy: this.testUsers.teacher.uid,
        createdAt: new Date()
      },
      {
        id: 'event2',
        title: 'Science Fair',
        description: 'Annual science fair showcasing student projects',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        time: '6:00 PM',
        location: 'School Gymnasium',
        type: 'event',
        createdBy: this.testUsers.teacher.uid,
        createdAt: new Date()
      },
      {
        id: 'event3',
        title: 'Field Trip - Natural History Museum',
        description: 'Educational field trip to learn about dinosaurs and fossils',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
        time: '9:00 AM',
        location: 'Natural History Museum',
        type: 'field_trip',
        createdBy: this.testUsers.teacher.uid,
        createdAt: new Date()
      }
    ];

    for (const event of events) {
      await db.collection('events').doc(event.id).set(event);
      console.log(`  ✅ Added event: ${event.title}`);
    }
  }

  async addSampleFiles() {
    console.log('📁 Adding sample files...');
    
    const files = [
      {
        id: 'file1',
        name: 'Math Homework - Week 3.pdf',
        type: 'homework',
        subject: 'Mathematics',
        uploadedBy: this.testUsers.teacher.uid,
        uploadedByName: 'Test Teacher',
        studentId: 'student1',
        studentName: 'Emma Johnson',
        url: 'https://example.com/files/math-homework-week3.pdf',
        size: 245760, // 240 KB
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        id: 'file2',
        name: 'Science Project Guidelines.docx',
        type: 'document',
        subject: 'Science',
        uploadedBy: this.testUsers.teacher.uid,
        uploadedByName: 'Test Teacher',
        studentId: null, // Available to all students
        studentName: null,
        url: 'https://example.com/files/science-project-guidelines.docx',
        size: 512000, // 500 KB
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        id: 'file3',
        name: 'Emma_Science_Project.jpg',
        type: 'project',
        subject: 'Science',
        uploadedBy: this.testUsers.parent.uid,
        uploadedByName: 'Test Parent',
        studentId: 'student1',
        studentName: 'Emma Johnson',
        url: 'https://example.com/files/emma-science-project.jpg',
        size: 1024000, // 1 MB
        uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    ];

    for (const file of files) {
      await db.collection('files').doc(file.id).set(file);
      console.log(`  ✅ Added file: ${file.name}`);
    }
  }

  async addSampleNotifications() {
    console.log('🔔 Adding sample notifications...');
    
    const notifications = [
      {
        id: 'notif1',
        userId: this.testUsers.parent.uid,
        title: 'New Message from Teacher',
        message: 'You have a new message from Test Teacher about Emma\'s progress.',
        type: 'message',
        read: false,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        actionUrl: '/messages'
      },
      {
        id: 'notif2',
        userId: this.testUsers.parent.uid,
        title: 'Progress Report Available',
        message: 'Emma\'s latest progress report is now available.',
        type: 'progress',
        read: false,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        actionUrl: '/progress'
      },
      {
        id: 'notif3',
        userId: this.testUsers.teacher.uid,
        title: 'New File Uploaded',
        message: 'Test Parent uploaded a new file for Emma\'s science project.',
        type: 'file',
        read: true,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        actionUrl: '/files'
      }
    ];

    for (const notification of notifications) {
      await db.collection('notifications').doc(notification.id).set(notification);
      console.log(`  ✅ Added notification: ${notification.title}`);
    }
  }

  async verifyData() {
    console.log('\n🔍 Verifying sample data...');
    
    const collections = ['students', 'messages', 'progress', 'announcements', 'events', 'files', 'notifications'];
    
    for (const collection of collections) {
      const snapshot = await db.collection(collection).get();
      console.log(`  📊 ${collection}: ${snapshot.size} documents`);
    }
  }
}

// Run the script
async function main() {
  const manager = new SampleDataManager();
  await manager.addSampleData();
  await manager.verifyData();
  
  console.log('\n🎉 Sample data setup complete!');
  console.log('\n📋 Test users now have:');
  console.log('  👥 3 sample students');
  console.log('  💬 3 sample messages');
  console.log('  📊 3 progress reports');
  console.log('  📢 3 announcements');
  console.log('  📅 3 events');
  console.log('  📁 3 files');
  console.log('  🔔 3 notifications');
  
  process.exit(0);
}

main().catch(console.error);
