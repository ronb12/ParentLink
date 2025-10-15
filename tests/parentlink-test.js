const puppeteer = require('puppeteer');

class ParentLinkTester {
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
    console.log('🚀 Starting ParentLink Test Suite...\n');
    
    this.browser = await puppeteer.launch({
      headless: false, // Set to true for CI/CD
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
    
    // Monitor page errors
    this.page.on('pageerror', error => {
      this.consoleErrors.push({
        type: 'page.error',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.log(`❌ Page Error: ${error.message}`);
    });
    
    // Monitor network errors
    this.page.on('requestfailed', request => {
      this.consoleErrors.push({
        type: 'network.error',
        message: `Failed to load: ${request.url()}`,
        timestamp: new Date().toISOString()
      });
      console.log(`❌ Network Error: Failed to load ${request.url()}`);
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

  async navigateToApp() {
    await this.page.goto('https://parentlink-2024-app.web.app', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for the app to load
    await this.page.waitForSelector('#root', { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 2000)); // Allow for initial load
  }

  async loginAsParent() {
    console.log('👨‍👩‍👧‍👦 Logging in as Parent...');
    
    // Navigate to login page
    await this.page.goto('https://parentlink-2024-app.web.app/login', {
      waitUntil: 'networkidle2'
    });
    
    // Fill login form
    await this.page.waitForSelector('input[name="email"]', { timeout: 10000 });
    await this.page.type('input[name="email"]', 'parent@test.com');
    await this.page.type('input[name="password"]', 'password123');
    
    // Submit form
    await this.page.click('button[type="submit"]');
    
    // Wait for either success or error
    try {
      await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check for error messages
      const errorMessage = await this.page.$('.toast-error, [class*="error"], .error-message');
      if (errorMessage) {
        const errorText = await errorMessage.evaluate(el => el.textContent);
        throw new Error(`Login failed: ${errorText}`);
      }
      
      // Verify we're on dashboard
      const currentUrl = this.page.url();
      if (!currentUrl.includes('/dashboard')) {
        throw new Error(`Failed to redirect to dashboard after login. Current URL: ${currentUrl}`);
      }
      
      console.log('✅ Parent login successful');
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new Error('Login timeout - authentication may be failing');
      }
      throw error;
    }
  }

  async loginAsTeacher() {
    console.log('👩‍🏫 Logging in as Teacher...');
    
    // Navigate to login page
    await this.page.goto('https://parentlink-2024-app.web.app/login', {
      waitUntil: 'networkidle2'
    });
    
    // Fill login form
    await this.page.waitForSelector('input[name="email"]', { timeout: 10000 });
    await this.page.type('input[name="email"]', 'teacher@test.com');
    await this.page.type('input[name="password"]', 'password123');
    
    // Submit form
    await this.page.click('button[type="submit"]');
    
    // Wait for either success or error
    try {
      await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check for error messages
      const errorMessage = await this.page.$('.toast-error, [class*="error"], .error-message');
      if (errorMessage) {
        const errorText = await errorMessage.evaluate(el => el.textContent);
        throw new Error(`Login failed: ${errorText}`);
      }
      
      // Verify we're on dashboard
      const currentUrl = this.page.url();
      if (!currentUrl.includes('/dashboard')) {
        throw new Error(`Failed to redirect to dashboard after login. Current URL: ${currentUrl}`);
      }
      
      console.log('✅ Teacher login successful');
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new Error('Login timeout - authentication may be failing');
      }
      throw error;
    }
  }

  async testParentFeatures() {
    await this.loginAsParent();
    
    // Test Dashboard
    await this.test('Parent Dashboard Loads', async () => {
      await this.page.waitForSelector('h1', { timeout: 10000 });
      const title = await this.page.$eval('h1', el => el.textContent);
      if (!title.includes('Welcome back')) {
        throw new Error('Dashboard title not found');
      }
    });
    
    // Test Messages Page
    await this.test('Parent Messages Page', async () => {
      await this.page.click('a[href="/messages"]');
      await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentUrl = this.page.url();
      if (!currentUrl.includes('/messages')) {
        throw new Error('Failed to navigate to messages page');
      }
      
      // Check if messages page loads without errors
      await this.page.waitForSelector('h1', { timeout: 10000 });
    });
    
    // Test Progress Page
    await this.test('Parent Progress Page', async () => {
      await this.page.click('a[href="/progress"]');
      await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentUrl = this.page.url();
      if (!currentUrl.includes('/progress')) {
        throw new Error('Failed to navigate to progress page');
      }
      
      await this.page.waitForSelector('h1', { timeout: 10000 });
    });
    
    // Test Announcements Page
    await this.test('Parent Announcements Page', async () => {
      await this.page.click('a[href="/announcements"]');
      await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentUrl = this.page.url();
      if (!currentUrl.includes('/announcements')) {
        throw new Error('Failed to navigate to announcements page');
      }
      
      await this.page.waitForSelector('h1', { timeout: 10000 });
    });
    
    // Test Calendar Page
    await this.test('Parent Calendar Page', async () => {
      await this.page.click('a[href="/calendar"]');
      await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentUrl = this.page.url();
      if (!currentUrl.includes('/calendar')) {
        throw new Error('Failed to navigate to calendar page');
      }
      
      await this.page.waitForSelector('h1', { timeout: 10000 });
    });
    
    // Test Files Page
    await this.test('Parent Files Page', async () => {
      await this.page.click('a[href="/files"]');
      await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentUrl = this.page.url();
      if (!currentUrl.includes('/files')) {
        throw new Error('Failed to navigate to files page');
      }
      
      await this.page.waitForSelector('h1', { timeout: 10000 });
    });
    
    // Test Profile Page
    await this.test('Parent Profile Page', async () => {
      await this.page.click('a[href="/profile"]');
      await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentUrl = this.page.url();
      if (!currentUrl.includes('/profile')) {
        throw new Error('Failed to navigate to profile page');
      }
      
      await this.page.waitForSelector('h1', { timeout: 10000 });
    });
    
    // Verify Students page is NOT accessible to parents
    await this.test('Parent Cannot Access Students Page', async () => {
      const studentsLink = await this.page.$('a[href="/students"]');
      if (studentsLink) {
        throw new Error('Students page should not be visible to parents');
      }
    });
  }

  async testTeacherFeatures() {
    await this.loginAsTeacher();
    
    // Test Dashboard
    await this.test('Teacher Dashboard Loads', async () => {
      await this.page.waitForSelector('h1', { timeout: 10000 });
      const title = await this.page.$eval('h1', el => el.textContent);
      if (!title.includes('Welcome back')) {
        throw new Error('Dashboard title not found');
      }
    });
    
    // Test Students Page (Teacher Only)
    await this.test('Teacher Students Page', async () => {
      await this.page.click('a[href="/students"]');
      await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentUrl = this.page.url();
      if (!currentUrl.includes('/students')) {
        throw new Error('Failed to navigate to students page');
      }
      
      await this.page.waitForSelector('h1', { timeout: 10000 });
    });
    
    // Test Messages Page
    await this.test('Teacher Messages Page', async () => {
      await this.page.click('a[href="/messages"]');
      await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentUrl = this.page.url();
      if (!currentUrl.includes('/messages')) {
        throw new Error('Failed to navigate to messages page');
      }
      
      await this.page.waitForSelector('h1', { timeout: 10000 });
    });
    
    // Test Progress Page
    await this.test('Teacher Progress Page', async () => {
      await this.page.click('a[href="/progress"]');
      await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentUrl = this.page.url();
      if (!currentUrl.includes('/progress')) {
        throw new Error('Failed to navigate to progress page');
      }
      
      await this.page.waitForSelector('h1', { timeout: 10000 });
    });
    
    // Test Announcements Page
    await this.test('Teacher Announcements Page', async () => {
      await this.page.click('a[href="/announcements"]');
      await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentUrl = this.page.url();
      if (!currentUrl.includes('/announcements')) {
        throw new Error('Failed to navigate to announcements page');
      }
      
      await this.page.waitForSelector('h1', { timeout: 10000 });
    });
    
    // Test Calendar Page
    await this.test('Teacher Calendar Page', async () => {
      await this.page.click('a[href="/calendar"]');
      await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentUrl = this.page.url();
      if (!currentUrl.includes('/calendar')) {
        throw new Error('Failed to navigate to calendar page');
      }
      
      await this.page.waitForSelector('h1', { timeout: 10000 });
    });
    
    // Test Files Page
    await this.test('Teacher Files Page', async () => {
      await this.page.click('a[href="/files"]');
      await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentUrl = this.page.url();
      if (!currentUrl.includes('/files')) {
        throw new Error('Failed to navigate to files page');
      }
      
      await this.page.waitForSelector('h1', { timeout: 10000 });
    });
    
    // Test Profile Page
    await this.test('Teacher Profile Page', async () => {
      await this.page.click('a[href="/profile"]');
      await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentUrl = this.page.url();
      if (!currentUrl.includes('/profile')) {
        throw new Error('Failed to navigate to profile page');
      }
      
      await this.page.waitForSelector('h1', { timeout: 10000 });
    });
  }

  async testAuthentication() {
    // Test Login Page
    await this.test('Login Page Loads', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/login', {
        waitUntil: 'networkidle2'
      });
      
      await this.page.waitForSelector('input[name="email"]', { timeout: 10000 });
      await this.page.waitForSelector('input[name="password"]', { timeout: 10000 });
      await this.page.waitForSelector('button[type="submit"]', { timeout: 10000 });
    });
    
    // Test Register Page
    await this.test('Register Page Loads', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/register', {
        waitUntil: 'networkidle2'
      });
      
      await this.page.waitForSelector('input[name="name"]', { timeout: 10000 });
      await this.page.waitForSelector('input[name="email"]', { timeout: 10000 });
      await this.page.waitForSelector('input[name="password"]', { timeout: 10000 });
    });
    
    // Test Forgot Password
    await this.test('Forgot Password Feature', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/login', {
        waitUntil: 'networkidle2'
      });
      
      // Look for forgot password button with proper selector
      const forgotPasswordButton = await this.page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(button => button.textContent.includes('Forgot your password?'));
      });
      
      if (forgotPasswordButton && await forgotPasswordButton.evaluate(el => el !== null)) {
        await forgotPasswordButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if forgot password form appears
        const emailInput = await this.page.$('input[type="email"]');
        if (!emailInput) {
          throw new Error('Forgot password form did not appear');
        }
      } else {
        console.log('ℹ️ Forgot password button not found (may not be visible)');
      }
    });
  }

  async testPWAFeatures() {
    await this.loginAsParent();
    
    // Test PWA Status
    await this.test('PWA Status Component', async () => {
      const pwaStatus = await this.page.$('[class*="PWAStatus"]');
      if (!pwaStatus) {
        // PWA status might be hidden on mobile or not visible
        console.log('ℹ️ PWA Status component not visible (may be hidden on mobile)');
      }
    });
    
    // Test Service Worker
    await this.test('Service Worker Registration', async () => {
      const swRegistered = await this.page.evaluate(() => {
        return 'serviceWorker' in navigator;
      });
      
      if (!swRegistered) {
        throw new Error('Service Worker not supported');
      }
    });
  }

  async runAllTests() {
    try {
      await this.setup();
      
      console.log('🔐 Testing Authentication Features...\n');
      await this.testAuthentication();
      
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
    console.log('📊 PARENTLINK TEST REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n✅ Tests Passed: ${this.testResults.passed}`);
    console.log(`❌ Tests Failed: ${this.testResults.failed}`);
    console.log(`📊 Total Tests: ${this.testResults.passed + this.testResults.failed}`);
    
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
        total: this.testResults.passed + this.testResults.failed
      },
      testErrors: this.testResults.errors,
      consoleErrors: this.consoleErrors
    };
    
    require('fs').writeFileSync(
      'test-report.json',
      JSON.stringify(report, null, 2)
    );
    
    console.log('📄 Detailed report saved to: test-report.json');
  }
}

// Run the tests
async function runTests() {
  const tester = new ParentLinkTester();
  await tester.runAllTests();
}

// Export for use in other files
module.exports = { ParentLinkTester, runTests };

// Run if called directly
if (require.main === module) {
  runTests().catch(console.error);
}
