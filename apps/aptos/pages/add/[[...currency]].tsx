import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Liquidity as LiquidityUI } from '@pancakeswap/uikit'
import { PageMeta } from 'components/Layout/Page'

import { ExchangeLayout } from 'components/Layout/ExchangeLayout'
import AddLiquidityForm from 'components/Liquidity/components/AddLiquidityForm'
import ChoosePair from 'components/Liquidity/components/ChoosePair'
import withLPValues from 'components/Liquidity/hocs/withLPValues'
import useCurrencySelectRoute, { CurrencySelectorContext } from 'components/Liquidity/hooks/useCurrencySelectRoute'
import useMintPair, { MintPairContext } from 'components/Liquidity/hooks/useMintPair'
import { L0_USDC } from 'config/coins'
import { useIsTransactionUnsupported, useIsTransactionWarning } from 'hooks/Trades'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useActiveChainId } from 'hooks/useNetwork'
import { PairState } from 'hooks/usePairs'
import { useCallback, useMemo, useState } from 'react'
import { MinimalPositionCard } from 'components/Liquidity/components/PositionCard'
import { SettingsButton } from 'components/Menu/Settings/SettingsButton'

enum Steps {
  Choose,
  Add,
}

const MinimalPositionCardContainer = withLPValues(MinimalPositionCard)

const AddLiquidityPage = () => {
  const { t } = useTranslation()
  const [steps, setSteps] = useState(Steps.Choose)
  const native = useNativeCurrency()
  const activeChainId = useActiveChainId()

  const defaultCurrencies = useMemo(() => [native.address, L0_USDC[activeChainId].address], [native, activeChainId])

  const currencies = useCurrencySelectRoute(defaultCurrencies)
  const mintPairState = useMintPair(currencies)

  const { pair, noLiquidity, pairState } = mintPairState

  const addIsUnsupported = useIsTransactionUnsupported(currencies?.currencyA, currencies?.currencyB)
  const addIsWarning = useIsTransactionWarning(currencies?.currencyA, currencies?.currencyB)

  const showAddLiquidity = Boolean(currencies?.currencyA) && Boolean(currencies?.currencyB) && steps === Steps.Add

  const goToAdd = useCallback(() => setSteps(Steps.Add), [])
  const goToChoose = useCallback(() => setSteps(Steps.Choose), [])

  return (
    <>
      <PageMeta title={t('Add Liquidity')} />
      <LiquidityUI.LiquidityCard>
        <LiquidityUI.LiquidityCard.Header
          title={t('Add Liquidity')}
          subtitle={t('Receive LP tokens and earn 0.17% trading fees')}
          helper={t(
            'Liquidity providers earn a 0.17% trading fee on all trades made for that token pair, proportional to their share of the liquidity pair.',
          )}
          config={<SettingsButton />}
          backTo={showAddLiquidity ? goToChoose : '/liquidity'}
        />
        <MintPairContext.Provider value={mintPairState}>
          <CurrencySelectorContext.Provider value={currencies}>
            {showAddLiquidity ? (
              <AddLiquidityForm notSupportPair={addIsUnsupported || addIsWarning} />
            ) : (
              <ChoosePair onNext={goToAdd} />
            )}
          </CurrencySelectorContext.Provider>
        </MintPairContext.Provider>
      </LiquidityUI.LiquidityCard>
      {pair && !noLiquidity && pairState !== PairState.INVALID ? (
        <AutoColumn style={{ minWidth: '20rem', width: '100%', maxWidth: '400px', marginTop: '1rem' }}>
          <MinimalPositionCardContainer pair={pair} />
        </AutoColumn>
      ) : null}
    </>
  )
}

AddLiquidityPage.Layout = ExchangeLayout

export default AddLiquidityPage
