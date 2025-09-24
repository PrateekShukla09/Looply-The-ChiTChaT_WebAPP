// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  ssr: {
    noExternal: ["firebase"], // ✅ ensures firebase is bundled in SSR (Vercel)
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split big libraries into their own chunks
          react: ["react", "react-dom"],
          firebase: ["firebase/app", "firebase/auth"],
          axios: ["axios"],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Raise limit so warnings don’t show unless >1MB
  },
});
