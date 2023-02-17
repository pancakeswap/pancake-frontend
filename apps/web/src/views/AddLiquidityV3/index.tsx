import { CurrencySelect } from 'components/CurrencySelect'
import { CommonBasesType } from 'components/SearchModal/types'

import { Currency, NATIVE, WNATIVE } from '@pancakeswap/sdk'
import { FlexGap, AutoColumn, CardBody, Card, Text, AddIcon } from '@pancakeswap/uikit'

import { FeeAmount } from '@pancakeswap/v3-sdk'
import { useCallback, useEffect, useState } from 'react'
import _isNaN from 'lodash/isNaN'

import currencyId from 'utils/currencyId'
import { useRouter } from 'next/router'
import { useTranslation } from '@pancakeswap/localization'

import Page from 'views/Page'
import { AppHeader } from 'components/App'
import styled from 'styled-components'

import { useCurrency } from 'hooks/Tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useStableConfig from 'views/Swap/StableSwap/hooks/useStableConfig'

import FeeSelector from './formViews/V3FormView/components/FeeSelector'

import V3FormView from './formViews/V3FormView'
import { DynamicSection } from './formViews/V3FormView/components/shared'
import { HandleFeePoolSelectFn, SELECTOR_TYPE } from './types'
import { StableV3Selector } from './components/StableV3Selector'

export const BodyWrapper = styled(Card)`
  border-radius: 24px;
  max-width: 858px;
  width: 100%;
  z-index: 1;
`

/* two-column layout where DepositAmount is moved at the very end on mobile. */
export const ResponsiveTwoColumns = styled.div`
  display: grid;
  grid-column-gap: 32px;
  grid-row-gap: 16px;
  grid-template-columns: 1fr;

  grid-template-rows: max-content;
  grid-auto-flow: row;

  padding-top: 20px;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr 1fr;
  }
`

interface UniversalAddLiquidityPropsType {
  currencyIdA: string
  currencyIdB: string
}

export default function UniversalAddLiquidity({ currencyIdA, currencyIdB }: UniversalAddLiquidityPropsType) {
  const { chainId } = useActiveWeb3React()

  const router = useRouter()
  const baseCurrency = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const stableConfig = useStableConfig({
    tokenA: baseCurrency,
    tokenB: currencyB,
  })

  const quoteCurrency =
    baseCurrency && currencyB && baseCurrency.wrapped.equals(currencyB.wrapped) ? undefined : currencyB

  const [, , feeAmountFromUrl] = router.query.currency || []

  // fee selection from url
  const feeAmount: FeeAmount | undefined =
    feeAmountFromUrl && Object.values(FeeAmount).includes(parseFloat(feeAmountFromUrl))
      ? parseFloat(feeAmountFromUrl)
      : undefined

  const { t } = useTranslation()

  const handleCurrencySelect = useCallback(
    (currencyNew: Currency, currencyIdOther?: string): (string | undefined)[] => {
      const currencyIdNew = currencyId(currencyNew)

      if (currencyIdNew === currencyIdOther) {
        // not ideal, but for now clobber the other if the currency ids are equal
        return [currencyIdNew, undefined]
      }
      // prevent weth + eth
      const isETHOrWETHNew =
        currencyNew?.isNative || (chainId !== undefined && currencyIdNew === WNATIVE[chainId]?.address)
      const isETHOrWETHOther =
        currencyIdOther !== undefined &&
        (currencyIdOther === NATIVE[chainId]?.symbol ||
          (chainId !== undefined && currencyIdOther === WNATIVE[chainId]?.address))

      if (isETHOrWETHNew && isETHOrWETHOther) {
        return [currencyIdNew, undefined]
      }

      return [currencyIdNew, currencyIdOther]
    },
    [chainId],
  )

  const handleCurrencyASelect = useCallback(
    (currencyANew: Currency) => {
      const [idA, idB] = handleCurrencySelect(currencyANew, currencyIdB)
      if (idB === undefined) {
        router.replace(`/add/${idA}`, undefined, {
          shallow: true,
        })
      } else {
        router.replace(`/add/${idA}/${idB}`, undefined, {
          shallow: true,
        })
      }
    },
    [handleCurrencySelect, currencyIdB, router],
  )

  const handleCurrencyBSelect = useCallback(
    (currencyBNew: Currency) => {
      const [idB, idA] = handleCurrencySelect(currencyBNew, currencyIdA)
      if (idA === undefined) {
        router.replace(`/add/${idB}`, undefined, {
          shallow: true,
        })
      } else {
        router.replace(`/add/${idA}/${idB}`, undefined, {
          shallow: true,
        })
      }
    },
    [handleCurrencySelect, currencyIdA, router],
  )

  const [selectorType, setSelectoType] = useState<SELECTOR_TYPE | null>(null)

  useEffect(() => {
    if (stableConfig.stableSwapConfig) {
      setSelectoType(SELECTOR_TYPE.STABLE)
    } else {
      setSelectoType(SELECTOR_TYPE.V3)
    }
  }, [stableConfig.stableSwapConfig])

  const handleFeePoolSelect = useCallback<HandleFeePoolSelectFn>(
    ({ type, feeAmount: newFeeAmount }) => {
      setSelectoType(type)

      router.replace(`/add/${currencyIdA}/${currencyIdB}/${newFeeAmount}`, undefined, {
        shallow: true,
      })
    },
    [currencyIdA, currencyIdB, router],
  )

  return (
    <Page>
      <BodyWrapper>
        <AppHeader title={t('Add Liquidity')} backTo="/pool-v3" />
        <CardBody>
          <ResponsiveTwoColumns>
            <AutoColumn>
              <Text mb="8px" bold fontSize="14px" textTransform="uppercase" color="secondary">
                Choose Token Pair
              </Text>
              <FlexGap gap="4px" width="100%" mb="24px">
                <CurrencySelect
                  id="add-liquidity-select-tokena"
                  selectedCurrency={baseCurrency}
                  onCurrencySelect={handleCurrencyASelect}
                  showCommonBases
                  commonBasesType={CommonBasesType.LIQUIDITY}
                  hideBalance
                />
                <AddIcon color="textSubtle" />
                <CurrencySelect
                  id="add-liquidity-select-tokenb"
                  selectedCurrency={quoteCurrency}
                  onCurrencySelect={handleCurrencyBSelect}
                  showCommonBases
                  commonBasesType={CommonBasesType.LIQUIDITY}
                  hideBalance
                />
              </FlexGap>
              <DynamicSection disabled={false}>
                {selectorType === SELECTOR_TYPE.STABLE && (
                  <StableV3Selector handleFeePoolSelect={handleFeePoolSelect} />
                )}
                {selectorType === SELECTOR_TYPE.V3 && (
                  <FeeSelector
                    currencyA={baseCurrency ?? undefined}
                    currencyB={quoteCurrency ?? undefined}
                    handleFeePoolSelect={handleFeePoolSelect}
                    feeAmount={feeAmount}
                  />
                )}
              </DynamicSection>
            </AutoColumn>
            <V3FormView
              feeAmount={feeAmount}
              baseCurrency={baseCurrency}
              quoteCurrency={quoteCurrency}
              currencyIdA={currencyIdA}
              currencyIdB={currencyIdB}
            />
          </ResponsiveTwoColumns>
        </CardBody>
      </BodyWrapper>
    </Page>
  )
}
