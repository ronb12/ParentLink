const puppeteer = require('puppeteer');

class SampleDataWebSetup {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async setup() {
    console.log('🚀 Setting up sample data via web interface...\n');
    
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

  async addSampleStudents() {
    console.log('👥 Adding sample students...');
    
    await this.page.goto('https://parentlink-2024-app.web.app/students', {
      waitUntil: 'networkidle2'
    });
    
    const students = [
      {
        name: 'Emma Johnson',
        grade: '3rd Grade',
        email: 'emma.johnson@student.com',
        phone: '(555) 111-2222',
        parentName: 'Test Parent',
        parentEmail: 'parent@test.com',
        parentPhone: '(555) 123-4567'
      },
      {
        name: 'Liam Smith',
        grade: '3rd Grade',
        email: 'liam.smith@student.com',
        phone: '(555) 333-4444',
        parentName: 'Test Parent',
        parentEmail: 'parent@test.com',
        parentPhone: '(555) 123-4567'
      },
      {
        name: 'Sophia Davis',
        grade: '3rd Grade',
        email: 'sophia.davis@student.com',
        phone: '(555) 555-6666',
        parentName: 'Test Parent',
        parentEmail: 'parent@test.com',
        parentPhone: '(555) 123-4567'
      }
    ];

    for (const student of students) {
      console.log(`  Adding student: ${student.name}`);
      
      // Click Add Student button
      await this.page.click('button:has-text("Add Student")');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fill student form
      await this.page.type('input[placeholder="Enter student name"]', student.name);
      await this.page.type('input[placeholder="e.g., 3rd Grade"]', student.grade);
      await this.page.type('input[placeholder="student@example.com"]', student.email);
      await this.page.type('input[placeholder="(555) 123-4567"]', student.phone);
      
      // Fill parent information
      await this.page.type('input[placeholder="Enter parent name"]', student.parentName);
      await this.page.type('input[placeholder="parent@example.com"]', student.parentEmail);
      await this.page.type('input[placeholder="(555) 123-4567"]', student.parentPhone);
      
      // Submit form
      await this.page.click('button[type="submit"]');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log(`  ✅ Added student: ${student.name}`);
    }
  }

  async addSampleAnnouncements() {
    console.log('📢 Adding sample announcements...');
    
    await this.page.goto('https://parentlink-2024-app.web.app/announcements', {
      waitUntil: 'networkidle2'
    });
    
    const announcements = [
      {
        title: 'Parent-Teacher Conference Week',
        content: 'Parent-Teacher conferences will be held from March 15-19. Please schedule your appointment through the ParentLink app.'
      },
      {
        title: 'Science Fair Project Guidelines',
        content: 'Science fair projects are due on March 25th. Please review the guidelines and start working on your projects early.'
      },
      {
        title: 'Spring Break Reminder',
        content: 'Spring break will be from April 5-9. No classes will be held during this time.'
      }
    ];

    for (const announcement of announcements) {
      console.log(`  Adding announcement: ${announcement.title}`);
      
      // Look for add announcement button
      const addButton = await this.page.$('button:has-text("Add Announcement"), button:has-text("Create Announcement"), button:has-text("New Announcement")');
      if (addButton) {
        await addButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Fill announcement form
        await this.page.type('input[placeholder*="title"], input[name="title"]', announcement.title);
        await this.page.type('textarea[placeholder*="content"], textarea[name="content"]', announcement.content);
        
        // Submit form
        await this.page.click('button[type="submit"]');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log(`  ✅ Added announcement: ${announcement.title}`);
      } else {
        console.log(`  ⚠️ Could not find add announcement button for: ${announcement.title}`);
      }
    }
  }

  async addSampleEvents() {
    console.log('📅 Adding sample events...');
    
    await this.page.goto('https://parentlink-2024-app.web.app/calendar', {
      waitUntil: 'networkidle2'
    });
    
    const events = [
      {
        title: 'Math Test - Multiplication',
        description: 'Unit test on multiplication tables and word problems',
        date: '2024-03-15',
        time: '10:00 AM',
        location: 'Classroom 3A'
      },
      {
        title: 'Science Fair',
        description: 'Annual science fair showcasing student projects',
        date: '2024-03-25',
        time: '6:00 PM',
        location: 'School Gymnasium'
      },
      {
        title: 'Field Trip - Natural History Museum',
        description: 'Educational field trip to learn about dinosaurs and fossils',
        date: '2024-04-10',
        time: '9:00 AM',
        location: 'Natural History Museum'
      }
    ];

    for (const event of events) {
      console.log(`  Adding event: ${event.title}`);
      
      // Look for add event button
      const addButton = await this.page.$('button:has-text("Add Event"), button:has-text("Create Event"), button:has-text("New Event")');
      if (addButton) {
        await addButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Fill event form
        await this.page.type('input[placeholder*="title"], input[name="title"]', event.title);
        await this.page.type('textarea[placeholder*="description"], textarea[name="description"]', event.description);
        await this.page.type('input[type="date"], input[placeholder*="date"]', event.date);
        await this.page.type('input[placeholder*="time"], input[name="time"]', event.time);
        await this.page.type('input[placeholder*="location"], input[name="location"]', event.location);
        
        // Submit form
        await this.page.click('button[type="submit"]');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log(`  ✅ Added event: ${event.title}`);
      } else {
        console.log(`  ⚠️ Could not find add event button for: ${event.title}`);
      }
    }
  }

  async runSetup() {
    try {
      await this.setup();
      await this.loginAsTeacher();
      await this.addSampleStudents();
      await this.addSampleAnnouncements();
      await this.addSampleEvents();
      
      console.log('\n🎉 Sample data setup completed!');
      console.log('\n📋 Added sample data:');
      console.log('  👥 3 students');
      console.log('  📢 3 announcements');
      console.log('  📅 3 events');
      
    } catch (error) {
      console.error('❌ Setup failed:', error);
    } finally {
      await this.teardown();
    }
  }
}

// Run the setup
async function runSampleDataSetup() {
  const setup = new SampleDataWebSetup();
  await setup.runSetup();
}

runSampleDataSetup().catch(console.error);
