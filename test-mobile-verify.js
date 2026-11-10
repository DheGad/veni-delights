import { chromium } from 'playwright';
import path from 'path';

async function main() {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });

  const artifactDir = '/Users/DEERU/.gemini/antigravity/brain/d4dcd290-e6af-44ee-ba3e-83c8e95c4d0f';

  // 1. Mobile verification (iPhone / Android 390x844)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    isMobile: true,
    hasTouch: true
  });

  const mobilePage = await mobileContext.newPage();
  console.log('Navigating to http://localhost:3000 on mobile...');
  await mobilePage.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(2000);

  // Take mobile hero screenshot
  await mobilePage.screenshot({
    path: path.join(artifactDir, 'mobile-app-dock-hero.png'),
    fullPage: false
  });
  console.log('Saved mobile-app-dock-hero.png');

  // Verify Persona buttons text
  const personaButtons = await mobilePage.$$eval('.persona-tab-btn', btns => 
    btns.map(b => b.textContent.trim().replace(/\s+/g, ' '))
  );
  console.log('Persona buttons:', personaButtons);

  // Verify Q&A chips
  const qaChips = await mobilePage.$$eval('.qa-chip-btn', btns => 
    btns.map(b => b.textContent.trim().replace(/\s+/g, ' '))
  );
  console.log('Q&A chips found:', qaChips);

  // Click on "100% Pure Butter?" chip
  console.log('Clicking 100% Pure Butter chip...');
  await mobilePage.click('.qa-chip-btn[data-qa-id="butter"]');
  await mobilePage.waitForTimeout(500);

  const speechText = await mobilePage.$eval('#avatar-speech-text', el => el.textContent.trim());
  console.log('Speech text after QA click:', speechText);

  const waLinkVisible = await mobilePage.$eval('#avatar-qa-wa-link', el => {
    return el.style.display !== 'none' && el.getAttribute('href');
  });
  console.log('WhatsApp link updated:', waLinkVisible);

  // Screenshot after asking question
  await mobilePage.screenshot({
    path: path.join(artifactDir, 'mobile-avatar-qa-active.png'),
    fullPage: false
  });
  console.log('Saved mobile-avatar-qa-active.png');

  // Verify mobile sticky dock items
  const dockTabs = await mobilePage.$$eval('#mobile-sticky-bar .mobile-bar-btn', btns =>
    btns.map(b => b.textContent.trim().replace(/\s+/g, ' '))
  );
  console.log('Mobile dock tabs:', dockTabs);

  // Scroll down to show sticky bottom dock and floating WhatsApp over content
  await mobilePage.evaluate(() => window.scrollTo(0, 600));
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({
    path: path.join(artifactDir, 'mobile-scrolled-dock.png'),
    fullPage: false
  });
  console.log('Saved mobile-scrolled-dock.png');

  // 2. Desktop 3D Turntable verification (1280x800)
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await desktopPage.waitForTimeout(2000);

  // Switch to 3D Cake Turntable stage
  console.log('Switching to 3D Cake Turntable stage...');
  await desktopPage.click('.hero-stage-toggle-btn[data-mode="cake-3d"]');
  await desktopPage.waitForTimeout(1000);

  // Verify 3D turntable toolbar
  const toolbarButtons = await desktopPage.$$eval('.turntable-tool-btn', btns =>
    btns.map(b => b.textContent.trim().replace(/\s+/g, ' '))
  );
  console.log('Turntable toolbar buttons:', toolbarButtons);

  // Click "Inspect Slice" button
  console.log('Clicking Inspect Slice toggle...');
  await desktopPage.click('#btn-turntable-slice');
  await desktopPage.waitForTimeout(1000);

  // Take desktop screenshot with 3D turntable
  await desktopPage.screenshot({
    path: path.join(artifactDir, 'desktop-turntable-inspect-slice.png'),
    fullPage: false
  });
  console.log('Saved desktop-turntable-inspect-slice.png');

  await browser.close();
  console.log('All verifications completed successfully!');
}

main().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
