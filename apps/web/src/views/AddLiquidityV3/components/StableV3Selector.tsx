import { useState, useMemo, useEffect } from 'react'
import { AutoColumn, Message, MessageText, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

import { FeeAmount } from '@pancakeswap/v3-sdk'
import { useFeeTierDistribution } from 'hooks/v3/useFeeTierDistribution'
import { usePools } from 'hooks/v3/usePools'
import { PoolState } from 'hooks/v3/types'
import { SelectButton } from 'components/SelectButton'
import { EvenWidthAutoRow } from 'components/Layout/EvenWidthAutoRow'
import { Currency } from '@pancakeswap/sdk'

import { useActiveChainId } from 'hooks/useActiveChainId'
import { FeeOption } from '../formViews/V3FormView/components/FeeOption'
import { FEE_AMOUNT_DETAIL, SelectContainer } from '../formViews/V3FormView/components/shared'
import { HandleFeePoolSelectFn, SELECTOR_TYPE } from '../types'
import HideShowSelectorSection from './HideShowSelectorSection'

export function StableV3Selector({
  handleFeePoolSelect,
  selectorType,
  feeAmount,
  currencyA,
  currencyB,
}: {
  selectorType: SELECTOR_TYPE
  feeAmount?: FeeAmount
  currencyA: Currency
  currencyB: Currency
  handleFeePoolSelect: HandleFeePoolSelectFn
}) {
  const { t } = useTranslation()
  const [showOptions, setShowOptions] = useState(false)
  const { chainId } = useActiveChainId()

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
          FEE_AMOUNT_DETAIL[FeeAmount.LOWEST]?.supportedChains.includes(chainId) && (
            <AutoColumn>
              <Text>
                V3 LP{' '}
                {FEE_AMOUNT_DETAIL[feeAmount]?.label
                  ? `- ${FEE_AMOUNT_DETAIL[feeAmount]?.label}% ${t('fee tier')}`
                  : ''}
              </Text>
            </AutoColumn>
          )
        )
      }
      content={
        <AutoColumn gap="8px">
          <EvenWidthAutoRow gap="8px">
            <SelectButton
              isActive={selectorType === SELECTOR_TYPE.STABLE}
              onClick={() => handleFeePoolSelect({ type: SELECTOR_TYPE.STABLE })}
            >
              StableSwap LP
            </SelectButton>
            {FEE_AMOUNT_DETAIL[FeeAmount.LOWEST]?.supportedChains.includes(chainId) && (
              <SelectButton
                isActive={selectorType === SELECTOR_TYPE.V3}
                onClick={() => handleFeePoolSelect({ type: SELECTOR_TYPE.V3 })}
              >
                V3 LP
              </SelectButton>
            )}
          </EvenWidthAutoRow>
          {selectorType === SELECTOR_TYPE.V3 && (
            <SelectContainer>
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
            </SelectContainer>
          )}
          <Message variant="warning">
            <MessageText>
              {t(
                'Stable coins work best with StableSwap LPs. Adding V3 or V2 LP may result in less fee earning or inability to perform yield farming.',
              )}
            </MessageText>
          </Message>
        </AutoColumn>
      }
    />
  )
}
