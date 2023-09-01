import { defineConfig } from "vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import dts from "vite-plugin-dts";

import pkg from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      fileName: "index",
      formats: ["cjs", "es"],
    },
    rollupOptions: {
      external: [...Object.keys(pkg.peerDependencies), ...Object.keys(pkg.dependencies), "crypto"],
    },
  },
  plugins: [
    vanillaExtractPlugin({
      identifiers: "short",
    }),
    dts(),
  ],
});
