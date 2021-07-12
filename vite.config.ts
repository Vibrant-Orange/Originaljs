import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  server: {
  },
  build: {
    // minify: false,
    lib: {
      entry: "src/index.ts",
      name: "original",
      formats: ["es", "iife"],
      fileName: "original",
    },
  },
});
