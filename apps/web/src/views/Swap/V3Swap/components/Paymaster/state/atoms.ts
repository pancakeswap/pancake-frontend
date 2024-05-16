import { atom } from 'jotai'
import { PaymasterToken } from '../types'
import { DEFAULT_PAYMASTER_TOKEN } from '../config/config'

export const feeTokenAtom = atom<PaymasterToken>(DEFAULT_PAYMASTER_TOKEN)
