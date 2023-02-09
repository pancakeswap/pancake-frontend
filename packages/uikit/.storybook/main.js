const { vanillaExtractPlugin } = require("@vanilla-extract/vite-plugin");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    {
      name: "@storybook/addon-essentials",
      options: {
        backgrounds: false,
      },
    },
    "@storybook/addon-links",
    "@storybook/addon-a11y",
    "themeprovider-storybook/register",
  ],
  core: { builder: "@storybook/builder-vite" },
  async viteFinal(config) {
    config.define["process.env"] = process.env;
    config.plugins.push(vanillaExtractPlugin());
    return config;
  },
};
