const puppeteer = require('puppeteer');

class TestUserDataSetup {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testUserIds = {
      parent: 'jxpPcwosGXV8HeRR4ZrFOjeNv4i1', // parent@test.com
      teacher: 'cSrXlu92HWVGFrx5MBEMOjNSyw03'  // teacher@test.com
    };
  }

  async setup() {
    console.log('🚀 Setting up sample data for test users only...\n');
    
    this.browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
  }

  async teardown() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async loginAsTeacher() {
    console.log('👩‍🏫 Logging in as Test Teacher...');
    
    await this.page.goto('https://parentlink-2024-app.web.app/login', {
      waitUntil: 'networkidle2'
    });
    
    await this.page.waitForSelector('input[name="email"]', { timeout: 10000 });
    await this.page.type('input[name="email"]', 'teacher@test.com');
    await this.page.type('input[name="password"]', 'password123');
    await this.page.click('button[type="submit"]');
    
    // Wait for navigation
    await new Promise(resolve => setTimeout(resolve, 5000));
    const currentUrl = this.page.url();
    
    if (!currentUrl.includes('/dashboard')) {
      throw new Error(`Teacher login failed - still on: ${currentUrl}`);
    }
    
    console.log('✅ Test Teacher login successful');
  }

  async addTestUserSampleData() {
    console.log('📊 Adding sample data for test users only...');
    
    // Add sample data using client-side Firebase, linked to test users
    const result = await this.page.evaluate(async (testUserIds) => {
      try {
        // Import Firebase functions
        const { collection, addDoc, serverTimestamp } = window.firebase.firestore;
        const db = window.firebase.firestore();
        
        const testUserData = {
          students: [
            {
              id: 'test-student-1',
              name: 'Emma Johnson',
              grade: '3rd Grade',
              parentId: testUserIds.parent, // Only visible to parent@test.com
              teacherId: testUserIds.teacher, // Only visible to teacher@test.com
              subjects: ['Mathematics', 'English', 'Science'],
              avatar: '👧',
              isTestData: true, // Flag to identify test data
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              id: 'test-student-2',
              name: 'Liam Smith',
              grade: '3rd Grade',
              parentId: testUserIds.parent,
              teacherId: testUserIds.teacher,
              subjects: ['Mathematics', 'English', 'Science'],
              avatar: '👦',
              isTestData: true,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              id: 'test-student-3',
              name: 'Sophia Davis',
              grade: '3rd Grade',
              parentId: testUserIds.parent,
              teacherId: testUserIds.teacher,
              subjects: ['Mathematics', 'English', 'Science'],
              avatar: '👧',
              isTestData: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ],
          messages: [
            {
              id: 'test-message-1',
              from: testUserIds.teacher,
              to: testUserIds.parent,
              fromName: 'Test Teacher',
              toName: 'Test Parent',
              subject: 'Emma\'s Progress Update',
              content: 'Hi! I wanted to update you on Emma\'s excellent progress in mathematics. She has been showing great improvement in problem-solving skills.',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              read: false,
              type: 'progress_update',
              isTestData: true
            },
            {
              id: 'test-message-2',
              from: testUserIds.parent,
              to: testUserIds.teacher,
              fromName: 'Test Parent',
              toName: 'Test Teacher',
              subject: 'Question about Homework',
              content: 'Thank you for the update! Emma mentioned she\'s having some difficulty with the science homework. Could you provide some additional guidance?',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              read: true,
              type: 'question',
              isTestData: true
            },
            {
              id: 'test-message-3',
              from: testUserIds.teacher,
              to: testUserIds.parent,
              fromName: 'Test Teacher',
              toName: 'Test Parent',
              subject: 'Science Homework Help',
              content: 'Of course! I\'ll provide Emma with some additional resources and schedule a brief one-on-one session to help her understand the concepts better.',
              timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
              read: false,
              type: 'response',
              isTestData: true
            }
          ],
          progress: [
            {
              id: 'test-progress-1',
              studentId: 'test-student-1',
              studentName: 'Emma Johnson',
              teacherId: testUserIds.teacher,
              parentId: testUserIds.parent,
              subject: 'Mathematics',
              grade: 'A',
              score: 95,
              comments: 'Excellent work! Emma shows strong understanding of multiplication and division concepts.',
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              createdAt: new Date(),
              isTestData: true
            },
            {
              id: 'test-progress-2',
              studentId: 'test-student-1',
              studentName: 'Emma Johnson',
              teacherId: testUserIds.teacher,
              parentId: testUserIds.parent,
              subject: 'English',
              grade: 'B+',
              score: 88,
              comments: 'Good progress in reading comprehension. Continue practicing vocabulary.',
              date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              createdAt: new Date(),
              isTestData: true
            },
            {
              id: 'test-progress-3',
              studentId: 'test-student-1',
              studentName: 'Emma Johnson',
              teacherId: testUserIds.teacher,
              parentId: testUserIds.parent,
              subject: 'Science',
              grade: 'A-',
              score: 92,
              comments: 'Great understanding of plant life cycles. Keep up the excellent work!',
              date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
              createdAt: new Date(),
              isTestData: true
            }
          ],
          announcements: [
            {
              id: 'test-announcement-1',
              title: 'Parent-Teacher Conference Week',
              content: 'Parent-Teacher conferences will be held from March 15-19. Please schedule your appointment through the ParentLink app.',
              author: testUserIds.teacher,
              authorName: 'Test Teacher',
              priority: 'high',
              date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              createdAt: new Date(),
              readBy: [],
              isTestData: true
            },
            {
              id: 'test-announcement-2',
              title: 'Science Fair Project Guidelines',
              content: 'Science fair projects are due on March 25th. Please review the guidelines and start working on your projects early.',
              author: testUserIds.teacher,
              authorName: 'Test Teacher',
              priority: 'medium',
              date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
              createdAt: new Date(),
              readBy: [],
              isTestData: true
            },
            {
              id: 'test-announcement-3',
              title: 'Spring Break Reminder',
              content: 'Spring break will be from April 5-9. No classes will be held during this time.',
              author: testUserIds.teacher,
              authorName: 'Test Teacher',
              priority: 'low',
              date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
              createdAt: new Date(),
              readBy: [],
              isTestData: true
            }
          ],
          events: [
            {
              id: 'test-event-1',
              title: 'Math Test - Multiplication',
              description: 'Unit test on multiplication tables and word problems',
              date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
              time: '10:00 AM',
              location: 'Classroom 3A',
              type: 'test',
              createdBy: testUserIds.teacher,
              createdAt: new Date(),
              isTestData: true
            },
            {
              id: 'test-event-2',
              title: 'Science Fair',
              description: 'Annual science fair showcasing student projects',
              date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
              time: '6:00 PM',
              location: 'School Gymnasium',
              type: 'event',
              createdBy: testUserIds.teacher,
              createdAt: new Date(),
              isTestData: true
            },
            {
              id: 'test-event-3',
              title: 'Field Trip - Natural History Museum',
              description: 'Educational field trip to learn about dinosaurs and fossils',
              date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
              time: '9:00 AM',
              location: 'Natural History Museum',
              type: 'field_trip',
              createdBy: testUserIds.teacher,
              createdAt: new Date(),
              isTestData: true
            }
          ],
          files: [
            {
              id: 'test-file-1',
              name: 'Math Homework - Week 3.pdf',
              type: 'homework',
              subject: 'Mathematics',
              uploadedBy: testUserIds.teacher,
              uploadedByName: 'Test Teacher',
              studentId: 'test-student-1',
              studentName: 'Emma Johnson',
              url: 'https://example.com/files/math-homework-week3.pdf',
              size: 245760,
              uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              sharedWith: [testUserIds.parent, testUserIds.teacher],
              isTestData: true
            },
            {
              id: 'test-file-2',
              name: 'Science Project Guidelines.docx',
              type: 'document',
              subject: 'Science',
              uploadedBy: testUserIds.teacher,
              uploadedByName: 'Test Teacher',
              studentId: null,
              studentName: null,
              url: 'https://example.com/files/science-project-guidelines.docx',
              size: 512000,
              uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              sharedWith: [testUserIds.parent, testUserIds.teacher],
              isTestData: true
            },
            {
              id: 'test-file-3',
              name: 'Emma_Science_Project.jpg',
              type: 'project',
              subject: 'Science',
              uploadedBy: testUserIds.parent,
              uploadedByName: 'Test Parent',
              studentId: 'test-student-1',
              studentName: 'Emma Johnson',
              url: 'https://example.com/files/emma-science-project.jpg',
              size: 1024000,
              uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              sharedWith: [testUserIds.parent, testUserIds.teacher],
              isTestData: true
            }
          ],
          notifications: [
            {
              id: 'test-notification-1',
              userId: testUserIds.parent,
              title: 'New Message from Teacher',
              message: 'You have a new message from Test Teacher about Emma\'s progress.',
              type: 'message',
              read: false,
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
              actionUrl: '/messages',
              isTestData: true
            },
            {
              id: 'test-notification-2',
              userId: testUserIds.parent,
              title: 'Progress Report Available',
              message: 'Emma\'s latest progress report is now available.',
              type: 'progress',
              read: false,
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              actionUrl: '/progress',
              isTestData: true
            },
            {
              id: 'test-notification-3',
              userId: testUserIds.teacher,
              title: 'New File Uploaded',
              message: 'Test Parent uploaded a new file for Emma\'s science project.',
              type: 'file',
              read: true,
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              actionUrl: '/files',
              isTestData: true
            }
          ]
        };

        const results = {};

        // Add students (only for test users)
        for (const student of testUserData.students) {
          const docRef = await addDoc(collection(db, 'students'), student);
          results.students = (results.students || 0) + 1;
          console.log(`Added test student: ${student.name}`);
        }

        // Add messages (only between test users)
        for (const message of testUserData.messages) {
          const docRef = await addDoc(collection(db, 'messages'), message);
          results.messages = (results.messages || 0) + 1;
          console.log(`Added test message: ${message.subject}`);
        }

        // Add progress reports (only for test users)
        for (const progress of testUserData.progress) {
          const docRef = await addDoc(collection(db, 'progress'), progress);
          results.progress = (results.progress || 0) + 1;
          console.log(`Added test progress: ${progress.studentName} - ${progress.subject}`);
        }

        // Add announcements (only from test teacher)
        for (const announcement of testUserData.announcements) {
          const docRef = await addDoc(collection(db, 'announcements'), announcement);
          results.announcements = (results.announcements || 0) + 1;
          console.log(`Added test announcement: ${announcement.title}`);
        }

        // Add events (only from test teacher)
        for (const event of testUserData.events) {
          const docRef = await addDoc(collection(db, 'events'), event);
          results.events = (results.events || 0) + 1;
          console.log(`Added test event: ${event.title}`);
        }

        // Add files (only for test users)
        for (const file of testUserData.files) {
          const docRef = await addDoc(collection(db, 'files'), file);
          results.files = (results.files || 0) + 1;
          console.log(`Added test file: ${file.name}`);
        }

        // Add notifications (only for test users)
        for (const notification of testUserData.notifications) {
          const docRef = await addDoc(collection(db, 'notifications'), notification);
          results.notifications = (results.notifications || 0) + 1;
          console.log(`Added test notification: ${notification.title}`);
        }

        return results;

      } catch (error) {
        console.error('Error adding test user data:', error);
        return { error: error.message };
      }
    }, this.testUserIds);

    if (result.error) {
      console.error('❌ Error adding test user data:', result.error);
    } else {
      console.log('✅ Test user sample data added successfully:');
      console.log(`  👥 Students: ${result.students || 0}`);
      console.log(`  💬 Messages: ${result.messages || 0}`);
      console.log(`  📊 Progress Reports: ${result.progress || 0}`);
      console.log(`  📢 Announcements: ${result.announcements || 0}`);
      console.log(`  📅 Events: ${result.events || 0}`);
      console.log(`  📁 Files: ${result.files || 0}`);
      console.log(`  🔔 Notifications: ${result.notifications || 0}`);
    }
  }

  async runSetup() {
    try {
      await this.setup();
      await this.loginAsTeacher();
      await this.addTestUserSampleData();
      
      console.log('\n🎉 Test user sample data setup completed!');
      console.log('\n📋 Test Users:');
      console.log('  👨‍👩‍👧‍👦 Parent: parent@test.com / password123');
      console.log('  👩‍🏫 Teacher: teacher@test.com / password123');
      console.log('\n🔒 Sample data is only visible to these test users');
      
    } catch (error) {
      console.error('❌ Setup failed:', error);
    } finally {
      await this.teardown();
    }
  }
}

// Run the setup
async function runTestUserDataSetup() {
  const setup = new TestUserDataSetup();
  await setup.runSetup();
}

runTestUserDataSetup().catch(console.error);
