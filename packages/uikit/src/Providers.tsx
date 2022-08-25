import { MatchBreakpointsProvider } from "@pancakeswap/uikit";
import { ThemeProvider, DefaultTheme } from "styled-components";

export const UIKitProvider: React.FC<React.PropsWithChildren<{ theme: DefaultTheme; children: React.ReactNode }>> = ({
  theme,
  children,
}) => {
  return (
    <MatchBreakpointsProvider>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </MatchBreakpointsProvider>
  );
};
