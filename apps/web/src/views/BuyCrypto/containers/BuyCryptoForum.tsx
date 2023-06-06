import { Dispatch, SetStateAction } from 'react'
// eslint-disable-next-line import/no-cycle
import { FormMain } from './FormMain'
// eslint-disable-next-line import/no-cycle
import { CryptoFormView } from '../index'

import { FormHeader } from './FormHeader'

export function BuyCryptoForum({
  setModalView,
  modalView,
}: {
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
  modalView: CryptoFormView
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
      <FormMain setModalView={setModalView} modalView={modalView} />
    </>
  )
}
