// vite.config.ts
import { defineConfig } from "file:///Users/evan/Documents/frontendMain/pancake-frontend/node_modules/.pnpm/vite@4.3.9_@types+node@18.16.2/node_modules/vite/dist/node/index.js";
import { vanillaExtractPlugin } from "file:///Users/evan/Documents/frontendMain/pancake-frontend/node_modules/.pnpm/@vanilla-extract+vite-plugin@3.8.0_@types+node@18.16.2_vite@4.3.9/node_modules/@vanilla-extract/vite-plugin/dist/vanilla-extract-vite-plugin.cjs.js";
import dts from "file:///Users/evan/Documents/frontendMain/pancake-frontend/node_modules/.pnpm/vite-plugin-dts@3.5.3_@types+node@18.16.2_rollup@2.78.0_typescript@5.1.3_vite@4.3.9/node_modules/vite-plugin-dts/dist/index.mjs";

// package.json
var package_default = {
  name: "@pancakeswap/uikit",
  version: "0.64.2",
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
    "./css/vars.css": {
      import: "./src/css/vars.css.ts",
      types: "./dist/css/vars.css.d.ts"
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
    vite: "4.3.9",
    "vite-plugin-dts": "^3.5.3",
    "vite-tsconfig-paths": "^4.0.3",
    vitest: "^0.27.2",
    wagmi: "^1.4.3"
  },
  peerDependencies: {
    "js-cookie": "*",
    next: "*",
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
    dayjs: "^1.11.10",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2V2YW4vRG9jdW1lbnRzL2Zyb250ZW5kTWFpbi9wYW5jYWtlLWZyb250ZW5kL3BhY2thZ2VzL3Vpa2l0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZXZhbi9Eb2N1bWVudHMvZnJvbnRlbmRNYWluL3BhbmNha2UtZnJvbnRlbmQvcGFja2FnZXMvdWlraXQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2V2YW4vRG9jdW1lbnRzL2Zyb250ZW5kTWFpbi9wYW5jYWtlLWZyb250ZW5kL3BhY2thZ2VzL3Vpa2l0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IHZhbmlsbGFFeHRyYWN0UGx1Z2luIH0gZnJvbSBcIkB2YW5pbGxhLWV4dHJhY3Qvdml0ZS1wbHVnaW5cIjtcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiO1xuXG5pbXBvcnQgcGtnIGZyb20gXCIuL3BhY2thZ2UuanNvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBidWlsZDoge1xuICAgIGxpYjoge1xuICAgICAgZW50cnk6IFwic3JjL2luZGV4LnRzXCIsXG4gICAgICBmaWxlTmFtZTogXCJpbmRleFwiLFxuICAgICAgZm9ybWF0czogW1wiY2pzXCIsIFwiZXNcIl0sXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogWy4uLk9iamVjdC5rZXlzKHBrZy5wZWVyRGVwZW5kZW5jaWVzKSwgLi4uT2JqZWN0LmtleXMocGtnLmRlcGVuZGVuY2llcyksIFwiY3J5cHRvXCJdLFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICB2YW5pbGxhRXh0cmFjdFBsdWdpbih7XG4gICAgICBpZGVudGlmaWVyczogXCJzaG9ydFwiLFxuICAgIH0pLFxuICAgIGR0cygpLFxuICBdLFxufSk7XG4iLCAie1xuICBcIm5hbWVcIjogXCJAcGFuY2FrZXN3YXAvdWlraXRcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMC42NC4yXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJTZXQgb2YgVUkgY29tcG9uZW50cyBmb3IgcGFuY2FrZSBwcm9qZWN0c1wiLFxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcbiAgXCJtYWluXCI6IFwiZGlzdC9pbmRleC5janNcIixcbiAgXCJtb2R1bGVcIjogXCJkaXN0L2luZGV4LmpzXCIsXG4gIFwidHlwZXNcIjogXCJkaXN0L2luZGV4LmQudHNcIixcbiAgXCJzaWRlRWZmZWN0c1wiOiBbXG4gICAgXCIqLmNzcy50c1wiLFxuICAgIFwic3JjL2Nzcy8qKi8qXCIsXG4gICAgXCJzcmMvdGhlbWUvKiovKlwiXG4gIF0sXG4gIFwiZXhwb3J0c1wiOiB7XG4gICAgXCIuL3BhY2thZ2UuanNvblwiOiBcIi4vcGFja2FnZS5qc29uXCIsXG4gICAgXCIuXCI6IHtcbiAgICAgIFwiaW1wb3J0XCI6IFwiLi9kaXN0L2luZGV4LmpzXCIsXG4gICAgICBcInJlcXVpcmVcIjogXCIuL2Rpc3QvaW5kZXguY2pzXCJcbiAgICB9LFxuICAgIFwiLi9zdHlsZXNcIjoge1xuICAgICAgXCJpbXBvcnRcIjogXCIuL2Rpc3Qvc3R5bGUuY3NzXCIsXG4gICAgICBcInJlcXVpcmVcIjogXCIuL2Rpc3Qvc3R5bGUuY3NzXCJcbiAgICB9LFxuICAgIFwiLi9jc3MvYXRvbXNcIjoge1xuICAgICAgXCJpbXBvcnRcIjogXCIuL3NyYy9jc3MvYXRvbXMudHNcIixcbiAgICAgIFwidHlwZXNcIjogXCIuL2Rpc3QvY3NzL2F0b21zLmQudHNcIlxuICAgIH0sXG4gICAgXCIuL2Nzcy92YXJzLmNzc1wiOiB7XG4gICAgICBcImltcG9ydFwiOiBcIi4vc3JjL2Nzcy92YXJzLmNzcy50c1wiLFxuICAgICAgXCJ0eXBlc1wiOiBcIi4vZGlzdC9jc3MvdmFycy5jc3MuZC50c1wiXG4gICAgfSxcbiAgICBcIi4vY3NzL3Jlc3BvbnNpdmVTdHlsZVwiOiB7XG4gICAgICBcImltcG9ydFwiOiBcIi4vc3JjL2Nzcy9yZXNwb25zaXZlU3R5bGUudHNcIixcbiAgICAgIFwidHlwZXNcIjogXCIuL2Rpc3QvY3NzL3Jlc3BvbnNpdmVTdHlsZS5kLnRzXCJcbiAgICB9XG4gIH0sXG4gIFwicmVwb3NpdG9yeVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9wYW5jYWtlc3dhcC9wYW5jYWtlLWZyb250ZW5kL3RyZWUvZGV2ZWxvcC9wYWNrYWdlcy91aWtpdFwiLFxuICBcImxpY2Vuc2VcIjogXCJNSVRcIixcbiAgXCJwcml2YXRlXCI6IHRydWUsXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJidWlsZDp1aWtpdFwiOiBcInZpdGUgYnVpbGRcIixcbiAgICBcImRldlwiOiBcInZpdGUgYnVpbGQgLS13YXRjaCAtLW1vZGUgZGV2ZWxvcG1lbnRcIixcbiAgICBcInN0YXJ0XCI6IFwicG5wbSBzdG9yeWJvb2tcIixcbiAgICBcImxpbnRcIjogXCJlc2xpbnQgJ3NyYy8qKi8qLntqcyxqc3gsdHMsdHN4fSdcIixcbiAgICBcImZvcm1hdDpjaGVja1wiOiBcInByZXR0aWVyIC0tY2hlY2sgLS1sb2dsZXZlbCBlcnJvciAnc3JjLyoqLyoue2pzLGpzeCx0cyx0c3h9J1wiLFxuICAgIFwiZm9ybWF0OndyaXRlXCI6IFwicHJldHRpZXIgLS13cml0ZSAnc3JjLyoqLyoue2pzLGpzeCx0cyx0c3h9J1wiLFxuICAgIFwic3Rvcnlib29rXCI6IFwic3Rvcnlib29rIGRldiAtcCA2MDA2XCIsXG4gICAgXCJidWlsZDpzdG9yeWJvb2tcIjogXCJzdG9yeWJvb2sgYnVpbGRcIixcbiAgICBcInRlc3RcIjogXCJ2aXRlc3QgLS1ydW5cIixcbiAgICBcInVwZGF0ZTpzbmFwc2hvdFwiOiBcInZpdGVzdCAtdVwiLFxuICAgIFwicHJlcHVibGlzaE9ubHlcIjogXCJwbnBtIHJ1biBidWlsZDp1aWtpdFwiLFxuICAgIFwiY2xlYW5cIjogXCJybSAtcmYgLnR1cmJvICYmIHJtIC1yZiBub2RlX21vZHVsZXMgJiYgcm0gLXJmIGRpc3RcIlxuICB9LFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAYmFiZWwvY29yZVwiOiBcIl43LjIwLjEyXCIsXG4gICAgXCJAYmFiZWwvcHJlc2V0LWVudlwiOiBcIl43LjIwLjJcIixcbiAgICBcIkBiYWJlbC9wcmVzZXQtcmVhY3RcIjogXCJeNy4xOC42XCIsXG4gICAgXCJAcGFuY2FrZXN3YXAvaG9va3NcIjogXCJ3b3Jrc3BhY2U6KlwiLFxuICAgIFwiQHBhbmNha2Vzd2FwL3V0aWxzXCI6IFwid29ya3NwYWNlOipcIixcbiAgICBcIkBwYW5jYWtlc3dhcC9jaGFpbnNcIjogXCJ3b3Jrc3BhY2U6KlwiLFxuICAgIFwiQHJvbGx1cC9wbHVnaW4tanNvblwiOiBcIl40LjEuMFwiLFxuICAgIFwiQHJvbGx1cC9wbHVnaW4tdHlwZXNjcmlwdFwiOiBcIl44LjIuMVwiLFxuICAgIFwiQHJvbGx1cC9wbHVnaW4tdXJsXCI6IFwiXjYuMC4wXCIsXG4gICAgXCJAc3Rvcnlib29rL2FkZG9uLWExMXlcIjogXCJeNy4wLjdcIixcbiAgICBcIkBzdG9yeWJvb2svYWRkb24tYWN0aW9uc1wiOiBcIl43LjAuN1wiLFxuICAgIFwiQHN0b3J5Ym9vay9hZGRvbi1lc3NlbnRpYWxzXCI6IFwiXjcuMC43XCIsXG4gICAgXCJAc3Rvcnlib29rL2FkZG9uLWxpbmtzXCI6IFwiXjcuMC43XCIsXG4gICAgXCJAc3Rvcnlib29rL2J1aWxkZXItdml0ZVwiOiBcIl43LjAuN1wiLFxuICAgIFwiQHN0b3J5Ym9vay9yZWFjdFwiOiBcIl43LjAuN1wiLFxuICAgIFwiQHN0b3J5Ym9vay9yZWFjdC12aXRlXCI6IFwiXjcuMC43XCIsXG4gICAgXCJAdGVzdGluZy1saWJyYXJ5L2plc3QtZG9tXCI6IFwiXjUuMTEuNlwiLFxuICAgIFwiQHRlc3RpbmctbGlicmFyeS9yZWFjdFwiOiBcIl4xMi4xLjNcIixcbiAgICBcIkB0eXBlcy9kM1wiOiBcIl43LjQuMFwiLFxuICAgIFwiQHR5cGVzL2pzLWNvb2tpZVwiOiBcIl4zLjAuMlwiLFxuICAgIFwiQHR5cGVzL2xvZGFzaFwiOiBcIl40LjE0LjE2OFwiLFxuICAgIFwiQHR5cGVzL3JlYWN0XCI6IFwiXjE4LjIuMjFcIixcbiAgICBcIkB0eXBlcy9yZWFjdC1kb21cIjogXCJeMTguMC42XCIsXG4gICAgXCJAdHlwZXMvcmVhY3Qtcm91dGVyLWRvbVwiOiBcIl41LjEuN1wiLFxuICAgIFwiQHR5cGVzL3JlYWN0LXRyYW5zaXRpb24tZ3JvdXBcIjogXCJeNC40LjFcIixcbiAgICBcIkB0eXBlcy9zdHlsZWQtc3lzdGVtX19zaG91bGQtZm9yd2FyZC1wcm9wXCI6IFwiXjUuMS4yXCIsXG4gICAgXCJAdmFuaWxsYS1leHRyYWN0L3ZpdGUtcGx1Z2luXCI6IFwiXjMuOC4wXCIsXG4gICAgXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiOiBcIjQuMC4wXCIsXG4gICAgXCJiYWJlbC1qZXN0XCI6IFwiXjI5LjMuMVwiLFxuICAgIFwiYmFiZWwtbG9hZGVyXCI6IFwiXjkuMS4yXCIsXG4gICAgXCJiYWJlbC1wbHVnaW4tc3R5bGVkLWNvbXBvbmVudHNcIjogXCJeMS4xMi4wXCIsXG4gICAgXCJkM1wiOiBcIl43LjguMlwiLFxuICAgIFwiamVzdFwiOiBcIjI5LjMuMVwiLFxuICAgIFwiamVzdC1lbnZpcm9ubWVudC1qc2RvbVwiOiBcIl4yOS4zLjFcIixcbiAgICBcImplc3Qtc3R5bGVkLWNvbXBvbmVudHNcIjogXCJeNy4wLjhcIixcbiAgICBcImpzLWNvb2tpZVwiOiBcIipcIixcbiAgICBcIm5leHRcIjogXCIqXCIsXG4gICAgXCJuZXh0LXRoZW1lc1wiOiBcIl4wLjIuMVwiLFxuICAgIFwicG9saXNoZWRcIjogXCJeNC4yLjJcIixcbiAgICBcInJlYWN0XCI6IFwiXjE4LjIuMFwiLFxuICAgIFwicmVhY3QtY291bnR1cFwiOiBcIl42LjQuMFwiLFxuICAgIFwicmVhY3QtZGV2aWNlLWRldGVjdFwiOiBcIipcIixcbiAgICBcInJlYWN0LWRvbVwiOiBcIl4xOC4yLjBcIixcbiAgICBcInJlYWN0LWlzXCI6IFwiXjE3LjAuMlwiLFxuICAgIFwicmVhY3QtbWFya2Rvd25cIjogXCJeNi4wLjJcIixcbiAgICBcInJlYWN0LXJlZHV4XCI6IFwiXjguMC41XCIsXG4gICAgXCJyZWFjdC1yb3V0ZXItZG9tXCI6IFwiXjUuMi4wXCIsXG4gICAgXCJyZWFjdC10cmFuc2l0aW9uLWdyb3VwXCI6IFwiKlwiLFxuICAgIFwicmVtYXJrLWdmbVwiOiBcIipcIixcbiAgICBcInJvbGx1cFwiOiBcIl4yLjcwLjFcIixcbiAgICBcInJvbGx1cC1wbHVnaW4tbm9kZS1idWlsdGluc1wiOiBcIl4yLjEuMlwiLFxuICAgIFwic3Rvcnlib29rXCI6IFwiXjcuMC43XCIsXG4gICAgXCJzdHlsZWQtY29tcG9uZW50c1wiOiBcIl42LjAuN1wiLFxuICAgIFwidGhlbWVwcm92aWRlci1zdG9yeWJvb2tcIjogXCJeMS43LjJcIixcbiAgICBcInRzLWplc3RcIjogXCJeMjcuMS4zXCIsXG4gICAgXCJ2aXRlXCI6IFwiNC4zLjlcIixcbiAgICBcInZpdGUtcGx1Z2luLWR0c1wiOiBcIl4zLjUuM1wiLFxuICAgIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiOiBcIl40LjAuM1wiLFxuICAgIFwidml0ZXN0XCI6IFwiXjAuMjcuMlwiLFxuICAgIFwid2FnbWlcIjogXCJeMS40LjNcIlxuICB9LFxuICBcInBlZXJEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwianMtY29va2llXCI6IFwiKlwiLFxuICAgIFwibmV4dFwiOiBcIipcIixcbiAgICBcIm5leHQtdGhlbWVzXCI6IFwiXjAuMi4xXCIsXG4gICAgXCJyZWFjdFwiOiBcIl4xOC4yLjBcIixcbiAgICBcInJlYWN0LWRldmljZS1kZXRlY3RcIjogXCIqXCIsXG4gICAgXCJyZWFjdC1kb21cIjogXCJeMTguMi4wXCIsXG4gICAgXCJyZWFjdC1yZWR1eFwiOiBcIl44LjAuNVwiLFxuICAgIFwicmVhY3QtdHJhbnNpdGlvbi1ncm91cFwiOiBcIipcIixcbiAgICBcInJlbWFyay1nZm1cIjogXCIqXCIsXG4gICAgXCJzdHlsZWQtY29tcG9uZW50c1wiOiBcIl42LjAuN1wiXG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBwYW5jYWtlc3dhcC9ob29rc1wiOiBcIndvcmtzcGFjZToqXCIsXG4gICAgXCJAcGFuY2FrZXN3YXAvbG9jYWxpemF0aW9uXCI6IFwid29ya3NwYWNlOipcIixcbiAgICBcIkBwb3BwZXJqcy9jb3JlXCI6IFwiXjIuOS4yXCIsXG4gICAgXCJAcmFkaXgtdWkvcmVhY3QtZGlzbWlzc2FibGUtbGF5ZXJcIjogXCJeMS4wLjNcIixcbiAgICBcIkByYWRpeC11aS9yZWFjdC1zbG90XCI6IFwiXjEuMC4wXCIsXG4gICAgXCJAc3R5bGVkLXN5c3RlbS9zaG91bGQtZm9yd2FyZC1wcm9wXCI6IFwiXjUuMS41XCIsXG4gICAgXCJAdHlwZXMvc3R5bGVkLXN5c3RlbVwiOiBcIl41LjEuMTdcIixcbiAgICBcIkB2YW5pbGxhLWV4dHJhY3QvY3NzXCI6IFwiXjEuMTMuMFwiLFxuICAgIFwiQHZhbmlsbGEtZXh0cmFjdC9jc3MtdXRpbHNcIjogXCJeMC4xLjNcIixcbiAgICBcIkB2YW5pbGxhLWV4dHJhY3QvcmVjaXBlc1wiOiBcIl4wLjUuMFwiLFxuICAgIFwiQHZhbmlsbGEtZXh0cmFjdC9zcHJpbmtsZXNcIjogXCJeMS42LjFcIixcbiAgICBcImJpZ251bWJlci5qc1wiOiBcIl45LjAuMFwiLFxuICAgIFwiY2xzeFwiOiBcIl4xLjIuMVwiLFxuICAgIFwiY3NzdHlwZVwiOiBcIl4zLjEuMlwiLFxuICAgIFwiZGF5anNcIjogXCJeMS4xMS4xMFwiLFxuICAgIFwiZGVlcG1lcmdlXCI6IFwiXjQuMC4wXCIsXG4gICAgXCJmcmFtZXItbW90aW9uXCI6IFwiMTAuMTYuNFwiLFxuICAgIFwibGlnaHR3ZWlnaHQtY2hhcnRzXCI6IFwiXjQuMC4xXCIsXG4gICAgXCJsb2Rhc2hcIjogXCJeNC4xNy4yMFwiLFxuICAgIFwicmVhY3QtcG9wcGVyXCI6IFwiXjIuMy4wXCIsXG4gICAgXCJzdHlsZWQtc3lzdGVtXCI6IFwiXjUuMS41XCIsXG4gICAgXCJ0c2xpYlwiOiBcIl4yLjIuMFwiXG4gIH0sXG4gIFwicHVibGlzaENvbmZpZ1wiOiB7XG4gICAgXCJhY2Nlc3NcIjogXCJwdWJsaWNcIlxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdYLFNBQVMsb0JBQW9CO0FBQ3JaLFNBQVMsNEJBQTRCO0FBQ3JDLE9BQU8sU0FBUzs7O0FDRmhCO0FBQUEsRUFDRSxNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsRUFDWCxhQUFlO0FBQUEsRUFDZixNQUFRO0FBQUEsRUFDUixNQUFRO0FBQUEsRUFDUixRQUFVO0FBQUEsRUFDVixPQUFTO0FBQUEsRUFDVCxhQUFlO0FBQUEsSUFDYjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBVztBQUFBLElBQ1Qsa0JBQWtCO0FBQUEsSUFDbEIsS0FBSztBQUFBLE1BQ0gsUUFBVTtBQUFBLE1BQ1YsU0FBVztBQUFBLElBQ2I7QUFBQSxJQUNBLFlBQVk7QUFBQSxNQUNWLFFBQVU7QUFBQSxNQUNWLFNBQVc7QUFBQSxJQUNiO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixRQUFVO0FBQUEsTUFDVixPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0Esa0JBQWtCO0FBQUEsTUFDaEIsUUFBVTtBQUFBLE1BQ1YsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBLHlCQUF5QjtBQUFBLE1BQ3ZCLFFBQVU7QUFBQSxNQUNWLE9BQVM7QUFBQSxJQUNYO0FBQUEsRUFDRjtBQUFB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
