const puppeteer = require('puppeteer');

async function debugRegistration() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Monitor console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`❌ Console Error: ${msg.text()}`);
    }
  });
  
  page.on('pageerror', error => {
    console.log(`❌ Page Error: ${error.message}`);
  });
  
  try {
    console.log('🔍 Debugging registration form...\n');
    
    await page.goto('https://parentlink-2024-app.web.app/register', {
      waitUntil: 'networkidle2'
    });
    
    console.log('📄 Page loaded, checking form elements...');
    
    // Check if form elements exist
    const nameInput = await page.$('input[name="name"]');
    const emailInput = await page.$('input[name="email"]');
    const roleSelect = await page.$('select[name="role"]');
    const phoneInput = await page.$('input[name="phone"]');
    const schoolInput = await page.$('input[name="school"]');
    const passwordInput = await page.$('input[name="password"]');
    const confirmPasswordInput = await page.$('input[name="confirmPassword"]');
    const submitButton = await page.$('button[type="submit"]');
    
    console.log(`Name input: ${nameInput ? '✅' : '❌'}`);
    console.log(`Email input: ${emailInput ? '✅' : '❌'}`);
    console.log(`Role select: ${roleSelect ? '✅' : '❌'}`);
    console.log(`Phone input: ${phoneInput ? '✅' : '❌'}`);
    console.log(`School input: ${schoolInput ? '✅' : '❌'}`);
    console.log(`Password input: ${passwordInput ? '✅' : '❌'}`);
    console.log(`Confirm password input: ${confirmPasswordInput ? '✅' : '❌'}`);
    console.log(`Submit button: ${submitButton ? '✅' : '❌'}`);
    
    if (!nameInput || !emailInput || !roleSelect || !submitButton) {
      console.log('\n❌ Critical form elements missing!');
      
      // Get page content to debug
      const pageContent = await page.content();
      console.log('\n📄 Page HTML (first 1000 chars):');
      console.log(pageContent.substring(0, 1000));
      return;
    }
    
    console.log('\n📝 Filling registration form...');
    
    // Fill the form step by step
    await nameInput.type('Test Parent');
    console.log('✅ Name filled');
    
    await emailInput.type('parent@test.com');
    console.log('✅ Email filled');
    
    await roleSelect.select('parent');
    console.log('✅ Role selected');
    
    // Wait for role-specific fields to appear
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (phoneInput) {
      await phoneInput.type('(555) 123-4567');
      console.log('✅ Phone filled');
    }
    
    if (schoolInput) {
      await schoolInput.type('Test Elementary School');
      console.log('✅ School filled');
    }
    
    // Check for grade field (parent specific)
    const gradeInput = await page.$('input[name="grade"]');
    if (gradeInput) {
      await gradeInput.type('3rd Grade');
      console.log('✅ Grade filled');
    }
    
    if (passwordInput) {
      await passwordInput.type('password123');
      console.log('✅ Password filled');
    }
    
    if (confirmPasswordInput) {
      await confirmPasswordInput.type('password123');
      console.log('✅ Confirm password filled');
    }
    
    console.log('\n🚀 Submitting form...');
    
    // Take screenshot before submit
    await page.screenshot({ path: 'before-submit.png' });
    console.log('📸 Screenshot saved: before-submit.png');
    
    await submitButton.click();
    console.log('✅ Form submitted');
    
    // Wait and check for results
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const currentUrl = page.url();
    console.log(`\n📍 Current URL: ${currentUrl}`);
    
    // Check for error messages
    const errorElements = await page.$$('.toast-error, [class*="error"], .error-message, .text-red-500, .text-red-600');
    if (errorElements.length > 0) {
      console.log('\n❌ Error messages found:');
      for (const errorEl of errorElements) {
        const errorText = await errorEl.evaluate(el => el.textContent);
        console.log(`  - ${errorText}`);
      }
    }
    
    // Check for success messages
    const successElements = await page.$$('.toast-success, [class*="success"], .success-message, .text-green-500, .text-green-600');
    if (successElements.length > 0) {
      console.log('\n✅ Success messages found:');
      for (const successEl of successElements) {
        const successText = await successEl.evaluate(el => el.textContent);
        console.log(`  - ${successText}`);
      }
    }
    
    // Take screenshot after submit
    await page.screenshot({ path: 'after-submit.png' });
    console.log('📸 Screenshot saved: after-submit.png');
    
    if (currentUrl.includes('/dashboard')) {
      console.log('\n🎉 Registration successful! Redirected to dashboard.');
    } else if (currentUrl.includes('/login')) {
      console.log('\n✅ Registration successful! Redirected to login.');
    } else {
      console.log('\n⚠️ Registration may have failed - no redirect to expected page.');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

debugRegistration().catch(console.error);
