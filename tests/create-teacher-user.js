const puppeteer = require('puppeteer');

async function createTeacherUser() {
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
    console.log('👩‍🏫 Creating Teacher test user...\n');
    
    await page.goto('https://parentlink-2024-app.web.app/register', {
      waitUntil: 'networkidle2'
    });
    
    // Fill registration form
    await page.waitForSelector('input[name="name"]', { timeout: 10000 });
    
    await page.type('input[name="name"]', 'Test Teacher');
    await page.type('input[name="email"]', 'teacher@test.com');
    
    // Select role
    await page.select('select[name="role"]', 'teacher');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for role-specific fields
    
    await page.type('input[name="phone"]', '(555) 987-6543');
    await page.type('input[name="school"]', 'Test Elementary School');
    
    // Select subjects
    const subjects = ['Mathematics', 'English', 'Science'];
    for (const subject of subjects) {
      const checkbox = await page.$(`input[value="${subject}"]`);
      if (checkbox) {
        await checkbox.click();
        console.log(`✅ Selected subject: ${subject}`);
      }
    }
    
    await page.type('input[name="password"]', 'password123');
    await page.type('input[name="confirmPassword"]', 'password123');
    
    // Submit form
    console.log('🚀 Submitting teacher registration...');
    await page.click('button[type="submit"]');
    
    // Wait for result
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('/dashboard')) {
      console.log('✅ Teacher user created successfully');
    } else if (currentUrl.includes('/login')) {
      console.log('✅ Teacher user created successfully (redirected to login)');
    } else {
      // Check for error messages
      const errorElements = await page.$$('.toast-error, [class*="error"], .error-message, .text-red-500, .text-red-600');
      if (errorElements.length > 0) {
        console.log('⚠️ Teacher user creation failed:');
        for (const errorEl of errorElements) {
          const errorText = await errorEl.evaluate(el => el.textContent);
          console.log(`  - ${errorText}`);
        }
      } else {
        console.log('⚠️ Teacher user creation may have failed - no redirect to expected page');
      }
    }
    
  } catch (error) {
    console.log(`❌ Error creating teacher user:`, error.message);
  } finally {
    await browser.close();
  }
}

createTeacherUser().catch(console.error);
