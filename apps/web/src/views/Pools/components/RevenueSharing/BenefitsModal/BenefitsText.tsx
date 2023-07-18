import { ReactElement } from 'react'
import { Flex, Text, TooltipText, useTooltip, useMatchBreakpoints } from '@pancakeswap/uikit'

interface BenefitsTextProps {
  title: string
  value: string
  icon: ReactElement
  tooltipComponent?: ReactElement
}

const BenefitsText: React.FC<React.PropsWithChildren<BenefitsTextProps>> = ({
  title,
  value,
  icon,
  tooltipComponent,
}) => {
  const { isMobile } = useMatchBreakpoints()

  const { targetRef, tooltipVisible, tooltip } = useTooltip(<>{tooltipComponent}</>, {
    placement: 'bottom',
    ...(isMobile && { hideTimeout: 2000 }),
  })

  return (
    <Flex mt="8px" flexDirection="row" alignItems="center">
      <Flex mr="auto" ref={targetRef}>
        {icon}
        <TooltipText color="textSubtle" fontSize="14px" ml="8px">
          {title}
        </TooltipText>
      </Flex>
      {tooltipVisible && tooltip}
      <Text bold>{value}</Text>
    </Flex>
  )
}

export default BenefitsText
