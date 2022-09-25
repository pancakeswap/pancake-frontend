import { GetStaticPaths, GetStaticProps } from 'next'
import { Swap as SwapUI, Liquidity as LiquidityUI } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

import _noop from 'lodash/noop'
import AddLiquidityForm from 'components/Liquidity/components/AddLiquidityForm'
import { useCallback, useState } from 'react'
import ChoosePair from 'components/Liquidity/components/ChoosePair'
import { CurrencySelectorContext, useCurrencySelector } from 'components/Liquidity/hooks/useCurrencySelectRoute'
import useMintPair, { MintPairContext } from 'components/Liquidity/hooks/useMintPair'
import { useIsTransactionUnsupported, useIsTransactionWarning } from 'hooks/Trades'

enum Steps {
  Choose,
  Add,
}

const AddLiquidityPage = () => {
  const { t } = useTranslation()
  const [steps, setSteps] = useState(Steps.Choose)
  const currencies = useCurrencySelector()
  const mintPairState = useMintPair(currencies)

  const addIsUnsupported = useIsTransactionUnsupported(currencies?.currencyA, currencies?.currencyB)
  const addIsWarning = useIsTransactionWarning(currencies?.currencyA, currencies?.currencyB)

  const showAddLiquidity = Boolean(currencies?.currencyA) && Boolean(currencies?.currencyA) && steps === Steps.Add

  const goToAdd = useCallback(() => setSteps(Steps.Add), [])
  const goToChoose = useCallback(() => setSteps(Steps.Choose), [])

  return (
    <SwapUI.Page helpUrl="https://docs.pancakeswap.finance/products/pancakeswap-exchange" isEvm={false}>
      <LiquidityUI.LiquidityCard>
        <LiquidityUI.LiquidityCard.Header
          title={t('Add Liquidity')}
          subtitle={t('Receive LP tokens and earn 0.17% trading fees')}
          helper={t(
            'Liquidity providers earn a 0.17% trading fee on all trades made for that token pair, proportional to their share of the liquidity pool.',
          )}
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
      {/* {!(addIsUnsupported || addIsWarning) ? (
        pair && !noLiquidity && pairState !== PairState.INVALID ? (
          <AutoColumn style={{ minWidth: '20rem', width: '100%', maxWidth: '400px', marginTop: '1rem' }}>
            <MinimalPositionCard showUnwrapped={oneCurrencyIsWNATIVE} pair={pair} />
          </AutoColumn>
        ) : null
      ) : (
        <UnsupportedCurrencyFooter currencies={[currencies.CURRENCY_A, currencies.CURRENCY_B]} />
      )} */}
    </SwapUI.Page>
  )
}

export default AddLiquidityPage

const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40}|BNB)-(0x[a-fA-F0-9]{40}|BNB)$/

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [{ params: { currency: [] } }],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { currency = [] } = params
  const [currencyIdA, currencyIdB] = currency
  const match = currencyIdA?.match(OLD_PATH_STRUCTURE)

  if (match?.length) {
    return {
      redirect: {
        statusCode: 301,
        destination: `/add/${match[1]}/${match[2]}`,
      },
    }
  }

  if (currencyIdA && currencyIdB && currencyIdA.toLowerCase() === currencyIdB.toLowerCase()) {
    return {
      redirect: {
        statusCode: 303,
        destination: `/add/${currencyIdA}`,
      },
    }
  }

  return {
    props: {},
  }
}
