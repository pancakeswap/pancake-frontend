import { useTranslation } from '@pancakeswap/localization'
import { MANAGER } from '@pancakeswap/position-managers'
import { Currency, CurrencyAmount, Percent } from '@pancakeswap/sdk'
import { Button, Flex, LinkExternal, ModalV2, RowBetween, Text } from '@pancakeswap/uikit'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { ConfirmationPendingContent } from '@pancakeswap/widgets-internal'
import BigNumber from 'bignumber.js'
import { CurrencyInput } from 'components/CurrencyInput'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { memo, useCallback, useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { Address } from 'viem'
import { useBCakeBoostLimitAndLockInfo } from 'views/Farms/components/YieldBooster/hooks/bCakeV3/useBCakeV3Info'
import { DYORWarning } from 'views/PositionManagers/components/DYORWarning'
import { SingleTokenWarning } from 'views/PositionManagers/components/SingleTokenWarning'
import { StyledModal } from 'views/PositionManagers/components/StyledModal'
import { FeeTag } from 'views/PositionManagers/components/Tags'
import { useApr } from 'views/PositionManagers/hooks/useApr'
import { AprDataInfo } from '../hooks'
import { AprButton } from './AprButton'

interface Props {
  id: string | number
  manager: {
    id: MANAGER
    name: string
  }
  isOpen?: boolean
  onDismiss?: () => void
  vaultName: string
  feeTier: FeeAmount
  currencyA: Currency
  currencyB: Currency
  ratio: number
  isSingleDepositToken: boolean
  allowDepositToken0: boolean
  allowDepositToken1: boolean
  onAmountChange?: (info: { value: string; currency: Currency; otherAmount: CurrencyAmount<Currency> }) => {
    otherAmount: CurrencyAmount<Currency>
  }
  refetch?: () => void
  contractAddress: Address
  userCurrencyBalances: {
    token0Balance: CurrencyAmount<Currency> | undefined
    token1Balance: CurrencyAmount<Currency> | undefined
  }
  userVaultPercentage?: Percent
  poolToken0Amount?: bigint
  poolToken1Amount?: bigint
  token0PriceUSD?: number
  token1PriceUSD?: number
  rewardPerSecond: string
  earningToken: Currency
  aprDataInfo: {
    info: AprDataInfo | undefined
    isLoading: boolean
  }
  rewardEndTime: number
  rewardStartTime: number
  onAdd?: (params: { amountA: CurrencyAmount<Currency>; amountB: CurrencyAmount<Currency> }) => Promise<void>
  totalAssetsInUsd: number
  totalStakedInUsd: number
  userLpAmounts?: bigint
  totalSupplyAmounts?: bigint
  precision?: bigint
  strategyInfoUrl?: string
  learnMoreAboutUrl?: string
  lpTokenDecimals?: number
  aprTimeWindow?: number
  bCakeWrapper?: Address
  minDepositUSD?: number
  boosterMultiplier?: number
  isBooster?: boolean
  onStake: (
    amountA: CurrencyAmount<Currency>,
    amountB: CurrencyAmount<Currency>,
    allowDepositToken0: boolean,
    allowDepositToken1: boolean,
    onDone?: () => void,
  ) => void
  isTxLoading: boolean
}

const StyledCurrencyInput = styled(CurrencyInput)`
  flex: 1;
`

export const AddLiquidity = memo(function AddLiquidity({
  id,
  manager,
  ratio,
  isOpen,
  vaultName,
  currencyA,
  currencyB,
  feeTier,
  isSingleDepositToken,
  allowDepositToken1,
  allowDepositToken0,
  contractAddress,
  userCurrencyBalances,
  poolToken0Amount,
  poolToken1Amount,
  token0PriceUSD,
  token1PriceUSD,
  rewardPerSecond,
  earningToken,
  aprDataInfo,
  rewardEndTime,
  rewardStartTime,
  refetch,
  onDismiss,
  totalAssetsInUsd,
  userLpAmounts,
  totalSupplyAmounts,
  precision,
  totalStakedInUsd,
  strategyInfoUrl,
  learnMoreAboutUrl,
  lpTokenDecimals,
  aprTimeWindow,
  bCakeWrapper,
  minDepositUSD,
  isBooster,
  boosterMultiplier,
  onStake,
  isTxLoading,
}: Props) {
  const [valueA, setValueA] = useState('')
  const [valueB, setValueB] = useState('')
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const tokenPairName = useMemo(() => `${currencyA.symbol}-${currencyB.symbol}`, [currencyA, currencyB])

  const onInputChange = useCallback(
    ({
      value,
      setValue,
      setOtherValue,
      isToken0,
    }: {
      value: string
      currency: Currency
      otherValue: string
      otherCurrency: Currency
      setValue: (value: string) => void
      setOtherValue: (value: string) => void
      isToken0: boolean
    }) => {
      const ratioValue = new BigNumber(value).times(new BigNumber(isToken0 ? 1 / ratio : ratio)).toNumber()
      const finalFormat =
        ratioValue > 0 ? ratioValue.toFixed(6) : ratioValue.toFixed(isToken0 ? currencyB.decimals : currencyA.decimals)
      setValue(value)
      setOtherValue(value ? finalFormat : '0.0')
    },
    [ratio, currencyA, currencyB],
  )
  const { locked } = useBCakeBoostLimitAndLockInfo()

  const onCurrencyAChange = useCallback(
    (value: string) =>
      onInputChange({
        value,
        currency: currencyA,
        otherValue: valueB,
        otherCurrency: currencyB,
        setValue: setValueA,
        setOtherValue: setValueB,
        isToken0: true,
      }),
    [currencyA, currencyB, valueB, onInputChange],
  )

  const onCurrencyBChange = useCallback(
    (value: string) =>
      onInputChange({
        value,
        currency: currencyB,
        otherValue: valueA,
        otherCurrency: currencyA,
        setValue: setValueB,
        setOtherValue: setValueA,
        isToken0: false,
      }),
    [currencyA, currencyB, valueA, onInputChange],
  )

  const amountA = useMemo(
    () => tryParseAmount(valueA, currencyA) || CurrencyAmount.fromRawAmount(currencyA, '0'),
    [valueA, currencyA],
  )
  const amountB = useMemo(
    () => tryParseAmount(valueB, currencyB) || CurrencyAmount.fromRawAmount(currencyB, '0'),
    [valueB, currencyB],
  )

  const totalPoolToken0Usd = useMemo(() => {
    return new BigNumber(amountA?.toSignificant() ?? 0).times(token0PriceUSD ?? 0)?.toNumber()
  }, [amountA, token0PriceUSD])

  const totalPoolToken1Usd = useMemo(() => {
    return new BigNumber(amountB?.toSignificant() ?? 0).times(token1PriceUSD ?? 0)?.toNumber()
  }, [amountB, token1PriceUSD])

  const userTotalDepositUSD = useMemo(() => {
    return (allowDepositToken0 ? totalPoolToken0Usd : 0) + (allowDepositToken1 ? totalPoolToken1Usd : 0)
  }, [allowDepositToken0, allowDepositToken1, totalPoolToken0Usd, totalPoolToken1Usd])

  const userVaultPercentage = useMemo(() => {
    return ((userTotalDepositUSD + totalAssetsInUsd) / (totalStakedInUsd + userTotalDepositUSD)) * 100
  }, [totalStakedInUsd, totalAssetsInUsd, userTotalDepositUSD])

  const apr = useApr({
    currencyA,
    currencyB,
    poolToken0Amount,
    poolToken1Amount,
    token0PriceUSD,
    token1PriceUSD,
    rewardPerSecond,
    earningToken,
    avgToken0Amount: aprDataInfo?.info?.token0 ?? 0,
    avgToken1Amount: aprDataInfo?.info?.token1 ?? 0,
    farmRewardAmount: aprDataInfo?.info?.rewardAmount ?? 0,
    rewardEndTime,
    rewardStartTime,
  })

  const displayBalanceText = useCallback(
    (balanceAmount: CurrencyAmount<Currency> | undefined) =>
      balanceAmount ? `Balances: ${balanceAmount?.toSignificant(6)}` : '',
    [],
  )

  const onDone = useCallback(() => {
    onDismiss?.()
    refetch?.()
  }, [onDismiss, refetch])

  const disabled = useMemo(() => {
    const balanceAmountMoreThenValueA =
      allowDepositToken0 &&
      amountA.greaterThan('0') &&
      Number(userCurrencyBalances?.token0Balance?.toSignificant()) < Number(amountA?.toSignificant())

    const balanceAmountMoreThenValueB =
      allowDepositToken1 &&
      amountB.greaterThan('0') &&
      Number(userCurrencyBalances?.token1Balance?.toSignificant()) < Number(amountB?.toSignificant())
    return (
      (allowDepositToken0 && (amountA.equalTo('0') || balanceAmountMoreThenValueA)) ||
      (allowDepositToken1 && (amountB.equalTo('0') || balanceAmountMoreThenValueB)) ||
      (Boolean(minDepositUSD) && userTotalDepositUSD < (minDepositUSD ?? 0))
    )
  }, [
    allowDepositToken0,
    allowDepositToken1,
    amountA,
    amountB,
    minDepositUSD,
    userCurrencyBalances?.token0Balance,
    userCurrencyBalances?.token1Balance,
    userTotalDepositUSD,
  ])

  const mintThenDeposit = useCallback(() => {
    onStake?.(amountA, amountB, allowDepositToken0, allowDepositToken1, onDone)
  }, [allowDepositToken0, allowDepositToken1, amountA, amountB, onDone, onStake])

  const translationData = useMemo(
    () =>
      isSingleDepositToken
        ? {
            amount: allowDepositToken0
              ? formatCurrencyAmount(amountA, 4, locale)
              : formatCurrencyAmount(amountB, 4, locale),
            symbol: allowDepositToken0 ? currencyA.symbol : currencyB.symbol,
          }
        : {
            amountA: formatCurrencyAmount(amountA, 4, locale),
            symbolA: currencyA.symbol,
            amountB: formatCurrencyAmount(amountB, 4, locale),
            symbolB: currencyB.symbol,
          },
    [allowDepositToken0, amountA, amountB, currencyA.symbol, currencyB.symbol, locale, isSingleDepositToken],
  )

  const pendingText = useMemo(
    () =>
      isSingleDepositToken
        ? t('Supplying %amount% %symbol%', translationData)
        : t('Supplying %amountA% %symbolA% and %amountB% %symbolB%', translationData),
    [t, isSingleDepositToken, translationData],
  )
  return (
    <ModalV2 onDismiss={onDismiss} isOpen={isOpen}>
      <StyledModal title={isTxLoading ? t('Pending Confirm') : t('Add Liquidity')}>
        {isTxLoading ? (
          <ConfirmationPendingContent pendingText={pendingText} />
        ) : (
          <>
            <RowBetween>
              <Text color="textSubtle">{t('Adding')}:</Text>
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
            {allowDepositToken0 && (
              <Flex mt="1em">
                <StyledCurrencyInput
                  value={valueA}
                  currency={currencyA}
                  balance={userCurrencyBalances.token0Balance}
                  balanceText={displayBalanceText(userCurrencyBalances?.token0Balance)}
                  onChange={onCurrencyAChange}
                  useTrustWalletUrl={false}
                />
              </Flex>
            )}
            {allowDepositToken1 && (
              <Flex mt="1em">
                <StyledCurrencyInput
                  value={valueB}
                  currency={currencyB}
                  balance={userCurrencyBalances.token1Balance}
                  balanceText={displayBalanceText(userCurrencyBalances?.token1Balance)}
                  onChange={onCurrencyBChange}
                  useTrustWalletUrl={false}
                />
              </Flex>
            )}
            <Flex mt="1.5em" flexDirection="column">
              {minDepositUSD && (
                <>
                  <RowBetween>
                    <Text color="text">{t('Your deposit value in USD')}:</Text>
                    <Text color="text">{`${userTotalDepositUSD.toString().substring(0, 5)}`}</Text>
                  </RowBetween>

                  <RowBetween>
                    <Text color="text">{t('Min deposit USD')}:</Text>
                    <Text color="text">{`${minDepositUSD}`}</Text>
                  </RowBetween>
                </>
              )}
              <RowBetween>
                <Text color="text">{t('Your share in the vault')}:</Text>
                <Text color="text">{`${userVaultPercentage?.toFixed(2)}%`}</Text>
              </RowBetween>
              <RowBetween>
                <Text color="text">{t('APR')}:</Text>
                <AprButton
                  id={id}
                  apr={apr}
                  isAprLoading={aprDataInfo.isLoading}
                  lpSymbol={`${currencyA.symbol}-${currencyB.symbol} LP`}
                  totalAssetsInUsd={totalAssetsInUsd}
                  totalStakedInUsd={totalStakedInUsd}
                  userLpAmounts={userLpAmounts}
                  totalSupplyAmounts={totalSupplyAmounts}
                  precision={precision}
                  lpTokenDecimals={lpTokenDecimals}
                  aprTimeWindow={aprTimeWindow}
                  rewardToken={earningToken}
                  isBooster={isBooster && apr?.isInCakeRewardDateRange}
                  boosterMultiplier={
                    totalAssetsInUsd === 0 || !locked ? 3 : boosterMultiplier === 0 ? 3 : boosterMultiplier
                  }
                />
              </RowBetween>
            </Flex>
            {isSingleDepositToken && <SingleTokenWarning strategyInfoUrl={strategyInfoUrl} />}
            <DYORWarning manager={manager} />
            <Flex mt="1.5em" flexDirection="column">
              <AddLiquidityButton
                amountA={allowDepositToken0 ? amountA : undefined}
                amountB={allowDepositToken1 ? amountB : undefined}
                contractAddress={contractAddress}
                disabled={disabled}
                onAddLiquidity={mintThenDeposit}
                isLoading={isTxLoading}
                learnMoreAboutUrl={learnMoreAboutUrl}
                bCakeWrapper={bCakeWrapper}
              />
            </Flex>
          </>
        )}
      </StyledModal>
    </ModalV2>
  )
})

interface AddLiquidityButtonProps {
  amountA: CurrencyAmount<Currency> | undefined
  amountB: CurrencyAmount<Currency> | undefined
  contractAddress: `0x${string}`
  disabled?: boolean
  onAddLiquidity?: () => void
  isLoading?: boolean
  learnMoreAboutUrl?: string
  bCakeWrapper?: Address
}

export const AddLiquidityButton = memo(function AddLiquidityButton({
  amountA,
  amountB,
  contractAddress,
  disabled,
  onAddLiquidity,
  isLoading,
  learnMoreAboutUrl,
  bCakeWrapper,
}: AddLiquidityButtonProps) {
  const { t } = useTranslation()

  const { approvalState: approvalStateToken0, approveCallback: approveCallbackToken0 } = useApproveCallback(
    amountA,
    bCakeWrapper ?? contractAddress,
  )
  const { approvalState: approvalStateToken1, approveCallback: approveCallbackToken1 } = useApproveCallback(
    amountB,
    bCakeWrapper ?? contractAddress,
  )

  const showAmountButtonA = useMemo(
    () => amountA && approvalStateToken0 === ApprovalState.NOT_APPROVED,
    [amountA, approvalStateToken0],
  )
  const showAmountButtonB = useMemo(
    () => amountB && approvalStateToken1 === ApprovalState.NOT_APPROVED,
    [amountB, approvalStateToken1],
  )
  const isConfirmButtonDisabled = useMemo(
    () =>
      disabled ||
      (amountA && approvalStateToken0 !== ApprovalState.APPROVED) ||
      (amountB && approvalStateToken1 !== ApprovalState.APPROVED),
    [amountA, amountB, disabled, approvalStateToken0, approvalStateToken1],
  )

  return (
    <>
      {showAmountButtonA && (
        <Button
          width="100%"
          variant="primary"
          disabled={disabled || approvalStateToken0 === ApprovalState.PENDING}
          onClick={approveCallbackToken0}
        >
          {t('Approve %symbol%', { symbol: amountA?.currency?.symbol ?? '' })}
        </Button>
      )}
      {showAmountButtonB && (
        <Button
          mt="0.5em"
          width="100%"
          variant="primary"
          disabled={disabled || approvalStateToken1 === ApprovalState.PENDING}
          onClick={approveCallbackToken1}
        >
          {t('Approve %symbol%', { symbol: amountB?.currency?.symbol ?? '' })}
        </Button>
      )}
      <Button
        mt="0.5em"
        width="100%"
        variant="primary"
        isLoading={isLoading}
        disabled={isConfirmButtonDisabled}
        onClick={onAddLiquidity}
      >
        {t('Confirm')}
      </Button>
      <LinkExternal external margin="24.5px auto 0 auto" href={learnMoreAboutUrl}>
        {t('Learn more about the strategy')}
      </LinkExternal>
    </>
  )
})
