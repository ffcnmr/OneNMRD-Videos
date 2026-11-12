// the ultraRelax8 (simulated uSpin32): its console pane at the FFC voltages,
// and the Check pane with the two checks imported before (shot.cjs run once
// with IMPORT=1 imports CHECK1 and CHECK2)
const fs = require('fs');
if ((await page.inputValue('#h-console')) !== 'ultrarelax8') { await page.selectOption('#h-console', 'ultrarelax8'); await page.waitForTimeout(4000); }
if (process.env.IMPORT) for (const f of [process.env.CHECK1, process.env.CHECK2]) {
  await page.click('#ck-import'); await page.waitForTimeout(800);
  await page.locator('textarea:visible').last().fill(fs.readFileSync(f, 'utf8'));
  await page.locator('dialog button:visible, .modal button:visible').filter({ hasText: /^(Import|OK)/ }).first().click();
  await page.waitForTimeout(2500);
}
await page.evaluate(() => {
  const h = [...document.querySelectorAll('#page-console h2, #page-console h3, #page-console legend')].find(e => /FFC voltage/i.test(e.textContent));
  (h?.closest('fieldset, .panel') || h)?.scrollIntoView({ block: 'start' });
});
await page.waitForTimeout(600);
for (const b of await page.locator('button:visible', { hasText: 'Close ×' }).all()) await b.click().catch(() => {});
await page.waitForTimeout(300);
