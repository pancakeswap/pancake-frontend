import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import type { AtomBoxProps } from '@pancakeswap/uikit'
import { Box, Button, Flex, ModalV2, RowBetween, Text, useToast } from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { useWeb3React } from '@pancakeswap/wagmi'
import { ConfirmationPendingContent, CurrencyLogo } from '@pancakeswap/widgets-internal'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { usePositionManagerBCakeWrapperContract, usePositionManagerWrapperContract } from 'hooks/useContract'
import { memo, useCallback, useMemo, useState } from 'react'
import { SpaceProps } from 'styled-system'
import { Address, encodePacked } from 'viem'

import { InnerCard } from './InnerCard'
import { PercentSlider } from './PercentSlider'
import { StyledModal } from './StyledModal'
import { FeeTag } from './Tags'

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
  contractAddress: Address
  refetch?: () => void
  onRemove?: (params: {
    amountA: CurrencyAmount<Currency>
    amountB: CurrencyAmount<Currency>
    liquidity: bigint
  }) => Promise<void>
  bCakeWrapper?: Address
}

export const RemoveLiquidity = memo(function RemoveLiquidity({
  isOpen,
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
  bCakeWrapper,
}: Props) {
  const { t } = useTranslation()
  const { account, chain } = useWeb3React()
  const [percent, setPercent] = useState(0)
  const tokenPairName = useMemo(() => `${currencyA.symbol}-${currencyB.symbol}`, [currencyA, currencyB])
  const bCakeWrapperContract = usePositionManagerBCakeWrapperContract(bCakeWrapper ?? '0x')
  const wrapperContract = usePositionManagerWrapperContract(contractAddress)
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { toastSuccess } = useToast()

  const amountA = useMemo(() => staked0Amount?.multiply(percent)?.divide(100), [staked0Amount, percent])
  const amountB = useMemo(() => staked1Amount?.multiply(percent)?.divide(100), [staked1Amount, percent])

  const withdrawThenBurn = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(
      bCakeWrapper
        ? async () => {
            const bCakeUserInfoAmount = await bCakeWrapperContract.read.userInfo([account ?? '0x'], {})
            const message = encodePacked(['uint256', 'uint256'], [BigInt(0), BigInt(0)])
            const withdrawAmount = new BigNumber(bCakeUserInfoAmount?.[0]?.toString() ?? 0)
              .multipliedBy(percent)
              .div(100)
              .toNumber()
            const avoidDecimalsProblem =
              percent === 100 ? BigInt(bCakeUserInfoAmount?.[0]) : BigInt(Math.floor(withdrawAmount))
            const estGas = await bCakeWrapperContract.estimateGas.withdrawThenBurn(
              [avoidDecimalsProblem, false, message],
              {
                account: account ?? '0x',
              },
            )
            console.log({
              estGasOrigin: estGas.toString(),
              estGasAdjusted: new BigNumber(estGas.toString()).times(1.5).toNumber(),
              from: account,
              to: bCakeWrapperContract.address,
              amount: avoidDecimalsProblem,
              method: 'withdrawThenBurn',
            })
            return bCakeWrapperContract.write.withdrawThenBurn([avoidDecimalsProblem, false, message], {
              account: account ?? '0x',
              chain,
              gas: BigInt(new BigNumber(estGas.toString()).times(1.5).toNumber().toFixed(0)),
            })
          }
        : async () => {
            const userInfoAmount = await wrapperContract.read.userInfo([account ?? '0x'], {})
            const withdrawAmount = new BigNumber(userInfoAmount?.[0]?.toString() ?? 0)
              .multipliedBy(percent)
              .div(100)
              .toNumber()

            const avoidDecimalsProblem =
              percent === 100 ? BigInt(userInfoAmount?.[0]) : BigInt(Math.floor(withdrawAmount))
            return wrapperContract.write.withdrawThenBurn([avoidDecimalsProblem, '0x'], {
              account: account ?? '0x',
              chain,
            })
          },
    )

    if (receipt?.status) {
      refetch?.()
      onDismiss?.()
      toastSuccess(
        `${t('Unstaked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your funds have been unstaked in position manager.')}
        </ToastDescriptionWithTx>,
      )
    }
  }, [
    fetchWithCatchTxError,
    bCakeWrapper,
    bCakeWrapperContract.read,
    bCakeWrapperContract.estimateGas,
    bCakeWrapperContract.write,
    account,
    percent,
    chain,
    wrapperContract.read,
    wrapperContract.write,
    refetch,
    onDismiss,
    toastSuccess,
    t,
  ])

  return (
    <ModalV2 onDismiss={onDismiss} isOpen={isOpen}>
      <StyledModal title={pendingTx ? t('Pending Confirm') : t('Remove Liquidity')}>
        {pendingTx ? (
          <ConfirmationPendingContent pendingText={t('Removing Liquidity')} />
        ) : (
          <>
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
            <RemoveLiquidityButton
              mt="1.5em"
              onClick={withdrawThenBurn}
              isLoading={pendingTx}
              disabled={percent <= 0}
            />
            <Text mt="24px" lineHeight="1.2" fontSize="12px" textAlign="center" color="textSubtle">
              {t('Token amounts displayed above are estimations. The final amount of tokens received may vary.')}
            </Text>
          </>
        )}
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
  const amountInUsd = useMemo(() => new BigNumber(formatAmount(amount) ?? 0).times(priceUSD ?? 0), [amount, priceUSD])

  const amountDisplay = useMemo(() => formatAmount(amount) || '0', [amount])
  const amountInUsdDisplay = useMemo(() => {
    const usdValue = amountInUsd.isNaN() ? '0' : amountInUsd?.toFixed(2)
    return `(~$${usdValue})`
  }, [amountInUsd])

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
          {amountInUsdDisplay}
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
