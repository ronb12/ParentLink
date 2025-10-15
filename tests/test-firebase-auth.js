const puppeteer = require('puppeteer');

async function testFirebaseAuth() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Testing Firebase Authentication directly...\n');
    
    // Go to the app
    await page.goto('https://parentlink-2024-app.web.app', {
      waitUntil: 'networkidle2'
    });
    
    // Wait for the app to load
    await page.waitForSelector('#root', { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test Firebase auth directly in the browser console
    console.log('🧪 Testing Firebase auth in browser console...');
    
    const authResult = await page.evaluate(async () => {
      try {
        // Check if Firebase is available
        if (typeof window.firebase === 'undefined') {
          return { error: 'Firebase not available' };
        }
        
        // Try to sign in
        const auth = window.firebase.auth();
        const result = await auth.signInWithEmailAndPassword('parent@test.com', 'password123');
        
        return {
          success: true,
          user: {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName
          }
        };
      } catch (error) {
        return {
          error: error.message,
          code: error.code
        };
      }
    });
    
    console.log('📊 Firebase Auth Result:', JSON.stringify(authResult, null, 2));
    
    if (authResult.success) {
      console.log('✅ Firebase authentication works directly!');
      console.log(`User: ${authResult.user.email} (${authResult.user.uid})`);
    } else {
      console.log('❌ Firebase authentication failed:', authResult.error);
    }
    
    // Test the app's authentication context
    console.log('\n🧪 Testing app authentication context...');
    
    const appAuthResult = await page.evaluate(async () => {
      try {
        // Check if the app's auth context is available
        if (typeof window.React !== 'undefined') {
          // Try to access the auth context
          const authContext = window.React.useContext;
          return { message: 'React context available' };
        }
        
        return { message: 'React not available' };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log('📊 App Auth Context Result:', JSON.stringify(appAuthResult, null, 2));
    
    // Check if there are any JavaScript errors
    console.log('\n🔍 Checking for JavaScript errors...');
    
    const errors = await page.evaluate(() => {
      return window.console.errors || [];
    });
    
    if (errors.length > 0) {
      console.log('❌ JavaScript errors found:', errors);
    } else {
      console.log('✅ No JavaScript errors found');
    }
    
    // Test manual login form interaction
    console.log('\n🧪 Testing manual login form interaction...');
    
    await page.goto('https://parentlink-2024-app.web.app/login', {
      waitUntil: 'networkidle2'
    });
    
    // Fill the form
    await page.waitForSelector('input[name="email"]', { timeout: 10000 });
    await page.type('input[name="email"]', 'parent@test.com');
    await page.type('input[name="password"]', 'password123');
    
    // Check if the form values are set correctly
    const formValues = await page.evaluate(() => {
      const emailInput = document.querySelector('input[name="email"]');
      const passwordInput = document.querySelector('input[name="password"]');
      return {
        email: emailInput ? emailInput.value : 'not found',
        password: passwordInput ? passwordInput.value : 'not found'
      };
    });
    
    console.log('📝 Form values:', formValues);
    
    // Try to trigger the form submission manually
    const submitResult = await page.evaluate(() => {
      try {
        const form = document.querySelector('form');
        if (form) {
          const event = new Event('submit', { bubbles: true, cancelable: true });
          form.dispatchEvent(event);
          return { success: true, message: 'Form submit event dispatched' };
        }
        return { error: 'Form not found' };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log('📊 Form submit result:', JSON.stringify(submitResult, null, 2));
    
    // Wait to see if anything happens
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testFirebaseAuth().catch(console.error);
