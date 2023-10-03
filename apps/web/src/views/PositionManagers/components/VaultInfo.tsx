import { useTranslation } from '@pancakeswap/localization'
import { BaseAssets, ManagerFee } from '@pancakeswap/position-managers'
import { Currency, CurrencyAmount, Price } from '@pancakeswap/sdk'
import { Box, IconButton, RowBetween, SwapVertIcon, Text } from '@pancakeswap/uikit'
import { formatAmount, formatPercent, formatPrice } from '@pancakeswap/utils/formatFractions'
import { Precision, formatTimestamp } from '@pancakeswap/utils/formatTimestamp'
import { memo, useMemo } from 'react'
import styled from 'styled-components'
import { SpaceProps } from 'styled-system'

import { usePositionPrices } from 'hooks/usePositionPrices'

import { getReadableManagerFeeType } from '../utils'

const SmallIconButton = styled(IconButton).attrs({
  variant: 'text',
  scale: 'sm',
})`
  width: 1em;
  padding: 0;
`

const InfoText = styled(Text).attrs({
  fontSize: '0.875em',
})``

const InvertIcon = styled(SwapVertIcon).attrs({
  color: 'primary',
  width: '1em',
  ml: '0.25em',
})<{ inverted?: boolean }>`
  transform: rotate(${(props) => (props.inverted ? '-90deg' : '90deg')});
`

export interface VaultInfoProps extends SpaceProps {
  currencyA: Currency
  currencyB: Currency

  // Total assets of the vault
  vaultAssets?: BaseAssets

  // timestamp of the last time position is updated
  lastUpdatedAt?: number

  // price of the current pool
  price?: Price<Currency, Currency>

  managerFee?: ManagerFee
  poolToken0Amount?: bigint
  poolToken1Amount?: bigint
  token0PriceUSD?: number
  token1PriceUSD?: number
}

export const VaultInfo = memo(function VaultInfo({
  currencyA,
  currencyB,
  managerFee,
  poolToken0Amount,
  poolToken1Amount,
  token0PriceUSD,
  token1PriceUSD,
  ...props
}: VaultInfoProps) {
  const {
    t,
    // currentLanguage: { locale },
  } = useTranslation()

  // TODO: mock
  // const lastUpdatedAt = Date.now()
  const { priceLower, priceUpper, invert, inverted } = usePositionPrices({
    baseCurrency: currencyA,
    quoteCurrency: currencyB,
    tickLower: 44000,
    tickUpper: 45000,
    tickCurrent: 44500,
  })

  // const lastUpdatedAtDisplay = useMemo(
  //   () => formatTimestamp(lastUpdatedAt, { locale, precision: Precision.DATE }),
  //   [lastUpdatedAt, locale],
  // )

  const min = useMemo(() => formatPrice(priceLower), [priceLower])
  const max = useMemo(() => formatPrice(priceUpper), [priceUpper])

  const feeRate = useMemo(() => formatPercent(managerFee?.rate), [managerFee?.rate])
  const feeType = useMemo(
    () => managerFee?.type !== undefined && getReadableManagerFeeType(t, managerFee.type),
    [t, managerFee?.type],
  )

  const managerFeeDisplay = managerFee ? (
    <>
      <RowBetween mt="8px" alignItems="flex-start">
        <InfoText>{t('Manager Fee')}:</InfoText>
        <InfoText>{feeRate}%</InfoText>
      </RowBetween>
      <RowBetween mt="8px" alignItems="flex-start">
        <InfoText>{t('Manager Fee Type')}:</InfoText>
        <InfoText>{feeType}</InfoText>
      </RowBetween>
    </>
  ) : null

  const invertButton = (
    <SmallIconButton onClick={invert}>
      <InvertIcon inverted={inverted} />
    </SmallIconButton>
  )

  const pool0Amount = poolToken0Amount ? CurrencyAmount.fromRawAmount(currencyA, poolToken0Amount) : undefined
  const pool1Amount = poolToken1Amount ? CurrencyAmount.fromRawAmount(currencyB, poolToken1Amount) : undefined

  const totalStakedInUsd = useMemo(() => {
    return (
      Number(formatAmount(pool0Amount)) * (token0PriceUSD ?? 0) +
      Number(formatAmount(pool1Amount)) * (token1PriceUSD ?? 0)
    )
  }, [pool0Amount, pool1Amount, token0PriceUSD, token1PriceUSD])

  return (
    <Box {...props}>
      <RowBetween>
        <InfoText>{t('Total staked')}:</InfoText>
        <InfoText>${totalStakedInUsd.toFixed(2)}</InfoText>
      </RowBetween>
      {/* <RowBetween mt="8px">
        <InfoText>{t('Last adjusted on')}:</InfoText>
        <InfoText>{lastUpdatedAtDisplay}</InfoText>
      </RowBetween> */}
      {/* <RowBetween mt="8px" alignItems="flex-start">
        <InfoText>{t('Price range')}:</InfoText>
        <Flex flexDirection="column" alignItems="flex-end">
          <InfoText>
            {t('Min %min% / Max %max%', {
              min,
              max,
            })}
          </InfoText>
          <Flex flexDirection="row" alignItems="center">
            <InfoText>
              {t('%quote% per %base%', {
                quote: quoteCurrency.symbol,
                base: baseCurrency.symbol,
              })}
            </InfoText>
            {invertButton}
          </Flex>
        </Flex>
      </RowBetween> */}
      {managerFeeDisplay}
    </Box>
  )
})
