import { Currency } from '@pancakeswap/swap-sdk-core'
import { DEFAULT_PAYMASTER_TOKEN } from 'config/paymaster'
import { atom } from 'jotai'

export const feeTokenAtom = atom<Currency>(DEFAULT_PAYMASTER_TOKEN)
