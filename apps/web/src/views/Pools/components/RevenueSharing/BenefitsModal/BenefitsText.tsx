import { ReactElement } from 'react'
import { Flex, Text } from '@pancakeswap/uikit'
import BenefitsTooltipsText from 'views/Pools/components/RevenueSharing/BenefitsModal/BenefitsTooltipsText'

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
  return (
    <Flex mt="8px" flexDirection="row" alignItems="center">
      <Flex mr="auto">
        <BenefitsTooltipsText title={title} icon={icon} tooltipComponent={tooltipComponent} />
      </Flex>
      <Text bold>{value}</Text>
    </Flex>
  )
}

export default BenefitsText
