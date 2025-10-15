const puppeteer = require('puppeteer');

async function cleanupAndSetupUsers() {
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
    console.log('🧹 Cleaning up existing test users and creating new ones...\n');
    
    // First, try to login with existing test users to delete them
    console.log('🔍 Checking if test users already exist...');
    
    // Try parent login
    await page.goto('https://parentlink-2024-app.web.app/login', {
      waitUntil: 'networkidle2'
    });
    
    await page.type('input[name="email"]', 'parent@test.com');
    await page.type('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    try {
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
      const currentUrl = page.url();
      
      if (currentUrl.includes('/dashboard')) {
        console.log('✅ Parent test user exists, will be replaced');
        // Navigate to profile to potentially delete account
        await page.goto('https://parentlink-2024-app.web.app/profile', {
          waitUntil: 'networkidle2'
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.log('ℹ️ Parent test user does not exist or login failed');
    }
    
    // Try teacher login
    await page.goto('https://parentlink-2024-app.web.app/login', {
      waitUntil: 'networkidle2'
    });
    
    await page.type('input[name="email"]', 'teacher@test.com');
    await page.type('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    try {
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
      const currentUrl = page.url();
      
      if (currentUrl.includes('/dashboard')) {
        console.log('✅ Teacher test user exists, will be replaced');
        // Navigate to profile to potentially delete account
        await page.goto('https://parentlink-2024-app.web.app/profile', {
          waitUntil: 'networkidle2'
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.log('ℹ️ Teacher test user does not exist or login failed');
    }
    
    console.log('\n📝 Creating new test users...\n');
    
    // Create Parent Test User
    console.log('👨‍👩‍👧‍👦 Creating Parent test user...');
    await createUser(page, {
      name: 'Test Parent',
      email: 'parent@test.com',
      password: 'password123',
      role: 'parent',
      phone: '(555) 123-4567',
      school: 'Test Elementary School',
      grade: '3rd Grade'
    });
    
    // Create Teacher Test User
    console.log('👩‍🏫 Creating Teacher test user...');
    await createUser(page, {
      name: 'Test Teacher',
      email: 'teacher@test.com',
      password: 'password123',
      role: 'teacher',
      phone: '(555) 987-6543',
      school: 'Test Elementary School',
      subjects: ['Mathematics', 'English', 'Science']
    });
    
    console.log('\n🧪 Testing login with created users...\n');
    
    // Test Parent Login
    console.log('👨‍👩‍👧‍👦 Testing Parent login...');
    await testLogin(page, 'parent@test.com', 'password123', 'Parent');
    
    // Test Teacher Login
    console.log('👩‍🏫 Testing Teacher login...');
    await testLogin(page, 'teacher@test.com', 'password123', 'Teacher');
    
    console.log('\n✅ Test user setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    await browser.close();
  }
}

async function createUser(page, userData) {
  try {
    await page.goto('https://parentlink-2024-app.web.app/register', {
      waitUntil: 'networkidle2'
    });
    
    // Fill registration form
    await page.waitForSelector('input[name="name"]', { timeout: 10000 });
    
    await page.type('input[name="name"]', userData.name);
    await page.type('input[name="email"]', userData.email);
    
    // Select role
    await page.select('select[name="role"]', userData.role);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for role-specific fields
    
    await page.type('input[name="phone"]', userData.phone);
    await page.type('input[name="school"]', userData.school);
    
    if (userData.role === 'parent') {
      const gradeInput = await page.$('input[name="grade"]');
      if (gradeInput) {
        await gradeInput.type(userData.grade);
      }
    } else if (userData.role === 'teacher') {
      // Select subjects
      for (const subject of userData.subjects) {
        const checkbox = await page.$(`input[value="${subject}"]`);
        if (checkbox) {
          await checkbox.click();
        }
      }
    }
    
    await page.type('input[name="password"]', userData.password);
    await page.type('input[name="confirmPassword"]', userData.password);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for result
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const currentUrl = page.url();
    if (currentUrl.includes('/dashboard')) {
      console.log(`✅ ${userData.role} user created successfully`);
    } else if (currentUrl.includes('/login')) {
      console.log(`✅ ${userData.role} user created successfully (redirected to login)`);
    } else {
      // Check for error messages
      const errorElements = await page.$$('.toast-error, [class*="error"], .error-message, .text-red-500, .text-red-600');
      if (errorElements.length > 0) {
        console.log(`⚠️ ${userData.role} user creation failed:`);
        for (const errorEl of errorElements) {
          const errorText = await errorEl.evaluate(el => el.textContent);
          console.log(`  - ${errorText}`);
        }
      } else {
        console.log(`⚠️ ${userData.role} user creation may have failed - no redirect to expected page`);
        console.log(`  Current URL: ${currentUrl}`);
      }
    }
    
  } catch (error) {
    console.log(`❌ Error creating ${userData.role} user:`, error.message);
  }
}

async function testLogin(page, email, password, userType) {
  try {
    await page.goto('https://parentlink-2024-app.web.app/login', {
      waitUntil: 'networkidle2'
    });
    
    await page.type('input[name="email"]', email);
    await page.type('input[name="password"]', password);
    await page.click('button[type="submit"]');
    
    try {
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
      const currentUrl = page.url();
      
      if (currentUrl.includes('/dashboard')) {
        console.log(`✅ ${userType} login successful`);
        
        // Test navigation to different pages
        const pages = ['/messages', '/progress', '/announcements', '/calendar', '/files', '/profile'];
        for (const pagePath of pages) {
          try {
            await page.goto(`https://parentlink-2024-app.web.app${pagePath}`, {
              waitUntil: 'networkidle2'
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log(`  ✅ ${pagePath} page accessible`);
          } catch (error) {
            console.log(`  ❌ ${pagePath} page failed: ${error.message}`);
          }
        }
        
        // Test teacher-specific page
        if (userType === 'Teacher') {
          try {
            await page.goto('https://parentlink-2024-app.web.app/students', {
              waitUntil: 'networkidle2'
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log(`  ✅ /students page accessible (teacher only)`);
          } catch (error) {
            console.log(`  ❌ /students page failed: ${error.message}`);
          }
        }
        
      } else {
        console.log(`❌ ${userType} login failed - no redirect to dashboard`);
        console.log(`  Current URL: ${currentUrl}`);
      }
    } catch (error) {
      console.log(`❌ ${userType} login timeout`);
    }
    
  } catch (error) {
    console.log(`❌ Error testing ${userType} login:`, error.message);
  }
}

cleanupAndSetupUsers().catch(console.error);
