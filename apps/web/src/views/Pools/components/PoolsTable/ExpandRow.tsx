import { useState, memo, ReactNode, useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints, Pool } from '@pancakeswap/uikit'
import { useDelayedUnmount } from '@pancakeswap/hooks'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  cursor: pointer;
`

const ExpandRow: React.FC<
  React.PropsWithChildren<{ children: ReactNode; panel: ReactNode; initialActivity?: boolean }>
> = ({ children, panel, initialActivity }) => {
  const hasSetInitialValue = useRef(false)
  const { isTablet, isDesktop } = useMatchBreakpoints()

  const [expanded, setExpanded] = useState(initialActivity)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])
  useEffect(() => {
    if (initialActivity && hasSetInitialValue.current === false) {
      setExpanded(initialActivity)
      hasSetInitialValue.current = true
    }
  }, [initialActivity])

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        {children}
        <Pool.ExpandActionCell expanded={expanded} isFullLayout={isTablet || isDesktop} />
      </StyledRow>
      {shouldRenderActionPanel && panel}
    </>
  )
}

export default memo(ExpandRow)
