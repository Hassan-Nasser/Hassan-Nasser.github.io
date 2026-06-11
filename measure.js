const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('https://hassan-nasser.github.io/', { waitUntil: 'networkidle2' });

  const navbarDetails = await page.evaluate(() => {
    const nav = document.querySelector('.navbar');
    if (!nav) return 'No navbar found';
    const styles = window.getComputedStyle(nav);
    return {
      height: styles.height,
      paddingTop: styles.paddingTop,
      paddingBottom: styles.paddingBottom,
      backgroundColor: styles.backgroundColor,
      backdropFilter: styles.backdropFilter
    };
  });

  await page.evaluate(() => window.scrollTo(0, 500));
  await new Promise(r => setTimeout(r, 1000));

  const navbarScrolled = await page.evaluate(() => {
    const nav = document.querySelector('.navbar');
    const styles = window.getComputedStyle(nav);
    return {
      height: styles.height,
      paddingTop: styles.paddingTop,
      paddingBottom: styles.paddingBottom,
      backgroundColor: styles.backgroundColor,
      backdropFilter: styles.backdropFilter
    };
  });

  await browser.close();
})();
