import { Balance, Flex, TooltipText, WarningIcon } from '@pancakeswap/uikit'

export const EarnedUsdPrice = () => {
  return (
    <TooltipText>
      <Flex>
        {/* <WarningIcon color="failure" width="20px" /> */}
        <Balance prefix="~" value={4.2} decimals={2} unit=" USD" />
        <WarningIcon color="failure" width="20px" />
      </Flex>
    </TooltipText>
  )
}
