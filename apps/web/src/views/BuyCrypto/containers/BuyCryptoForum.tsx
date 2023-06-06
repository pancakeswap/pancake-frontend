import { Dispatch, SetStateAction } from 'react'
// eslint-disable-next-line import/no-cycle
import { BuyCryptoState } from 'state/buyCrypto/reducer'
// eslint-disable-next-line import/no-cycle
import { FormMain } from './FormMain'
// eslint-disable-next-line import/no-cycle
import { CryptoFormView } from '../index'

import { FormHeader } from './FormHeader'

export function BuyCryptoForum({
  setModalView,
  modalView,
  buyCryptoState,
  fetchQuotes,
}: {
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
  modalView: CryptoFormView
  buyCryptoState: BuyCryptoState
  fetchQuotes: () => Promise<void>
}) {
  return (
    <>
      {/* onRefresh={refresh} refreshDisabled={!tradeLoaded || syncing || !isStale} */}
      <FormHeader
        refreshDisabled={false}
        onRefresh={() => null}
        title="Buy Crypto"
        subTitle="Buy crypto in one click"
      />
      <FormMain
        setModalView={setModalView}
        modalView={modalView}
        buyCryptoState={buyCryptoState}
        fetchQuotes={fetchQuotes}
      />
    </>
  )
}
