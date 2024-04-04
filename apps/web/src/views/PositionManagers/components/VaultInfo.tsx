import { useTranslation } from '@pancakeswap/localization'
import { BaseAssets } from '@pancakeswap/position-managers'
import { Currency, Percent, Price } from '@pancakeswap/sdk'
import { Box, RowBetween, Text } from '@pancakeswap/uikit'
import { memo, useMemo } from 'react'
import { styled } from 'styled-components'
import { SpaceProps } from 'styled-system'
import { useTotalStakedInUsd } from 'views/PositionManagers/hooks/useTotalStakedInUsd'
import { RewardPerDay } from './RewardPerDay'

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

  managerFee?: Percent
  poolToken0Amount?: bigint
  poolToken1Amount?: bigint
  token0PriceUSD?: number
  token1PriceUSD?: number
  earningToken: Currency
  isInCakeRewardDateRange: boolean
  tokenPerSecond?: number
  isTableView?: boolean
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
  tokenPerSecond = 0,
  earningToken,
  managerFee,
  isInCakeRewardDateRange,
  isTableView,
  ...props
}: VaultInfoProps) {
  const { t } = useTranslation()

  const totalStakedInUsd = useTotalStakedInUsd({
    currencyA,
    currencyB,
    poolToken0Amount,
    poolToken1Amount,
    token0PriceUSD,
    token1PriceUSD,
  })

  const earning = useMemo(
    () => (isInCakeRewardDateRange ? `${earningToken?.symbol ?? ''} + ${t('Fees')}` : t('Fees')),
    [t, isInCakeRewardDateRange, earningToken?.symbol],
  )

  return (
    <Box {...props}>
      {isSingleDepositToken && (
        <RowBetween>
          <InfoText>{t('Depositing Token')}:</InfoText>
          {allowDepositToken0 && <InfoText bold>{currencyA.symbol}</InfoText>}
          {allowDepositToken1 && <InfoText bold>{currencyB.symbol}</InfoText>}
        </RowBetween>
      )}
      {isTableView && (
        <RowBetween>
          <InfoText>{t('Earn')}:</InfoText>
          <InfoText>{earning}</InfoText>
        </RowBetween>
      )}
      {isInCakeRewardDateRange && isTableView && (
        <RowBetween style={{ padding: '2px 0px' }}>
          <InfoText>{t('Reward Per Day')}:</InfoText>
          <InfoText>
            <RewardPerDay scale="sm" rewardPerSec={tokenPerSecond} />
          </InfoText>
        </RowBetween>
      )}
      <RowBetween>
        <InfoText>{t('Total staked')}:</InfoText>
        <InfoText>{`$${totalStakedInUsd.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}</InfoText>
      </RowBetween>
      {isInCakeRewardDateRange && (
        <RowBetween>
          <InfoText>{t('Farming Rewards')}:</InfoText>
          <InfoText>{`~${tokenPerSecond.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
          })} ${earningToken.symbol} / ${t('second')}`}</InfoText>
        </RowBetween>
      )}
      <RowBetween>
        <InfoText>{t('Manager Fee')}:</InfoText>
        <InfoText>{`${managerFee?.numerator}`}%</InfoText>
      </RowBetween>
    </Box>
  )
})
