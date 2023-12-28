import { TooltipOptions, useMatchBreakpoints, useTooltip } from '@pancakeswap/uikit'

type TooltipsProps = {
  content: React.ReactNode
  options?: TooltipOptions
  disabled?: boolean
}

export const Tooltips: React.FC<React.PropsWithChildren<TooltipsProps>> = ({
  children,
  content,
  disabled,
  options = {},
}) => {
  const { isMobile } = useMatchBreakpoints()

  const { targetRef, tooltipVisible, tooltip } = useTooltip(content, {
    placement: 'auto',
    ...(isMobile && { hideTimeout: 2000 }),
    ...options,
  })

  if (disabled) return children

  return (
    <>
      <div ref={targetRef}>{children}</div>
      {tooltipVisible && tooltip}
    </>
  )
}

export const DebugTooltips: React.FC<React.PropsWithChildren<TooltipsProps>> = ({ ...props }) => {
  return (
    <Tooltips
      {...props}
      disabled={!(process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview')}
    />
  )
}
