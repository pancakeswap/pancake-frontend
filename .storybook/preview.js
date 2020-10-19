import React from "react";
import { withThemesProvider } from "themeprovider-storybook";
import light from "../src/theme/light";
import dark from "../src/theme/dark";
import ResetCSS from "../src/ResetCSS";

const globalDecorator = (StoryFn) => (
  <>
    <ResetCSS />
    <StoryFn />
  </>
);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

const themes = [
  {
    name: "Light",
    backgroundColor: light.colors.background,
    ...light,
  },
  {
    name: "Dark",
    backgroundColor: dark.colors.background,
    ...dark,
  },
];

export const decorators = [globalDecorator, withThemesProvider(themes)];
