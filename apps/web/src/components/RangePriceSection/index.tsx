import { Text, Heading } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'

export const RangePriceSection = ({ title, currency0, currency1, price, ...props }) => {
  return (
    <LightGreyCard
      {...props}
      style={{
        textAlign: 'center',
      }}
    >
      <Text fontSize="14px" color="secondary" bold textTransform="uppercase" mb="4px">
        {title}
      </Text>
      <Heading mb="4px">{price}</Heading>
      <Text fontSize="14px" color="textSubtle">
        {currency0?.symbol} per {currency1?.symbol}
      </Text>
    </LightGreyCard>
  )
}
