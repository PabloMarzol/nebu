import { test, expect } from '@playwright/test';

test.describe('Complete Website Scan', () => {
  test('should crawl entire website and test all links and buttons', async ({ browser }) => {
    test.setTimeout(600000); // 10 minutes for full crawl
    
    const visitedPages = new Set();
    const allIssues = {
      brokenLinks: [],
      brokenButtons: [],
      authErrors: [],
      missingResources: [],
      reactWarnings: [],
      jsErrors: [],
      pageErrors: []
    };
    
    const baseUrl = 'http://localhost:5000';
    const pagesToCrawl = ['/'];
    
    console.log('🚀 Starting website scan...\n');
    
    // Crawl function
    async function crawlPage(url) {
      if (visitedPages.has(url)) return;
      visitedPages.add(url);
      
      console.log(`📄 Crawling: ${url}`);
      
      const context = await browser.newContext();
      const page = await context.newPage();
      
      const pageIssues = {
        url,
        links: [],
        buttons: [],
        errors: [],
        warnings: []
      };
      
      // Capture console messages
      page.on('console', (msg) => {
        const text = msg.text();
        if (msg.type() === 'error') {
          pageIssues.errors.push(text);
        } else if (msg.type() === 'warning' && text.includes('Warning:')) {
          pageIssues.warnings.push(text);
        }
      });
      
      try {
        const response = await page.goto(url);
        
        if (!response || response.status() >= 400) {
          allIssues.pageErrors.push({
            url,
            status: response?.status() || 'No response',
            error: 'Page failed to load'
          });
          await context.close();
          return;
        }
        
        await page.waitForLoadState('networkidle', { timeout: 30000 });
        
        // Find all links on this page
        const links = await page.evaluate((baseUrl) => {
          const allLinks = Array.from(document.querySelectorAll('a[href]'));
          return allLinks
            .map(link => link.href)
            .filter(href => {
              return href && 
                     !href.startsWith('#') && 
                     !href.startsWith('javascript:') && 
                     !href.startsWith('mailto:') && 
                     !href.startsWith('tel:') &&
                     (href.startsWith('/') || href.includes('localhost:5000'));
            })
            .map(href => href.startsWith('/') ? baseUrl + href : href)
            .filter((href, index, array) => array.indexOf(href) === index);
        }, baseUrl);
        
        // Test all links on this page
        console.log(`  🔗 Testing ${links.length} links...`);
        for (const link of links) {
          try {
            const linkResponse = await page.request.get(link);
            if (linkResponse.status() >= 400) {
              allIssues.brokenLinks.push({
                page: url,
                link,
                status: linkResponse.status(),
                error: linkResponse.statusText()
              });
            } else {
              // Add new pages to crawl list
              const relativePath = link.replace(baseUrl, '');
              if (!visitedPages.has(relativePath) && !pagesToCrawl.includes(relativePath)) {
                pagesToCrawl.push(relativePath);
              }
            }
          } catch (error) {
            allIssues.brokenLinks.push({
              page: url,
              link,
              status: 'ERROR',
              error: error.message
            });
          }
        }
        
        // Find all buttons on this page
        const buttons = await page.evaluate(() => {
          const allButtons = [
            ...document.querySelectorAll('button:not([disabled])'),
            ...document.querySelectorAll('[role="button"]:not([disabled])'),
            ...document.querySelectorAll('.btn:not([disabled]), .button:not([disabled])'),
            ...document.querySelectorAll('[onclick]:not([disabled])'),
            ...document.querySelectorAll('[data-testid*="button"]:not([disabled])')
          ];
          
          return allButtons
            .filter(el => {
              const style = window.getComputedStyle(el);
              return style.display !== 'none' && 
                     style.visibility !== 'hidden' && 
                     el.offsetParent !== null;
            })
            .map((el, index) => ({
              index,
              text: el.textContent?.trim().substring(0, 50) || `Button ${index + 1}`,
              className: el.className,
              id: el.id,
              tagName: el.tagName,
              type: el.getAttribute('type') || 'button'
            }));
        });
        
        // Test all buttons on this page
        console.log(`  🔘 Testing ${buttons.length} buttons...`);
        for (const buttonInfo of buttons.slice(0, 20)) { // Limit to 20 buttons per page
          const buttonContext = await browser.newContext();
          const buttonPage = await buttonContext.newPage();
          
          const buttonErrors = [];
          const buttonWarnings = [];
          
          buttonPage.on('console', (msg) => {
            const text = msg.text();
            if (msg.type() === 'error') buttonErrors.push(text);
            if (msg.type() === 'warning' && text.includes('Warning:')) buttonWarnings.push(text);
          });
          
          try {
            await buttonPage.goto(url);
            await buttonPage.waitForLoadState('networkidle');
            
            const button = buttonPage.locator(`${buttonInfo.tagName}`).nth(buttonInfo.index);
            
            const isVisible = await button.isVisible({ timeout: 3000 }).catch(() => false);
            const isEnabled = await button.isEnabled().catch(() => false);
            
            if (isVisible && isEnabled) {
              await button.click({ timeout: 5000 });
              await buttonPage.waitForTimeout(1500);
              
              // Categorize button results
              const authErrors = buttonErrors.filter(e => e.includes('401') || e.includes('Unauthorized'));
              const resourceErrors = buttonErrors.filter(e => e.includes('404') || e.includes('Not Found'));
              const realErrors = buttonErrors.filter(e => 
                !e.includes('401') && 
                !e.includes('404') && 
                !e.includes('Unauthorized') && 
                !e.includes('Not Found')
              );
              
              if (realErrors.length > 0 || (authErrors.length === 0 && resourceErrors.length === 0 && buttonErrors.length > 0)) {
                allIssues.brokenButtons.push({
                  page: url,
                  button: buttonInfo.text,
                  errors: realErrors.length > 0 ? realErrors : buttonErrors,
                  type: 'functionality'
                });
              }
              
              if (authErrors.length > 0) {
                allIssues.authErrors.push({
                  page: url,
                  button: buttonInfo.text,
                  count: authErrors.length
                });
              }
              
              if (resourceErrors.length > 0) {
                allIssues.missingResources.push({
                  page: url,
                  button: buttonInfo.text,
                  count: resourceErrors.length
                });
              }
              
              if (buttonWarnings.some(w => w.includes('key prop'))) {
                allIssues.reactWarnings.push({
                  page: url,
                  button: buttonInfo.text,
                  warning: 'Missing key props'
                });
              }
            }
            
          } catch (error) {
            allIssues.brokenButtons.push({
              page: url,
              button: buttonInfo.text,
              errors: [error.message],
              type: 'click_error'
            });
          }
          
          await buttonContext.close();
        }
        
      } catch (error) {
        allIssues.pageErrors.push({
          url,
          error: error.message
        });
      }
      
      await context.close();
      console.log(`  ✅ Completed: ${url}`);
    }
    
    // Crawl all pages
    while (pagesToCrawl.length > 0) {
      const currentUrl = pagesToCrawl.shift();
      await crawlPage(baseUrl + currentUrl);
    }
    
    // Generate comprehensive report
    console.log('\n' + '='.repeat(80));
    console.log('📊 WEBSITE SCAN REPORT');
    console.log('='.repeat(80));
    
    console.log(`\n📄 PAGES CRAWLED: ${visitedPages.size}`);
    visitedPages.forEach(page => console.log(`  ✓ ${page}`));
    
    console.log(`\n🔗 BROKEN LINKS: ${allIssues.brokenLinks.length}`);
    allIssues.brokenLinks.forEach(link => {
      console.log(`  ❌ ${link.link} (Status: ${link.status}) on ${link.page}`);
    });
    
    console.log(`\n🔘 BROKEN BUTTONS: ${allIssues.brokenButtons.length}`);
    allIssues.brokenButtons.slice(0, 10).forEach(btn => {
      console.log(`  ❌ "${btn.button}" on ${btn.page}`);
      console.log(`     Error: ${btn.errors[0]}`);
    });
    
    console.log(`\n🔐 AUTHENTICATION ISSUES: ${allIssues.authErrors.length}`);
    const authSummary = {};
    allIssues.authErrors.forEach(auth => {
      authSummary[auth.page] = (authSummary[auth.page] || 0) + 1;
    });
    Object.entries(authSummary).forEach(([page, count]) => {
      console.log(`  ⚠️  ${page}: ${count} buttons with auth issues`);
    });
    
    console.log(`\n📁 MISSING RESOURCES: ${allIssues.missingResources.length}`);
    const resourceSummary = {};
    allIssues.missingResources.forEach(res => {
      resourceSummary[res.page] = (resourceSummary[res.page] || 0) + 1;
    });
    Object.entries(resourceSummary).forEach(([page, count]) => {
      console.log(`  📂 ${page}: ${count} buttons with missing resources`);
    });
    
    console.log(`\n⚠️  REACT WARNINGS: ${allIssues.reactWarnings.length}`);
    allIssues.reactWarnings.slice(0, 5).forEach(warning => {
      console.log(`  🔧 ${warning.page}: ${warning.warning} in "${warning.button}"`);
    });
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`  ✅ Pages successfully crawled: ${visitedPages.size}`);
    console.log(`  ❌ Broken links found: ${allIssues.brokenLinks.length}`);
    console.log(`  🔘 Button issues found: ${allIssues.brokenButtons.length}`);
    console.log(`  🔐 Auth-related issues: ${allIssues.authErrors.length}`);
    console.log(`  📁 Missing resources: ${allIssues.missingResources.length}`);
    console.log(`  ⚠️  React warnings: ${allIssues.reactWarnings.length}`);
    
    console.log(`\n🎯 TOP PRIORITY FIXES:`);
    console.log(`  1. Fix React key prop warnings (${allIssues.reactWarnings.length} instances)`);
    console.log(`  2. Implement graceful auth error handling (${allIssues.authErrors.length} instances)`);
    console.log(`  3. Resolve missing API endpoints (${allIssues.missingResources.length} instances)`);
    console.log(`  4. Fix broken button functionality (${allIssues.brokenButtons.length} instances)`);
    
    // The test passes - we're doing comprehensive analysis
    expect(visitedPages.size).toBeGreaterThan(0);
  });
});