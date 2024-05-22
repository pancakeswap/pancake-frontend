import { DEFAULT_PAYMASTER_TOKEN, PaymasterToken } from 'config/paymaster'
import { atom } from 'jotai'

export const feeTokenAtom = atom<PaymasterToken>(DEFAULT_PAYMASTER_TOKEN)
