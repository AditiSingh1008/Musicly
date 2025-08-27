// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // Automatically updates service worker
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "masked-icon.svg"
      ],
      manifest: {
        name: "My Music App",
        short_name: "MusicApp",
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#1DB954",
        icons: [
          {
            src: "icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true
      }
    }
  }
});
