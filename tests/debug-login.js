const puppeteer = require('puppeteer');

async function debugLogin() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Monitor all console messages
  page.on('console', msg => {
    console.log(`📝 Console [${msg.type()}]: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.log(`❌ Page Error: ${error.message}`);
  });
  
  page.on('requestfailed', request => {
    console.log(`❌ Request Failed: ${request.url()} - ${request.failure().errorText}`);
  });
  
  try {
    console.log('🔍 Debugging login process...\n');
    
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
    
    // Take screenshot before submit
    await page.screenshot({ path: 'debug-login-before.png' });
    console.log('📸 Screenshot saved: debug-login-before.png');
    
    // Submit form
    await page.click('button[type="submit"]');
    console.log('🚀 Form submitted');
    
    // Wait and monitor what happens
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const currentUrl = page.url();
    console.log(`📍 Current URL after submit: ${currentUrl}`);
    
    // Check for any error messages
    const errorElements = await page.$$('.toast-error, [class*="error"], .error-message, .text-red-500, .text-red-600');
    if (errorElements.length > 0) {
      console.log('❌ Error messages found:');
      for (const errorEl of errorElements) {
        const errorText = await errorEl.evaluate(el => el.textContent);
        console.log(`  - ${errorText}`);
      }
    }
    
    // Check for success messages
    const successElements = await page.$$('.toast-success, [class*="success"], .success-message, .text-green-500, .text-green-600');
    if (successElements.length > 0) {
      console.log('✅ Success messages found:');
      for (const successEl of successElements) {
        const successText = await successEl.evaluate(el => el.textContent);
        console.log(`  - ${successText}`);
      }
    }
    
    // Check if we're still on login page
    if (currentUrl.includes('/login')) {
      console.log('⚠️ Still on login page - checking form state');
      
      // Check if form is disabled
      const submitButton = await page.$('button[type="submit"]');
      if (submitButton) {
        const isDisabled = await submitButton.evaluate(el => el.disabled);
        console.log(`Submit button disabled: ${isDisabled}`);
      }
      
      // Check if there are any loading indicators
      const loadingElements = await page.$$('[class*="loading"], [class*="spinner"], .animate-spin');
      if (loadingElements.length > 0) {
        console.log('🔄 Loading indicators found - form may still be processing');
      }
    }
    
    // Take screenshot after submit
    await page.screenshot({ path: 'debug-login-after.png' });
    console.log('📸 Screenshot saved: debug-login-after.png');
    
    // Wait a bit more to see if anything changes
    console.log('⏳ Waiting 5 more seconds to see if anything changes...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const finalUrl = page.url();
    console.log(`📍 Final URL: ${finalUrl}`);
    
    if (finalUrl.includes('/dashboard')) {
      console.log('🎉 Login successful! Redirected to dashboard.');
    } else if (finalUrl.includes('/login')) {
      console.log('❌ Login failed - still on login page.');
    } else {
      console.log(`ℹ️ Redirected to: ${finalUrl}`);
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

debugLogin().catch(console.error);
