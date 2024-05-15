import { atom } from 'jotai'
import { PaymasterToken, ZyfiResponse } from '../types'
import { DEFAULT_PAYMASTER_TOKEN } from '../config/config'

export const feeTokenAtom = atom<PaymasterToken & Partial<ZyfiResponse>>(DEFAULT_PAYMASTER_TOKEN)
