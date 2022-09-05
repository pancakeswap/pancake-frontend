import React, { useEffect } from "react";
import { withThemesProvider } from "themeprovider-storybook";
import light from "../src/theme/light";
import dark from "../src/theme/dark";
import ResetCSS from "../src/ResetCSS";
import { ModalProvider } from "../src/widgets/Modal";
import { MatchBreakpointsProvider } from "../src";

import "@pancakeswap/ui/css/global.css";
import { useTheme } from "styled-components";

function useNextThemeMock() {
  const theme = useTheme();
  const isDark = theme?.isDark;
  // TODO: fix storybook theming
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [isDark]);
}

const globalDecorator = (StoryFn) => {
  useNextThemeMock();
  return (
    <MatchBreakpointsProvider>
      <ModalProvider>
        <ResetCSS />
        <StoryFn />
      </ModalProvider>
    </MatchBreakpointsProvider>
  );
};

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: "fullscreen",
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
