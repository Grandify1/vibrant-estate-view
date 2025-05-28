
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      // Ensure widget.js is copied to root of dist folder
      input: {
        main: './index.html'
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'widget.js') {
            return 'widget.js';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    // Copy public directory including widget.js
    copyPublicDir: true
  },
  // Ensure public directory is copied
  publicDir: 'public'
}));
