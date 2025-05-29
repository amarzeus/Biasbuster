/**
 * Screenshot Generation Script for Biasbuster
 * 
 * This script uses Puppeteer to capture screenshots of the Biasbuster
 * web platform and Chrome extension in action for documentation.
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Make sure the docs directory exists
const docsDir = path.join(__dirname, '..', 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

// List of screenshots to capture
const screenshots = [
  {
    name: 'web-platform-demo.png',
    url: 'http://localhost:8080/web-platform/',
    selector: '.demo',
    description: 'Screenshot of the web platform demo interface'
  },
  {
    name: 'bias-heatmap.png',
    url: 'http://localhost:8080/web-platform/',
    selector: '#bias-visualization',
    description: 'Visualization of bias heatmap'
  },
  {
    name: 'extension-popup.png',
    url: 'chrome-extension://popup/popup.html',
    viewport: { width: 400, height: 600 },
    description: 'Chrome extension popup'
  },
  {
    name: 'flowchart-preview.png',
    url: 'https://github.com/amarzeus/Biasbuster/blob/main/FLOWCHART.md',
    selector: '.markdown-body',
    description: 'Preview of the flowchart from GitHub'
  }
];

async function captureScreenshots() {
  console.log('Starting screenshot capture...');
  
  try {
    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: {
        width: 1280,
        height: 800
      }
    });
    
    // Process each screenshot
    for (const screenshot of screenshots) {
      console.log(`Capturing ${screenshot.name}...`);
      
      try {
        const page = await browser.newPage();
        
        // Set custom viewport if specified
        if (screenshot.viewport) {
          await page.setViewport(screenshot.viewport);
        }
        
        // Navigate to URL
        await page.goto(screenshot.url, { waitUntil: 'networkidle2' });
        
        // Wait for selector if specified
        if (screenshot.selector) {
          await page.waitForSelector(screenshot.selector);
        }
        
        // Take screenshot
        const element = screenshot.selector 
          ? await page.$(screenshot.selector) 
          : null;
          
        const outputPath = path.join(docsDir, screenshot.name);
        
        if (element) {
          await element.screenshot({ path: outputPath });
        } else {
          await page.screenshot({ path: outputPath });
        }
        
        console.log(`✅ Captured ${screenshot.name}`);
      } catch (err) {
        console.error(`❌ Failed to capture ${screenshot.name}:`, err.message);
        
        // Create a placeholder image with error text
        createPlaceholderImage(
          path.join(docsDir, screenshot.name),
          `Failed to capture: ${screenshot.description}\nError: ${err.message}`
        );
      }
    }
    
    await browser.close();
    console.log('Screenshot capture complete!');
    
  } catch (err) {
    console.error('Error during screenshot capture:', err);
  }
}

/**
 * Create a placeholder text file for missing screenshots
 */
function createPlaceholderImage(filePath, text) {
  const placeholder = `[This would be a screenshot image: ${text}]`;
  fs.writeFileSync(filePath, placeholder);
  console.log(`Created placeholder for ${path.basename(filePath)}`);
}

// Check if puppeteer is installed
try {
  require.resolve('puppeteer');
  captureScreenshots();
} catch (err) {
  console.log('Puppeteer is not installed. Creating placeholders instead...');
  
  // Create placeholder images
  for (const screenshot of screenshots) {
    createPlaceholderImage(
      path.join(docsDir, screenshot.name),
      screenshot.description
    );
  }
  
  console.log('Placeholder creation complete!');
  console.log('To generate actual screenshots, run: npm install puppeteer --save-dev');
} 