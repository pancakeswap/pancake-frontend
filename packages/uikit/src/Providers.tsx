import { ThemeProvider, DefaultTheme } from "styled-components";
import "@pancakeswap/ui/index.css";
import { MatchBreakpointsProvider } from "./contexts/MatchBreakpoints/Provider";
import { ToastsProvider } from "./contexts/ToastsContext/Provider";

export const UIKitProvider: React.FC<React.PropsWithChildren<{ theme: DefaultTheme; children: React.ReactNode }>> = ({
  theme,
  children,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <MatchBreakpointsProvider>
        <ToastsProvider>{children}</ToastsProvider>
      </MatchBreakpointsProvider>
    </ThemeProvider>
  );
};
