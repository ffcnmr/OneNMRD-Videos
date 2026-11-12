await page.getByRole('button', { name: 'Fit in OFE', exact: true }).click();
const t0 = Date.now();
for (;;) {
  await page.waitForTimeout(2000);
  const t = await page.evaluate(() => document.getElementById('page-results').innerText.slice(0, 600));
  if (Date.now() - t0 > 240000) { console.log('timeout', t); break; }
  if (!/fitting|running|⋯|…/i.test(t.split('\n').slice(0, 8).join(' ')) && /T1 OFE[^\n]*\n[\s\S]*\d+\.\d+ ± /.test(t)) { console.log(Math.round((Date.now() - t0) / 1000) + 's'); console.log(t); break; }
}
await page.waitForTimeout(1500);
