import { Currency } from '@pancakeswap/sdk'
import { AutoColumn, RowBetween, RowFixed, Text } from '@pancakeswap/uikit'
import { Position } from '@pancakeswap/v3-sdk'
import { LightCard } from 'components/Card'
import { DoubleCurrencyLogo } from 'components/Logo'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { formatTickPrice } from 'hooks/v3/utils/formatTickPrice'
import JSBI from 'jsbi'
import { ReactNode, useState } from 'react'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { Bound } from '../form/actions'

export const PositionPreview = ({
  position,
  title,
  inRange,
  baseCurrencyDefault,
  ticksAtLimit,
}: {
  position: Position
  title?: ReactNode
  inRange: boolean
  baseCurrencyDefault?: Currency | undefined
  ticksAtLimit: { [bound: string]: boolean | undefined }
}) => {
  const currency0 = unwrappedToken(position.pool.token0)
  const currency1 = unwrappedToken(position.pool.token1)

  // track which currency should be base
  const [
    baseCurrency,
    // setBaseCurrency
  ] = useState(
    baseCurrencyDefault
      ? baseCurrencyDefault === currency0
        ? currency0
        : baseCurrencyDefault === currency1
        ? currency1
        : currency0
      : currency0,
  )

  const sorted = baseCurrency === currency0
  const quoteCurrency = sorted ? currency1 : currency0

  const price = sorted ? position.pool.priceOf(position.pool.token0) : position.pool.priceOf(position.pool.token1)

  const priceLower = sorted ? position.token0PriceLower : position.token0PriceUpper.invert()
  const priceUpper = sorted ? position.token0PriceUpper : position.token0PriceLower.invert()

  // const handleRateChange = useCallback(() => {
  //   setBaseCurrency(quoteCurrency)
  // }, [quoteCurrency])

  const removed = position?.liquidity && JSBI.equal(position?.liquidity, JSBI.BigInt(0))

  return (
    <AutoColumn gap="md" style={{ marginTop: '0.5rem' }}>
      <RowBetween style={{ marginBottom: '0.5rem' }}>
        <RowFixed>
          <DoubleCurrencyLogo currency0={currency0 ?? undefined} currency1={currency1 ?? undefined} size={24} />
          <Text ml="10px" fontSize="24px">
            {currency0?.symbol} / {currency1?.symbol}
          </Text>
        </RowFixed>
        {removed ? 'Removed' : inRange ? 'In Range' : 'Out of Range'}
      </RowBetween>

      <LightCard>
        <AutoColumn gap="md">
          <RowBetween>
            <RowFixed>
              <CurrencyLogo currency={currency0} />
              <Text ml="8px">{currency0?.symbol}</Text>
            </RowFixed>
            <RowFixed>
              <Text mr="8px">{position.amount0.toSignificant(4)}</Text>
            </RowFixed>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <CurrencyLogo currency={currency1} />
              <Text ml="8px">{currency1?.symbol}</Text>
            </RowFixed>
            <RowFixed>
              <Text mr="8px">{position.amount1.toSignificant(4)}</Text>
            </RowFixed>
          </RowBetween>
          <RowBetween>
            <Text>Fee Tier</Text>
            <Text>{position?.pool?.fee / 10000}%</Text>
          </RowBetween>
        </AutoColumn>
      </LightCard>

      <AutoColumn gap="md">
        <RowBetween>{title ? <Text>{title}</Text> : <div />}</RowBetween>

        <RowBetween>
          <LightCard width="48%" padding="8px">
            <AutoColumn gap="4px" justify="center">
              <Text fontSize="12px">Min Price</Text>
              <Text textAlign="center">{`${formatTickPrice(priceLower, ticksAtLimit, Bound.LOWER)}`}</Text>
              <Text textAlign="center" fontSize="12px">
                {quoteCurrency.symbol} per {baseCurrency.symbol}
              </Text>
              <Text textAlign="center">
                Your position will be 100% composed of {baseCurrency?.symbol} at this price
              </Text>
            </AutoColumn>
          </LightCard>

          <LightCard width="48%" padding="8px">
            <AutoColumn gap="4px" justify="center">
              <Text fontSize="12px">Max Price</Text>
              <Text textAlign="center">{`${formatTickPrice(priceUpper, ticksAtLimit, Bound.UPPER)}`}</Text>
              <Text textAlign="center" fontSize="12px">
                {quoteCurrency.symbol} per {baseCurrency.symbol}
              </Text>
              <Text textAlign="center">
                Your position will be 100% composed of {quoteCurrency?.symbol} at this price
              </Text>
            </AutoColumn>
          </LightCard>
        </RowBetween>
        <LightCard padding="12px ">
          <AutoColumn gap="4px" justify="center">
            <Text fontSize="12px">Current price</Text>
            <Text>{`${price.toSignificant(5)} `}</Text>
            <Text textAlign="center" fontSize="12px">
              {quoteCurrency.symbol} per {baseCurrency.symbol}
            </Text>
          </AutoColumn>
        </LightCard>
      </AutoColumn>
    </AutoColumn>
  )
}
