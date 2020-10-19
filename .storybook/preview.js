import React from "react";
import { withThemesProvider } from "themeprovider-storybook";
import { createGlobalStyle } from "styled-components";
import light from "../src/theme/light";
import dark from "../src/theme/dark";

const Global = createGlobalStyle`
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    font-family: 'Kanit', sans-serif;
  }
`;

const globalDecorator = (StoryFn) => (
  <>
    <Global />
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
