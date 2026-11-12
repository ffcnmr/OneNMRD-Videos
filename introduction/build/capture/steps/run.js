// starts the plan and screenshots the run as it goes (OUTDIR/run-N.png)
const dir = process.env.OUTDIR;
await page.click('#h-run');
await page.getByRole('button', { name: 'OK', exact: true }).click();
const t0 = Date.now();
for (let i = 1; i <= 18; i++) {
  await page.waitForTimeout(4000);
  await page.mouse.move(1915, 1075);
  await page.screenshot({ path: `${dir}/run-${String(i).padStart(2, '0')}.png` });
  const st = await page.evaluate(() => (document.getElementById('h-status') || document.querySelector('.status') || {}).textContent);
  console.log(i, Math.round((Date.now() - t0) / 1000) + 's', st);
}
