// tests/broken-buttons.spec.js
import { test, expect } from '@playwright/test';

test.describe('Broken Buttons Test', () => {
  test('should check main page for broken buttons', async ({ browser }) => {
    test.setTimeout(180000); // 3 minutes
    
    // Create initial page to get button list
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('http://localhost:5000/');
    await page.waitForLoadState('networkidle');
    
    // Get all clickable elements
    const clickableElements = await page.evaluate(() => {
      const elements = [
        ...document.querySelectorAll('button:not([disabled])'),
        ...document.querySelectorAll('[role="button"]:not([disabled])'),
        ...document.querySelectorAll('.btn:not([disabled]), .button:not([disabled])'),
        ...document.querySelectorAll('[data-testid*="button"]:not([disabled])')
      ];
      
      return elements
        .filter(el => {
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && 
                 style.visibility !== 'hidden' && 
                 el.offsetParent !== null;
        })
        .map((el, index) => ({
          index,
          tagName: el.tagName,
          text: el.textContent?.trim().substring(0, 40) || '',
          className: el.className,
          id: el.id,
          xpath: getXPath(el)
        }));
        
      function getXPath(element) {
        if (element.id) return `//*[@id="${element.id}"]`;
        if (element === document.body) return '/html/body';
        
        let ix = 0;
        const siblings = element.parentNode?.childNodes || [];
        for (let i = 0; i < siblings.length; i++) {
          const sibling = siblings[i];
          if (sibling === element) {
            const tag = element.tagName.toLowerCase();
            return getXPath(element.parentNode) + `/${tag}[${ix + 1}]`;
          }
          if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
            ix++;
          }
        }
      }
    });
    
    await context.close();
    
    console.log(`Found ${clickableElements.length} clickable elements to test`);
    
    const buttonResults = [];
    
    for (let i = 0; i < clickableElements.length; i++) {
      const buttonInfo = clickableElements[i];
      let result = {
        button: buttonInfo,
        status: 'unknown',
        error: null
      };
      
      console.log(`Testing button ${i + 1}/${clickableElements.length}: "${buttonInfo.text}"`);
      
      try {
        // Create a fresh context for each button test
        const testContext = await browser.newContext();
        const testPage = await testContext.newPage();
        
        // Set up error listeners
        const pageErrors = [];
        testPage.on('pageerror', (error) => {
          pageErrors.push(error.message);
        });
        
        testPage.on('console', (msg) => {
          if (msg.type() === 'error') {
            pageErrors.push(msg.text());
          }
        });
        
        // Navigate to main page
        await testPage.goto('http://localhost:5000/', { waitUntil: 'networkidle' });
        
        // Find the button using XPath or ID
        let button;
        if (buttonInfo.id) {
          button = testPage.locator(`#${buttonInfo.id}`);
        } else if (buttonInfo.xpath) {
          button = testPage.locator(`xpath=${buttonInfo.xpath}`);
        } else {
          button = testPage.locator(`${buttonInfo.tagName}`).filter({ hasText: buttonInfo.text }).first();
        }
        
        // Check if button exists and is visible
        const isVisible = await button.isVisible({ timeout: 5000 }).catch(() => false);
        if (!isVisible) {
          result.status = 'not_found';
          result.error = 'Button not found or not visible';
        } else {
          // Check if button is enabled
          const isEnabled = await button.isEnabled().catch(() => false);
          if (!isEnabled) {
            result.status = 'disabled';
            result.error = 'Button is disabled';
          } else {
            // Try to click the button with timeout protection
            const clickPromise = button.click({ timeout: 5000 });
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Click timeout')), 10000)
            );
            
            try {
              await Promise.race([clickPromise, timeoutPromise]);
              
              // Wait a bit to see what happens
              await testPage.waitForTimeout(2000);
              
              // Check for JavaScript errors
              if (pageErrors.length > 0) {
                result.status = 'js_error';
                result.error = `JavaScript errors: ${pageErrors.join(', ')}`;
              } else {
                result.status = 'clicked_successfully';
                result.error = null;
              }
              
            } catch (clickError) {
              if (clickError.message.includes('Click timeout')) {
                result.status = 'slow_response';
                result.error = 'Button click caused slow response or hang';
              } else {
                result.status = 'click_error';
                result.error = clickError.message;
              }
            }
          }
        }
        
        // Clean up this test context
        await testContext.close();
        
      } catch (error) {
        result.status = 'context_error';
        result.error = `Context error: ${error.message}`;
      }
      
      buttonResults.push(result);
    }
    
    // Report results
    console.log('\n📊 BUTTON TEST RESULTS:');
    
    const successful = buttonResults.filter(r => r.status === 'clicked_successfully');
    const errors = buttonResults.filter(r => r.status.includes('error'));
    const notFound = buttonResults.filter(r => r.status === 'not_found');
    const disabled = buttonResults.filter(r => r.status === 'disabled');
    const slowResponse = buttonResults.filter(r => r.status === 'slow_response');
    
    console.log(`✅ Working buttons: ${successful.length}`);
    console.log(`❌ Error buttons: ${errors.length}`);
    console.log(`⚪ Not found: ${notFound.length}`);
    console.log(`🔒 Disabled: ${disabled.length}`);
    console.log(`🐌 Slow response: ${slowResponse.length}`);
    
    if (errors.length > 0) {
      console.log('\n❌ BUTTONS WITH ERRORS:');
      errors.forEach((result, index) => {
        console.log(`  ${index + 1}. "${result.button.text}" (${result.button.tagName}) - ${result.error}`);
      });
    }
    
    if (slowResponse.length > 0) {
      console.log('\n🐌 SLOW RESPONSE BUTTONS:');
      slowResponse.forEach((result, index) => {
        console.log(`  ${index + 1}. "${result.button.text}" (${result.button.tagName})`);
      });
    }
    
    // Only fail if there are actual critical errors
    const criticalErrors = errors.filter(r => !r.status.includes('slow_response'));
    expect(criticalErrors.length).toBe(0);
  });
});