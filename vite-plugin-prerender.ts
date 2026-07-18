import type { Plugin } from "vite";
import { promises as fs } from "fs";
import path from "path";
import http from "http";

interface PrerenderOptions {
  /** Static routes (paths beginning with "/") to always prerender. */
  staticRoutes: string[];
  /** Called at build time to compute dynamic routes (e.g. from a DB). */
  dynamicRoutes?: () => Promise<string[]>;
  /** ms to wait for content after navigation. Default 15000. */
  timeout?: number;
  /** Selector we wait for before capturing HTML. */
  waitForSelector?: string;
}

/**
 * Custom prerender plugin: after `vite build`, boots a static file server against
 * `dist/`, drives headless Chromium through each route, and writes the fully
 * rendered HTML to `dist/<route>/index.html`. Lovable's CDN serves those real
 * files in preference to the SPA fallback, so crawlers get complete HTML.
 *
 * Failures are logged but never fail the build — a missing prerender falls back
 * to the SPA shell which still hydrates on the client.
 */
export function prerenderPlugin(opts: PrerenderOptions): Plugin {
  const timeout = opts.timeout ?? 15000;
  const waitForSelector = opts.waitForSelector ?? "#root > *";

  return {
    name: "app-prerender",
    apply: "build",
    enforce: "post",
    async closeBundle() {
      if (process.env.SKIP_PRERENDER === "1") {
        console.log("[prerender] skipped (SKIP_PRERENDER=1)");
        return;
      }
      // Only prerender production builds.
      if (process.env.NODE_ENV !== "production") {
        console.log("[prerender] skipped (non-production build)");
        return;
      }

      const distDir = path.resolve("dist");
      try {
        await fs.access(path.join(distDir, "index.html"));
      } catch {
        console.warn("[prerender] dist/index.html missing, skipping");
        return;
      }

      let puppeteer: typeof import("puppeteer");
      let sirv: typeof import("sirv").default;
      try {
        puppeteer = (await import("puppeteer")).default as unknown as typeof import("puppeteer");
        sirv = (await import("sirv")).default;
      } catch (e) {
        console.warn("[prerender] puppeteer/sirv unavailable, skipping:", (e as Error).message);
        return;
      }

      let dynamicRoutes: string[] = [];
      if (opts.dynamicRoutes) {
        try {
          dynamicRoutes = await opts.dynamicRoutes();
        } catch (e) {
          console.warn("[prerender] dynamicRoutes() failed:", (e as Error).message);
        }
      }

      const routes = Array.from(new Set([...opts.staticRoutes, ...dynamicRoutes]));
      console.log(`[prerender] rendering ${routes.length} route(s)…`);

      const serve = sirv(distDir, { single: true, dev: false, etag: false });
      const server = http.createServer((req, res) => serve(req, res, () => {
        res.statusCode = 404;
        res.end("Not found");
      }));
      await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      const base = `http://127.0.0.1:${port}`;

      let browser: import("puppeteer").Browser | null = null;
      try {
        browser = await puppeteer.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
        });
      } catch (e) {
        console.warn("[prerender] failed to launch Chromium, skipping:", (e as Error).message);
        server.close();
        return;
      }

      let success = 0;
      let failed = 0;
      try {
        for (const route of routes) {
          const page = await browser.newPage();
          try {
            // Silence noisy console output from the app during prerender.
            page.on("pageerror", (err) => console.warn(`[prerender][${route}] pageerror:`, err.message));
            const url = base + route;
            await page.goto(url, { waitUntil: "networkidle0", timeout });
            await page.waitForSelector(waitForSelector, { timeout: 5000 }).catch(() => {});
            // Give React a beat to flush effects (SEOHead writes tags in useEffect).
            await new Promise((r) => setTimeout(r, 500));

            const html = await page.content();
            const outDir = path.join(distDir, route);
            await fs.mkdir(outDir, { recursive: true });
            await fs.writeFile(path.join(outDir, "index.html"), html, "utf8");
            success++;
            console.log(`[prerender] ✓ ${route}`);
          } catch (e) {
            failed++;
            console.warn(`[prerender] ✗ ${route}:`, (e as Error).message);
          } finally {
            await page.close();
          }
        }
      } finally {
        await browser.close();
        server.close();
      }
      console.log(`[prerender] done: ${success} ok, ${failed} failed`);
    },
  };
}
