import { useContext } from "react";
import { MatchBreakpointsContext } from "./Provider";
import { useMatchBreakpoints } from "../../hooks";

const useMatchBreakpointsContext = () => {
  const matchBreakpointContext = useContext(MatchBreakpointsContext);
  const contextAvailable = matchBreakpointContext !== undefined;
  const hookState = useMatchBreakpoints(contextAvailable);

  return contextAvailable ? matchBreakpointContext : hookState;
};

export default useMatchBreakpointsContext;
