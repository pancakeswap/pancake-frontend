import { Currency } from '@pancakeswap/sdk'
import { Box, Text } from '@pancakeswap/uikit'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { PoolState } from 'hooks/v3/types'
import { useFeeTierDistribution } from 'hooks/v3/useFeeTierDistribution'
import { usePools } from 'hooks/v3/usePools'
import _toNumber from 'lodash/toNumber'
import styled from 'styled-components'
import { useEffect, useMemo, useState } from 'react'
import HideShowSelectorSection from 'views/AddLiquidityV3/components/HideShowSelectorSection'
import { HandleFeePoolSelectFn, SELECTOR_TYPE } from 'views/AddLiquidityV3/types'
import { FeeOption } from './FeeOption'
import { FeeTierPercentageBadge } from './FeeTierPercentageBadge'
import { FEE_AMOUNT_DETAIL } from './shared'

const Select = styled.div`
  align-items: flex-start;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 8px;
`

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

  const { isLoading, isError, largestUsageFeeTier, distributions } = useFeeTierDistribution(currencyA, currencyB)

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
    if (feeAmount || isLoading || isError) {
      return
    }

    if (!largestUsageFeeTier) {
      // cannot recommend, open options
      setShowOptions(true)
    } else {
      setShowOptions(false)

      handleFeePoolSelect({
        type: SELECTOR_TYPE.V3,
        feeAmount: largestUsageFeeTier,
      })
    }
  }, [feeAmount, isLoading, isError, largestUsageFeeTier, handleFeePoolSelect])

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
          <Box>
            <Text>{FEE_AMOUNT_DETAIL[feeAmount].label}% fee tier fee tier</Text>
            {distributions && (
              <FeeTierPercentageBadge
                distributions={distributions}
                feeAmount={feeAmount}
                poolState={poolsByFeeTier[feeAmount]}
              />
            )}
          </Box>
        ) : (
          <>
            <Text>Fee tier</Text>
            <Text>The % you will earn in fees.</Text>
          </>
        )
      }
      content={
        <Select>
          {[FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH].map((_feeAmount) => {
            const { supportedChains } = FEE_AMOUNT_DETAIL[_feeAmount]
            if (supportedChains.includes(chainId)) {
              return (
                <FeeOption
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
        </Select>
      }
    />
  )
}
