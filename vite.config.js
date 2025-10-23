import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Pokédex App",
        short_name: "Pokédex",
        description: "Pokédex en React + Vite + Tailwind",
        theme_color: "#dc2626",
        background_color: "#f3f4f6",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "./pokebola.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./pokebolagod.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/pokeapi\.co\/api\/v2\/pokemon/,
              handler: "NetworkFirst",
              options: {
                cacheName: "pokeapi-cache",
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 días
                },
                networkTimeoutSeconds: 5, // fallback si tarda mucho
              },
            },
          ],
        },
      },
    }),
  ],
});
