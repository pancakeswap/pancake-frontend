import React, { useEffect } from "react";
import { withThemesProvider } from "themeprovider-storybook";
import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from "next-themes";
import light from "../src/theme/light";
import dark from "../src/theme/dark";
import ResetCSS from "../src/ResetCSS";
import { ModalProvider } from "../src/widgets/Modal";
import { MatchBreakpointsProvider } from "../src";
import { ThemeProvider } from "styled-components";

const globalDecorator = (StoryFn) => (
  <MatchBreakpointsProvider>
    <ModalProvider>
      <ResetCSS />
      <StoryFn />
    </ModalProvider>
  </MatchBreakpointsProvider>
);

const StyledThemeProvider = (props) => {
  const { setTheme } = useNextTheme();

  useEffect(() => {
    setTheme(props.theme.name);
  }, [props.theme.name]);

  return <ThemeProvider {...props}>{props.children}</ThemeProvider>;
};

const StorybookThemeProvider = (props) => {
  return (
    <NextThemeProvider>
      <StyledThemeProvider {...props} />
    </NextThemeProvider>
  );
};

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: "fullscreen",
};

const themes = [
  {
    name: "light",
    backgroundColor: light.colors.background,
    ...light,
  },
  {
    name: "dark",
    backgroundColor: dark.colors.background,
    ...dark,
  },
];

export const decorators = [
  globalDecorator,
  withThemesProvider(themes, {
    CustomThemeProvider: StorybookThemeProvider,
  }),
];
