import puppeteer from 'puppeteer';

describe('Web Platform End-to-End Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should load the homepage and display key elements', async () => {
    await page.goto('http://localhost:3000/web-platform/index.html');
    await page.waitForSelector('header nav');
    const title = await page.title();
    expect(title).toBe('BiasBuster - AI-Powered Media Bias Detection');
    const heroText = await page.$eval('#hero h1', el => el.textContent);
    expect(heroText).toContain('Detect Media Bias in Real-Time');
  });

  it('should navigate to media literacy page and verify content', async () => {
    await page.goto('http://localhost:3000/web-platform/media-literacy.html');
    await page.waitForSelector('main');
    const heading = await page.$eval('main h1', el => el.textContent);
    expect(heading).toBe('Understanding Media Bias');
  });

  it('should perform demo text analysis and display results', async () => {
    await page.goto('http://localhost:3000/web-platform/index.html#demo');
    await page.waitForSelector('#analysis-input');
    await page.type('#analysis-input', 'This is a test news article with potential bias.');
    await page.click('#analyze-button');
    await page.waitForSelector('.analysis-results-container', { timeout: 5000 });
    const resultExists = await page.$('.analysis-results-container') !== null;
    expect(resultExists).toBe(true);
  });

  it('should verify navigation links work', async () => {
    await page.goto('http://localhost:3000/web-platform/index.html');
    await page.click('nav ul li a[href="media-literacy.html"]');
    await page.waitForNavigation();
    const url = page.url();
    expect(url).toContain('media-literacy.html');
  });
});
