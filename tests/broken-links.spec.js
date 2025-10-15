
import { test, expect } from '@playwright/test';

test.describe('Broken Links Test', () => {
  test('should check main page for broken links', async ({ page }) => {
    // Increase timeout for this test
    test.setTimeout(120000); // 2 minutes
    
    // Navigate to the main page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get all internal links
    const links = await page.evaluate(() => {
      const allLinks = Array.from(document.querySelectorAll('a[href]'));
      return allLinks
        .map(link => link.href)
        .filter(href => {
          // Only test internal links
          return href && 
                 !href.startsWith('#') && 
                 !href.startsWith('javascript:') && 
                 !href.startsWith('mailto:') && 
                 !href.startsWith('tel:') &&
                 (href.startsWith('/') || href.includes('localhost:5000'));
        })
        // Remove duplicates
        .filter((href, index, array) => array.indexOf(href) === index);
    });
    
    console.log(`Found ${links.length} unique internal links to test`);
    
    // Test links more efficiently
    const brokenLinks = [];
    
    for (const href of links) {
      try {
        console.log(`Testing: ${href}`);
        
        // Use a faster approach - just check if page responds
        const response = await page.request.get(href);
        
        if (response.status() >= 400) {
          brokenLinks.push({
            url: href,
            status: response.status(),
            statusText: response.statusText()
          });
        }
      } catch (error) {
        brokenLinks.push({
          url: href,
          status: 'ERROR',
          statusText: error.message
        });
      }
    }
    
    // Report results
    if (brokenLinks.length > 0) {
      console.log('\n❌ BROKEN LINKS FOUND:');
      brokenLinks.forEach(link => {
        console.log(`  ${link.url} - Status: ${link.status} (${link.statusText})`);
      });
    } else {
      console.log('\n✅ All links are working!');
    }
    
    // Fail test if broken links found
    expect(brokenLinks).toHaveLength(0);
  });
});