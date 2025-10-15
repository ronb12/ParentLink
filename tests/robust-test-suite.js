const puppeteer = require('puppeteer');

class RobustTestSuite {
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
    console.log('🚀 Starting Robust ParentLink Test Suite...\n');
    
    this.browser = await puppeteer.launch({
      headless: false,
      slowMo: 50,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-dev-shm-usage'
      ]
    });
    
    this.page = await this.browser.newPage();
    
    // Set viewport for consistent testing
    await this.page.setViewport({ width: 1280, height: 720 });
    
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

  async waitForNavigation(url, timeout = 15000) {
    try {
      // Method 1: Wait for URL change
      await this.page.waitForFunction(
        (expectedUrl) => window.location.href.includes(expectedUrl),
        { timeout },
        url
      );
      return true;
    } catch (error) {
      // Method 2: Wait for specific elements to appear
      try {
        if (url.includes('/dashboard')) {
          await this.page.waitForSelector('h1', { timeout: 5000 });
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    }
  }

  async loginAsParent() {
    console.log('👨‍👩‍👧‍👦 Logging in as Parent...');
    
    await this.page.goto('https://parentlink-2024-app.web.app/login', {
      waitUntil: 'networkidle2'
    });
    
    // Wait for form to be ready
    await this.page.waitForSelector('input[name="email"]', { timeout: 10000 });
    await this.page.waitForSelector('input[name="password"]', { timeout: 10000 });
    await this.page.waitForSelector('button[type="submit"]', { timeout: 10000 });
    
    // Clear any existing values
    await this.page.evaluate(() => {
      const emailInput = document.querySelector('input[name="email"]');
      const passwordInput = document.querySelector('input[name="password"]');
      if (emailInput) emailInput.value = '';
      if (passwordInput) passwordInput.value = '';
    });
    
    // Fill form
    await this.page.type('input[name="email"]', 'parent@test.com');
    await this.page.type('input[name="password"]', 'password123');
    
    // Submit form
    await this.page.click('button[type="submit"]');
    
    // Wait for navigation with multiple fallback methods
    const navigationSuccess = await this.waitForNavigation('/dashboard');
    
    if (!navigationSuccess) {
      // Fallback: Check current URL after a delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      const currentUrl = this.page.url();
      if (!currentUrl.includes('/dashboard')) {
        throw new Error(`Failed to redirect to dashboard. Current URL: ${currentUrl}`);
      }
    }
    
    console.log('✅ Parent login successful');
  }

  async loginAsTeacher() {
    console.log('👩‍🏫 Logging in as Teacher...');
    
    await this.page.goto('https://parentlink-2024-app.web.app/login', {
      waitUntil: 'networkidle2'
    });
    
    // Wait for form to be ready
    await this.page.waitForSelector('input[name="email"]', { timeout: 10000 });
    await this.page.waitForSelector('input[name="password"]', { timeout: 10000 });
    await this.page.waitForSelector('button[type="submit"]', { timeout: 10000 });
    
    // Clear any existing values
    await this.page.evaluate(() => {
      const emailInput = document.querySelector('input[name="email"]');
      const passwordInput = document.querySelector('input[name="password"]');
      if (emailInput) emailInput.value = '';
      if (passwordInput) passwordInput.value = '';
    });
    
    // Fill form
    await this.page.type('input[name="email"]', 'teacher@test.com');
    await this.page.type('input[name="password"]', 'password123');
    
    // Submit form
    await this.page.click('button[type="submit"]');
    
    // Wait for navigation with multiple fallback methods
    const navigationSuccess = await this.waitForNavigation('/dashboard');
    
    if (!navigationSuccess) {
      // Fallback: Check current URL after a delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      const currentUrl = this.page.url();
      if (!currentUrl.includes('/dashboard')) {
        throw new Error(`Failed to redirect to dashboard. Current URL: ${currentUrl}`);
      }
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

  async testFormValidation() {
    await this.test('Login Form Validation', async () => {
      await this.page.goto('https://parentlink-2024-app.web.app/login', {
        waitUntil: 'networkidle2'
      });
      
      // Test empty form submission
      await this.page.click('button[type="submit"]');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if form validation works
      const emailInput = await this.page.$('input[name="email"]');
      const passwordInput = await this.page.$('input[name="password"]');
      
      if (emailInput && passwordInput) {
        const emailRequired = await emailInput.evaluate(el => el.required);
        const passwordRequired = await passwordInput.evaluate(el => el.required);
        
        if (!emailRequired || !passwordRequired) {
          throw new Error('Form validation not properly configured');
        }
      }
    });
  }

  async testResponsiveDesign() {
    await this.loginAsParent();
    
    await this.test('Mobile Viewport', async () => {
      await this.page.setViewport({ width: 375, height: 667 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if mobile navigation is accessible
      const mobileMenu = await this.page.$('[class*="mobile"], [class*="hamburger"], [class*="menu"]');
      if (!mobileMenu) {
        console.log('ℹ️ Mobile menu not found (may be hidden or not implemented)');
      }
    });
    
    await this.test('Desktop Viewport', async () => {
      await this.page.setViewport({ width: 1280, height: 720 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if desktop navigation is accessible
      const desktopNav = await this.page.$('nav, [class*="navbar"], [class*="navigation"]');
      if (!desktopNav) {
        throw new Error('Desktop navigation not found');
      }
    });
  }

  async runAllTests() {
    try {
      await this.setup();
      
      console.log('🔐 Testing Authentication Features...\n');
      await this.testAuthenticationFeatures();
      
      console.log('📝 Testing Form Validation...\n');
      await this.testFormValidation();
      
      console.log('👨‍👩‍👧‍👦 Testing Parent Features...\n');
      await this.testParentFeatures();
      
      console.log('👩‍🏫 Testing Teacher Features...\n');
      await this.testTeacherFeatures();
      
      console.log('📱 Testing PWA Features...\n');
      await this.testPWAFeatures();
      
      console.log('📱 Testing Responsive Design...\n');
      await this.testResponsiveDesign();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    } finally {
      await this.teardown();
      this.generateReport();
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 ROBUST PARENTLINK TEST REPORT');
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
      'robust-test-report.json',
      JSON.stringify(report, null, 2)
    );
    
    console.log('📄 Detailed report saved to: robust-test-report.json');
  }
}

// Run the tests
async function runRobustTests() {
  const tester = new RobustTestSuite();
  await tester.runAllTests();
}

// Export for use in other files
module.exports = { RobustTestSuite, runRobustTests };

// Run if called directly
if (require.main === module) {
  runRobustTests().catch(console.error);
}
