// vite.config.ts
import { defineConfig } from "file:///Users/evan/Documents/pancakeNewFE/pancake-frontend/node_modules/.pnpm/vite@4.3.1_@types+node@18.16.2/node_modules/vite/dist/node/index.js";
import { vanillaExtractPlugin } from "file:///Users/evan/Documents/pancakeNewFE/pancake-frontend/node_modules/.pnpm/@vanilla-extract+vite-plugin@3.8.0_@types+node@18.16.2_vite@4.3.1/node_modules/@vanilla-extract/vite-plugin/dist/vanilla-extract-vite-plugin.cjs.js";
import dts from "file:///Users/evan/Documents/pancakeNewFE/pancake-frontend/node_modules/.pnpm/vite-plugin-dts@3.5.3_@types+node@18.16.2_rollup@2.78.0_typescript@5.1.3_vite@4.3.1/node_modules/vite-plugin-dts/dist/index.mjs";

// package.json
var package_default = {
  name: "@pancakeswap/uikit",
  version: "0.64.0",
  description: "Set of UI components for pancake projects",
  type: "module",
  main: "dist/index.cjs",
  module: "dist/index.js",
  types: "dist/index.d.ts",
  sideEffects: [
    "*.css.ts",
    "src/css/**/*",
    "src/theme/**/*"
  ],
  exports: {
    "./package.json": "./package.json",
    ".": {
      import: "./dist/index.js",
      require: "./dist/index.cjs"
    },
    "./styles": {
      import: "./dist/style.css",
      require: "./dist/style.css"
    },
    "./css/atoms": {
      import: "./src/css/atoms.ts",
      types: "./dist/css/atoms.d.ts"
    },
    "./css/responsiveStyle": {
      import: "./src/css/responsiveStyle.ts",
      types: "./dist/css/responsiveStyle.d.ts"
    }
  },
  repository: "https://github.com/pancakeswap/pancake-frontend/tree/develop/packages/uikit",
  license: "MIT",
  private: true,
  scripts: {
    "build:uikit": "vite build",
    dev: "vite build --watch --mode development",
    start: "pnpm storybook",
    lint: "eslint 'src/**/*.{js,jsx,ts,tsx}'",
    "format:check": "prettier --check --loglevel error 'src/**/*.{js,jsx,ts,tsx}'",
    "format:write": "prettier --write 'src/**/*.{js,jsx,ts,tsx}'",
    storybook: "storybook dev -p 6006",
    "build:storybook": "storybook build",
    test: "vitest --run",
    "update:snapshot": "vitest -u",
    prepublishOnly: "pnpm run build:uikit",
    clean: "rm -rf .turbo && rm -rf node_modules && rm -rf dist"
  },
  devDependencies: {
    "@babel/core": "^7.20.12",
    "@babel/preset-env": "^7.20.2",
    "@babel/preset-react": "^7.18.6",
    "@pancakeswap/hooks": "workspace:*",
    "@pancakeswap/utils": "workspace:*",
    "@pancakeswap/chains": "workspace:*",
    "@rollup/plugin-json": "^4.1.0",
    "@rollup/plugin-typescript": "^8.2.1",
    "@rollup/plugin-url": "^6.0.0",
    "@storybook/addon-a11y": "^7.0.7",
    "@storybook/addon-actions": "^7.0.7",
    "@storybook/addon-essentials": "^7.0.7",
    "@storybook/addon-links": "^7.0.7",
    "@storybook/builder-vite": "^7.0.7",
    "@storybook/react": "^7.0.7",
    "@storybook/react-vite": "^7.0.7",
    "@testing-library/jest-dom": "^5.11.6",
    "@testing-library/react": "^12.1.3",
    "@types/d3": "^7.4.0",
    "@types/js-cookie": "^3.0.2",
    "@types/lodash": "^4.14.168",
    "@types/react": "^18.2.21",
    "@types/react-dom": "^18.0.6",
    "@types/react-router-dom": "^5.1.7",
    "@types/react-transition-group": "^4.4.1",
    "@types/styled-system__should-forward-prop": "^5.1.2",
    "@vanilla-extract/vite-plugin": "^3.8.0",
    "@vitejs/plugin-react": "4.0.0",
    "babel-jest": "^29.3.1",
    "babel-loader": "^9.1.2",
    "babel-plugin-styled-components": "^1.12.0",
    d3: "^7.8.2",
    jest: "29.3.1",
    "jest-environment-jsdom": "^29.3.1",
    "jest-styled-components": "^7.0.8",
    "js-cookie": "*",
    next: "*",
    "next-seo": "*",
    "next-themes": "^0.2.1",
    polished: "^4.2.2",
    react: "^18.2.0",
    "react-countup": "^6.4.0",
    "react-device-detect": "*",
    "react-dom": "^18.2.0",
    "react-is": "^17.0.2",
    "react-markdown": "^6.0.2",
    "react-redux": "^8.0.5",
    "react-router-dom": "^5.2.0",
    "react-transition-group": "*",
    "remark-gfm": "*",
    rollup: "^2.70.1",
    "rollup-plugin-node-builtins": "^2.1.2",
    storybook: "^7.0.7",
    "styled-components": "^6.0.7",
    "themeprovider-storybook": "^1.7.2",
    "ts-jest": "^27.1.3",
    vite: "^4.3.1",
    "vite-plugin-dts": "^3.5.3",
    "vite-tsconfig-paths": "^4.0.3",
    vitest: "^0.27.2",
    wagmi: "^1.3.10"
  },
  peerDependencies: {
    "js-cookie": "*",
    next: "*",
    "next-seo": "*",
    "next-themes": "^0.2.1",
    react: "^18.2.0",
    "react-device-detect": "*",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.5",
    "react-transition-group": "*",
    "remark-gfm": "*",
    "styled-components": "^6.0.7"
  },
  dependencies: {
    "@pancakeswap/hooks": "workspace:*",
    "@pancakeswap/localization": "workspace:*",
    "@popperjs/core": "^2.9.2",
    "@radix-ui/react-dismissable-layer": "^1.0.3",
    "@radix-ui/react-slot": "^1.0.0",
    "@styled-system/should-forward-prop": "^5.1.5",
    "@types/styled-system": "^5.1.17",
    "@vanilla-extract/css": "^1.13.0",
    "@vanilla-extract/css-utils": "^0.1.3",
    "@vanilla-extract/recipes": "^0.5.0",
    "@vanilla-extract/sprinkles": "^1.6.1",
    "bignumber.js": "^9.0.0",
    clsx: "^1.2.1",
    csstype: "^3.1.2",
    "date-fns": "^2.29.3",
    deepmerge: "^4.0.0",
    "framer-motion": "10.16.4",
    "lightweight-charts": "^4.0.1",
    lodash: "^4.17.20",
    "react-popper": "^2.3.0",
    "styled-system": "^5.1.5",
    tslib: "^2.2.0"
  },
  publishConfig: {
    access: "public"
  }
};

// vite.config.ts
var vite_config_default = defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      fileName: "index",
      formats: ["cjs", "es"]
    },
    rollupOptions: {
      external: [...Object.keys(package_default.peerDependencies), ...Object.keys(package_default.dependencies), "crypto"]
    }
  },
  plugins: [
    vanillaExtractPlugin({
      identifiers: "short"
    }),
    dts()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2V2YW4vRG9jdW1lbnRzL3BhbmNha2VOZXdGRS9wYW5jYWtlLWZyb250ZW5kL3BhY2thZ2VzL3Vpa2l0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZXZhbi9Eb2N1bWVudHMvcGFuY2FrZU5ld0ZFL3BhbmNha2UtZnJvbnRlbmQvcGFja2FnZXMvdWlraXQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2V2YW4vRG9jdW1lbnRzL3BhbmNha2VOZXdGRS9wYW5jYWtlLWZyb250ZW5kL3BhY2thZ2VzL3Vpa2l0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IHZhbmlsbGFFeHRyYWN0UGx1Z2luIH0gZnJvbSBcIkB2YW5pbGxhLWV4dHJhY3Qvdml0ZS1wbHVnaW5cIjtcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiO1xuXG5pbXBvcnQgcGtnIGZyb20gXCIuL3BhY2thZ2UuanNvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBidWlsZDoge1xuICAgIGxpYjoge1xuICAgICAgZW50cnk6IFwic3JjL2luZGV4LnRzXCIsXG4gICAgICBmaWxlTmFtZTogXCJpbmRleFwiLFxuICAgICAgZm9ybWF0czogW1wiY2pzXCIsIFwiZXNcIl0sXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogWy4uLk9iamVjdC5rZXlzKHBrZy5wZWVyRGVwZW5kZW5jaWVzKSwgLi4uT2JqZWN0LmtleXMocGtnLmRlcGVuZGVuY2llcyksIFwiY3J5cHRvXCJdLFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICB2YW5pbGxhRXh0cmFjdFBsdWdpbih7XG4gICAgICBpZGVudGlmaWVyczogXCJzaG9ydFwiLFxuICAgIH0pLFxuICAgIGR0cygpLFxuICBdLFxufSk7XG4iLCAie1xuICBcIm5hbWVcIjogXCJAcGFuY2FrZXN3YXAvdWlraXRcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMC42NC4wXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJTZXQgb2YgVUkgY29tcG9uZW50cyBmb3IgcGFuY2FrZSBwcm9qZWN0c1wiLFxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcbiAgXCJtYWluXCI6IFwiZGlzdC9pbmRleC5janNcIixcbiAgXCJtb2R1bGVcIjogXCJkaXN0L2luZGV4LmpzXCIsXG4gIFwidHlwZXNcIjogXCJkaXN0L2luZGV4LmQudHNcIixcbiAgXCJzaWRlRWZmZWN0c1wiOiBbXG4gICAgXCIqLmNzcy50c1wiLFxuICAgIFwic3JjL2Nzcy8qKi8qXCIsXG4gICAgXCJzcmMvdGhlbWUvKiovKlwiXG4gIF0sXG4gIFwiZXhwb3J0c1wiOiB7XG4gICAgXCIuL3BhY2thZ2UuanNvblwiOiBcIi4vcGFja2FnZS5qc29uXCIsXG4gICAgXCIuXCI6IHtcbiAgICAgIFwiaW1wb3J0XCI6IFwiLi9kaXN0L2luZGV4LmpzXCIsXG4gICAgICBcInJlcXVpcmVcIjogXCIuL2Rpc3QvaW5kZXguY2pzXCJcbiAgICB9LFxuICAgIFwiLi9zdHlsZXNcIjoge1xuICAgICAgXCJpbXBvcnRcIjogXCIuL2Rpc3Qvc3R5bGUuY3NzXCIsXG4gICAgICBcInJlcXVpcmVcIjogXCIuL2Rpc3Qvc3R5bGUuY3NzXCJcbiAgICB9LFxuICAgIFwiLi9jc3MvYXRvbXNcIjoge1xuICAgICAgXCJpbXBvcnRcIjogXCIuL3NyYy9jc3MvYXRvbXMudHNcIixcbiAgICAgIFwidHlwZXNcIjogXCIuL2Rpc3QvY3NzL2F0b21zLmQudHNcIlxuICAgIH0sXG4gICAgXCIuL2Nzcy9yZXNwb25zaXZlU3R5bGVcIjoge1xuICAgICAgXCJpbXBvcnRcIjogXCIuL3NyYy9jc3MvcmVzcG9uc2l2ZVN0eWxlLnRzXCIsXG4gICAgICBcInR5cGVzXCI6IFwiLi9kaXN0L2Nzcy9yZXNwb25zaXZlU3R5bGUuZC50c1wiXG4gICAgfVxuICB9LFxuICBcInJlcG9zaXRvcnlcIjogXCJodHRwczovL2dpdGh1Yi5jb20vcGFuY2FrZXN3YXAvcGFuY2FrZS1mcm9udGVuZC90cmVlL2RldmVsb3AvcGFja2FnZXMvdWlraXRcIixcbiAgXCJsaWNlbnNlXCI6IFwiTUlUXCIsXG4gIFwicHJpdmF0ZVwiOiB0cnVlLFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiYnVpbGQ6dWlraXRcIjogXCJ2aXRlIGJ1aWxkXCIsXG4gICAgXCJkZXZcIjogXCJ2aXRlIGJ1aWxkIC0td2F0Y2ggLS1tb2RlIGRldmVsb3BtZW50XCIsXG4gICAgXCJzdGFydFwiOiBcInBucG0gc3Rvcnlib29rXCIsXG4gICAgXCJsaW50XCI6IFwiZXNsaW50ICdzcmMvKiovKi57anMsanN4LHRzLHRzeH0nXCIsXG4gICAgXCJmb3JtYXQ6Y2hlY2tcIjogXCJwcmV0dGllciAtLWNoZWNrIC0tbG9nbGV2ZWwgZXJyb3IgJ3NyYy8qKi8qLntqcyxqc3gsdHMsdHN4fSdcIixcbiAgICBcImZvcm1hdDp3cml0ZVwiOiBcInByZXR0aWVyIC0td3JpdGUgJ3NyYy8qKi8qLntqcyxqc3gsdHMsdHN4fSdcIixcbiAgICBcInN0b3J5Ym9va1wiOiBcInN0b3J5Ym9vayBkZXYgLXAgNjAwNlwiLFxuICAgIFwiYnVpbGQ6c3Rvcnlib29rXCI6IFwic3Rvcnlib29rIGJ1aWxkXCIsXG4gICAgXCJ0ZXN0XCI6IFwidml0ZXN0IC0tcnVuXCIsXG4gICAgXCJ1cGRhdGU6c25hcHNob3RcIjogXCJ2aXRlc3QgLXVcIixcbiAgICBcInByZXB1Ymxpc2hPbmx5XCI6IFwicG5wbSBydW4gYnVpbGQ6dWlraXRcIixcbiAgICBcImNsZWFuXCI6IFwicm0gLXJmIC50dXJibyAmJiBybSAtcmYgbm9kZV9tb2R1bGVzICYmIHJtIC1yZiBkaXN0XCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGJhYmVsL2NvcmVcIjogXCJeNy4yMC4xMlwiLFxuICAgIFwiQGJhYmVsL3ByZXNldC1lbnZcIjogXCJeNy4yMC4yXCIsXG4gICAgXCJAYmFiZWwvcHJlc2V0LXJlYWN0XCI6IFwiXjcuMTguNlwiLFxuICAgIFwiQHBhbmNha2Vzd2FwL2hvb2tzXCI6IFwid29ya3NwYWNlOipcIixcbiAgICBcIkBwYW5jYWtlc3dhcC91dGlsc1wiOiBcIndvcmtzcGFjZToqXCIsXG4gICAgXCJAcGFuY2FrZXN3YXAvY2hhaW5zXCI6IFwid29ya3NwYWNlOipcIixcbiAgICBcIkByb2xsdXAvcGx1Z2luLWpzb25cIjogXCJeNC4xLjBcIixcbiAgICBcIkByb2xsdXAvcGx1Z2luLXR5cGVzY3JpcHRcIjogXCJeOC4yLjFcIixcbiAgICBcIkByb2xsdXAvcGx1Z2luLXVybFwiOiBcIl42LjAuMFwiLFxuICAgIFwiQHN0b3J5Ym9vay9hZGRvbi1hMTF5XCI6IFwiXjcuMC43XCIsXG4gICAgXCJAc3Rvcnlib29rL2FkZG9uLWFjdGlvbnNcIjogXCJeNy4wLjdcIixcbiAgICBcIkBzdG9yeWJvb2svYWRkb24tZXNzZW50aWFsc1wiOiBcIl43LjAuN1wiLFxuICAgIFwiQHN0b3J5Ym9vay9hZGRvbi1saW5rc1wiOiBcIl43LjAuN1wiLFxuICAgIFwiQHN0b3J5Ym9vay9idWlsZGVyLXZpdGVcIjogXCJeNy4wLjdcIixcbiAgICBcIkBzdG9yeWJvb2svcmVhY3RcIjogXCJeNy4wLjdcIixcbiAgICBcIkBzdG9yeWJvb2svcmVhY3Qtdml0ZVwiOiBcIl43LjAuN1wiLFxuICAgIFwiQHRlc3RpbmctbGlicmFyeS9qZXN0LWRvbVwiOiBcIl41LjExLjZcIixcbiAgICBcIkB0ZXN0aW5nLWxpYnJhcnkvcmVhY3RcIjogXCJeMTIuMS4zXCIsXG4gICAgXCJAdHlwZXMvZDNcIjogXCJeNy40LjBcIixcbiAgICBcIkB0eXBlcy9qcy1jb29raWVcIjogXCJeMy4wLjJcIixcbiAgICBcIkB0eXBlcy9sb2Rhc2hcIjogXCJeNC4xNC4xNjhcIixcbiAgICBcIkB0eXBlcy9yZWFjdFwiOiBcIl4xOC4yLjIxXCIsXG4gICAgXCJAdHlwZXMvcmVhY3QtZG9tXCI6IFwiXjE4LjAuNlwiLFxuICAgIFwiQHR5cGVzL3JlYWN0LXJvdXRlci1kb21cIjogXCJeNS4xLjdcIixcbiAgICBcIkB0eXBlcy9yZWFjdC10cmFuc2l0aW9uLWdyb3VwXCI6IFwiXjQuNC4xXCIsXG4gICAgXCJAdHlwZXMvc3R5bGVkLXN5c3RlbV9fc2hvdWxkLWZvcndhcmQtcHJvcFwiOiBcIl41LjEuMlwiLFxuICAgIFwiQHZhbmlsbGEtZXh0cmFjdC92aXRlLXBsdWdpblwiOiBcIl4zLjguMFwiLFxuICAgIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjogXCI0LjAuMFwiLFxuICAgIFwiYmFiZWwtamVzdFwiOiBcIl4yOS4zLjFcIixcbiAgICBcImJhYmVsLWxvYWRlclwiOiBcIl45LjEuMlwiLFxuICAgIFwiYmFiZWwtcGx1Z2luLXN0eWxlZC1jb21wb25lbnRzXCI6IFwiXjEuMTIuMFwiLFxuICAgIFwiZDNcIjogXCJeNy44LjJcIixcbiAgICBcImplc3RcIjogXCIyOS4zLjFcIixcbiAgICBcImplc3QtZW52aXJvbm1lbnQtanNkb21cIjogXCJeMjkuMy4xXCIsXG4gICAgXCJqZXN0LXN0eWxlZC1jb21wb25lbnRzXCI6IFwiXjcuMC44XCIsXG4gICAgXCJqcy1jb29raWVcIjogXCIqXCIsXG4gICAgXCJuZXh0XCI6IFwiKlwiLFxuICAgIFwibmV4dC1zZW9cIjogXCIqXCIsXG4gICAgXCJuZXh0LXRoZW1lc1wiOiBcIl4wLjIuMVwiLFxuICAgIFwicG9saXNoZWRcIjogXCJeNC4yLjJcIixcbiAgICBcInJlYWN0XCI6IFwiXjE4LjIuMFwiLFxuICAgIFwicmVhY3QtY291bnR1cFwiOiBcIl42LjQuMFwiLFxuICAgIFwicmVhY3QtZGV2aWNlLWRldGVjdFwiOiBcIipcIixcbiAgICBcInJlYWN0LWRvbVwiOiBcIl4xOC4yLjBcIixcbiAgICBcInJlYWN0LWlzXCI6IFwiXjE3LjAuMlwiLFxuICAgIFwicmVhY3QtbWFya2Rvd25cIjogXCJeNi4wLjJcIixcbiAgICBcInJlYWN0LXJlZHV4XCI6IFwiXjguMC41XCIsXG4gICAgXCJyZWFjdC1yb3V0ZXItZG9tXCI6IFwiXjUuMi4wXCIsXG4gICAgXCJyZWFjdC10cmFuc2l0aW9uLWdyb3VwXCI6IFwiKlwiLFxuICAgIFwicmVtYXJrLWdmbVwiOiBcIipcIixcbiAgICBcInJvbGx1cFwiOiBcIl4yLjcwLjFcIixcbiAgICBcInJvbGx1cC1wbHVnaW4tbm9kZS1idWlsdGluc1wiOiBcIl4yLjEuMlwiLFxuICAgIFwic3Rvcnlib29rXCI6IFwiXjcuMC43XCIsXG4gICAgXCJzdHlsZWQtY29tcG9uZW50c1wiOiBcIl42LjAuN1wiLFxuICAgIFwidGhlbWVwcm92aWRlci1zdG9yeWJvb2tcIjogXCJeMS43LjJcIixcbiAgICBcInRzLWplc3RcIjogXCJeMjcuMS4zXCIsXG4gICAgXCJ2aXRlXCI6IFwiXjQuMy4xXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1kdHNcIjogXCJeMy41LjNcIixcbiAgICBcInZpdGUtdHNjb25maWctcGF0aHNcIjogXCJeNC4wLjNcIixcbiAgICBcInZpdGVzdFwiOiBcIl4wLjI3LjJcIixcbiAgICBcIndhZ21pXCI6IFwiXjEuMy4xMFwiXG4gIH0sXG4gIFwicGVlckRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJqcy1jb29raWVcIjogXCIqXCIsXG4gICAgXCJuZXh0XCI6IFwiKlwiLFxuICAgIFwibmV4dC1zZW9cIjogXCIqXCIsXG4gICAgXCJuZXh0LXRoZW1lc1wiOiBcIl4wLjIuMVwiLFxuICAgIFwicmVhY3RcIjogXCJeMTguMi4wXCIsXG4gICAgXCJyZWFjdC1kZXZpY2UtZGV0ZWN0XCI6IFwiKlwiLFxuICAgIFwicmVhY3QtZG9tXCI6IFwiXjE4LjIuMFwiLFxuICAgIFwicmVhY3QtcmVkdXhcIjogXCJeOC4wLjVcIixcbiAgICBcInJlYWN0LXRyYW5zaXRpb24tZ3JvdXBcIjogXCIqXCIsXG4gICAgXCJyZW1hcmstZ2ZtXCI6IFwiKlwiLFxuICAgIFwic3R5bGVkLWNvbXBvbmVudHNcIjogXCJeNi4wLjdcIlxuICB9LFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAcGFuY2FrZXN3YXAvaG9va3NcIjogXCJ3b3Jrc3BhY2U6KlwiLFxuICAgIFwiQHBhbmNha2Vzd2FwL2xvY2FsaXphdGlvblwiOiBcIndvcmtzcGFjZToqXCIsXG4gICAgXCJAcG9wcGVyanMvY29yZVwiOiBcIl4yLjkuMlwiLFxuICAgIFwiQHJhZGl4LXVpL3JlYWN0LWRpc21pc3NhYmxlLWxheWVyXCI6IFwiXjEuMC4zXCIsXG4gICAgXCJAcmFkaXgtdWkvcmVhY3Qtc2xvdFwiOiBcIl4xLjAuMFwiLFxuICAgIFwiQHN0eWxlZC1zeXN0ZW0vc2hvdWxkLWZvcndhcmQtcHJvcFwiOiBcIl41LjEuNVwiLFxuICAgIFwiQHR5cGVzL3N0eWxlZC1zeXN0ZW1cIjogXCJeNS4xLjE3XCIsXG4gICAgXCJAdmFuaWxsYS1leHRyYWN0L2Nzc1wiOiBcIl4xLjEzLjBcIixcbiAgICBcIkB2YW5pbGxhLWV4dHJhY3QvY3NzLXV0aWxzXCI6IFwiXjAuMS4zXCIsXG4gICAgXCJAdmFuaWxsYS1leHRyYWN0L3JlY2lwZXNcIjogXCJeMC41LjBcIixcbiAgICBcIkB2YW5pbGxhLWV4dHJhY3Qvc3ByaW5rbGVzXCI6IFwiXjEuNi4xXCIsXG4gICAgXCJiaWdudW1iZXIuanNcIjogXCJeOS4wLjBcIixcbiAgICBcImNsc3hcIjogXCJeMS4yLjFcIixcbiAgICBcImNzc3R5cGVcIjogXCJeMy4xLjJcIixcbiAgICBcImRhdGUtZm5zXCI6IFwiXjIuMjkuM1wiLFxuICAgIFwiZGVlcG1lcmdlXCI6IFwiXjQuMC4wXCIsXG4gICAgXCJmcmFtZXItbW90aW9uXCI6IFwiMTAuMTYuNFwiLFxuICAgIFwibGlnaHR3ZWlnaHQtY2hhcnRzXCI6IFwiXjQuMC4xXCIsXG4gICAgXCJsb2Rhc2hcIjogXCJeNC4xNy4yMFwiLFxuICAgIFwicmVhY3QtcG9wcGVyXCI6IFwiXjIuMy4wXCIsXG4gICAgXCJzdHlsZWQtc3lzdGVtXCI6IFwiXjUuMS41XCIsXG4gICAgXCJ0c2xpYlwiOiBcIl4yLjIuMFwiXG4gIH0sXG4gIFwicHVibGlzaENvbmZpZ1wiOiB7XG4gICAgXCJhY2Nlc3NcIjogXCJwdWJsaWNcIlxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdYLFNBQVMsb0JBQW9CO0FBQ3JaLFNBQVMsNEJBQTRCO0FBQ3JDLE9BQU8sU0FBUzs7O0FDRmhCO0FBQUEsRUFDRSxNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsRUFDWCxhQUFlO0FBQUEsRUFDZixNQUFRO0FBQUEsRUFDUixNQUFRO0FBQUEsRUFDUixRQUFVO0FBQUEsRUFDVixPQUFTO0FBQUEsRUFDVCxhQUFlO0FBQUEsSUFDYjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBVztBQUFBLElBQ1Qsa0JBQWtCO0FBQUEsSUFDbEIsS0FBSztBQUFBLE1BQ0gsUUFBVTtBQUFBLE1BQ1YsU0FBVztBQUFBLElBQ2I7QUFBQSxJQUNBLFlBQVk7QUFBQSxNQUNWLFFBQVU7QUFBQSxNQUNWLFNBQVc7QUFBQSxJQUNiO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixRQUFVO0FBQUEsTUFDVixPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0EseUJBQXlCO0FBQUEsTUFDdkIsUUFBVTtBQUFBLE1BQ1YsT0FBUztBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQUEsRUFDQSxZQUFjO0FBQUEsRUFDZCxTQUFXO0FBQUEsRUFDWCxTQUFXO0FBQUEsRUFDWCxTQUFXO0FBQUEsSUFDVCxlQUFlO0FBQUEsSUFDZixLQUFPO0FBQUEsSUFDUCxPQUFTO0FBQUEsSUFDVCxNQUFRO0FBQUEsSUFDUixnQkFB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
