import { Currency } from '@pancakeswap/swap-sdk-core'
import { paymasterTokens } from 'config/paymaster'
import { atom, useAtom } from 'jotai'

// export const gasTokenAtom = atom<Currency>(DEFAULT_PAYMASTER_TOKEN)
export const gasTokenAtom = atom<Currency>(paymasterTokens[4])

export const useGasToken = () => {
  return useAtom(gasTokenAtom)
}
