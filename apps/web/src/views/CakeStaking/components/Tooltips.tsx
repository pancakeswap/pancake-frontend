import { TooltipOptions, useMatchBreakpoints, useTooltip } from '@pancakeswap/uikit'

type TooltipsProps = {
  content: React.ReactNode
  options?: TooltipOptions
}

export const Tooltips: React.FC<React.PropsWithChildren<TooltipsProps>> = ({ children, content, options = {} }) => {
  const { isMobile } = useMatchBreakpoints()

  const { targetRef, tooltipVisible, tooltip } = useTooltip(content, {
    placement: 'auto',
    ...(isMobile && { hideTimeout: 2000 }),
    ...options,
  })

  return (
    <>
      <div ref={targetRef}>{children}</div>
      {tooltipVisible && tooltip}
    </>
  )
}
