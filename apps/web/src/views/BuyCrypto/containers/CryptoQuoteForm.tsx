import { Dispatch, SetStateAction } from 'react'
import { FormHeader } from './FormHeader'
// eslint-disable-next-line import/no-cycle
import { CryptoFormView } from '../index'
// eslint-disable-next-line import/no-cycle
import { FormQuote } from './FormQuote'

export function CryptoQuoteForm({ setModalView }: { setModalView: Dispatch<SetStateAction<CryptoFormView>> }) {
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
      <FormQuote setModalView={setModalView} swapCommitButton={<></>} />
    </>
  )
}
