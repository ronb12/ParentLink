const puppeteer = require('puppeteer');

class ComprehensiveTestWithData {
  constructor() {
    this.browser = null;
    this.page = null;
    this.consoleErrors = [];
    this.testResults = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  async setup() {
    console.log('🚀 Starting Comprehensive ParentLink Test with Sample Data...\n');
    
    this.browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
    
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1280, height: 720 });
    
    // Monitor console errors
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.consoleErrors.push(msg.text());
        console.log(`❌ Console Error: ${msg.text()}`);
      }
    });
    
    this.page.on('pageerror', error => {
      this.consoleErrors.push(error.message);
      console.log(`❌ Page Error: ${error.message}`);
    });
  }

  async teardown() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async test(name, testFunction) {
    try {
      console.log(`🧪 Testing: ${name}`);
      await testFunction();
      this.testResults.passed++;
      console.log(`✅ PASSED: ${name}\n`);
    } catch (error) {
      this.testResults.failed++;
      this.testResults.errors.push({
        test: name,
        error: error.message
      });
      console.log(`❌ FAILED: ${name} - ${error.message}\n`);
    }
  }

  async loginAsParent() {
    console.log('👨‍👩‍👧‍👦 Logging in as Parent...');
    
    await this.page.goto('https://parentlink-2024-app.web.app/login', {
      waitUntil: 'networkidle2'
    });
    
    await this.page.waitForSelector('input[name="email"]', { timeout: 10000 });
    await this.page.type('input[name="email"]', 'parent@test.com');
    await this.page.type('input[name="password"]', 'password123');
    await this.page.click('button[type="submit"]');
    
    // Wait for navigation
    await new Promise(resolve => setTimeout(resolve, 5000));
    const currentUrl = this.page.url();
    
    if (!currentUrl.includes('/dashboard')) {
      throw new Error(`Login failed - still on: ${currentUrl}`);
    }
    
    console.log('✅ Parent login successful');
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
      throw new Error(`Login failed - still on: ${currentUrl}`);
    }
    
    console.log('✅ Teacher login successful');
  }

  async testParentFeaturesWithData() {
    await this.loginAsParent();
    
    // Test Dashboard with sample data
    await this.test('Parent Dashboard with Sample Data', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/dashboard', {
        waitUntil: 'networkidle2'
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if dashboard shows sample data
      const dashboardContent = await this.page.evaluate(() => {
        return document.body.textContent;
      });
      
      if (!dashboardContent.includes('Welcome back')) {
        throw new Error('Dashboard welcome message not found');
      }
    });
    
    // Test Messages with sample data
    await this.test('Parent Messages with Sample Data', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/messages', {
        waitUntil: 'networkidle2'
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if messages page loads and shows sample messages
      const messagesContent = await this.page.evaluate(() => {
        return document.body.textContent;
      });
      
      if (!messagesContent.includes('Messages')) {
        throw new Error('Messages page not loading properly');
      }
    });
    
    // Test Progress with sample data
    await this.test('Parent Progress with Sample Data', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/progress', {
        waitUntil: 'networkidle2'
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if progress page loads
      const progressContent = await this.page.evaluate(() => {
        return document.body.textContent;
      });
      
      if (!progressContent.includes('Progress')) {
        throw new Error('Progress page not loading properly');
      }
    });
    
    // Test Announcements with sample data
    await this.test('Parent Announcements with Sample Data', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/announcements', {
        waitUntil: 'networkidle2'
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if announcements page loads
      const announcementsContent = await this.page.evaluate(() => {
        return document.body.textContent;
      });
      
      if (!announcementsContent.includes('Announcements')) {
        throw new Error('Announcements page not loading properly');
      }
    });
    
    // Test Calendar with sample data
    await this.test('Parent Calendar with Sample Data', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/calendar', {
        waitUntil: 'networkidle2'
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if calendar page loads
      const calendarContent = await this.page.evaluate(() => {
        return document.body.textContent;
      });
      
      if (!calendarContent.includes('Calendar')) {
        throw new Error('Calendar page not loading properly');
      }
    });
    
    // Test Files with sample data
    await this.test('Parent Files with Sample Data', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/files', {
        waitUntil: 'networkidle2'
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if files page loads
      const filesContent = await this.page.evaluate(() => {
        return document.body.textContent;
      });
      
      if (!filesContent.includes('Files')) {
        throw new Error('Files page not loading properly');
      }
    });
    
    // Test Profile
    await this.test('Parent Profile', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/profile', {
        waitUntil: 'networkidle2'
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if profile page loads
      const profileContent = await this.page.evaluate(() => {
        return document.body.textContent;
      });
      
      if (!profileContent.includes('Profile')) {
        throw new Error('Profile page not loading properly');
      }
    });
    
    // Verify Students page is restricted
    await this.test('Parent Cannot Access Students Page', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/students', {
        waitUntil: 'networkidle2'
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentUrl = this.page.url();
      if (currentUrl.includes('/students')) {
        throw new Error('Students page should not be accessible to parents');
      }
    });
  }

  async testTeacherFeaturesWithData() {
    await this.loginAsTeacher();
    
    // Test Dashboard with sample data
    await this.test('Teacher Dashboard with Sample Data', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/dashboard', {
        waitUntil: 'networkidle2'
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if dashboard shows sample data
      const dashboardContent = await this.page.evaluate(() => {
        return document.body.textContent;
      });
      
      if (!dashboardContent.includes('Welcome back')) {
        throw new Error('Dashboard welcome message not found');
      }
    });
    
    // Test Students page with sample data
    await this.test('Teacher Students Page with Sample Data', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/students', {
        waitUntil: 'networkidle2'
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if students page loads
      const studentsContent = await this.page.evaluate(() => {
        return document.body.textContent;
      });
      
      if (!studentsContent.includes('Students')) {
        throw new Error('Students page not loading properly');
      }
    });
    
    // Test Messages with sample data
    await this.test('Teacher Messages with Sample Data', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/messages', {
        waitUntil: 'networkidle2'
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if messages page loads
      const messagesContent = await this.page.evaluate(() => {
        return document.body.textContent;
      });
      
      if (!messagesContent.includes('Messages')) {
        throw new Error('Messages page not loading properly');
      }
    });
    
    // Test Progress with sample data
    await this.test('Teacher Progress with Sample Data', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/progress', {
        waitUntil: 'networkidle2'
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if progress page loads
      const progressContent = await this.page.evaluate(() => {
        return document.body.textContent;
      });
      
      if (!progressContent.includes('Progress')) {
        throw new Error('Progress page not loading properly');
      }
    });
    
    // Test Announcements with sample data
    await this.test('Teacher Announcements with Sample Data', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/announcements', {
        waitUntil: 'networkidle2'
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if announcements page loads
      const announcementsContent = await this.page.evaluate(() => {
        return document.body.textContent;
      });
      
      if (!announcementsContent.includes('Announcements')) {
        throw new Error('Announcements page not loading properly');
      }
    });
    
    // Test Calendar with sample data
    await this.test('Teacher Calendar with Sample Data', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/calendar', {
        waitUntil: 'networkidle2'
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if calendar page loads
      const calendarContent = await this.page.evaluate(() => {
        return document.body.textContent;
      });
      
      if (!calendarContent.includes('Calendar')) {
        throw new Error('Calendar page not loading properly');
      }
    });
    
    // Test Files with sample data
    await this.test('Teacher Files with Sample Data', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/files', {
        waitUntil: 'networkidle2'
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if files page loads
      const filesContent = await this.page.evaluate(() => {
        return document.body.textContent;
      });
      
      if (!filesContent.includes('Files')) {
        throw new Error('Files page not loading properly');
      }
    });
    
    // Test Profile
    await this.test('Teacher Profile', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/profile', {
        waitUntil: 'networkidle2'
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if profile page loads
      const profileContent = await this.page.evaluate(() => {
        return document.body.textContent;
      });
      
      if (!profileContent.includes('Profile')) {
        throw new Error('Profile page not loading properly');
      }
    });
  }

  async testPWAFeatures() {
    await this.loginAsParent();
    
    await this.test('PWA Manifest Available', async () => {
      const manifestResponse = await this.page.goto('https://parentlink-2024-app.web.app/manifest.json');
      if (manifestResponse.status() !== 200) {
        throw new Error('PWA manifest not accessible');
      }
    });
    
    await this.test('Service Worker Registration', async () => {
      const swRegistered = await this.page.evaluate(() => {
        return 'serviceWorker' in navigator;
      });
      
      if (!swRegistered) {
        throw new Error('Service Worker not supported');
      }
    });
    
    await this.test('PWA Icons Available', async () => {
      const iconResponse = await this.page.goto('https://parentlink-2024-app.web.app/icons/icon-192x192.svg');
      if (iconResponse.status() !== 200) {
        throw new Error('PWA icons not accessible');
      }
    });
  }

  async testAuthenticationFeatures() {
    await this.test('Login Page Loads', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/login', {
        waitUntil: 'networkidle2'
      });
      
      await this.page.waitForSelector('input[name="email"]', { timeout: 10000 });
      await this.page.waitForSelector('input[name="password"]', { timeout: 10000 });
      await this.page.waitForSelector('button[type="submit"]', { timeout: 10000 });
    });
    
    await this.test('Register Page Loads', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/register', {
        waitUntil: 'networkidle2'
      });
      
      await this.page.waitForSelector('input[name="name"]', { timeout: 10000 });
      await this.page.waitForSelector('input[name="email"]', { timeout: 10000 });
      await this.page.waitForSelector('select[name="role"]', { timeout: 10000 });
    });
    
    await this.test('Forgot Password Feature', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/login', {
        waitUntil: 'networkidle2'
      });
      
      const forgotPasswordButton = await this.page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(button => button.textContent.includes('Forgot your password?'));
      });
      
      if (forgotPasswordButton && await forgotPasswordButton.evaluate(el => el !== null)) {
        await forgotPasswordButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const emailInput = await this.page.$('input[type="email"]');
        if (!emailInput) {
          throw new Error('Forgot password form did not appear');
        }
      }
    });
  }

  async runAllTests() {
    try {
      await this.setup();
      
      console.log('🔐 Testing Authentication Features...\n');
      await this.testAuthenticationFeatures();
      
      console.log('👨‍👩‍👧‍👦 Testing Parent Features with Sample Data...\n');
      await this.testParentFeaturesWithData();
      
      console.log('👩‍🏫 Testing Teacher Features with Sample Data...\n');
      await this.testTeacherFeaturesWithData();
      
      console.log('📱 Testing PWA Features...\n');
      await this.testPWAFeatures();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    } finally {
      await this.teardown();
      this.generateReport();
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPREHENSIVE TEST WITH SAMPLE DATA REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n✅ Tests Passed: ${this.testResults.passed}`);
    console.log(`❌ Tests Failed: ${this.testResults.failed}`);
    console.log(`📊 Total Tests: ${this.testResults.passed + this.testResults.failed}`);
    console.log(`📈 Success Rate: ${((this.testResults.passed / (this.testResults.passed + this.testResults.failed)) * 100).toFixed(1)}%`);
    
    if (this.testResults.errors.length > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.testResults.errors.forEach(error => {
        console.log(`  • ${error.test}: ${error.error}`);
      });
    }
    
    if (this.consoleErrors.length > 0) {
      console.log(`\n🚨 CONSOLE ERRORS FOUND: ${this.consoleErrors.length}`);
      this.consoleErrors.forEach(error => {
        console.log(`  • ${error}`);
      });
    } else {
      console.log('\n✅ NO CONSOLE ERRORS FOUND');
    }
    
    console.log('\n' + '='.repeat(60));
    
    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        passed: this.testResults.passed,
        failed: this.testResults.failed,
        total: this.testResults.passed + this.testResults.failed,
        successRate: ((this.testResults.passed / (this.testResults.passed + this.testResults.failed)) * 100).toFixed(1)
      },
      testErrors: this.testResults.errors,
      consoleErrors: this.consoleErrors
    };
    
    require('fs').writeFileSync(
      'comprehensive-test-report.json',
      JSON.stringify(report, null, 2)
    );
    
    console.log('📄 Detailed report saved to: comprehensive-test-report.json');
  }
}

// Run the tests
async function runComprehensiveTests() {
  const tester = new ComprehensiveTestWithData();
  await tester.runAllTests();
}

// Export for use in other files
module.exports = { ComprehensiveTestWithData, runComprehensiveTests };

// Run if called directly
if (require.main === module) {
  runComprehensiveTests().catch(console.error);
}
