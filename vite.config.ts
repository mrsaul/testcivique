import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";
import { prerenderPlugin } from "./vite-plugin-prerender";


const STATIC_PRERENDER_ROUTES = [
  "/home",
  "/install",
  "/mentions-legales",
  "/politique-confidentialite",
  "/blog",
  "/themes-guide",
  "/theme/principes_valeurs",
  "/theme/systeme_institutionnel",
  "/theme/droits_devoirs",
  "/theme/histoire_geographie",
  "/theme/vivre_societe",
];

function makeFetchBlogSlugs(url: string | undefined, key: string | undefined) {
  return async function fetchBlogSlugs(): Promise<string[]> {
    if (!url || !key) {
      console.warn("[prerender] fetchBlogSlugs: missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY");
      return [];
    }
    try {
      const res = await fetch(
        `${url}/rest/v1/blog_posts?select=slug&published=eq.true`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` } },
      );
      if (!res.ok) {
        console.warn(`[prerender] fetchBlogSlugs: HTTP ${res.status} ${await res.text()}`);
        return [];
      }
      const rows = (await res.json()) as { slug: string }[];
      const slugs = rows
        .map((r) => r.slug?.replace(/^\/+|\/+$/g, ""))
        .filter(Boolean)
        .map((s) => `/blog/${s}`);
      console.log(`[prerender] fetchBlogSlugs: found ${slugs.length} slug(s)`);
      return slugs;
    } catch (e) {
      console.warn("[prerender] fetchBlogSlugs threw:", (e as Error).message);
      return [];
    }
  };
}



// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const fetchBlogSlugs = makeFetchBlogSlugs(
    env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  );
  return ({

  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "pwa-icon-192.png", "pwa-icon-512.png"],
      manifest: {
        name: "Test Civique – Préparation Examen",
        short_name: "Test Civique",
        description: "Préparez votre examen civique français avec des quiz interactifs",
        theme_color: "#2563eb",
        background_color: "#f8fafc",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/pwa-icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        navigateFallbackDenylist: [/^\/~oauth/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
    prerenderPlugin({
      staticRoutes: STATIC_PRERENDER_ROUTES,
      dynamicRoutes: fetchBlogSlugs,
    }),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  });
});

