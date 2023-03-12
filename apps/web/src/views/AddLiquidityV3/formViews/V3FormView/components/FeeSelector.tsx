import { farmsV3ConfigChainMap } from '@pancakeswap/farms/constants/v3'
import { ChainId, Currency } from '@pancakeswap/sdk'
import { AtomBox } from '@pancakeswap/ui'
import { AutoColumn, CircleLoader, Text } from '@pancakeswap/uikit'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useV2Pair } from 'hooks/usePairs'
import { PoolState } from 'hooks/v3/types'
import { useFeeTierDistribution } from 'hooks/v3/useFeeTierDistribution'
import { usePools } from 'hooks/v3/usePools'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import currencyId from 'utils/currencyId'
import HideShowSelectorSection from 'views/AddLiquidityV3/components/HideShowSelectorSection'
import { HandleFeePoolSelectFn, SELECTOR_TYPE } from 'views/AddLiquidityV3/types'
import { FeeOption } from './FeeOption'
import { FeeTierPercentageBadge } from './FeeTierPercentageBadge'
import { FEE_AMOUNT_DETAIL, SelectContainer } from './shared'

export default function FeeSelector({
  feeAmount,
  handleFeePoolSelect,
  currencyA,
  currencyB,
}: {
  feeAmount?: FeeAmount
  handleFeePoolSelect: HandleFeePoolSelectFn
  currencyA?: Currency | undefined
  currencyB?: Currency | undefined
}) {
  const { chainId } = useActiveWeb3React()
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

  const [, pair] = useV2Pair(currencyA, currencyB)

  const v2PairHasBetterTokenAmounts = useMemo(() => {
    if (isLoading || isError || !pair || !currencyA || !currencyB) {
      return false
    }
    if (!isLoading && !largestUsageFeeTier) {
      return true
    }
    if (largestUsageFeeTierTvl) {
      if (!(largestUsageFeeTierTvl[0] && !largestUsageFeeTier[1])) {
        return true
      }
      return (
        pair.reserve0.greaterThan(tryParseAmount(String(largestUsageFeeTierTvl[0]), pair.token0)) ||
        pair.reserve1.greaterThan(tryParseAmount(String(largestUsageFeeTierTvl[1]), pair.token1))
      )
    }
    return true
  }, [currencyA, currencyB, isError, isLoading, largestUsageFeeTier, largestUsageFeeTierTvl, pair])

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
          return {
            ...acc,
            ...{ [curPool?.fee as FeeAmount]: curPoolState },
          }
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

    if (!largestUsageFeeTier) {
      // cannot recommend, open options
      setShowOptions(true)
    } else {
      if (v2PairHasBetterTokenAmounts) return
      setShowOptions(false)

      handleFeePoolSelect({
        type: SELECTOR_TYPE.V3,
        feeAmount: largestUsageFeeTier,
      })
    }
  }, [feeAmount, isLoading, isError, largestUsageFeeTier, handleFeePoolSelect, v2PairHasBetterTokenAmounts, farmV3])

  useEffect(() => {
    setShowOptions(isError)
  }, [isError])

  return (
    <HideShowSelectorSection
      showOptions={showOptions}
      noHideButton={!feeAmount}
      setShowOptions={setShowOptions}
      heading={
        feeAmount ? (
          <AutoColumn gap="8px">
            <Text>{FEE_AMOUNT_DETAIL[feeAmount].label}% fee tier</Text>
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
            <Text>Fee tier</Text>
            <Text>The % you will earn in fees.</Text>
            {isLoading && <CircleLoader />}
          </>
        )
      }
      content={
        <>
          <SelectContainer>
            {[FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH].map((_feeAmount) => {
              const { supportedChains } = FEE_AMOUNT_DETAIL[_feeAmount]
              if (supportedChains.includes(chainId)) {
                return (
                  <FeeOption
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
          {currencyA && currencyB && v2PairHasBetterTokenAmounts && (
            <AtomBox textAlign="center" pt="24px">
              <Link href={`/v2/add/${currencyId(currencyA)}/${currencyId(currencyB)}`}>
                <Text color="textSubtle" bold>
                  Add V2 Liquidity
                </Text>
              </Link>
            </AtomBox>
          )}
        </>
      }
    />
  )
}
