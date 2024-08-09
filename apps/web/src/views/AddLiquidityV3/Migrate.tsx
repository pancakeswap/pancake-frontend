import { Trans, useTranslation } from '@pancakeswap/localization'
import { CurrencyAmount, ERC20Token, Fraction, NATIVE, Pair, Price, WNATIVE, ZERO } from '@pancakeswap/sdk'
import {
  AtomBox,
  AutoColumn,
  AutoRow,
  Box,
  Button,
  CardBody,
  Dots,
  Message,
  MessageText,
  PreTitle,
  RowBetween,
  Spinner,
  Text,
} from '@pancakeswap/uikit'
import { useUserSlippagePercent } from '@pancakeswap/utils/user'
import { FeeAmount, Pool, Position, priceToClosestTick, TickMath } from '@pancakeswap/v3-sdk'
import { LiquidityChartRangeInput } from '@pancakeswap/widgets-internal'
import { GreyCard } from 'components/Card'
import { CommitButton } from 'components/CommitButton'
import { CurrencyLogo } from 'components/Logo'
import { Bound } from 'config/constants/types'
import { useToken } from 'hooks/Tokens'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { usePairContract, useV3MigratorContract } from 'hooks/useContract'
import { useV2Pair } from 'hooks/usePairs'
import useTokenBalance from 'hooks/useTokenBalance'
import useTotalSupply from 'hooks/useTotalSupply'
import { useTransactionDeadline } from 'hooks/useTransactionDeadline'
import { useDerivedPositionInfo } from 'hooks/v3/useDerivedPositionInfo'
import useV3DerivedInfo from 'hooks/v3/useV3DerivedInfo'
import { tryParsePrice } from 'hooks/v3/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIsTransactionPending, useTransactionAdder } from 'state/transactions/hooks'
import { calculateGasMargin } from 'utils'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { useDensityChartData } from 'views/AddLiquidityV3/hooks/useDensityChartData'
import { useReadContract } from '@pancakeswap/wagmi'
// import { splitSignature } from 'utils/splitSignature'
import { Address, encodeFunctionData, Hex } from 'viem'
// import { isUserRejected } from 'utils/sentry'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useFeeTierDistribution } from 'hooks/v3/useFeeTierDistribution'
import { ResponsiveTwoColumns } from 'views/AddLiquidityV3'
import { useInitialRange } from 'views/AddLiquidityV3/formViews/V3FormView/form/hooks/useInitialRange'
import FeeSelector from './formViews/V3FormView/components/FeeSelector'
import RangeSelector from './formViews/V3FormView/components/RangeSelector'
import RateToggle from './formViews/V3FormView/components/RateToggle'
import { useRangeHopCallbacks } from './formViews/V3FormView/form/hooks/useRangeHopCallbacks'
import { useV3MintActionHandlers } from './formViews/V3FormView/form/hooks/useV3MintActionHandlers'
import { useV3FormState } from './formViews/V3FormView/form/reducer'
import { HandleFeePoolSelectFn } from './types'

export function Migrate({ v2PairAddress }: { v2PairAddress: Address }) {
  const pairContract = usePairContract(v2PairAddress)
  const { chainId } = useActiveChainId()

  const { data: token0Address } = useReadContract({
    abi: pairContract?.abi,
    address: v2PairAddress,
    functionName: 'token0',
    chainId,
  })

  const { data: token1Address } = useReadContract({
    abi: pairContract?.abi,
    address: v2PairAddress,
    functionName: 'token1',
    chainId,
  })

  const token0 = useToken(token0Address as Address)
  const token1 = useToken(token1Address as Address)

  const [, pair] = useV2Pair(token0 ?? undefined, token1 ?? undefined)
  const totalSupply = useTotalSupply(pair?.liquidityToken)

  if (!token0Address || !token1Address || !pair || !totalSupply)
    return (
      <AtomBox width="100%" justifyContent="center" alignItems="center" display="flex" minHeight="screenMd">
        <Spinner />
      </AtomBox>
    )

  return (
    <V2PairMigrate
      v2PairAddress={v2PairAddress}
      token0={token0!}
      token1={token1!}
      pair={pair}
      v2LPTotalSupply={totalSupply}
    />
  )
}

const percentageToMigrate = 100

function V2PairMigrate({
  v2PairAddress,
  token0,
  token1,
  pair,
  v2LPTotalSupply,
}: {
  v2PairAddress: Address
  token0: ERC20Token
  token1: ERC20Token
  pair: Pair
  v2LPTotalSupply: CurrencyAmount<ERC20Token>
}) {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { account, chainId } = useAccountActiveChain()
  const { balance: pairBalance } = useTokenBalance(v2PairAddress)

  const { reserve0, reserve1 } = pair

  useInitialRange(reserve0?.currency, reserve1?.currency)

  const token0Value = useMemo(
    () =>
      CurrencyAmount.fromRawAmount(
        token0,
        (BigInt(pairBalance.toString()) * reserve0.quotient) / v2LPTotalSupply.quotient,
      ),
    [token0, pairBalance, reserve0.quotient, v2LPTotalSupply.quotient],
  )
  const token1Value = useMemo(
    () =>
      CurrencyAmount.fromRawAmount(
        token1,
        (BigInt(pairBalance.toString()) * reserve1.quotient) / v2LPTotalSupply.quotient,
      ),
    [token1, pairBalance, reserve1.quotient, v2LPTotalSupply.quotient],
  )

  const { isPending, isError, largestUsageFeeTier } = useFeeTierDistribution(token0, token1)

  const [feeAmount, setFeeAmount] = useState(FeeAmount.MEDIUM)

  const handleFeePoolSelect = useCallback<HandleFeePoolSelectFn>(({ feeAmount: newFeeAmount }) => {
    if (newFeeAmount) setFeeAmount(newFeeAmount)
  }, [])

  const { position: existingPosition } = useDerivedPositionInfo(undefined)

  // mint state
  const formState = useV3FormState()

  const [baseToken, setBaseToken] = useState(token0)

  const { pool, ticks, price, pricesAtTicks, noLiquidity, invalidRange, outOfRange, invertPrice, ticksAtLimit } =
    useV3DerivedInfo(
      token0 ?? undefined,
      token1 ?? undefined,
      feeAmount,
      baseToken ?? undefined,
      existingPosition,
      formState,
    )
  const { onLeftRangeInput, onRightRangeInput, onBothRangeInput } = useV3MintActionHandlers(noLiquidity)

  const onBothRangePriceInput = useCallback(
    (leftRangeValue: string, rightRangeValue: string) => {
      onBothRangeInput({
        leftTypedValue: tryParsePrice(
          baseToken,
          baseToken.equals(token0) ? token1 : token0 ?? undefined,
          leftRangeValue,
        ),
        rightTypedValue: tryParsePrice(
          baseToken,
          baseToken.equals(token0) ? token1 : token0 ?? undefined,
          rightRangeValue,
        ),
      })
    },
    [baseToken, token0, token1, onBothRangeInput],
  )

  const onLeftRangePriceInput = useCallback(
    (leftRangeValue: string) => {
      onLeftRangeInput(
        tryParsePrice(baseToken, baseToken.equals(token0) ? token1 : token0 ?? undefined, leftRangeValue),
      )
    },
    [baseToken, token0, token1, onLeftRangeInput],
  )

  const onRightRangePriceInput = useCallback(
    (rightRangeValue: string) => {
      onRightRangeInput(
        tryParsePrice(baseToken, baseToken.equals(token0) ? token1 : token0 ?? undefined, rightRangeValue),
      )
    },
    [baseToken, token0, token1, onRightRangeInput],
  )

  // get spot prices + price difference
  const v2SpotPrice = useMemo(
    () => new Price(token0, token1, reserve0.quotient, reserve1.quotient),
    [token0, token1, reserve0, reserve1],
  )
  const v3SpotPrice = pool?.token0Price ?? undefined

  const priceDifferenceFraction: Fraction | undefined = useMemo(() => {
    const result = v2SpotPrice && v3SpotPrice ? v3SpotPrice.divide(v2SpotPrice).subtract(1).multiply(100) : undefined
    if (result?.lessThan(ZERO)) {
      return result.multiply(-1)
    }
    return result
  }, [v2SpotPrice, v3SpotPrice])

  const largePriceDifference = useMemo(
    () => priceDifferenceFraction && !priceDifferenceFraction?.lessThan(2n),
    [priceDifferenceFraction],
  )

  // modal and loading
  // capital efficiency warning
  const [showCapitalEfficiencyWarning, setShowCapitalEfficiencyWarning] = useState<boolean>(false)

  useEffect(() => {
    setShowCapitalEfficiencyWarning(false)
  }, [token0, token1, feeAmount, onLeftRangeInput, onRightRangeInput])

  useEffect(() => {
    if (feeAmount) {
      onBothRangeInput({ leftTypedValue: undefined, rightTypedValue: undefined })
    }
    // NOTE: ignore exhaustive-deps to avoid infinite re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeAmount])

  const currency0 = unwrappedToken(token0)
  const currency1 = unwrappedToken(token1)

  useEffect(() => {
    if (!isError && !isPending && largestUsageFeeTier) {
      setFeeAmount(largestUsageFeeTier)
    }
  }, [isError, isPending, largestUsageFeeTier])

  // txn values
  const [deadline] = useTransactionDeadline() // custom from users settings

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks

  const [allowedSlippage] = useUserSlippagePercent()

  // the v3 tick is either the pool's tickCurrent, or the tick closest to the v2 spot price
  const tick = useMemo(() => pool?.tickCurrent ?? priceToClosestTick(v2SpotPrice), [pool?.tickCurrent, v2SpotPrice])
  // the price is either the current v3 price, or the price at the tick
  const sqrtPrice = useMemo(() => pool?.sqrtRatioX96 ?? TickMath.getSqrtRatioAtTick(tick), [pool?.sqrtRatioX96, tick])
  const position = useMemo(
    () =>
      typeof tickLower === 'number' && typeof tickUpper === 'number' && !invalidRange
        ? Position.fromAmounts({
            pool: pool ?? new Pool(token0, token1, feeAmount, sqrtPrice, 0, tick, []),
            tickLower,
            tickUpper,
            amount0: token0Value.quotient,
            amount1: token1Value.quotient,
            useFullPrecision: true, // we want full precision for the theoretical position
          })
        : undefined,
    [
      feeAmount,
      invalidRange,
      pool,
      sqrtPrice,
      tick,
      tickLower,
      tickUpper,
      token0,
      token0Value.quotient,
      token1,
      token1Value.quotient,
    ],
  )

  const { amount0: v3Amount0Min, amount1: v3Amount1Min } = useMemo(
    () => (position ? position.mintAmountsWithSlippage(allowedSlippage) : { amount0: undefined, amount1: undefined }),
    [position, allowedSlippage],
  )

  const refund0 = useMemo(
    () => position && CurrencyAmount.fromRawAmount(token0, token0Value.quotient - position.amount0.quotient),
    [token0Value, position, token0],
  )
  const refund1 = useMemo(
    () => position && CurrencyAmount.fromRawAmount(token1, token1Value.quotient - position.amount1.quotient),
    [token1Value, position, token1],
  )

  const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper, getSetFullRange } =
    useRangeHopCallbacks(
      baseToken ?? undefined,
      baseToken.equals(token0) ? token1 : token0,
      feeAmount,
      tickLower,
      tickUpper,
      pool,
    )

  const [confirmingMigration, setConfirmingMigration] = useState<boolean>(false)
  const [pendingMigrationHash, setPendingMigrationHash] = useState<string | null>(null)

  const addTransaction = useTransactionAdder()
  const isMigrationPending = useIsTransactionPending(pendingMigrationHash ?? undefined)

  const migrator = useV3MigratorContract()
  const [
    signatureData,
    // setSignatureData
  ] = useState<{
    v: number
    r: `0x${string}`
    s: `0x${string}`
    deadline: number
  } | null>(null)
  const { approvalState, approveCallback } = useApproveCallback(
    CurrencyAmount.fromRawAmount(pair.liquidityToken, pairBalance.toString()),
    migrator.address,
  )

  const approve = useCallback(async () => {
    return approveCallback()
    // // try to gather a signature for permission
    // const nonce = await pairContractRead?.read.nonces([account!])

    // const EIP712Domain = [
    //   { name: 'name', type: 'string' },
    //   { name: 'version', type: 'string' },
    //   { name: 'chainId', type: 'uint256' },
    //   { name: 'verifyingContract', type: 'address' },
    // ]
    // const domain = {
    //   name: 'Pancake LPs',
    //   version: '1',
    //   chainId,
    //   verifyingContract: pair.liquidityToken.address as `0x${string}`,
    // }
    // const Permit = [
    //   { name: 'owner', type: 'address' },
    //   { name: 'spender', type: 'address' },
    //   { name: 'value', type: 'uint256' },
    //   { name: 'nonce', type: 'uint256' },
    //   { name: 'deadline', type: 'uint256' },
    // ]
    // const message = {
    //   owner: account,
    //   spender: migrator.address,
    //   value: pairBalance.toString(),
    //   nonce: toHex(nonce ?? 0),
    //   deadline: Number(deadline),
    // }

    // signTypedDataAsync({
    //   // @ts-ignore
    //   domain,
    //   primaryType: 'Permit',
    //   types: {
    //     EIP712Domain,
    //     Permit,
    //   },
    //   message,
    // })
    //   .then(splitSignature)
    //   .then((signature) => {
    //     setSignatureData({
    //       v: signature.v,
    //       r: signature.r,
    //       s: signature.s,
    //       deadline: Number(deadline),
    //     })
    //   })
    //   .catch((err) => {
    //     // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
    //     if (!isUserRejected(err)) {
    //       approveCallback()
    //     }
    //   })
  }, [approveCallback])

  const migrate = useCallback(() => {
    if (
      !migrator ||
      !account ||
      !deadline ||
      typeof tickLower !== 'number' ||
      typeof tickUpper !== 'number' ||
      !chainId
    )
      return

    const deadlineToUse = signatureData?.deadline ? BigInt(signatureData.deadline) : deadline

    const data: Hex[] = []

    // permit if necessary
    if (signatureData) {
      data.push(
        encodeFunctionData({
          abi: migrator.abi,
          functionName: 'selfPermit',
          args: [
            pair.liquidityToken.address,
            BigInt(pairBalance.toString()),
            deadlineToUse,
            signatureData.v,
            signatureData.r,
            signatureData.s,
          ],
        }),
      )
    }

    // create/initialize pool if necessary
    if (noLiquidity) {
      data.push(
        encodeFunctionData({
          abi: migrator.abi,
          functionName: 'createAndInitializePoolIfNecessary',
          args: [token0.address, token1.address, feeAmount, sqrtPrice],
        }),
      )
    }

    // TODO could save gas by not doing this in multicall
    data.push(
      encodeFunctionData({
        abi: migrator.abi,
        functionName: 'migrate',
        args: [
          {
            pair: pair.liquidityToken.address,
            liquidityToMigrate: BigInt(pairBalance.toString()),
            percentageToMigrate,
            token0: token0.address,
            token1: token1.address,
            fee: feeAmount,
            tickLower,
            tickUpper,
            amount0Min: v3Amount0Min ?? 0n,
            amount1Min: v3Amount1Min ?? 0n,
            recipient: account,
            deadline: deadlineToUse,
            refundAsETH: true, // hard-code this for now
          },
        ],
      }),
    )

    setConfirmingMigration(true)

    migrator.estimateGas
      .multicall(
        [data], // TODO: Fix viem
        // @ts-ignore
        { account: migrator.account!, value: 0n },
      )
      .then((gasEstimate) => {
        return migrator.write
          .multicall([data], { gas: calculateGasMargin(gasEstimate), account, chain: migrator.chain, value: 0n })
          .then((response) => {
            addTransaction(
              {
                hash: response,
              },
              {
                type: 'migrate-v3',
                translatableSummary: {
                  text: 'Migrated %symbolA% %symbolB% V2 liquidity to V3',
                  data: { symbolA: currency0?.symbol, symbolB: currency1?.symbol },
                },
              },
            )
            setPendingMigrationHash(response)
          })
      })
      .catch((e) => {
        console.error(e)
        setConfirmingMigration(false)
      })
  }, [
    chainId,
    migrator,
    noLiquidity,
    token0,
    token1,
    feeAmount,
    pairBalance,
    tickLower,
    tickUpper,
    sqrtPrice,
    v3Amount0Min,
    v3Amount1Min,
    account,
    deadline,
    signatureData,
    addTransaction,
    pair,
    currency0,
    currency1,
  ])

  const isSuccessfullyMigrated = useMemo(
    () => !!pendingMigrationHash && BigInt(pairBalance.toString()) === ZERO,
    [pendingMigrationHash, pairBalance],
  )

  const {
    isLoading: isChartDataLoading,
    error: chartDataError,
    formattedData,
  } = useDensityChartData({
    currencyA: baseToken ?? undefined,
    currencyB: baseToken.equals(token0) ? token1 : token0 ?? undefined,
    feeAmount,
  })

  return (
    <CardBody>
      <ResponsiveTwoColumns>
        <AutoColumn alignSelf="start" gap="16px">
          <PreTitle>{t('Migrating from V2')}</PreTitle>
          <GreyCard>
            <AutoColumn gap="8px">
              <AutoRow justifyContent="space-between">
                <AutoRow gap="4px" flex={1}>
                  <CurrencyLogo currency={token0} />
                  <Text color="textSubtle" small>
                    {token0?.symbol}
                  </Text>
                </AutoRow>
                <Text bold>{token0Value.toFixed(token0.decimals)}</Text>
              </AutoRow>
              <AutoRow>
                <AutoRow gap="4px" flex={1}>
                  <CurrencyLogo currency={token1} />
                  <Text color="textSubtle" small>
                    {token1?.symbol}
                  </Text>
                </AutoRow>
                <Text bold>{token1Value.toFixed(token1.decimals)}</Text>
              </AutoRow>
            </AutoColumn>
          </GreyCard>
          <FeeSelector
            currencyA={token0 ?? undefined}
            currencyB={token1 ?? undefined}
            handleFeePoolSelect={handleFeePoolSelect}
            feeAmount={feeAmount}
          />
          <AutoColumn gap="8px">
            <PreTitle>{t('Deposit Amount')}</PreTitle>
            <GreyCard>
              <AutoColumn gap="8px">
                <AutoRow justifyContent="space-between">
                  <AutoRow gap="4px" flex={1}>
                    <CurrencyLogo currency={token0} />
                    <Text color="textSubtle" small>
                      {token0?.symbol}
                    </Text>
                  </AutoRow>
                  {position && <Text bold>{position.amount0.toFixed(token0.decimals)}</Text>}
                </AutoRow>
                <AutoRow>
                  <AutoRow gap="4px" flex={1}>
                    <CurrencyLogo currency={token1} />
                    <Text color="textSubtle" small>
                      {token1?.symbol}
                    </Text>
                  </AutoRow>
                  {position && <Text bold>{position.amount1.toFixed(token1.decimals)}</Text>}
                </AutoRow>
                {position && chainId && refund0 && refund1 ? (
                  <Text color="textSubtle">
                    At least {formatCurrencyAmount(refund0, 4, locale)}{' '}
                    {chainId && WNATIVE[chainId]?.equals(token0) ? NATIVE?.[chainId].symbol : token0.symbol} and{' '}
                    {formatCurrencyAmount(refund1, 4, locale)}{' '}
                    {chainId && WNATIVE[chainId]?.equals(token1) ? NATIVE?.[chainId].symbol : token1.symbol} will be
                    refunded to your wallet due to selected price range.
                  </Text>
                ) : null}
              </AutoColumn>
            </GreyCard>
          </AutoColumn>
        </AutoColumn>
        <AutoColumn alignSelf="flex-start" gap="16px">
          <RowBetween>
            <PreTitle>{t('Set Price Range')}</PreTitle>
            <RateToggle
              currencyA={invertPrice ? currency1 : currency0}
              handleRateToggle={() => {
                setBaseToken((base) => (base.equals(token0) ? token1 : token0))
                if (!ticksAtLimit[Bound.LOWER] && !ticksAtLimit[Bound.UPPER]) {
                  onBothRangeInput({
                    leftTypedValue: (invertPrice ? priceLower : priceUpper?.invert()) ?? undefined,
                    rightTypedValue: (invertPrice ? priceUpper : priceLower?.invert()) ?? undefined,
                  })
                }
              }}
            />
          </RowBetween>
          {noLiquidity && (
            <AtomBox>
              <Message variant="warning">
                <MessageText>
                  {t(
                    'You are the first liquidity provider for this PancakeSwap V3 pool. Your liquidity will migrate at the current V2 price.',
                  )}
                  <MessageText>
                    {t('Your transaction cost will be much higher as it includes the gas to create the pool.')}
                  </MessageText>
                </MessageText>
              </Message>

              {v2SpotPrice && (
                <AutoColumn gap="sm" style={{ marginTop: '12px' }}>
                  <RowBetween>
                    <Text>
                      <Text>
                        V2 {invertPrice ? currency1?.symbol : currency0?.symbol} {t('Price')}:
                      </Text>{' '}
                      {invertPrice
                        ? `${v2SpotPrice?.invert()?.toSignificant(6)} ${currency0?.symbol}`
                        : `${v2SpotPrice?.toSignificant(6)} ${currency1?.symbol}`}
                    </Text>
                  </RowBetween>
                </AutoColumn>
              )}
            </AtomBox>
          )}
          {largePriceDifference ? (
            <GreyCard>
              <AutoColumn gap="sm">
                <RowBetween>
                  <Text fontSize={14}>
                    V2 {invertPrice ? currency1?.symbol : currency0?.symbol} {t('Price')}:
                  </Text>
                  <Text fontSize={14}>
                    {invertPrice
                      ? `${v2SpotPrice?.invert()?.toSignificant(6)} ${currency0?.symbol}`
                      : `${v2SpotPrice?.toSignificant(6)} ${currency1?.symbol}`}
                  </Text>
                </RowBetween>

                <RowBetween>
                  <Text fontSize={14}>
                    V3 {invertPrice ? currency1?.symbol : currency0?.symbol} {t('Price')}:
                  </Text>
                  <Text fontSize={14}>
                    {invertPrice
                      ? `${v3SpotPrice?.invert()?.toSignificant(6)} ${currency0?.symbol}`
                      : `${v3SpotPrice?.toSignificant(6)} ${currency1?.symbol}`}
                  </Text>
                </RowBetween>

                <RowBetween>
                  <Text fontSize={14} color="inherit">
                    {t('Price Difference')}:
                  </Text>
                  <Text fontSize={14} color="inherit">
                    {priceDifferenceFraction?.toSignificant(4)}%
                  </Text>
                </RowBetween>
              </AutoColumn>
              <Text fontSize={14} style={{ marginTop: 8, fontWeight: 400 }}>
                {t('You should only deposit liquidity into PancakeSwap V3 at a price you believe is correct.')} <br />
                {t(
                  'If the price seems incorrect, you can either make a swap to move the price or wait for someone else to do so.',
                )}
              </Text>
            </GreyCard>
          ) : !noLiquidity && v3SpotPrice ? (
            <RowBetween>
              <Text fontSize={14}>
                V3 {invertPrice ? currency1?.symbol : currency0?.symbol} {t('Price')}:
              </Text>
              <Text fontSize={14}>
                {invertPrice
                  ? `${v3SpotPrice?.invert()?.toSignificant(6)} ${currency0?.symbol}`
                  : `${v3SpotPrice?.toSignificant(6)} ${currency1?.symbol}`}
              </Text>
            </RowBetween>
          ) : null}

          <LiquidityChartRangeInput
            currencyA={baseToken ?? undefined}
            currencyB={baseToken.equals(token0) ? token1 : token0 ?? undefined}
            feeAmount={feeAmount}
            ticksAtLimit={ticksAtLimit}
            price={price ? parseFloat((invertPrice ? price.invert() : price).toSignificant(8)) : undefined}
            priceLower={priceLower}
            priceUpper={priceUpper}
            onLeftRangeInput={onLeftRangePriceInput}
            onRightRangeInput={onRightRangePriceInput}
            onBothRangeInput={onBothRangePriceInput}
            formattedData={formattedData}
            isLoading={isChartDataLoading}
            error={chartDataError}
            interactive
          />
          <RangeSelector
            priceLower={priceLower}
            priceUpper={priceUpper}
            getDecrementLower={getDecrementLower}
            getIncrementLower={getIncrementLower}
            getDecrementUpper={getDecrementUpper}
            getIncrementUpper={getIncrementUpper}
            onLeftRangeInput={onLeftRangeInput}
            onRightRangeInput={onRightRangeInput}
            currencyA={invertPrice ? currency1 : currency0}
            currencyB={invertPrice ? currency0 : currency1}
            feeAmount={feeAmount}
            ticksAtLimit={ticksAtLimit}
          />
          {showCapitalEfficiencyWarning ? (
            <Message variant="warning">
              <Box>
                <Text fontSize="16px">{t('Efficiency Comparison')}</Text>
                <Text color="textSubtle">
                  {t('Full range positions may earn less fees than concentrated positions.')}
                </Text>
                <Button
                  mt="16px"
                  onClick={() => {
                    setShowCapitalEfficiencyWarning(false)
                    getSetFullRange()
                  }}
                  scale="md"
                  variant="danger"
                >
                  {t('I understand')}
                </Button>
              </Box>
            </Message>
          ) : (
            <Button
              onClick={() => {
                setShowCapitalEfficiencyWarning(true)
              }}
              variant="secondary"
              scale="sm"
            >
              {t('Full Range')}
            </Button>
          )}
          {outOfRange || !v3Amount0Min || !v3Amount1Min ? (
            <Message variant="warning">
              <RowBetween>
                <Text ml="12px" fontSize="12px">
                  {t(
                    'Your position will not earn fees or be used in trades until the market price moves into your range.',
                  )}
                </Text>
              </RowBetween>
            </Message>
          ) : null}
          {invalidRange ? (
            <Message variant="warning">
              <MessageText>{t('Invalid range selected. The min price must be lower than the max price.')}</MessageText>
            </Message>
          ) : null}
          <AutoColumn gap="md">
            {!isSuccessfullyMigrated && !isMigrationPending ? (
              <AutoColumn gap="md" style={{ flex: '1' }}>
                <CommitButton
                  variant={approvalState === ApprovalState.APPROVED || signatureData !== null ? 'success' : 'primary'}
                  disabled={
                    approvalState !== ApprovalState.NOT_APPROVED ||
                    signatureData !== null ||
                    invalidRange ||
                    confirmingMigration
                  }
                  onClick={approve}
                >
                  {approvalState === ApprovalState.PENDING ? (
                    <Dots>
                      <Trans>Enabling</Trans>
                    </Dots>
                  ) : approvalState === ApprovalState.APPROVED || signatureData !== null ? (
                    <Trans>Enabled</Trans>
                  ) : (
                    <Trans>Enable</Trans>
                  )}
                </CommitButton>
              </AutoColumn>
            ) : null}
            <AutoColumn gap="md" style={{ flex: '1' }}>
              <CommitButton
                variant={isSuccessfullyMigrated ? 'success' : 'primary'}
                disabled={
                  invalidRange ||
                  (approvalState !== ApprovalState.APPROVED && signatureData === null) ||
                  confirmingMigration ||
                  isMigrationPending ||
                  isSuccessfullyMigrated
                }
                onClick={migrate}
              >
                {isSuccessfullyMigrated ? (
                  'Success!'
                ) : isMigrationPending ? (
                  <Dots>
                    <Trans>Migrating</Trans>
                  </Dots>
                ) : (
                  <Trans>Migrate</Trans>
                )}
              </CommitButton>
            </AutoColumn>
          </AutoColumn>
        </AutoColumn>
      </ResponsiveTwoColumns>
    </CardBody>
  )
}
