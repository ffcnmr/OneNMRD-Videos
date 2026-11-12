// a Gaussian filter previewed on the last scan, beside the analysis choices
await page.fill('#lv-ff', '20');
await page.press('#lv-ff', 'Enter');
await page.waitForTimeout(2500);
await page.evaluate(() => document.getElementById('analysis-panel')?.scrollIntoView({ block: 'start' }));
await page.waitForTimeout(800);
await page.click('#lv-note-close').catch(() => {});
await page.waitForTimeout(400);
