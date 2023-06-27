import { mergeConfig } from "vite";

module.exports = {
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
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
  async viteFinal(config) {
    const finalConfig = mergeConfig(config, {
      resolve: {
        alias: {
          // @see https://github.com/nuxt/vite/issues/160#issuecomment-983080874
          crypto: require.resolve("rollup-plugin-node-builtins"),
        },
      },
      plugins: [require("@vanilla-extract/vite-plugin").vanillaExtractPlugin()],
    });

    return finalConfig;
  },
};
