import type { Plugin } from "vite";
import { promises as fs } from "fs";
import path from "path";
import http from "http";

interface SitemapOptions {
  /** Absolute base URL, e.g. "https://letestcivique.org" (no trailing slash). */
  baseUrl: string;
  /** Languages to emit as hreflang alternates via ?lang=xx. First entry is the default. */
  languages?: string[];
  /** Route prefixes that should NOT get hreflang alternates (e.g. legal pages). */
  monolingualPrefixes?: string[];
  /** Per-prefix metadata overrides. Longest prefix wins. */
  priorityByPrefix?: Array<{ prefix: string; priority?: string; changefreq?: string }>;
  /** Default priority when nothing matches. */
  defaultPriority?: string;
  /** Default changefreq when nothing matches. */
  defaultChangefreq?: string;
}

interface PrerenderOptions {
  /** Static routes (paths beginning with "/") to always prerender. */
  staticRoutes: string[];
  /** Called at build time to compute dynamic routes (e.g. from a DB). */
  dynamicRoutes?: () => Promise<string[]>;
  /** ms to wait for content after navigation. Default 15000. */
  timeout?: number;
  /** Selector we wait for before capturing HTML. */
  waitForSelector?: string;
  /** If provided, writes dist/sitemap.xml listing every successfully-prerendered route. */
  sitemap?: SitemapOptions;
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
      const rendered: string[] = [];
      try {
        for (const route of routes) {
          const page = await browser.newPage();
          try {
            // Silence noisy console output from the app during prerender.
            page.on("pageerror", (err: unknown) => console.warn(`[prerender][${route}] pageerror:`, (err as Error)?.message));
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
            rendered.push(route);
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

      if (opts.sitemap && rendered.length > 0) {
        try {
          const xml = buildSitemap(rendered, opts.sitemap);
          await fs.writeFile(path.join(distDir, "sitemap.xml"), xml, "utf8");
          console.log(`[prerender] sitemap.xml written (${rendered.length} url(s))`);
        } catch (e) {
          console.warn("[prerender] sitemap write failed:", (e as Error).message);
        }
      }
    },
  };
}

function buildSitemap(routes: string[], opts: SitemapOptions): string {
  const base = opts.baseUrl.replace(/\/+$/, "");
  const languages = opts.languages ?? [];
  const defaultLang = languages[0];
  const mono = opts.monolingualPrefixes ?? [];
  const overrides = (opts.priorityByPrefix ?? []).slice().sort((a, b) => b.prefix.length - a.prefix.length);
  const defaultPriority = opts.defaultPriority ?? "0.5";
  const defaultChangefreq = opts.defaultChangefreq ?? "monthly";
  const today = new Date().toISOString().slice(0, 10);

  const sorted = routes.slice().sort();
  const urls = sorted.map((route) => {
    const loc = `${base}${route}`;
    const meta = overrides.find((o) => route === o.prefix || route.startsWith(o.prefix + "/") || route.startsWith(o.prefix));
    const priority = meta?.priority ?? defaultPriority;
    const changefreq = meta?.changefreq ?? defaultChangefreq;
    const isMonolingual = mono.some((p) => route === p || route.startsWith(p));
    const alternates = !isMonolingual && languages.length > 1 && defaultLang
      ? [
          ...languages.map((lang) => {
            const href = lang === defaultLang ? loc : `${loc}?lang=${lang}`;
            return `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`;
          }),
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>`,
        ].join("\n")
      : "";
    return [
      `  <url>`,
      `    <loc>${loc}</loc>`,
      alternates,
      `    <lastmod>${today}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      `  </url>`,
    ].filter(Boolean).join("\n");
  });

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
    `        xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    ...urls,
    `</urlset>`,
    ``,
  ].join("\n");
}
