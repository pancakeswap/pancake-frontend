import { CurrencySelect } from 'components/CurrencySelect'
import { CommonBasesType } from 'components/SearchModal/types'

import { Currency, NATIVE, WNATIVE } from '@pancakeswap/sdk'
import {
  FlexGap,
  AutoColumn,
  CardBody,
  Card,
  AddIcon,
  PreTitle,
  DynamicSection,
  RefreshIcon,
  IconButton,
} from '@pancakeswap/uikit'

import { FeeAmount } from '@pancakeswap/v3-sdk'
import { useCallback, useEffect, useMemo } from 'react'

import currencyId from 'utils/currencyId'
import { useRouter } from 'next/router'
import { Trans, useTranslation } from '@pancakeswap/localization'

import Page from 'views/Page'
import { AppHeader } from 'components/App'
import styled from 'styled-components'
import { atom, useAtom } from 'jotai'

import { useCurrency } from 'hooks/Tokens'
import useStableConfig, { StableConfigContext } from 'views/Swap/hooks/useStableConfig'
import AddStableLiquidity from 'views/AddLiquidity/AddStableLiquidity'
import AddLiquidity from 'views/AddLiquidity'
import { usePreviousValue } from '@pancakeswap/hooks'
import { getAddress } from 'viem'

import noop from 'lodash/noop'
import { useActiveChainId } from 'hooks/useActiveChainId'
import FeeSelector from './formViews/V3FormView/components/FeeSelector'

import V3FormView from './formViews/V3FormView'
import { HandleFeePoolSelectFn, SELECTOR_TYPE } from './types'
import { StableV3Selector } from './components/StableV3Selector'
import StableFormView from './formViews/StableFormView'
import { V2Selector } from './components/V2Selector'
import V2FormView from './formViews/V2FormView'
import { AprCalculator } from './components/AprCalculator'
import { useCurrencyParams } from './hooks/useCurrencyParams'

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

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr 1fr;
  }
`

const selectTypeAtom = atom(SELECTOR_TYPE.V3)

interface UniversalAddLiquidityPropsType {
  currencyIdA: string
  currencyIdB: string
  isV2?: boolean
  preferredSelectType?: SELECTOR_TYPE
  preferredFeeAmount?: FeeAmount
}

export function UniversalAddLiquidity({
  isV2,
  currencyIdA,
  currencyIdB,
  preferredSelectType,
  preferredFeeAmount,
}: UniversalAddLiquidityPropsType) {
  const { chainId } = useActiveChainId()
  const { t } = useTranslation()

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
  const feeAmount: FeeAmount | undefined = useMemo(() => {
    return (
      preferredFeeAmount ||
      (feeAmountFromUrl && Object.values(FeeAmount).includes(parseFloat(feeAmountFromUrl))
        ? parseFloat(feeAmountFromUrl)
        : undefined)
    )
  }, [preferredFeeAmount, feeAmountFromUrl])

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
          (chainId !== undefined && getAddress(currencyIdOther) === WNATIVE[chainId]?.address))

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
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              currency: [idA],
            },
          },
          undefined,
          { shallow: true },
        )
      } else {
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              currency: [idA, idB],
            },
          },
          undefined,
          { shallow: true },
        )
      }
    },
    [handleCurrencySelect, currencyIdB, router],
  )

  const handleCurrencyBSelect = useCallback(
    (currencyBNew: Currency) => {
      const [idB, idA] = handleCurrencySelect(currencyBNew, currencyIdA)
      if (idA === undefined) {
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              currency: [idB],
            },
          },
          undefined,
          { shallow: true },
        )
      } else {
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              currency: [idA, idB],
            },
          },
          undefined,
          { shallow: true },
        )
      }
    },
    [handleCurrencySelect, currencyIdA, router],
  )

  const [selectorType, setSelectorType] = useAtom(selectTypeAtom)

  const prevPreferredSelectType = usePreviousValue(preferredSelectType)

  useEffect(() => {
    if (!currencyIdA || !currencyIdB) return

    if (selectorType === SELECTOR_TYPE.V3 && preferredSelectType === SELECTOR_TYPE.V3) {
      return
    }

    // if fee selection from url, don't change the selector type to avoid keep selecting stable when url changes, e.g. toggle rate
    if (feeAmountFromUrl) return
    if (stableConfig.stableSwapConfig) {
      setSelectorType(SELECTOR_TYPE.STABLE)
    } else {
      setSelectorType(preferredSelectType || isV2 ? SELECTOR_TYPE.V2 : SELECTOR_TYPE.V3)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currencyIdA,
    currencyIdB,
    feeAmountFromUrl,
    isV2,
    preferredSelectType,
    prevPreferredSelectType,
    setSelectorType,
    stableConfig.stableSwapConfig,
  ])

  const handleFeePoolSelect = useCallback<HandleFeePoolSelectFn>(
    ({ type, feeAmount: newFeeAmount }) => {
      setSelectorType(type)
      if (newFeeAmount) {
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              currency: [currencyIdA, currencyIdB, newFeeAmount.toString()],
            },
          },
          undefined,
          { shallow: true },
        )
      }
    },
    [currencyIdA, currencyIdB, router, setSelectorType],
  )

  useEffect(() => {
    if (preferredFeeAmount && !feeAmountFromUrl && selectorType === SELECTOR_TYPE.V3) {
      handleFeePoolSelect({ type: selectorType, feeAmount: preferredFeeAmount })
    }
  }, [preferredFeeAmount, feeAmountFromUrl, handleFeePoolSelect, selectorType])

  return (
    <>
      <CardBody>
        <ResponsiveTwoColumns>
          <AutoColumn alignSelf="stretch">
            <PreTitle mb="8px">{t('Choose Token Pair')}</PreTitle>
            <FlexGap gap="4px" width="100%" mb="8px" alignItems="center">
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
            <DynamicSection disabled={!baseCurrency || !currencyB}>
              {!isV2 &&
                stableConfig.stableSwapConfig &&
                [SELECTOR_TYPE.STABLE, SELECTOR_TYPE.V3].includes(selectorType) && (
                  <StableV3Selector
                    currencyA={baseCurrency ?? undefined}
                    currencyB={quoteCurrency ?? undefined}
                    feeAmount={feeAmount}
                    selectorType={selectorType}
                    handleFeePoolSelect={handleFeePoolSelect}
                  />
                )}

              {((isV2 && selectorType !== SELECTOR_TYPE.V3) || selectorType === SELECTOR_TYPE.V2) && (
                <V2Selector
                  isStable={Boolean(stableConfig.stableSwapConfig)}
                  selectorType={selectorType}
                  handleFeePoolSelect={({ type }) => {
                    // keep using state instead of replacing url in UniversalLiquidity
                    handleFeePoolSelect({ type })
                  }}
                />
              )}

              {!stableConfig.stableSwapConfig && selectorType === SELECTOR_TYPE.V3 && (
                <FeeSelector
                  currencyA={baseCurrency ?? undefined}
                  currencyB={quoteCurrency ?? undefined}
                  handleFeePoolSelect={handleFeePoolSelect}
                  feeAmount={feeAmount}
                  handleSelectV2={() => setSelectorType(SELECTOR_TYPE.V2)}
                />
              )}
            </DynamicSection>
          </AutoColumn>
          {selectorType === SELECTOR_TYPE.STABLE && (
            <StableConfigContext.Provider value={stableConfig}>
              <AddStableLiquidity currencyA={baseCurrency} currencyB={quoteCurrency}>
                {(props) => <StableFormView {...props} stableLpFee={stableConfig?.stableSwapConfig?.stableLpFee} />}
              </AddStableLiquidity>
            </StableConfigContext.Provider>
          )}
          {selectorType === SELECTOR_TYPE.V3 && (
            <V3FormView
              feeAmount={feeAmount}
              baseCurrency={baseCurrency}
              quoteCurrency={quoteCurrency}
              currencyIdA={currencyIdA}
              currencyIdB={currencyIdB}
            />
          )}
          {selectorType === SELECTOR_TYPE.V2 && (
            <AddLiquidity currencyA={baseCurrency} currencyB={quoteCurrency}>
              {(props) => <V2FormView {...props} />}
            </AddLiquidity>
          )}
        </ResponsiveTwoColumns>
      </CardBody>
    </>
  )
}

const SELECTOR_TYPE_T = {
  [SELECTOR_TYPE.STABLE]: <Trans>Add Stable Liquidity</Trans>,
  [SELECTOR_TYPE.V2]: <Trans>Add V2 Liquidity</Trans>,
  [SELECTOR_TYPE.V3]: <Trans>Add V3 Liquidity</Trans>,
} as const satisfies Record<SELECTOR_TYPE, JSX.Element>

export function AddLiquidityV3Layout({
  showRefreshButton = false,
  handleRefresh,
  children,
}: {
  showRefreshButton?: boolean
  handleRefresh?: () => void
  children: React.ReactNode
}) {
  const { t } = useTranslation()

  const [selectType] = useAtom(selectTypeAtom)
  const { currencyIdA, currencyIdB, feeAmount } = useCurrencyParams()

  const baseCurrency = useCurrency(currencyIdA)
  const quoteCurrency = useCurrency(currencyIdB)

  const title = SELECTOR_TYPE_T[selectType] || t('Add Liquidity')

  return (
    <Page>
      <BodyWrapper>
        <AppHeader
          title={title}
          backTo="/liquidity"
          IconSlot={
            <>
              {selectType === SELECTOR_TYPE.V3 && (
                <AprCalculator
                  showQuestion
                  baseCurrency={baseCurrency}
                  quoteCurrency={quoteCurrency}
                  feeAmount={feeAmount}
                />
              )}
              {showRefreshButton && (
                <IconButton variant="text" scale="sm">
                  <RefreshIcon onClick={handleRefresh || noop} color="textSubtle" height={24} width={24} />
                </IconButton>
              )}
            </>
          }
        />
        {children}
      </BodyWrapper>
    </Page>
  )
}
