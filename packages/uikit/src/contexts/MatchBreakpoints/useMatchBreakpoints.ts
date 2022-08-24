import { useContext } from "react";
import { MatchBreakpointsContext } from "./Provider";

const useMatchBreakpoints = () => {
  const matchBreakpointContext = useContext(MatchBreakpointsContext);

  if (matchBreakpointContext === undefined) {
    throw new Error("Match Breakpoint context is undefined");
  }

  return matchBreakpointContext;
};

export default useMatchBreakpoints;
