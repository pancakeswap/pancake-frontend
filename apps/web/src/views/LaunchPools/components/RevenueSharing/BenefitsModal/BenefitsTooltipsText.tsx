import { ReactElement } from 'react'
import { Flex, TooltipText, useTooltip, useMatchBreakpoints } from '@pancakeswap/uikit'

interface BenefitsTooltipsTextProps {
  title: string
  icon?: ReactElement
  tooltipComponent?: ReactElement
}

const BenefitsTooltipsText: React.FC<React.PropsWithChildren<BenefitsTooltipsTextProps>> = ({
  title,
  icon,
  tooltipComponent,
}) => {
  const { isMobile } = useMatchBreakpoints()

  const { targetRef, tooltipVisible, tooltip } = useTooltip(<>{tooltipComponent}</>, {
    placement: 'bottom',
    ...(isMobile && { hideTimeout: 2000 }),
  })

  return (
    <>
      <Flex ref={targetRef} mr="auto">
        {icon}
        <TooltipText color="textSubtle" fontSize="14px">
          {title}
        </TooltipText>
      </Flex>
      {tooltipVisible && tooltip}
    </>
  )
}

export default BenefitsTooltipsText
