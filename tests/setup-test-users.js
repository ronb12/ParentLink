const puppeteer = require('puppeteer');

class TestUserSetup {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async setup() {
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

  async createTestUsers() {
    console.log('🔧 Setting up test users...\n');
    
    await this.page.goto('https://parentlink-2024-app.web.app/register', {
      waitUntil: 'networkidle2'
    });

    // Create Parent Test User
    console.log('👨‍👩‍👧‍👦 Creating Parent test user...');
    await this.createUser({
      name: 'Test Parent',
      email: 'parent@test.com',
      password: 'password123',
      role: 'parent',
      phone: '(555) 123-4567',
      school: 'Test Elementary School',
      grade: '3rd Grade'
    });

    // Create Teacher Test User
    console.log('👩‍🏫 Creating Teacher test user...');
    await this.createUser({
      name: 'Test Teacher',
      email: 'teacher@test.com',
      password: 'password123',
      role: 'teacher',
      phone: '(555) 987-6543',
      school: 'Test Elementary School',
      subjects: ['Mathematics', 'English', 'Science']
    });

    console.log('✅ Test users created successfully!');
  }

  async createUser(userData) {
    try {
      // Fill registration form
      await this.page.waitForSelector('input[name="name"]', { timeout: 10000 });
      
      await this.page.type('input[name="name"]', userData.name);
      await this.page.type('input[name="email"]', userData.email);
      
      // Select role
      await this.page.select('select[name="role"]', userData.role);
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait for role-specific fields
      
      await this.page.type('input[name="phone"]', userData.phone);
      await this.page.type('input[name="school"]', userData.school);
      
      if (userData.role === 'parent') {
        await this.page.type('input[name="grade"]', userData.grade);
      } else if (userData.role === 'teacher') {
        // Select subjects
        for (const subject of userData.subjects) {
          const checkbox = await this.page.$(`input[value="${subject}"]`);
          if (checkbox) {
            await checkbox.click();
          }
        }
      }
      
      await this.page.type('input[name="password"]', userData.password);
      await this.page.type('input[name="confirmPassword"]', userData.password);
      
      // Submit form
      await this.page.click('button[type="submit"]');
      
      // Wait for success or error
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check for success (redirect to dashboard)
      const currentUrl = this.page.url();
      if (currentUrl.includes('/dashboard')) {
        console.log(`✅ ${userData.role} user created successfully`);
        // Logout to create next user
        const signOutButton = await this.page.evaluateHandle(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(button => button.textContent.includes('Sign Out'));
        });
        if (signOutButton && await signOutButton.evaluate(el => el !== null)) {
          await signOutButton.click();
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        // Check for error messages
        const errorMessage = await this.page.$('.toast-error, [class*="error"]');
        if (errorMessage) {
          const errorText = await errorMessage.evaluate(el => el.textContent);
          console.log(`⚠️ ${userData.role} user creation failed: ${errorText}`);
        } else {
          console.log(`⚠️ ${userData.role} user creation may have failed - no redirect to dashboard`);
        }
      }
      
    } catch (error) {
      console.log(`❌ Error creating ${userData.role} user:`, error.message);
    }
  }

  async testLogin() {
    console.log('\n🧪 Testing login with created users...\n');
    
    // Test Parent Login
    console.log('👨‍👩‍👧‍👦 Testing Parent login...');
    await this.page.goto('https://parentlink-2024-app.web.app/login', {
      waitUntil: 'networkidle2'
    });
    
    await this.page.type('input[name="email"]', 'parent@test.com');
    await this.page.type('input[name="password"]', 'password123');
    await this.page.click('button[type="submit"]');
    
    try {
      await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
      const currentUrl = this.page.url();
      if (currentUrl.includes('/dashboard')) {
        console.log('✅ Parent login successful');
      } else {
        console.log('❌ Parent login failed');
      }
    } catch (error) {
      console.log('❌ Parent login timeout');
    }
    
    // Logout
    const signOutButton = await this.page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(button => button.textContent.includes('Sign Out'));
    });
    if (signOutButton && await signOutButton.evaluate(el => el !== null)) {
      await signOutButton.click();
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test Teacher Login
    console.log('👩‍🏫 Testing Teacher login...');
    await this.page.goto('https://parentlink-2024-app.web.app/login', {
      waitUntil: 'networkidle2'
    });
    
    await this.page.type('input[name="email"]', 'teacher@test.com');
    await this.page.type('input[name="password"]', 'password123');
    await this.page.click('button[type="submit"]');
    
    try {
      await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
      const currentUrl = this.page.url();
      if (currentUrl.includes('/dashboard')) {
        console.log('✅ Teacher login successful');
      } else {
        console.log('❌ Teacher login failed');
      }
    } catch (error) {
      console.log('❌ Teacher login timeout');
    }
  }

  async run() {
    try {
      await this.setup();
      await this.createTestUsers();
      await this.testLogin();
    } catch (error) {
      console.error('❌ Setup failed:', error);
    } finally {
      await this.teardown();
    }
  }
}

// Run if called directly
if (require.main === module) {
  const setup = new TestUserSetup();
  setup.run().catch(console.error);
}

module.exports = TestUserSetup;
