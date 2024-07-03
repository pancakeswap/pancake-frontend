import { Text, TextProps } from '@pancakeswap/uikit'
import { formatBigIntToFixed } from '@pancakeswap/utils/formatBalance'
import { useMemo } from 'react'
import CountUp from 'react-countup'
import { Address } from 'viem'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import usePollOraclePrice from 'views/Predictions/hooks/usePollOraclePrice'
import { usePredictionPrice } from 'views/Predictions/hooks/usePredictionPrice'

interface PriceProps extends TextProps {
  displayedDecimals?: number
  chainlinkOracleAddress?: Address
  galetoOracleAddress?: Address
}

export const Price: React.FC<React.PropsWithChildren<PriceProps>> = ({
  displayedDecimals,
  chainlinkOracleAddress,
  galetoOracleAddress,
  ...props
}) => {
  const config = useConfig()

  const { price } = usePollOraclePrice({
    chainlinkOracleAddress,
    galetoOracleAddress,
  })

  const {
    data: { price: aiLivePrice },
  } = usePredictionPrice({
    currencyA: config?.token.symbol,
    enabled: Boolean(config?.ai),
  })

  const priceAsNumber = useMemo(
    () => (config?.ai ? aiLivePrice : parseFloat(formatBigIntToFixed(price, 4, 8))),
    [price, aiLivePrice, config?.ai],
  )

  if (!Number.isFinite(priceAsNumber)) {
    return null
  }

  return (
    <CountUp start={0} preserveValue delay={0} end={priceAsNumber} prefix="$" decimals={displayedDecimals} duration={1}>
      {({ countUpRef }) => (
        <Text lineHeight="110%" style={{ alignSelf: 'center' }} bold fontSize="16px" {...props}>
          <span ref={countUpRef} />
        </Text>
      )}
    </CountUp>
  )
}
