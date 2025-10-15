const puppeteer = require('puppeteer');

async function quickLoginTest() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Quick Login Test with Updated Firebase Config...\n');
    
    // Go to login page
    await page.goto('https://parentlink-2024-app.web.app/login', {
      waitUntil: 'networkidle2'
    });
    
    console.log('📄 Login page loaded');
    
    // Fill login form
    await page.waitForSelector('input[name="email"]', { timeout: 10000 });
    await page.type('input[name="email"]', 'parent@test.com');
    await page.type('input[name="password"]', 'password123');
    
    console.log('📝 Login form filled');
    
    // Submit form
    await page.click('button[type="submit"]');
    console.log('🚀 Form submitted');
    
    // Wait for navigation
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('/dashboard')) {
      console.log('🎉 Login successful! Redirected to dashboard.');
      
      // Test a few pages
      console.log('\n🧪 Testing page navigation...');
      
      await page.goto('https://parentlink-2024-app.web.app/messages', {
        waitUntil: 'networkidle2'
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('✅ Messages page accessible');
      
      await page.goto('https://parentlink-2024-app.web.app/progress', {
        waitUntil: 'networkidle2'
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('✅ Progress page accessible');
      
      await page.goto('https://parentlink-2024-app.web.app/students', {
        waitUntil: 'networkidle2'
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      const studentsUrl = page.url();
      if (studentsUrl.includes('/students')) {
        console.log('⚠️ Students page accessible (should be restricted for parents)');
      } else {
        console.log('✅ Students page properly restricted for parents');
      }
      
    } else if (currentUrl.includes('/login')) {
      console.log('❌ Login failed - still on login page.');
      
      // Check for error messages
      const errorElements = await page.$$('.toast-error, [class*="error"], .error-message, .text-red-500, .text-red-600');
      if (errorElements.length > 0) {
        console.log('❌ Error messages found:');
        for (const errorEl of errorElements) {
          const errorText = await errorEl.evaluate(el => el.textContent);
          console.log(`  - ${errorText}`);
        }
      }
    } else {
      console.log(`ℹ️ Redirected to: ${currentUrl}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

quickLoginTest().catch(console.error);
