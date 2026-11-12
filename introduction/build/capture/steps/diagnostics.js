// starts the plan with the Diagnostics pane beside Live and waits for the
// simulated magnet monitor to measure a few hundred field switches;
// SCROLL=1 scrolls the Diagnostics pane to its measurements; SKIPRUN=1
// only looks (the monitor keeps what it measured)
if (!process.env.SKIPRUN) {
  await page.evaluate(async () => { await api("sf", { mhz: 8.24 }); });
  await page.waitForTimeout(1000);
  await page.click('#h-run');
  await page.getByRole('button', { name: 'OK', exact: true }).click();
}
await page.waitForTimeout(+(process.env.WAIT || 30) * 1000);
await page.click('#dg-pause');
if (process.env.SCROLL) {
  await page.evaluate(() => document.querySelector('#dg-metrics').closest('.panel').scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(500);
}
