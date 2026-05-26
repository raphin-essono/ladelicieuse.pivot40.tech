import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5100,
    allowedHosts: [
      "ladelicieuse.pivot40.tech",
      "ladelicieuse.singcloud.ga",
      "localhost",
      "127.0.0.1"
    ],
    hmr: {
      overlay: false,
    },
    // Proxy vers le backend pour les requêtes API
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 5100,
    allowedHosts: [
      "ladelicieuse.pivot40.tech",
      "ladelicieuse.singcloud.ga",
      "localhost",
      "127.0.0.1"
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    sourcemap: false,
    assetsInlineLimit: 4096,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-core':   ['react', 'react-dom', 'react-router-dom'],
          'ui-radix':     ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs', '@radix-ui/react-toast', '@radix-ui/react-popover', '@radix-ui/react-accordion'],
          'ui-animation': ['framer-motion'],
          'charts':       ['recharts'],
          'forms':        ['react-hook-form', '@hookform/resolvers', 'zod'],
          'date':         ['date-fns'],
        },
      },
    },
  },
}));
