import React, { createContext } from "react";
import { BreakpointChecks } from "../../hooks/useMatchBreakpoints";
import { useMatchBreakpoints } from "../../hooks";

export const MatchBreakpointsContext = createContext<BreakpointChecks>({
  isMobile: false,
  isTablet: false,
  isDesktop: false,
});

export const MatchBreakpointsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const state = useMatchBreakpoints();

  return <MatchBreakpointsContext.Provider value={state}>{children}</MatchBreakpointsContext.Provider>;
};
