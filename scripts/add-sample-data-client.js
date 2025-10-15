const puppeteer = require('puppeteer');

class ClientSampleDataSetup {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async setup() {
    console.log('🚀 Adding sample data via client-side Firebase...\n');
    
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
    console.log('👩‍🏫 Logging in as Teacher...');
    
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
    
    console.log('✅ Teacher login successful');
  }

  async addSampleData() {
    console.log('📊 Adding sample data to Firebase...');
    
    // Add sample data using client-side Firebase
    const result = await this.page.evaluate(async () => {
      try {
        // Import Firebase functions (they should be available globally)
        const { collection, addDoc, serverTimestamp } = window.firebase.firestore;
        const db = window.firebase.firestore();
        
        const sampleData = {
          students: [
            {
              name: 'Emma Johnson',
              grade: '3rd Grade',
              parentId: 'jxpPcwosGXV8HeRR4ZrFOjeNv4i1', // parent@test.com
              teacherId: 'cSrXlu92HWVGFrx5MBEMOjNSyw03', // teacher@test.com
              subjects: ['Mathematics', 'English', 'Science'],
              avatar: '👧',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              name: 'Liam Smith',
              grade: '3rd Grade',
              parentId: 'jxpPcwosGXV8HeRR4ZrFOjeNv4i1',
              teacherId: 'cSrXlu92HWVGFrx5MBEMOjNSyw03',
              subjects: ['Mathematics', 'English', 'Science'],
              avatar: '👦',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              name: 'Sophia Davis',
              grade: '3rd Grade',
              parentId: 'jxpPcwosGXV8HeRR4ZrFOjeNv4i1',
              teacherId: 'cSrXlu92HWVGFrx5MBEMOjNSyw03',
              subjects: ['Mathematics', 'English', 'Science'],
              avatar: '👧',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ],
          messages: [
            {
              from: 'cSrXlu92HWVGFrx5MBEMOjNSyw03',
              to: 'jxpPcwosGXV8HeRR4ZrFOjeNv4i1',
              fromName: 'Test Teacher',
              toName: 'Test Parent',
              subject: 'Emma\'s Progress Update',
              content: 'Hi! I wanted to update you on Emma\'s excellent progress in mathematics. She has been showing great improvement in problem-solving skills.',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              read: false,
              type: 'progress_update'
            },
            {
              from: 'jxpPcwosGXV8HeRR4ZrFOjeNv4i1',
              to: 'cSrXlu92HWVGFrx5MBEMOjNSyw03',
              fromName: 'Test Parent',
              toName: 'Test Teacher',
              subject: 'Question about Homework',
              content: 'Thank you for the update! Emma mentioned she\'s having some difficulty with the science homework. Could you provide some additional guidance?',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              read: true,
              type: 'question'
            }
          ],
          progress: [
            {
              studentId: 'student1',
              studentName: 'Emma Johnson',
              teacherId: 'cSrXlu92HWVGFrx5MBEMOjNSyw03',
              parentId: 'jxpPcwosGXV8HeRR4ZrFOjeNv4i1',
              subject: 'Mathematics',
              grade: 'A',
              score: 95,
              comments: 'Excellent work! Emma shows strong understanding of multiplication and division concepts.',
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              createdAt: new Date()
            },
            {
              studentId: 'student1',
              studentName: 'Emma Johnson',
              teacherId: 'cSrXlu92HWVGFrx5MBEMOjNSyw03',
              parentId: 'jxpPcwosGXV8HeRR4ZrFOjeNv4i1',
              subject: 'English',
              grade: 'B+',
              score: 88,
              comments: 'Good progress in reading comprehension. Continue practicing vocabulary.',
              date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              createdAt: new Date()
            }
          ],
          announcements: [
            {
              title: 'Parent-Teacher Conference Week',
              content: 'Parent-Teacher conferences will be held from March 15-19. Please schedule your appointment through the ParentLink app.',
              author: 'cSrXlu92HWVGFrx5MBEMOjNSyw03',
              authorName: 'Test Teacher',
              priority: 'high',
              date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              createdAt: new Date(),
              readBy: []
            },
            {
              title: 'Science Fair Project Guidelines',
              content: 'Science fair projects are due on March 25th. Please review the guidelines and start working on your projects early.',
              author: 'cSrXlu92HWVGFrx5MBEMOjNSyw03',
              authorName: 'Test Teacher',
              priority: 'medium',
              date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
              createdAt: new Date(),
              readBy: []
            }
          ],
          events: [
            {
              title: 'Math Test - Multiplication',
              description: 'Unit test on multiplication tables and word problems',
              date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
              time: '10:00 AM',
              location: 'Classroom 3A',
              type: 'test',
              createdBy: 'cSrXlu92HWVGFrx5MBEMOjNSyw03',
              createdAt: new Date()
            },
            {
              title: 'Science Fair',
              description: 'Annual science fair showcasing student projects',
              date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
              time: '6:00 PM',
              location: 'School Gymnasium',
              type: 'event',
              createdBy: 'cSrXlu92HWVGFrx5MBEMOjNSyw03',
              createdAt: new Date()
            }
          ]
        };

        const results = {};

        // Add students
        for (const student of sampleData.students) {
          const docRef = await addDoc(collection(db, 'students'), student);
          results.students = (results.students || 0) + 1;
          console.log(`Added student: ${student.name}`);
        }

        // Add messages
        for (const message of sampleData.messages) {
          const docRef = await addDoc(collection(db, 'messages'), message);
          results.messages = (results.messages || 0) + 1;
          console.log(`Added message: ${message.subject}`);
        }

        // Add progress reports
        for (const progress of sampleData.progress) {
          const docRef = await addDoc(collection(db, 'progress'), progress);
          results.progress = (results.progress || 0) + 1;
          console.log(`Added progress report: ${progress.studentName} - ${progress.subject}`);
        }

        // Add announcements
        for (const announcement of sampleData.announcements) {
          const docRef = await addDoc(collection(db, 'announcements'), announcement);
          results.announcements = (results.announcements || 0) + 1;
          console.log(`Added announcement: ${announcement.title}`);
        }

        // Add events
        for (const event of sampleData.events) {
          const docRef = await addDoc(collection(db, 'events'), event);
          results.events = (results.events || 0) + 1;
          console.log(`Added event: ${event.title}`);
        }

        return results;

      } catch (error) {
        console.error('Error adding sample data:', error);
        return { error: error.message };
      }
    });

    if (result.error) {
      console.error('❌ Error adding sample data:', result.error);
    } else {
      console.log('✅ Sample data added successfully:');
      console.log(`  👥 Students: ${result.students || 0}`);
      console.log(`  💬 Messages: ${result.messages || 0}`);
      console.log(`  📊 Progress Reports: ${result.progress || 0}`);
      console.log(`  📢 Announcements: ${result.announcements || 0}`);
      console.log(`  📅 Events: ${result.events || 0}`);
    }
  }

  async runSetup() {
    try {
      await this.setup();
      await this.loginAsTeacher();
      await this.addSampleData();
      
      console.log('\n🎉 Sample data setup completed!');
      
    } catch (error) {
      console.error('❌ Setup failed:', error);
    } finally {
      await this.teardown();
    }
  }
}

// Run the setup
async function runClientSampleDataSetup() {
  const setup = new ClientSampleDataSetup();
  await setup.runSetup();
}

runClientSampleDataSetup().catch(console.error);
