import { Box, Placement, WarningIcon, useTooltip } from '@pancakeswap/uikit'
import USDPlusWarning from 'views/Swap/components/SwapWarningModal/zksync/USDPlusWarning'

type TooltipProps = {
  size?: string
  placement?: Placement
  tooltipOffset?: [number, number]
}

export function USDPlusWarningTooltip({
  size = '20px',
  placement = 'top-start',
  tooltipOffset = [-20, 10],
}: TooltipProps) {
  const { tooltip, tooltipVisible, targetRef } = useTooltip(<USDPlusWarning />, {
    placement,
    tooltipOffset,
  })

  return (
    <>
      <Box ref={targetRef} width={size} height={size}>
        <WarningIcon color="warning" width={size} height={size} />
      </Box>
      {tooltipVisible ? tooltip : null}
    </>
  )
}
