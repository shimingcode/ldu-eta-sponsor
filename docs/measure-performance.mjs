import { chromium } from "@playwright/test";
import fs from "node:fs";
const label = process.argv[2];
const browser = await chromium.launch({ channel: "msedge" });
const results = [];
for (let i = 0; i < 3; i++) {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Performance.enable");
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.addInitScript(() => {
    window.samples = { long: [], cls: 0, lcp: 0, frames: [], home: 0 };
    new PerformanceObserver((l) =>
      l.getEntries().forEach((e) => samples.long.push(e.duration)),
    ).observe({ type: "longtask", buffered: true });
    new PerformanceObserver((l) =>
      l.getEntries().forEach((e) => {
        if (!e.hadRecentInput) samples.cls += e.value;
      }),
    ).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((l) =>
      l.getEntries().forEach((e) => (samples.lcp = e.startTime)),
    ).observe({ type: "largest-contentful-paint", buffered: true });
    let last = performance.now();
    function frame(t) {
      samples.frames.push(t - last);
      last = t;
      if (t < 5500) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    new MutationObserver(() => {
      if (!samples.home && document.querySelector("#sponsor-name"))
        samples.home = performance.now();
    }).observe(document, { childList: true, subtree: true });
  });
  await page.goto("http://127.0.0.1:4173/ldu-eta-sponsor/");
  await page.waitForTimeout(9000);
  const metrics = await cdp.send("Performance.getMetrics");
  results.push(
    await page.evaluate(
      (metrics) => ({
        ...samples,
        frames: undefined,
        fps:
          1000 /
          (samples.frames.reduce((a, b) => a + b, 0) / samples.frames.length),
        fcp: performance.getEntriesByName("first-contentful-paint")[0]
          ?.startTime,
        metrics: Object.fromEntries(
          metrics.metrics
            .filter((x) =>
              [
                "ScriptDuration",
                "TaskDuration",
                "JSHeapUsedSize",
                "Nodes",
                "LayoutCount",
              ].includes(x.name),
            )
            .map((x) => [x.name, x.value]),
        ),
      }),
      metrics,
    ),
  );
  await page.screenshot({ path: `work/screenshots/perf-${label}.png` });
  await page.close();
}
await browser.close();
fs.writeFileSync(
  `docs/performance-${label}.json`,
  JSON.stringify(results, null, 2),
);
console.log(results);
