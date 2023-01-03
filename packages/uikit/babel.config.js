// eslint-disable-next-line @typescript-eslint/no-var-requires
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  presets: ["@babel/preset-env", ["@babel/preset-react", { runtime: "automatic" }]],
  plugins: ["styled-components", "@vanilla-extract/babel-plugin", new MiniCssExtractPlugin()],
};
