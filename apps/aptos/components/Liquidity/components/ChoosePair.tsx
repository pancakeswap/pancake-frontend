import { useTranslation } from '@pancakeswap/localization'
import { ChoosePairView } from '@pancakeswap/uikit/src/widgets/Liquidity'
import { CommitButton } from 'components/CommitButton'
import { useContext } from 'react'
import { CurrencySelectorContext } from '../hooks/useCurrencySelectRoute'
import { MintPairContext } from '../hooks/useMintPair'
import { CurrencySelect } from './CurrencySelect'
import LiquidityBridgeWarning from './LiquidityBridgeWarning'

export default function ChoosePair({ onNext }: { onNext: () => void }) {
  const { error } = useContext(MintPairContext)
  const { currencyA, currencyB, handleCurrencyASelect, handleCurrencyBSelect } = useContext(CurrencySelectorContext)
  const { t } = useTranslation()

  return (
    <ChoosePairView
      selectCurrencyA={
        <CurrencySelect
          onCurrencySelect={handleCurrencyASelect}
          otherSelectedCurrency={currencyB}
          selectedCurrency={currencyA}
        />
      }
      selectCurrencyB={
        <CurrencySelect
          onCurrencySelect={handleCurrencyBSelect}
          otherSelectedCurrency={currencyA}
          selectedCurrency={currencyB}
        />
      }
      footer={
        <>
          {[currencyA, currencyB].map((currency) => (
            <LiquidityBridgeWarning currency={currency} />
          ))}
          <CommitButton
            data-test="choose-pair-next"
            width="100%"
            variant={error ? 'danger' : 'primary'}
            onClick={onNext}
            disabled={Boolean(error)}
          >
            {error ?? t('Add Liquidity')}
          </CommitButton>
        </>
      }
    />
  )
}
