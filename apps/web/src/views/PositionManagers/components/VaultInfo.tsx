import { useTranslation } from '@pancakeswap/localization'
import { BaseAssets, ManagerFee } from '@pancakeswap/position-managers'
import { Currency, Price } from '@pancakeswap/sdk'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { Box, RowBetween, Text } from '@pancakeswap/uikit'
import { memo, useMemo } from 'react'
import { styled } from 'styled-components'
import { SpaceProps } from 'styled-system'
import { useTotalStakedInUsd } from 'views/PositionManagers/hooks/useTotalStakedInUsd'
import BigNumber from 'bignumber.js'

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
  rewardPerSecond: string
  earningToken: Currency
  isInCakeRewardDateRange: boolean
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
  rewardPerSecond,
  earningToken,
  managerFee,
  isInCakeRewardDateRange,
  ...props
}: VaultInfoProps) {
  const { t } = useTranslation()

  const tokenPerSecond = useMemo(() => {
    return getBalanceAmount(new BigNumber(rewardPerSecond), earningToken.decimals).toNumber()
  }, [rewardPerSecond, earningToken])

  const totalStakedInUsd = useTotalStakedInUsd({
    currencyA,
    currencyB,
    poolToken0Amount,
    poolToken1Amount,
    token0PriceUSD,
    token1PriceUSD,
  })

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
      {isInCakeRewardDateRange && (
        <RowBetween>
          <InfoText>{t('Farming Rewards')}:</InfoText>
          <InfoText>{`~${tokenPerSecond} ${earningToken.symbol} / ${t('second')}`}</InfoText>
        </RowBetween>
      )}
      <RowBetween>
        <InfoText>{t('Manager Fee')}:</InfoText>
        <InfoText>{`${managerFee?.rate.numerator}`}%</InfoText>
      </RowBetween>
    </Box>
  )
})
