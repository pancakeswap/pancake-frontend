import { useState, useMemo, useEffect } from 'react'
import { AutoColumn, Button, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

import { FeeAmount } from '@pancakeswap/v3-sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useFeeTierDistribution } from 'hooks/v3/useFeeTierDistribution'
import { usePools } from 'hooks/v3/usePools'
import { PoolState } from 'hooks/v3/types'

import { FeeOption } from '../formViews/V3FormView/components/FeeOption'
import { FEE_AMOUNT_DETAIL } from '../formViews/V3FormView/components/shared'
import { SELECTOR_TYPE } from '../types'
import HideShowSelectorSection from './HideShowSelectorSection'

// DUPDALITE from FeeSelector
const Select = styled.div`
  align-items: flex-start;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 8px;
`

export function StableV3Selector({ handleFeePoolSelect, selectorType, feeAmount, currencyA, currencyB }) {
  const [showOptions, setShowOptions] = useState(false)
  const { chainId } = useActiveWeb3React()

  const { isLoading, isError, largestUsageFeeTier, distributions } = useFeeTierDistribution(currencyA, currencyB)

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

  return (
    <HideShowSelectorSection
      showOptions={showOptions}
      setShowOptions={setShowOptions}
      heading={
        selectorType === SELECTOR_TYPE.STABLE ? (
          <AutoColumn>
            <Text>StableSwap LP</Text>
          </AutoColumn>
        ) : (
          FEE_AMOUNT_DETAIL[feeAmount]?.includes(chainId) && (
            <AutoColumn>
              <Text>V3 LP - {FEE_AMOUNT_DETAIL[feeAmount]?.label}% fee tier</Text>
            </AutoColumn>
          )
        )
      }
      content={
        <>
          <Button onClick={() => handleFeePoolSelect({ type: SELECTOR_TYPE.STABLE })}>Stable</Button>
          {FEE_AMOUNT_DETAIL[feeAmount]?.includes(chainId) && (
            <Button onClick={() => handleFeePoolSelect({ type: SELECTOR_TYPE.V3 })}>LP 3</Button>
          )}
          {selectorType === SELECTOR_TYPE.V3 && (
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
          )}
        </>
      }
    />
  )
}
