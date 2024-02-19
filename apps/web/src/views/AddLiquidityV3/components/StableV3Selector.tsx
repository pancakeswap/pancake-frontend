import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Message, MessageText, Text } from '@pancakeswap/uikit'
import { useEffect, useMemo, useState } from 'react'

import { Currency } from '@pancakeswap/sdk'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { EvenWidthAutoRow } from 'components/Layout/EvenWidthAutoRow'
import { SelectButton } from 'components/SelectButton'
import { PoolState } from 'hooks/v3/types'
import { useFeeTierDistribution } from 'hooks/v3/useFeeTierDistribution'
import { usePools } from 'hooks/v3/usePools'

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
  currencyA?: Currency | null
  currencyB?: Currency | null
  handleFeePoolSelect: HandleFeePoolSelectFn
}) {
  const { t } = useTranslation()
  const [showOptions, setShowOptions] = useState(false)
  const { chainId } = useActiveChainId()

  const { isPending, isError, largestUsageFeeTier, distributions } = useFeeTierDistribution(currencyA, currencyB)

  const pools = usePools(
    useMemo(
      () => [
        [currencyA, currencyB, FeeAmount.LOWEST],
        [currencyA, currencyB, FeeAmount.LOW],
        [currencyA, currencyB, FeeAmount.MEDIUM],
        [currencyA, currencyB, FeeAmount.HIGH],
      ],
      [currencyA, currencyB],
    ),
  )

  const poolsByFeeTier = useMemo(
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
        } as Record<FeeAmount, PoolState>,
      ),
    [pools],
  )

  useEffect(() => {
    if (feeAmount || isPending || isError || selectorType === SELECTOR_TYPE.STABLE) {
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
  }, [feeAmount, isPending, isError, largestUsageFeeTier, handleFeePoolSelect, selectorType])

  return (
    <HideShowSelectorSection
      showOptions={showOptions}
      setShowOptions={setShowOptions}
      heading={
        selectorType === SELECTOR_TYPE.STABLE ? (
          <AutoColumn>
            <Text>StableSwap LP</Text>
          </AutoColumn>
        ) : chainId && FEE_AMOUNT_DETAIL[FeeAmount.LOWEST]?.supportedChains.includes(chainId) ? (
          <AutoColumn>
            <Text>
              V3 LP{' '}
              {feeAmount && FEE_AMOUNT_DETAIL[feeAmount]?.label
                ? `- ${FEE_AMOUNT_DETAIL[feeAmount]?.label}% ${t('fee tier')}`
                : ''}
            </Text>
          </AutoColumn>
        ) : null
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
            {chainId && FEE_AMOUNT_DETAIL[FeeAmount.LOWEST]?.supportedChains.includes(chainId) && (
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
                if (chainId && supportedChains.includes(chainId)) {
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
