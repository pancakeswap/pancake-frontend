import { defineConfig } from "vitest/config";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // @ts-ignore
  plugins: [react(), vanillaExtractPlugin()],
  test: {
    setupFiles: ["./src/setupTests.js"],
    environment: "jsdom",
    globals: true,
  },
});
