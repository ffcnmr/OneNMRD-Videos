// the timing diagram of #3 (inversion), and the #1–#10 checklist in Settings
await page.selectOption('#sd-seq', 'ffc2');
await page.waitForTimeout(1200);
await page.evaluate(() => {
  const l = [...document.querySelectorAll('#page-settings legend')].find(e => /sequences available/i.test(e.textContent));
  const box = l.closest('fieldset') || l;
  box.scrollIntoView({ block: 'center' });
});
await page.waitForTimeout(600);
