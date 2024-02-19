import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { AutoColumn, Heading, RowBetween, RowFixed, Text } from '@pancakeswap/uikit'
import { Position } from '@pancakeswap/v3-sdk'
import { LightGreyCard } from 'components/Card'
import Divider from 'components/Divider'
import FormattedCurrencyAmount from 'components/FormattedCurrencyAmount/FormattedCurrencyAmount'
import { DoubleCurrencyLogo } from 'components/Logo'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { RangePriceSection } from 'components/RangePriceSection'
import { Bound } from 'config/constants/types'
import { useStablecoinPrice } from 'hooks/useStablecoinPrice'
import { formatTickPrice } from 'hooks/v3/utils/formatTickPrice'
import { ReactNode, useCallback, useState } from 'react'
import { formatPrice } from 'utils/formatCurrencyAmount'
import { unwrappedToken } from 'utils/wrappedCurrency'

import { RangeTag } from 'components/RangeTag'
import RateToggle from './RateToggle'

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
  baseCurrencyDefault?: Currency | undefined | null
  ticksAtLimit: { [bound: string]: boolean | undefined }
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const currency0 = unwrappedToken(position.pool.token0)
  const currency1 = unwrappedToken(position.pool.token1)

  // track which currency should be base
  const [baseCurrency, setBaseCurrency] = useState(
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

  const price0 = useStablecoinPrice(position.pool.token0 ?? undefined, { enabled: !!position.amount0 })
  const price1 = useStablecoinPrice(position.pool.token1 ?? undefined, { enabled: !!position.amount1 })

  const handleRateChange = useCallback(() => {
    setBaseCurrency(quoteCurrency)
  }, [quoteCurrency])

  const removed = typeof position?.liquidity === 'bigint' && position?.liquidity === 0n

  return (
    <AutoColumn gap="md" style={{ marginTop: '0.5rem' }}>
      <RowBetween style={{ marginBottom: '0.5rem' }}>
        <RowFixed>
          <DoubleCurrencyLogo currency0={currency0 ?? undefined} currency1={currency1 ?? undefined} size={24} />
          <Heading as="h2" ml="4px">
            {currency0?.symbol}-{currency1?.symbol}
          </Heading>
        </RowFixed>
        <RangeTag removed={removed} outOfRange={!inRange} />
      </RowBetween>

      <LightGreyCard>
        <AutoColumn gap="sm">
          <RowBetween>
            <RowFixed>
              <CurrencyLogo currency={currency0} />
              <Text ml="4px">{currency0?.symbol}</Text>
            </RowFixed>
            <RowFixed>
              <Text mr="8px">
                <FormattedCurrencyAmount currencyAmount={position.amount0} />
              </Text>
            </RowFixed>
            <RowBetween justifyContent="flex-end">
              <Text fontSize="10px" color="textSubtle" ml="4px" mr="8px">
                {position.amount0 && price0
                  ? `~$${price0.quote(position.amount0?.wrapped).toFixed(2, { groupSeparator: ',' })}`
                  : ''}
              </Text>
            </RowBetween>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <CurrencyLogo currency={currency1} />
              <Text ml="4px">{currency1?.symbol}</Text>
            </RowFixed>
            <RowFixed>
              <Text mr="8px">
                <FormattedCurrencyAmount currencyAmount={position.amount1} />
              </Text>
            </RowFixed>
            <RowBetween justifyContent="flex-end">
              <Text fontSize="10px" color="textSubtle" ml="4px" mr="8px">
                {position.amount1 && price1
                  ? `~$${price1.quote(position.amount1?.wrapped).toFixed(2, { groupSeparator: ',' })}`
                  : ''}
              </Text>
            </RowBetween>
          </RowBetween>
          <Divider />
          <RowBetween>
            <Text color="textSubtle">{t('Fee Tier')}</Text>
            <Text>{position?.pool?.fee / 10000}%</Text>
          </RowBetween>
        </AutoColumn>
      </LightGreyCard>

      <AutoColumn gap="md">
        <RowBetween>
          {title ? (
            <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
              {title}
            </Text>
          ) : (
            <div />
          )}
          <RateToggle currencyA={sorted ? currency0 : currency1} handleRateToggle={handleRateChange} />
        </RowBetween>

        <RowBetween>
          <RangePriceSection
            width="48%"
            title={t('Min Price')}
            currency0={quoteCurrency}
            currency1={baseCurrency}
            price={formatTickPrice(priceLower, ticksAtLimit, Bound.LOWER, locale)}
          />
          <RangePriceSection
            width="48%"
            title={t('Max Price')}
            currency0={quoteCurrency}
            currency1={baseCurrency}
            price={formatTickPrice(priceUpper, ticksAtLimit, Bound.UPPER, locale)}
          />
        </RowBetween>
        <RangePriceSection
          title={t('Current Price')}
          currency0={quoteCurrency}
          currency1={baseCurrency}
          price={formatPrice(price, 6, locale)}
        />
      </AutoColumn>
    </AutoColumn>
  )
}
