// One screen of a running onenmrd-gui, for the video's shots/.
//   node shot.cjs OUT.png LAYOUT.json [STEPS.js]
// GUI     the GUI link with its key (http://127.0.0.1:8090/#t=...), printed by
//         onenmrd-gui at start; the profile keeps the key afterwards
// PROFILE a Chromium profile folder (kept between shots)
// CHROME  a Chromium binary, if Playwright has none of its own
// LAYOUT is the pane layout (layout.js's ffc-layout-v1); STEPS is the body of
// an async function (page) run before the screenshot.
const { chromium } = require('playwright-core');
const fs = require('fs');
const [out, layoutFile, stepsFile] = process.argv.slice(2);
(async () => {
  const ctx = await chromium.launchPersistentContext(process.env.PROFILE, {
    ...(process.env.CHROME ? { executablePath: process.env.CHROME } : {}),
    viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2, colorScheme: 'dark',
  });
  const layout = fs.readFileSync(layoutFile, 'utf8');
  await ctx.addInitScript((l) => { try { localStorage.setItem('ffc-layout-v1', l); } catch (e) {} }, layout);
  const page = ctx.pages()[0] || await ctx.newPage();
  page.on('dialog', d => d.accept().catch(() => {}));
  await page.goto(process.env.GUI); await page.waitForTimeout(2500);
  if (stepsFile) {
    const steps = new (Object.getPrototypeOf(async function () {}).constructor)('page', 'require', fs.readFileSync(stepsFile, 'utf8'));
    await steps(page, require);
  }
  await page.mouse.move(1915, 1075);
  await page.waitForTimeout(400);
  await page.screenshot({ path: out });
  await ctx.close();
})();
