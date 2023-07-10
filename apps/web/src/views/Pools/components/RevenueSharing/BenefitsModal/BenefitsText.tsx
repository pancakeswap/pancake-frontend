import { ReactElement } from 'react'
import { Flex, Text, TooltipText } from '@pancakeswap/uikit'

interface BenefitsTextProps {
  title: string
  value: string
  icon: ReactElement
  tooltipText?: string
}

const BenefitsText: React.FC<React.PropsWithChildren<BenefitsTextProps>> = ({ title, value, icon }) => {
  return (
    <Flex mt="8px" flexDirection="row" alignItems="center">
      <Flex mr="auto">
        {icon}
        <TooltipText color="textSubtle" fontSize="14px" ml="8px">
          {title}
        </TooltipText>
      </Flex>
      <Text bold>{value}</Text>
    </Flex>
  )
}

export default BenefitsText
