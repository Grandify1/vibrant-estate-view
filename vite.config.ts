
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
      // Stelle sicher, dass widget.js als statisches Asset behandelt wird
      external: ['widget.js'],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'widget.js') {
            return 'widget.js';
          }
          return assetInfo.name || '';
        }
      }
    }
  }
}));
