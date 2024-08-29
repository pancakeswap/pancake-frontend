import { CHAIN_IDS } from 'utils/wagmi'
import BuyCrypto from 'views/BuyCrypto'
import { useMemo } from 'react'
import { BuyCryptoAtomProvider, createFormAtom } from 'state/buyCrypto/reducer'

const BuyCryptoPage = () => {
  const formAtom = useMemo(() => createFormAtom(), [])

  return (
    <BuyCryptoAtomProvider
      value={{
        formAtom,
      }}
    >
      <BuyCrypto />
    </BuyCryptoAtomProvider>
  )
}

BuyCryptoPage.chains = CHAIN_IDS

export default BuyCryptoPage
