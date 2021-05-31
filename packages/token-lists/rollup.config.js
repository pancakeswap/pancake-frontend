import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: [{ file: pkg.main, format: "es" }],
  plugins: [json(), typescript()],
};
