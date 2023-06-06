import { Dispatch, SetStateAction } from 'react'
import { BuyCryptoState } from 'state/buyCrypto/reducer'
import { FormHeader } from './FormHeader'
// eslint-disable-next-line import/no-cycle
import { CryptoFormView } from '../index'
// eslint-disable-next-line import/no-cycle
import { FormQuote } from './FormQuote'
import { ProviderQoute } from '../hooks/usePriceQuoter'

export function CryptoQuoteForm({
  setModalView,
  buyCryptoState,
  combinedQuotes,
}: {
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
  buyCryptoState: BuyCryptoState
  combinedQuotes: ProviderQoute[]
}) {
  return (
    <>
      {/* onRefresh={refresh} refreshDisabled={!tradeLoaded || syncing || !isStale} */}
      <FormHeader
        refreshDisabled={false}
        onRefresh={() => null}
        title="Select a quote"
        subTitle="Quotes are updated every 30 seconds."
        backTo={() => setModalView(CryptoFormView.Input)}
      />
      <FormQuote setModalView={setModalView} buyCryptoState={buyCryptoState} combinedQuotes={combinedQuotes} />
    </>
  )
}
