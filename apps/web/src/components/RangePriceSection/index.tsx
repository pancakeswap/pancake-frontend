import { Currency } from '@pancakeswap/sdk'
import { Text, Heading } from '@pancakeswap/uikit'
import { LightGreyCard, LightCardProps } from 'components/Card'

interface RangePriceSectionProps extends LightCardProps {
  title: string
  currency0: Currency
  currency1: Currency
  price: string
}

export const RangePriceSection = ({ title, currency0, currency1, price, ...props }: RangePriceSectionProps) => {
  return (
    <LightGreyCard
      {...props}
      style={{
        paddingTop: '8px',
        paddingBottom: '8px',
        textAlign: 'center',
      }}
    >
      <Text fontSize="12px" color="secondary" bold textTransform="uppercase" mb="4px">
        {title}
      </Text>
      <Heading mb="4px">{price}</Heading>
      <Text fontSize="12px" color="textSubtle">
        {currency0?.symbol} per {currency1?.symbol}
      </Text>
    </LightGreyCard>
  )
}
