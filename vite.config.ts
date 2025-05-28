
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
      // ULTIMATE FINAL: widget.js wird als statisches Asset behandelt
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'widget.js') {
            return 'widget.js';
          }
          return assetInfo.name || '';
        }
      }
    },
    // ULTIMATE FINAL: Kopiere widget.js ins public Verzeichnis
    copyPublicDir: true
  },
  // ULTIMATE FINAL: Stelle sicher, dass widget.js verfügbar ist
  publicDir: 'public'
}));
