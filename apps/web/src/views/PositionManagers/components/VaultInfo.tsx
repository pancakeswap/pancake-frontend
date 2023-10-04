import { useTranslation } from '@pancakeswap/localization'
import { BaseAssets, ManagerFee } from '@pancakeswap/position-managers'
import { Currency, CurrencyAmount, Price } from '@pancakeswap/sdk'
import { Box, RowBetween, Text } from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { memo, useMemo } from 'react'
import styled from 'styled-components'
import { SpaceProps } from 'styled-system'

const InfoText = styled(Text).attrs({
  fontSize: '0.875em',
})``

export interface VaultInfoProps extends SpaceProps {
  currencyA: Currency
  currencyB: Currency
  isSingleDepositToken: boolean
  allowDepositToken0: boolean
  allowDepositToken1: boolean

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
  poolToken0Amount,
  poolToken1Amount,
  token0PriceUSD,
  token1PriceUSD,
  isSingleDepositToken,
  allowDepositToken0,
  allowDepositToken1,
  ...props
}: VaultInfoProps) {
  const { t } = useTranslation()

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
      {isSingleDepositToken && (
        <RowBetween>
          <InfoText>{t('Depositing Token')}:</InfoText>
          {allowDepositToken0 && <InfoText bold>{currencyA.symbol}</InfoText>}
          {allowDepositToken1 && <InfoText bold>{currencyB.symbol}</InfoText>}
        </RowBetween>
      )}
      <RowBetween>
        <InfoText>{t('Total staked')}:</InfoText>
        <InfoText>{`$${totalStakedInUsd.toFixed(2)}`}</InfoText>
      </RowBetween>
    </Box>
  )
})
