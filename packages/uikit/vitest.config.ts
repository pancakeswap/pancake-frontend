import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // @ts-ignore
  plugins: [react(), vanillaExtractPlugin()],
  test: {
    setupFiles: ["./src/setupTests.js"],
    environment: "happy-dom",
    globals: true,
  },
});
