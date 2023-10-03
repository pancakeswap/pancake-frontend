import { memo, useMemo, useState, useCallback } from 'react'
import { ModalV2, RowBetween, Text, Flex, Button, CurrencyLogo, Box, useToast } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { BaseAssets } from '@pancakeswap/position-managers'
import type { AtomBoxProps } from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { SpaceProps } from 'styled-system'
import useCatchTxError from 'hooks/useCatchTxError'
import { usePositionManagerWrapperContract } from 'hooks/useContract'
import { ToastDescriptionWithTx } from 'components/Toast'

import { StyledModal } from './StyledModal'
import { FeeTag } from './Tags'
import { InnerCard } from './InnerCard'
import { PercentSlider } from './PercentSlider'

interface Props {
  isOpen?: boolean
  onDismiss?: () => void
  vaultName: string
  feeTier: FeeAmount
  currencyA: Currency
  currencyB: Currency
  staked0Amount?: CurrencyAmount<Currency>
  staked1Amount?: CurrencyAmount<Currency>
  token0PriceUSD?: number
  token1PriceUSD?: number
  contractAddress: `0x${string}`
  refetch?: () => void
  // TODO: return data
  onRemove?: (params: {
    amountA: CurrencyAmount<Currency>
    amountB: CurrencyAmount<Currency>
    liquidity: bigint
  }) => Promise<void>
}

export const RemoveLiquidity = memo(function RemoveLiquidity({
  isOpen,
  // assets,
  vaultName,
  onDismiss,
  currencyA,
  currencyB,
  staked0Amount,
  staked1Amount,
  token0PriceUSD,
  token1PriceUSD,
  feeTier,
  contractAddress,
  refetch,
}: // onRemove,
Props) {
  const { t } = useTranslation()
  const [percent, setPercent] = useState(0)
  const tokenPairName = useMemo(() => `${currencyA.symbol}-${currencyB.symbol}`, [currencyA, currencyB])
  const wrapperContract = usePositionManagerWrapperContract(contractAddress)
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { toastSuccess } = useToast()

  const amountA = useMemo(() => staked0Amount?.multiply(percent)?.divide(100), [staked0Amount, percent])
  const amountB = useMemo(() => staked1Amount?.multiply(percent)?.divide(100), [staked1Amount, percent])

  const withdrawThenBurn = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() =>
      wrapperContract.write.withdrawThenBurn([amountA?.quotient + amountB.quotient, '0x'], {}),
    )

    if (receipt?.status) {
      refetch?.()
      onDismiss?.()
      toastSuccess(
        `${t('Removed')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'CAKE' })}
        </ToastDescriptionWithTx>,
      )
    }
  }, [amountA, wrapperContract, t, toastSuccess, fetchWithCatchTxError, refetch, onDismiss, amountB])

  return (
    <ModalV2 onDismiss={onDismiss} isOpen={isOpen}>
      <StyledModal title={t('Remove Liquidity')}>
        <RowBetween>
          <Text color="textSubtle">{t('Removing')}:</Text>
          <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
            <Text color="text" bold>
              {tokenPairName}
            </Text>
            <Text color="text" ml="0.25em">
              {vaultName}
            </Text>
            <FeeTag feeAmount={feeTier} ml="0.25em" />
          </Flex>
        </RowBetween>
        <InnerCard>
          <CurrencyAmountDisplay currency={currencyA} amount={amountA} priceUSD={token0PriceUSD} />
          <CurrencyAmountDisplay currency={currencyB} mt="8px" amount={amountB} priceUSD={token1PriceUSD} />
        </InnerCard>
        <PercentSlider percent={percent} onChange={setPercent} mt="1em" />
        <RemoveLiquidityButton mt="1.5em" onClick={withdrawThenBurn} isLoading={pendingTx} disabled={percent <= 0} />
      </StyledModal>
    </ModalV2>
  )
})

interface CurrencyAmountDisplayProps extends AtomBoxProps {
  amount?: CurrencyAmount<Currency>
  currency: Currency
  priceUSD?: number
}

const CurrencyAmountDisplay = memo(function CurrencyAmountDisplay({
  amount,
  currency,
  priceUSD,
  ...rest
}: CurrencyAmountDisplayProps) {
  const currencyDisplay = amount?.currency || currency
  const amountDisplay = useMemo(() => formatAmount(amount) || '0', [amount])
  const amountInUsd = useMemo(() => {
    return Number(formatAmount(amount)) * (priceUSD ?? 0)
  }, [amount, priceUSD])

  return (
    <RowBetween {...rest}>
      <Flex flexDirection="row" justifyContent="flex-start">
        <CurrencyLogo currency={currencyDisplay} />
        <Text color="textSubtle" ml="0.5em" fontSize="0.875em">
          {currencyDisplay.symbol}
        </Text>
      </Flex>
      <Flex flexDirection="row" alignItems="flex-end">
        <Text color="text" bold fontSize="0.875em">
          {amountDisplay}
        </Text>
        <Text color="text" fontSize="0.875em" ml="0.5em">
          (~${amountInUsd.toFixed(2)})
        </Text>
      </Flex>
    </RowBetween>
  )
})

interface RemoveLiquidityButtonProps extends SpaceProps {
  onClick?: () => void
  isLoading?: boolean
  disabled?: boolean
}

export const RemoveLiquidityButton = memo(function RemoveLiquidityButton({
  onClick,
  isLoading,
  disabled,
  ...rest
}: RemoveLiquidityButtonProps) {
  const { t } = useTranslation()
  return (
    <Box {...rest}>
      <Button isLoading={isLoading} mt="0.5em" variant="primary" width="100%" onClick={onClick} disabled={disabled}>
        {t('Confirm')}
      </Button>
    </Box>
  )
})
