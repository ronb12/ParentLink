const puppeteer = require('puppeteer');

async function debugNewConfig() {
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
    console.log('🔍 Debugging with new Firebase configuration...\n');
    
    // Go to the app
    await page.goto('https://parentlink-2024-app.web.app', {
      waitUntil: 'networkidle2'
    });
    
    console.log('📄 App loaded');
    
    // Check if Firebase is initialized
    const firebaseStatus = await page.evaluate(() => {
      try {
        // Check if Firebase is available
        if (typeof window.firebase !== 'undefined') {
          return { status: 'Firebase available', version: window.firebase.SDK_VERSION };
        }
        
        // Check if the app is using the new Firebase v9+ modular SDK
        if (typeof window.firebaseApp !== 'undefined') {
          return { status: 'Firebase v9+ modular SDK available' };
        }
        
        return { status: 'Firebase not found' };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log('📊 Firebase Status:', JSON.stringify(firebaseStatus, null, 2));
    
    // Go to login page
    await page.goto('https://parentlink-2024-app.web.app/login', {
      waitUntil: 'networkidle2'
    });
    
    console.log('📄 Login page loaded');
    
    // Check if the form is working
    const formStatus = await page.evaluate(() => {
      try {
        const emailInput = document.querySelector('input[name="email"]');
        const passwordInput = document.querySelector('input[name="password"]');
        const submitButton = document.querySelector('button[type="submit"]');
        
        return {
          emailInput: emailInput ? 'found' : 'not found',
          passwordInput: passwordInput ? 'found' : 'not found',
          submitButton: submitButton ? 'found' : 'not found',
          submitDisabled: submitButton ? submitButton.disabled : 'N/A'
        };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log('📊 Form Status:', JSON.stringify(formStatus, null, 2));
    
    // Fill the form
    await page.type('input[name="email"]', 'parent@test.com');
    await page.type('input[name="password"]', 'password123');
    
    console.log('📝 Form filled');
    
    // Check form values
    const formValues = await page.evaluate(() => {
      const emailInput = document.querySelector('input[name="email"]');
      const passwordInput = document.querySelector('input[name="password"]');
      return {
        email: emailInput ? emailInput.value : 'not found',
        password: passwordInput ? passwordInput.value : 'not found'
      };
    });
    
    console.log('📊 Form Values:', JSON.stringify(formValues, null, 2));
    
    // Submit the form
    await page.click('button[type="submit"]');
    console.log('🚀 Form submitted');
    
    // Wait and monitor
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);
    
    // Check for any error messages
    const errorMessages = await page.evaluate(() => {
      const errorElements = document.querySelectorAll('.toast-error, [class*="error"], .error-message, .text-red-500, .text-red-600');
      return Array.from(errorElements).map(el => el.textContent);
    });
    
    if (errorMessages.length > 0) {
      console.log('❌ Error messages found:', errorMessages);
    }
    
    // Check for success messages
    const successMessages = await page.evaluate(() => {
      const successElements = document.querySelectorAll('.toast-success, [class*="success"], .success-message, .text-green-500, .text-green-600');
      return Array.from(successElements).map(el => el.textContent);
    });
    
    if (successMessages.length > 0) {
      console.log('✅ Success messages found:', successMessages);
    }
    
    // Check if there are any loading indicators
    const loadingStatus = await page.evaluate(() => {
      const loadingElements = document.querySelectorAll('[class*="loading"], [class*="spinner"], .animate-spin');
      return {
        loadingElements: loadingElements.length,
        submitButtonDisabled: document.querySelector('button[type="submit"]')?.disabled || false
      };
    });
    
    console.log('📊 Loading Status:', JSON.stringify(loadingStatus, null, 2));
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

debugNewConfig().catch(console.error);
