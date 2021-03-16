import typescript from "@rollup/plugin-typescript";
import url from "@rollup/plugin-url";
import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    { file: pkg.main, format: "cjs" },
    { file: pkg.module, format: "es" },
  ],
  plugins: [url(), typescript()],
};
