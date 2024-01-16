import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from "next-themes";
import React, { useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { MatchBreakpointsProvider, ToastListener } from "../src";
import ResetCSS from "../src/ResetCSS";
import dark from "../src/theme/dark";
import light from "../src/theme/light";
import { ModalProvider } from "../src/widgets/Modal";

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Global theme for components",
    defaultValue: "dark",
    toolbar: {
      // The icon for the toolbar item
      icon: "circlehollow",
      // Array of options
      items: [
        { value: "light", icon: "circlehollow", title: "light" },
        { value: "dark", icon: "circle", title: "dark" },
      ],
      // Property that specifies if the name of the item will be displayed
      showName: true,
    },
  },
};

const globalDecorator = (StoryFn, context) => {
  const theme = context.parameters.theme || context.globals.theme;
  const storyTheme = theme === "dark" ? "dark" : "light";

  return (
    <StorybookThemeProvider themeName={storyTheme}>
      <MatchBreakpointsProvider>
        <ModalProvider>
          <ResetCSS />
          <ToastListener />
          <StoryFn />
        </ModalProvider>
      </MatchBreakpointsProvider>
    </StorybookThemeProvider>
  );
};

const StyledThemeProvider = (props) => {
  const { setTheme } = useNextTheme();

  useEffect(() => {
    setTheme(props.themeName);
  }, [props.themeName]);

  return <ThemeProvider {...props}>{props.children}</ThemeProvider>;
};

const StorybookThemeProvider = (props) => {
  return (
    <NextThemeProvider>
      <StyledThemeProvider theme={props.themeName === "dark" ? dark : light} {...props} />
    </NextThemeProvider>
  );
};

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: "fullscreen",
};

export const decorators = [globalDecorator];
