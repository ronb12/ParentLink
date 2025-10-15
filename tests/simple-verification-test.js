const puppeteer = require('puppeteer');

async function simpleVerificationTest() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  let consoleErrors = [];
  let testResults = { passed: 0, failed: 0, errors: [] };
  
  // Monitor console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log(`❌ Console Error: ${msg.text()}`);
    }
  });
  
  page.on('pageerror', error => {
    consoleErrors.push(error.message);
    console.log(`❌ Page Error: ${error.message}`);
  });
  
  const test = async (name, testFunction) => {
    try {
      console.log(`🧪 Testing: ${name}`);
      await testFunction();
      testResults.passed++;
      console.log(`✅ PASSED: ${name}\n`);
    } catch (error) {
      testResults.failed++;
      testResults.errors.push({ test: name, error: error.message });
      console.log(`❌ FAILED: ${name} - ${error.message}\n`);
    }
  };
  
  try {
    console.log('🚀 Starting Simple ParentLink Verification Test...\n');
    
    // Test 1: App loads
    await test('App Loads Successfully', async () => {
      await page.goto('https://parentlink-2024-app.web.app', {
        waitUntil: 'networkidle2'
      });
      
      await page.waitForSelector('#root', { timeout: 10000 });
      const title = await page.title();
      if (!title.includes('ParentLink')) {
        throw new Error('App title does not contain ParentLink');
      }
    });
    
    // Test 2: Login page works
    await test('Login Page Accessible', async () => {
      await page.goto('https://parentlink-2024-app.web.app/login', {
        waitUntil: 'networkidle2'
      });
      
      await page.waitForSelector('input[name="email"]', { timeout: 10000 });
      await page.waitForSelector('input[name="password"]', { timeout: 10000 });
      await page.waitForSelector('button[type="submit"]', { timeout: 10000 });
    });
    
    // Test 3: Register page works
    await test('Register Page Accessible', async () => {
      await page.goto('https://parentlink-2024-app.web.app/register', {
        waitUntil: 'networkidle2'
      });
      
      await page.waitForSelector('input[name="name"]', { timeout: 10000 });
      await page.waitForSelector('input[name="email"]', { timeout: 10000 });
      await page.waitForSelector('select[name="role"]', { timeout: 10000 });
    });
    
    // Test 4: Parent login works
    await test('Parent Login Works', async () => {
      await page.goto('https://parentlink-2024-app.web.app/login', {
        waitUntil: 'networkidle2'
      });
      
      await page.type('input[name="email"]', 'parent@test.com');
      await page.type('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Wait for navigation without strict timeout
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const currentUrl = page.url();
      if (currentUrl.includes('/dashboard')) {
        console.log('✅ Parent login successful - redirected to dashboard');
      } else if (currentUrl.includes('/login')) {
        // Check for error messages
        const errorElements = await page.$$('.toast-error, [class*="error"], .error-message');
        if (errorElements.length > 0) {
          const errorText = await errorElements[0].evaluate(el => el.textContent);
          throw new Error(`Login failed: ${errorText}`);
        } else {
          throw new Error('Login failed - still on login page');
        }
      } else {
        console.log(`ℹ️ Parent login redirected to: ${currentUrl}`);
      }
    });
    
    // Test 5: Parent pages accessible
    if (page.url().includes('/dashboard')) {
      await test('Parent Dashboard Accessible', async () => {
        await page.waitForSelector('h1', { timeout: 10000 });
        const title = await page.$eval('h1', el => el.textContent);
        if (!title) {
          throw new Error('Dashboard title not found');
        }
      });
      
      await test('Parent Messages Page Accessible', async () => {
        await page.goto('https://parentlink-2024-app.web.app/messages', {
          waitUntil: 'networkidle2'
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        await page.waitForSelector('h1', { timeout: 10000 });
      });
      
      await test('Parent Progress Page Accessible', async () => {
        await page.goto('https://parentlink-2024-app.web.app/progress', {
          waitUntil: 'networkidle2'
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        await page.waitForSelector('h1', { timeout: 10000 });
      });
      
      await test('Parent Students Page Restricted', async () => {
        await page.goto('https://parentlink-2024-app.web.app/students', {
          waitUntil: 'networkidle2'
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const currentUrl = page.url();
        if (currentUrl.includes('/students')) {
          throw new Error('Students page should not be accessible to parents');
        }
      });
    }
    
    // Test 6: Teacher login works
    await test('Teacher Login Works', async () => {
      await page.goto('https://parentlink-2024-app.web.app/login', {
        waitUntil: 'networkidle2'
      });
      
      await page.type('input[name="email"]', 'teacher@test.com');
      await page.type('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Wait for navigation without strict timeout
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const currentUrl = page.url();
      if (currentUrl.includes('/dashboard')) {
        console.log('✅ Teacher login successful - redirected to dashboard');
      } else if (currentUrl.includes('/login')) {
        // Check for error messages
        const errorElements = await page.$$('.toast-error, [class*="error"], .error-message');
        if (errorElements.length > 0) {
          const errorText = await errorElements[0].evaluate(el => el.textContent);
          throw new Error(`Login failed: ${errorText}`);
        } else {
          throw new Error('Login failed - still on login page');
        }
      } else {
        console.log(`ℹ️ Teacher login redirected to: ${currentUrl}`);
      }
    });
    
    // Test 7: Teacher pages accessible (including students)
    if (page.url().includes('/dashboard')) {
      await test('Teacher Dashboard Accessible', async () => {
        await page.waitForSelector('h1', { timeout: 10000 });
        const title = await page.$eval('h1', el => el.textContent);
        if (!title) {
          throw new Error('Dashboard title not found');
        }
      });
      
      await test('Teacher Students Page Accessible', async () => {
        await page.goto('https://parentlink-2024-app.web.app/students', {
          waitUntil: 'networkidle2'
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        await page.waitForSelector('h1', { timeout: 10000 });
      });
    }
    
    // Test 8: PWA features
    await test('PWA Manifest Available', async () => {
      const manifestResponse = await page.goto('https://parentlink-2024-app.web.app/manifest.json');
      if (manifestResponse.status() !== 200) {
        throw new Error('PWA manifest not accessible');
      }
    });
    
    await test('PWA Icons Available', async () => {
      const iconResponse = await page.goto('https://parentlink-2024-app.web.app/icons/icon-192x192.svg');
      if (iconResponse.status() !== 200) {
        throw new Error('PWA icons not accessible');
      }
    });
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  } finally {
    await browser.close();
    
    // Generate report
    console.log('\n' + '='.repeat(60));
    console.log('📊 SIMPLE VERIFICATION TEST REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n✅ Tests Passed: ${testResults.passed}`);
    console.log(`❌ Tests Failed: ${testResults.failed}`);
    console.log(`📊 Total Tests: ${testResults.passed + testResults.failed}`);
    console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
    
    if (testResults.errors.length > 0) {
      console.log('\n❌ FAILED TESTS:');
      testResults.errors.forEach(error => {
        console.log(`  • ${error.test}: ${error.error}`);
      });
    }
    
    if (consoleErrors.length > 0) {
      console.log(`\n🚨 CONSOLE ERRORS FOUND: ${consoleErrors.length}`);
      consoleErrors.forEach(error => {
        console.log(`  • ${error}`);
      });
    } else {
      console.log('\n✅ NO CONSOLE ERRORS FOUND');
    }
    
    console.log('\n' + '='.repeat(60));
    
    // Save report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        passed: testResults.passed,
        failed: testResults.failed,
        total: testResults.passed + testResults.failed,
        successRate: ((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)
      },
      testErrors: testResults.errors,
      consoleErrors: consoleErrors
    };
    
    require('fs').writeFileSync(
      'simple-test-report.json',
      JSON.stringify(report, null, 2)
    );
    
    console.log('📄 Detailed report saved to: simple-test-report.json');
  }
}

simpleVerificationTest().catch(console.error);
