import { farmsV3ConfigChainMap } from '@pancakeswap/farms/constants/v3'
import { useTranslation } from '@pancakeswap/localization'
import { ChainId, Currency } from '@pancakeswap/sdk'
import { AtomBox } from '@pancakeswap/ui'
import { AutoColumn, Button, CircleLoader, Text } from '@pancakeswap/uikit'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { PairState, useV2Pair } from 'hooks/usePairs'
import { PoolState } from 'hooks/v3/types'
import { useFeeTierDistribution } from 'hooks/v3/useFeeTierDistribution'
import { usePools } from 'hooks/v3/usePools'
import { useEffect, useMemo, useState } from 'react'
import HideShowSelectorSection from 'views/AddLiquidityV3/components/HideShowSelectorSection'
import { HandleFeePoolSelectFn, SELECTOR_TYPE } from 'views/AddLiquidityV3/types'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { FeeOption } from './FeeOption'
import { FeeTierPercentageBadge } from './FeeTierPercentageBadge'
import { FEE_AMOUNT_DETAIL, SelectContainer } from './shared'

const FEE_TIERS = [FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH]

export default function FeeSelector({
  feeAmount,
  handleFeePoolSelect,
  currencyA,
  currencyB,
  handleSelectV2,
}: {
  feeAmount?: FeeAmount
  handleFeePoolSelect: HandleFeePoolSelectFn
  currencyA?: Currency | undefined
  currencyB?: Currency | undefined
  /**
   * If this is set, the selector will show a button to select the V2 pair when V2 has better token amounts
   */
  handleSelectV2?: () => void
}) {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const farmV3Config = farmsV3ConfigChainMap[currencyA?.chainId as ChainId]

  const farmV3 = useMemo(() => {
    if (currencyA && currencyB) {
      const [tokenA, tokenB] = [currencyA.wrapped, currencyB.wrapped]
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return farmV3Config?.length > 0 && farmV3Config.find((f) => f.token.equals(token0) && f.quoteToken.equals(token1))
    }
    return null
  }, [currencyA, currencyB, farmV3Config])

  const { isLoading, isError, largestUsageFeeTier, distributions, largestUsageFeeTierTvl } = useFeeTierDistribution(
    currencyA,
    currencyB,
  )

  const [pairState, pair] = useV2Pair(currencyA, currencyB)

  const [showOptions, setShowOptions] = useState(false)
  // get pool data on-chain for latest states
  const pools = usePools([
    [currencyA, currencyB, FeeAmount.LOWEST],
    [currencyA, currencyB, FeeAmount.LOW],
    [currencyA, currencyB, FeeAmount.MEDIUM],
    [currencyA, currencyB, FeeAmount.HIGH],
  ])

  const poolsByFeeTier: Record<FeeAmount, PoolState> = useMemo(
    () =>
      pools.reduce(
        (acc, [curPoolState, curPool]) => {
          return curPool
            ? {
                ...acc,
                ...{ [curPool.fee as FeeAmount]: curPoolState },
              }
            : acc
        },
        {
          // default all states to NOT_EXISTS
          [FeeAmount.LOWEST]: PoolState.NOT_EXISTS,
          [FeeAmount.LOW]: PoolState.NOT_EXISTS,
          [FeeAmount.MEDIUM]: PoolState.NOT_EXISTS,
          [FeeAmount.HIGH]: PoolState.NOT_EXISTS,
        },
      ),
    [pools],
  )

  const v2PairHasBetterTokenAmounts = useMemo(() => {
    if (!handleSelectV2) return false
    if (
      isLoading ||
      isError ||
      !currencyA ||
      !currencyB ||
      [PairState.LOADING, PairState.INVALID].includes(pairState)
    ) {
      return false
    }

    // Show Add V2 button when no v2 pool or no v3 pool
    if (
      (!isLoading && !largestUsageFeeTier) ||
      pairState === PairState.NOT_EXISTS ||
      FEE_TIERS.every((tier) => poolsByFeeTier[tier] === PoolState.NOT_EXISTS)
    ) {
      return true
    }

    if (largestUsageFeeTierTvl) {
      if (!Array.isArray(largestUsageFeeTierTvl) || !(largestUsageFeeTierTvl[0] && !largestUsageFeeTier[1])) {
        return true
      }

      const v3Amount0 = tryParseAmount(String(largestUsageFeeTierTvl[0]), pair.token0)
      const v3Amount1 = tryParseAmount(String(largestUsageFeeTierTvl[1]), pair.token1)

      return (v3Amount0 && pair.reserve0.greaterThan(v3Amount0)) || (v3Amount1 && pair.reserve1.greaterThan(v3Amount1))
    }
    return true
  }, [
    poolsByFeeTier,
    currencyA,
    currencyB,
    handleSelectV2,
    isError,
    isLoading,
    largestUsageFeeTier,
    largestUsageFeeTierTvl,
    pair,
    pairState,
  ])

  useEffect(() => {
    if (feeAmount) {
      return
    }

    if (farmV3) {
      handleFeePoolSelect({
        type: SELECTOR_TYPE.V3,
        feeAmount: farmV3.feeAmount,
      })
      return
    }

    if (isLoading || isError) {
      return
    }

    if (!largestUsageFeeTier || v2PairHasBetterTokenAmounts) {
      // cannot recommend, open options
      setShowOptions(true)
    } else {
      setShowOptions(false)

      handleFeePoolSelect({
        type: SELECTOR_TYPE.V3,
        feeAmount: largestUsageFeeTier,
      })
    }
  }, [feeAmount, isLoading, isError, largestUsageFeeTier, handleFeePoolSelect, v2PairHasBetterTokenAmounts, farmV3])

  return (
    <HideShowSelectorSection
      showOptions={showOptions || (!v2PairHasBetterTokenAmounts && isError)}
      noHideButton={!feeAmount}
      setShowOptions={setShowOptions}
      heading={
        feeAmount ? (
          <AutoColumn gap="8px">
            <Text>
              V3 LP - {FEE_AMOUNT_DETAIL[feeAmount].label}% {t('fee tier')}
            </Text>
            {distributions && (
              <FeeTierPercentageBadge
                distributions={distributions}
                feeAmount={feeAmount}
                poolState={poolsByFeeTier[feeAmount]}
              />
            )}
          </AutoColumn>
        ) : (
          <>
            <Text>V3 LP</Text>
            {isLoading && <CircleLoader />}
          </>
        )
      }
      content={
        <>
          <SelectContainer>
            {FEE_TIERS.map((_feeAmount) => {
              const { supportedChains } = FEE_AMOUNT_DETAIL[_feeAmount]
              if (supportedChains.includes(chainId)) {
                return (
                  <FeeOption
                    isLoading={isLoading}
                    largestUsageFeeTier={largestUsageFeeTier}
                    feeAmount={_feeAmount}
                    active={feeAmount === _feeAmount}
                    onClick={() => handleFeePoolSelect({ type: SELECTOR_TYPE.V3, feeAmount: _feeAmount })}
                    distributions={distributions}
                    poolState={poolsByFeeTier[_feeAmount]}
                    key={_feeAmount}
                  />
                )
              }
              return null
            })}
          </SelectContainer>
          {currencyA && currencyB && v2PairHasBetterTokenAmounts && handleSelectV2 && (
            <AtomBox textAlign="center">
              {/*
                using state instead of replacing url to /v2 here
                avoid pages keep in v2 when user change the tokens in selection
              */}
              <Button variant="text" onClick={handleSelectV2}>
                <Text color="textSubtle" bold>
                  {t('Add V2 Liquidity')}
                </Text>
              </Button>
            </AtomBox>
          )}
        </>
      }
    />
  )
}
