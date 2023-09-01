import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import dts from "vite-plugin-dts";
import { onSuccess } from "vite-plugin-on-success";

import pkg from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      fileName: "index",
      formats: ["cjs", "es"],
    },
    rollupOptions: {
      external: [...Object.keys(pkg.peerDependencies), "crypto"],
      // output: {
      //   interop: "compat",
      // },
    },
  },
  plugins: [
    vanillaExtractPlugin({
      identifiers: "short",
    }),
    onSuccess({
      command: "tsc --emitDeclarationOnly --declaration",
    }),
  ],
});
