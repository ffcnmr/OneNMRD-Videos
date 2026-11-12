// Open in OFE-GUI: OneNMRD sends the fitted JSON to OFE-GUI, which refits it
// and opens in a new tab (OUTDIR/ofe-gui.png), with log X for the τ axis
const pop = page.context().waitForEvent('page', { timeout: 60000 });
await page.getByRole('button', { name: /Open in OFE-GUI/ }).click();
const p2 = await pop;
await p2.setViewportSize({ width: 1920, height: 1080 });
await p2.waitForTimeout(12000);
if (!(await p2.isChecked('#logX'))) await p2.check('#logX', { force: true });
await p2.click('#plotBtn').catch(async () => p2.getByRole('button', { name: 'Plot', exact: true }).click());
await p2.waitForTimeout(12000);
await p2.mouse.move(1915, 1075);
await p2.screenshot({ path: process.env.OUTDIR + '/ofe-gui.png' });
