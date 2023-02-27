import { useState, memo, ReactNode, useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { useDelayedUnmount } from "@pancakeswap/hooks";
import { ExpandActionCell } from "../Cells/ExpandActionCell";
import useMatchBreakpoints from "../../../contexts/MatchBreakpoints/useMatchBreakpoints";

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  cursor: pointer;
`;

export const ExpandRow: React.FC<
  React.PropsWithChildren<{ children: ReactNode; panel: ReactNode; initialActivity?: boolean }>
> = memo(({ children, panel, initialActivity = false }) => {
  const hasSetInitialValue = useRef(false);
  const { isTablet, isDesktop } = useMatchBreakpoints();

  const [expanded, setExpanded] = useState(initialActivity);
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300);

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);
  useEffect(() => {
    if (initialActivity && hasSetInitialValue.current === false) {
      setExpanded(initialActivity);
      hasSetInitialValue.current = true;
    }
  }, [initialActivity]);

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        {children}
        <ExpandActionCell expanded={expanded} isFullLayout={isTablet || isDesktop} />
      </StyledRow>
      {shouldRenderActionPanel && panel}
    </>
  );
});
