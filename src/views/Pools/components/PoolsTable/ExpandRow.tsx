import { useState, memo, ReactNode, useCallback } from 'react'
import styled from 'styled-components'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import { useMatchBreakpointsContext } from '@pancakeswap/uikit'

import ExpandActionCell from './Cells/ExpandActionCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  cursor: pointer;
`

const ExpandRow: React.FC<{ children: ReactNode; panel: ReactNode }> = ({ children, panel }) => {
  const { isTablet, isDesktop } = useMatchBreakpointsContext()

  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        {children}
        <ExpandActionCell expanded={expanded} isFullLayout={isTablet || isDesktop} />
      </StyledRow>
      {shouldRenderActionPanel && panel}
    </>
  )
}

export default memo(ExpandRow)
