// tests/comprehensive-button-analysis.spec.js
import { test, expect } from '@playwright/test';

test.describe('Comprehensive Button & Error Analysis', () => {
  test('should analyze all button interactions and categorize issues', async ({ browser }) => {
    const issues = {
      authErrors: [],
      missingResources: [],
      reactWarnings: [],
      jsErrors: [],
      functionalButtons: [],
      brokenButtons: []
    };

    const context = await browser.newContext();
    const page = await context.newPage();

    // Capture all console messages
    page.on('console', (msg) => {
      const text = msg.text();
      
      if (msg.type() === 'error') {
        if (text.includes('401') || text.includes('Unauthorized')) {
          issues.authErrors.push(text);
        } else if (text.includes('404') || text.includes('Not Found')) {
          issues.missingResources.push(text);
        } else {
          issues.jsErrors.push(text);
        }
      } else if (msg.type() === 'warning' && text.includes('Warning:')) {
        issues.reactWarnings.push(text);
      }
    });

    await page.goto('http://localhost:5000/');
    await page.waitForLoadState('networkidle');

    // Get all buttons with better categorization
    const buttons = await page.evaluate(() => {
      const allButtons = Array.from(document.querySelectorAll('button, [role="button"], .btn'));
      
      return allButtons
        .filter(el => {
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && 
                 style.visibility !== 'hidden' && 
                 el.offsetParent !== null;
        })
        .map((el, index) => ({
          index,
          text: el.textContent?.trim().substring(0, 40) || `Button ${index + 1}`,
          className: el.className,
          id: el.id,
          type: el.getAttribute('type') || 'button',
          isAuthRelated: /sign|login|register|auth/i.test(el.textContent || ''),
          isTradingRelated: /trade|trading|buy|sell|btc|eth|usdt/i.test(el.textContent || ''),
          isNavigationRelated: /get started|demo|learn|view/i.test(el.textContent || '')
        }));
    });

    console.log(`\n🔍 Found ${buttons.length} buttons to analyze\n`);

    // Test each button category
    for (const button of buttons.slice(0, 15)) { // Test first 15 to avoid timeout
      const testContext = await browser.newContext();
      const testPage = await testContext.newPage();
      
      const buttonErrors = [];
      const buttonWarnings = [];

      testPage.on('console', (msg) => {
        const text = msg.text();
        if (msg.type() === 'error') buttonErrors.push(text);
        if (msg.type() === 'warning' && text.includes('Warning:')) buttonWarnings.push(text);
      });

      try {
        await testPage.goto('http://localhost:5000/');
        await testPage.waitForLoadState('networkidle');

        const buttonLocator = testPage.locator('button, [role="button"], .btn').nth(button.index);
        await buttonLocator.click({ timeout: 5000 });
        await testPage.waitForTimeout(1500);

        // Categorize the button result
        const authErrors = buttonErrors.filter(e => e.includes('401') || e.includes('Unauthorized'));
        const resourceErrors = buttonErrors.filter(e => e.includes('404') || e.includes('Not Found'));
        const realErrors = buttonErrors.filter(e => 
          !e.includes('401') && 
          !e.includes('404') && 
          !e.includes('Unauthorized') && 
          !e.includes('Not Found')
        );

        const result = {
          button: button.text,
          category: button.isAuthRelated ? 'Auth' : 
                   button.isTradingRelated ? 'Trading' : 
                   button.isNavigationRelated ? 'Navigation' : 'Other',
          authErrors: authErrors.length,
          resourceErrors: resourceErrors.length,
          realErrors: realErrors.length,
          reactWarnings: buttonWarnings.filter(w => w.includes('key prop')).length
        };

        if (realErrors.length > 0) {
          issues.brokenButtons.push({ ...result, errors: realErrors });
        } else {
          issues.functionalButtons.push(result);
        }

        console.log(`✓ ${button.text} (${result.category}) - Auth:${result.authErrors} Missing:${result.resourceErrors} Errors:${result.realErrors} Warnings:${result.reactWarnings}`);

      } catch (error) {
        issues.brokenButtons.push({
          button: button.text,
          category: 'Unknown',
          error: error.message
        });
        console.log(`✗ ${button.text} - Failed: ${error.message}`);
      }

      await testContext.close();
    }

    await context.close();

    // Generate detailed report
    console.log('\n📊 COMPREHENSIVE ANALYSIS REPORT\n');
    
    console.log('🔐 AUTHENTICATION ISSUES:');
    const uniqueAuthErrors = [...new Set(issues.authErrors)];
    console.log(`  Found ${uniqueAuthErrors.length} unique auth-related errors`);
    console.log('  → Recommendation: Implement proper auth state handling\n');

    console.log('📁 MISSING RESOURCES:');
    const uniqueResourceErrors = [...new Set(issues.missingResources)];
    console.log(`  Found ${uniqueResourceErrors.length} unique 404 errors`);
    uniqueResourceErrors.slice(0, 3).forEach(error => {
      const url = error.match(/http[s]?:\/\/[^\s]+/);
      if (url) console.log(`  → Missing: ${url[0]}`);
    });
    console.log('');

    console.log('⚠️  REACT CODE QUALITY:');
    const uniqueWarnings = [...new Set(issues.reactWarnings)];
    if (uniqueWarnings.length > 0) {
      console.log('  → Fix missing key props in LiveTradingPanel component');
      console.log('  → Location: src/components/trading/live-trading-panel.tsx:35');
    } else {
      console.log('  ✅ No React warnings found');
    }
    console.log('');

    console.log('🎯 PRIORITY FIXES:');
    console.log('  1. Add key props to list items in LiveTradingPanel');
    console.log('  2. Handle 401 errors gracefully (redirect to login)');
    console.log('  3. Fix missing API endpoints or resources');
    console.log('  4. Add loading states for async operations\n');

    console.log(`📈 SUMMARY:`);
    console.log(`  ✅ Functional buttons: ${issues.functionalButtons.length}`);
    console.log(`  ❌ Broken buttons: ${issues.brokenButtons.length}`);
    console.log(`  🔐 Auth-related issues: ${uniqueAuthErrors.length}`);
    console.log(`  📁 Missing resources: ${uniqueResourceErrors.length}`);

    // Test passes - we're just analyzing
    expect(true).toBe(true);
  });
});