import { PaymasterToken, DEFAULT_PAYMASTER_TOKEN } from 'config/paymaster'
import { atom } from 'jotai'

export const feeTokenAtom = atom<PaymasterToken>(DEFAULT_PAYMASTER_TOKEN)
