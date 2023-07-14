import styled from 'styled-components'
import { SpaceProps } from 'styled-system'
import { memo, useMemo } from 'react'
import { Box, Flex, RowBetween, Text, SwapVertIcon, IconButton } from '@pancakeswap/uikit'
import { BaseAssets, ManagerFee } from '@pancakeswap/position-managers'
import { Currency, Price } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'
import { formatTimestamp, Precision } from '@pancakeswap/utils/formatTimestamp'
import { formatPercent, formatPrice } from '@pancakeswap/utils/formatFractions'

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
}

export const VaultInfo = memo(function VaultInfo({ currencyA, currencyB, managerFee, ...props }: VaultInfoProps) {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  // TODO: mock
  const totalStakedInUsd = 12345679
  const lastUpdatedAt = Date.now()
  const { baseCurrency, quoteCurrency, priceLower, priceUpper, priceCurrent, invert, inverted } = usePositionPrices({
    baseCurrency: currencyA,
    quoteCurrency: currencyB,
    tickLower: 44000,
    tickUpper: 45000,
    tickCurrent: 44500,
  })

  const lastUpdatedAtDisplay = useMemo(
    () => formatTimestamp(lastUpdatedAt, { locale, precision: Precision.DATE }),
    [lastUpdatedAt, locale],
  )
  const current = useMemo(() => formatPrice(priceCurrent), [priceCurrent])
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

  return (
    <Box {...props}>
      <RowBetween>
        <InfoText>{t('Total staked')}:</InfoText>
        <InfoText>${totalStakedInUsd}</InfoText>
      </RowBetween>
      <RowBetween mt="8px">
        <InfoText>{t('Last adjusted on')}:</InfoText>
        <InfoText>{lastUpdatedAtDisplay}</InfoText>
      </RowBetween>
      <RowBetween mt="8px" alignItems="flex-start">
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
      </RowBetween>
      <RowBetween mt="8px" alignItems="flex-start">
        <InfoText>{t('Current price')}:</InfoText>
        <Flex flexDirection="row" alignItems="center">
          <InfoText>
            {t('%price% %quote% per %base%', {
              price: current,
              quote: quoteCurrency.symbol,
              base: baseCurrency.symbol,
            })}
          </InfoText>
          {invertButton}
        </Flex>
      </RowBetween>
      {managerFeeDisplay}
    </Box>
  )
})
