module.exports = {
  presets: ["@babel/preset-env", ["@babel/preset-react", { runtime: "automatic" }]],
  plugins: ["styled-components", "@vanilla-extract/babel-plugin"],
};
