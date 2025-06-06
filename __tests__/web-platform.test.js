const puppeteer = require('puppeteer');
const http = require('http');
const { app } = require('../src/index'); // Import the Express app

describe('Web Platform End-to-End Tests', () => {
  let browser;
  let page;
  let server;

  beforeAll(async () => {
    // Start the server
    server = http.createServer(app);
    await new Promise(resolve => server.listen(3000, resolve)); // Listen on port 3000

    browser = await puppeteer.launch({
      headless: 'new', // Or true for older versions
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--remote-debugging-port=9222']
    });
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
  }, 30000); // Increased timeout for beforeAll

  afterAll(async () => {
    await browser.close();
    await new Promise(resolve => server.close(resolve)); // Stop the server
  }, 30000); // Increased timeout for afterAll

  beforeEach(async () => {
    // Ensure page is available, navigation will happen in tests
    // Clearing localStorage is now done after page.goto in each test
  });

  test('homepage loads and displays key elements', async () => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear()); // Clear LS after page load
    
    // Check title
    const title = await page.title();
    expect(title).toContain('BiasBuster');
    
    // Check hero section
    const heroText = await page.$eval('h1', el => el.textContent);
    expect(heroText).toContain('Detect Media Bias');
  }, 30000);

  test('demo text analysis works', async () => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear()); // Clear LS after page load
    
    // Type test text
    await page.type('#analysis-input', 'This is a test article for bias analysis.');
    
    // Click analyze button
    await page.click('#analyze-button');
    
    // Wait for results
    await page.waitForSelector('.analysis-results', { timeout: 10000 });
    
    // Check results are displayed
    const results = await page.$eval('.analysis-results', el => el.textContent);
    expect(results).toBeTruthy();
  }, 30000);

  test('navigation works correctly', async () => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Click media literacy link
    await page.click('a[href="/media-literacy"]');
    await page.waitForSelector('h1');
    
    const pageTitle = await page.$eval('h1', el => el.textContent);
    expect(pageTitle).toContain('Media Literacy');
  }, 30000);

  test('authentication flow works', async () => {
    await page.goto('http://localhost:3000/auth', { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear()); // Clear LS after page load
    
    // Fill login form
    await page.type('#email', 'test@example.com');
    await page.type('#password', 'testpassword');
    
    // Submit form
    await page.click('#login-button');
    
    // Check for success message or redirect
    await page.waitForSelector('.success-message, #dashboard', { timeout: 10000 });
    
    // Verify authentication
    const token = await page.evaluate(() => localStorage.getItem('authToken'));
    expect(token).toBeTruthy();
  }, 30000);

  test('bias analysis with API integration', async () => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear()); // Clear LS after page load
    
    // Mock API response
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.url().includes('/api/analysis/analyze')) {
        request.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            MainTopic: 'Test Analysis',
            BiasDetected: 'yes',
            BiasInstances: [{
              Sentence: 'Test sentence',
              BiasType: 'Test bias',
              Explanation: 'Test explanation'
            }]
          })
        });
      } else {
        request.continue();
      }
    });
    
    // Perform analysis
    await page.type('#analysis-input', 'Test article text');
    await page.click('#analyze-button');
    
    // Check results
    await page.waitForSelector('.bias-detected', { timeout: 10000 });
    const biasResult = await page.$eval('.bias-detected', el => el.textContent);
    expect(biasResult).toContain('Bias Detected');
  }, 30000);
});
