import { ErrorIcon, useTooltip, Box } from '@pancakeswap/uikit'
import STGWarning from './STGWarning'

export function STGWarningTooltip() {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<STGWarning />, {
    placement: 'top-end',
    tooltipOffset: [20, 10],
  })

  return (
    <>
      <Box ref={targetRef} ml="8px">
        <ErrorIcon width={24} height={24} color="warning" />
      </Box>
      {tooltipVisible && tooltip}
    </>
  )
}
