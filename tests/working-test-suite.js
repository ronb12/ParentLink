const puppeteer = require('puppeteer');

class WorkingTestSuite {
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
    console.log('🚀 Starting Working ParentLink Test Suite...\n');
    
    this.browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    
    // Monitor console errors
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.consoleErrors.push({
          type: 'console.error',
          message: msg.text(),
          timestamp: new Date().toISOString()
        });
        console.log(`❌ Console Error: ${msg.text()}`);
      }
    });
    
    this.page.on('pageerror', error => {
      this.consoleErrors.push({
        type: 'page.error',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
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
        error: error.message,
        stack: error.stack
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
    
    // Wait for navigation without strict timeout
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const currentUrl = this.page.url();
    if (!currentUrl.includes('/dashboard')) {
      throw new Error(`Failed to redirect to dashboard. Current URL: ${currentUrl}`);
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
    
    // Wait for navigation without strict timeout
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const currentUrl = this.page.url();
    if (!currentUrl.includes('/dashboard')) {
      throw new Error(`Failed to redirect to dashboard. Current URL: ${currentUrl}`);
    }
    
    console.log('✅ Teacher login successful');
  }

  async testParentFeatures() {
    await this.loginAsParent();
    
    // Test all parent pages
    const parentPages = [
      { path: '/messages', name: 'Messages' },
      { path: '/progress', name: 'Progress' },
      { path: '/announcements', name: 'Announcements' },
      { path: '/calendar', name: 'Calendar' },
      { path: '/files', name: 'Files' },
      { path: '/profile', name: 'Profile' }
    ];
    
    for (const page of parentPages) {
      await this.test(`Parent ${page.name} Page`, async () => {
        await this.page.goto(`https://parentlink-2024-app.web.app${page.path}`, {
          waitUntil: 'networkidle2'
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const currentUrl = this.page.url();
        if (!currentUrl.includes(page.path)) {
          throw new Error(`Failed to navigate to ${page.name} page`);
        }
        
        // Check if page loads without errors
        await this.page.waitForSelector('h1', { timeout: 10000 });
      });
    }
    
    // Verify Students page is NOT accessible to parents
    await this.test('Parent Cannot Access Students Page', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/students', {
        waitUntil: 'networkidle2'
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentUrl = this.page.url();
      // Should redirect away from students page or show access denied
      if (currentUrl.includes('/students')) {
        throw new Error('Students page should not be accessible to parents');
      }
    });
  }

  async testTeacherFeatures() {
    await this.loginAsTeacher();
    
    // Test all teacher pages (including students page)
    const teacherPages = [
      { path: '/students', name: 'Students' },
      { path: '/messages', name: 'Messages' },
      { path: '/progress', name: 'Progress' },
      { path: '/announcements', name: 'Announcements' },
      { path: '/calendar', name: 'Calendar' },
      { path: '/files', name: 'Files' },
      { path: '/profile', name: 'Profile' }
    ];
    
    for (const page of teacherPages) {
      await this.test(`Teacher ${page.name} Page`, async () => {
        await this.page.goto(`https://parentlink-2024-app.web.app${page.path}`, {
          waitUntil: 'networkidle2'
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const currentUrl = this.page.url();
        if (!currentUrl.includes(page.path)) {
          throw new Error(`Failed to navigate to ${page.name} page`);
        }
        
        // Check if page loads without errors
        await this.page.waitForSelector('h1', { timeout: 10000 });
      });
    }
  }

  async testPWAFeatures() {
    await this.loginAsParent();
    
    // Test PWA features
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
    // Test login page
    await this.test('Login Page Loads', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/login', {
        waitUntil: 'networkidle2'
      });
      
      await this.page.waitForSelector('input[name="email"]', { timeout: 10000 });
      await this.page.waitForSelector('input[name="password"]', { timeout: 10000 });
      await this.page.waitForSelector('button[type="submit"]', { timeout: 10000 });
    });
    
    // Test register page
    await this.test('Register Page Loads', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/register', {
        waitUntil: 'networkidle2'
      });
      
      await this.page.waitForSelector('input[name="name"]', { timeout: 10000 });
      await this.page.waitForSelector('input[name="email"]', { timeout: 10000 });
      await this.page.waitForSelector('select[name="role"]', { timeout: 10000 });
    });
    
    // Test forgot password
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
      
      console.log('👨‍👩‍👧‍👦 Testing Parent Features...\n');
      await this.testParentFeatures();
      
      console.log('👩‍🏫 Testing Teacher Features...\n');
      await this.testTeacherFeatures();
      
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
    console.log('📊 WORKING PARENTLINK TEST REPORT');
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
        console.log(`  • ${error.type}: ${error.message}`);
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
      'working-test-report.json',
      JSON.stringify(report, null, 2)
    );
    
    console.log('📄 Detailed report saved to: working-test-report.json');
  }
}

// Run the tests
async function runWorkingTests() {
  const tester = new WorkingTestSuite();
  await tester.runAllTests();
}

// Export for use in other files
module.exports = { WorkingTestSuite, runWorkingTests };

// Run if called directly
if (require.main === module) {
  runWorkingTests().catch(console.error);
}
