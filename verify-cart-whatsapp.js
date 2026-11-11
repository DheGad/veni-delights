import { chromium } from 'playwright';
import path from 'path';

async function main() {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });

  const artifactDir = '/Users/DEERU/.gemini/antigravity/brain/d4dcd290-e6af-44ee-ba3e-83c8e95c4d0f';

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    isMobile: true,
    hasTouch: true
  });

  const page = await context.newPage();

  console.log('1. Navigating to products page on localhost:3001/products.html...');
  await page.goto('http://localhost:3001/products.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Clear any existing localStorage
  await page.evaluate(() => {
    localStorage.clear();
  });

  console.log('2. Clicking "Add to Cart" for Pure Butter Cake...');
  // Find add to cart button for pure butter cake
  const addBtn = await page.waitForSelector('.product-card button[data-product-id="pure-butter-cake"], .product-card .add-drawer-btn[data-product-id="pure-butter-cake"]');
  await addBtn.click();
  await page.waitForTimeout(1000);

  // Verify cart drawer is open
  const drawerHidden = await page.$eval('#order-drawer', el => el.getAttribute('aria-hidden'));
  console.log('Cart drawer aria-hidden:', drawerHidden);
  if (drawerHidden !== 'false') throw new Error('Order drawer failed to open!');

  // Check subtotal in drawer
  const drawerSubtotal = await page.$eval('.order-total-bar', el => el.textContent.trim().replace(/\s+/g, ' '));
  console.log('Drawer Subtotal Bar:', drawerSubtotal);
  if (!drawerSubtotal.includes('79.00')) throw new Error('Expected RM79.00 in drawer subtotal!');

  // Increase quantity to 2
  console.log('3. Increasing quantity to 2...');
  const plusBtn = await page.waitForSelector('.qty-plus');
  await plusBtn.click();
  await page.waitForTimeout(500);

  const updatedSubtotal = await page.$eval('.order-total-bar', el => el.textContent.trim().replace(/\s+/g, ' '));
  console.log('Updated Subtotal after +1:', updatedSubtotal);
  if (!updatedSubtotal.includes('158.00')) throw new Error('Expected RM158.00 after increasing quantity!');

  // Take screenshot of mobile cart drawer
  await page.screenshot({
    path: path.join(artifactDir, 'mobile-cart-drawer-verified.png'),
    fullPage: false
  });
  console.log('Saved mobile-cart-drawer-verified.png');

  // Verify localStorage keys
  const storageState = await page.evaluate(() => {
    return {
      delights: JSON.parse(localStorage.getItem('veni_delights_cart') || '[]'),
      orderItems: JSON.parse(localStorage.getItem('veni_order_items') || '[]'),
    };
  });
  console.log('LocalStorage synchronized state:', storageState);
  if (storageState.delights.length !== 1 || storageState.delights[0].quantity !== 2) {
    throw new Error('localStorage veni_delights_cart mismatch!');
  }
  if (storageState.orderItems.length !== 1 || storageState.orderItems[0].quantity !== 2) {
    throw new Error('localStorage veni_order_items mismatch!');
  }

  // 4. Navigate to order.html and verify sync
  console.log('4. Navigating to order.html (checkout page)...');
  await page.goto('http://localhost:3001/order.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const orderCheckoutSubtotal = await page.$eval('#checkout-subtotal', el => el.textContent.trim());
  console.log('Order.html Checkout Subtotal:', orderCheckoutSubtotal);
  if (orderCheckoutSubtotal !== 'RM158.00') {
    throw new Error(`Expected RM158.00 on order.html, got ${orderCheckoutSubtotal}`);
  }

  // 5. Fill customer details and verify WhatsApp URL submission
  console.log('5. Filling customer details on order.html...');
  await page.fill('#chk-name', 'Siti Nurhaliza');
  await page.fill('#chk-phone', '012-345 6789');
  await page.fill('#chk-date', '2026-12-25');
  await page.selectOption('#chk-delivery', 'Direct Bakery Delivery');
  await page.fill('#chk-address', 'No 88, Jalan Meru, 41050 Klang, Selangor');
  await page.fill('#chk-notes', 'Happy Anniversary! Gold ribbon packaging please.');

  // Intercept window.open
  await page.evaluate(() => {
    window.capturedWhatsAppUrls = [];
    window.open = function(url) {
      window.capturedWhatsAppUrls.push(url);
    };
  });

  console.log('6. Clicking Submit via WhatsApp button...');
  await page.click('#chk-submit-btn');
  await page.waitForTimeout(500);

  const capturedUrls = await page.evaluate(() => window.capturedWhatsAppUrls);
  console.log('Captured WhatsApp URL:', capturedUrls);
  if (!capturedUrls || capturedUrls.length === 0) {
    throw new Error('No WhatsApp URL captured on submit!');
  }

  const waUrl = capturedUrls[0];
  console.log('\n--- VERIFYING WHATSAPP URL ---');
  console.log(waUrl);

  // Assertions
  if (!waUrl.startsWith('https://wa.me/60123360470?text=')) {
    throw new Error(`URL does not target Malaysian WhatsApp 60123360470: ${waUrl}`);
  }

  const decodedMsg = decodeURIComponent(waUrl.replace('https://wa.me/60123360470?text=', ''));
  console.log('\n--- DECODED WHATSAPP MESSAGE ---');
  console.log(decodedMsg);

  if (!decodedMsg.includes('VENI DELIGHTS')) throw new Error('Missing header');
  if (!decodedMsg.includes('Siti Nurhaliza')) throw new Error('Missing customer name');
  if (!decodedMsg.includes('012-345 6789')) throw new Error('Missing phone number');
  if (!decodedMsg.includes('2026-12-25')) throw new Error('Missing preferred date');
  if (!decodedMsg.includes('Direct Bakery Delivery')) throw new Error('Missing delivery method');
  if (!decodedMsg.includes('No 88, Jalan Meru, 41050 Klang')) throw new Error('Missing address');
  if (!decodedMsg.includes('Pure Butter Cake')) throw new Error('Missing product name');
  if (!decodedMsg.includes('Qty: 2')) throw new Error('Missing item quantity 2');
  if (!decodedMsg.includes('RM158.00')) throw new Error('Missing subtotal RM158.00');
  if (!decodedMsg.includes('DuitNow')) throw new Error('Missing DuitNow payment confirmation');

  // Screenshot of order page
  await page.screenshot({
    path: path.join(artifactDir, 'mobile-order-checkout-verified.png'),
    fullPage: true
  });
  console.log('Saved mobile-order-checkout-verified.png');

  console.log('\n✅ ALL VERIFICATION CHECKS PASSED PERFECTLY!');
  await browser.close();
}

main().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
